const mysqlPool = require('../config/mysql_db');
const MutualFundProvider = require('../services/mutualFundProvider');
const RecommendationEngine = require('../services/recommendationEngine');
const N8nService = require('../services/n8nService');
const AIService = require('../services/aiService');

// In-Memory Fallback State Store
const memoryStore = {
  profiles: {},
  goals: {},
  holdings: {},
  transactions: {},
  watchlists: {}
};

// Helper to get or init profile
const getMemoryProfile = (userId) => {
  if (!memoryStore.profiles[userId]) {
    memoryStore.profiles[userId] = {
      id: `prof_${userId}`,
      user_id: userId,
      business_id: 'business_123',
      age: 32,
      monthly_income: 60000.00,
      monthly_expenses: 35000.00,
      mandatory_commitments: 5000.00,
      existing_savings: 150000.00,
      emergency_fund: 100000.00,
      total_liabilities: 50000.00,
      existing_investments: 75000.00,
      monthly_investment_target: 10000.00,
      estimated_capacity_min: 8000.00,
      estimated_capacity_max: 15000.00,
      risk_tolerance: 'Moderate',
      investment_horizon_years: 5,
      liquidity_need: 'Medium',
      investment_experience: 'Intermediate'
    };
  }
  return memoryStore.profiles[userId];
};

// 1. Get or Create Investor Profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const businessId = req.businessId?.toString() || req.user?.businessId?._id?.toString() || 'business_123';

    try {
      const [rows] = await mysqlPool.query(
        'SELECT * FROM investor_profiles WHERE user_id = ? LIMIT 1',
        [userId]
      );
      if (rows.length > 0) {
        return res.status(200).json({ status: 'success', data: rows[0] });
      }
    } catch (dbErr) {
      console.warn('MySQL profile query failed, using in-memory store:', dbErr.message);
    }

    const memProf = getMemoryProfile(userId);
    return res.status(200).json({ status: 'success', data: memProf });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 2. Save / Update Investor Profile & Compute Investment Capacity
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const businessId = req.businessId?.toString() || req.user?.businessId?._id?.toString() || 'business_123';

    const {
      age = 30,
      monthlyIncome = 60000,
      monthlyExpenses = 35000,
      mandatoryCommitments = 0,
      existingSavings = 100000,
      emergencyFund = 50000,
      totalLiabilities = 0,
      existingInvestments = 0,
      investmentHorizonYears = 5,
      liquidityNeed = 'Medium',
      investmentExperience = 'Intermediate',
      riskTolerance = 'Moderate'
    } = req.body;

    const income = Number(monthlyIncome);
    const expenses = Number(monthlyExpenses);
    const commitments = Number(mandatoryCommitments);
    const surplus = Math.max(0, income - expenses - commitments);

    const monthlyExpenseRequirement = expenses + commitments;
    const emergencyMonths = emergencyFund / (monthlyExpenseRequirement || 1);
    
    let capacityFactorMin = emergencyMonths < 3 ? 0.40 : 0.50;
    let capacityFactorMax = emergencyMonths < 3 ? 0.70 : 0.80;

    const estimatedCapacityMin = Number((surplus * capacityFactorMin).toFixed(2));
    const estimatedCapacityMax = Number((surplus * capacityFactorMax).toFixed(2));
    const monthlyTarget = Number(((estimatedCapacityMin + estimatedCapacityMax) / 2).toFixed(2));

    const id = `prof_${Date.now()}`;

    // Update Memory Store
    memoryStore.profiles[userId] = {
      id, user_id: userId, business_id: businessId, age,
      monthly_income: income, monthly_expenses: expenses,
      mandatory_commitments: commitments, existing_savings: existingSavings,
      emergency_fund: emergencyFund, total_liabilities: totalLiabilities,
      existing_investments: existingInvestments, monthly_investment_target: monthlyTarget,
      estimated_capacity_min: estimatedCapacityMin, estimated_capacity_max: estimatedCapacityMax,
      risk_tolerance: riskTolerance, investment_horizon_years: investmentHorizonYears,
      liquidity_need: liquidityNeed, investment_experience: investmentExperience
    };

    try {
      await mysqlPool.query(`
        INSERT INTO investor_profiles (
          id, user_id, business_id, age, monthly_income, monthly_expenses,
          mandatory_commitments, existing_savings, emergency_fund, total_liabilities,
          existing_investments, monthly_investment_target, estimated_capacity_min,
          estimated_capacity_max, risk_tolerance, investment_horizon_years,
          liquidity_need, investment_experience
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          age = VALUES(age), monthly_income = VALUES(monthly_income),
          monthly_expenses = VALUES(monthly_expenses), mandatory_commitments = VALUES(mandatory_commitments),
          existing_savings = VALUES(existing_savings), emergency_fund = VALUES(emergency_fund),
          total_liabilities = VALUES(total_liabilities), existing_investments = VALUES(existing_investments),
          monthly_investment_target = VALUES(monthly_investment_target), estimated_capacity_min = VALUES(estimated_capacity_min),
          estimated_capacity_max = VALUES(estimated_capacity_max), risk_tolerance = VALUES(risk_tolerance),
          investment_horizon_years = VALUES(investment_horizon_years), liquidity_need = VALUES(liquidity_need),
          investment_experience = VALUES(investment_experience)
      `, [
        id, userId, businessId, age, income, expenses, commitments,
        existingSavings, emergencyFund, totalLiabilities, existingInvestments,
        monthlyTarget, estimatedCapacityMin, estimatedCapacityMax,
        riskTolerance, investmentHorizonYears, liquidityNeed, investmentExperience
      ]);
    } catch (dbErr) {
      console.warn('MySQL profile update fallback used:', dbErr.message);
    }

    res.status(200).json({
      status: 'success',
      message: 'Investor profile updated successfully',
      data: {
        userId,
        monthlySurplus: surplus,
        estimatedInvestmentCapacity: {
          min: estimatedCapacityMin,
          max: estimatedCapacityMax,
          recommendedMonthlyTarget: monthlyTarget,
          explanation: `Calculated from Monthly Surplus (₹${surplus.toLocaleString('en-IN')}) taking into account ${emergencyMonths.toFixed(1)} months of emergency buffer.`
        }
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 3. Complete Risk Assessment
exports.assessRisk = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const businessId = req.businessId?.toString() || 'business_123';
    const {
      lossTolerance = 'Moderate',
      incomeStability = 'Stable',
      horizonYears = 5,
      experience = 'Intermediate',
      emergencyFundMonths = 3
    } = req.body;

    let score = 50;
    if (lossTolerance === 'High') score += 25;
    else if (lossTolerance === 'Low') score -= 20;

    if (incomeStability === 'Stable') score += 10;
    else score -= 10;

    if (horizonYears >= 7) score += 15;
    else if (horizonYears < 3) score -= 15;

    if (experience === 'Advanced') score += 10;
    else if (experience === 'Beginner') score -= 10;

    if (emergencyFundMonths >= 6) score += 10;

    let category = 'Moderate';
    if (score <= 30) category = 'Conservative';
    else if (score <= 45) category = 'Moderately Conservative';
    else if (score <= 65) category = 'Moderate';
    else if (score <= 80) category = 'Moderately Aggressive';
    else category = 'Aggressive';

    const rationale = `Assigned ${category} (Score: ${score}/100) based on your ${horizonYears}-year investment horizon, ${incomeStability.toLowerCase()} income, and ${lossTolerance.toLowerCase()} loss tolerance.`;

    const profile = getMemoryProfile(userId);
    profile.risk_tolerance = category;

    try {
      const id = `risk_${Date.now()}`;
      await mysqlPool.query(`
        INSERT INTO risk_assessments (id, user_id, business_id, score, category, rationale, loss_tolerance, income_stability)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, userId, businessId, score, category, rationale, lossTolerance, incomeStability]);
      await mysqlPool.query('UPDATE investor_profiles SET risk_tolerance = ? WHERE user_id = ?', [category, userId]);
    } catch (dbErr) {
      console.warn('MySQL risk assessment fallback used:', dbErr.message);
    }

    res.status(200).json({
      status: 'success',
      data: {
        score,
        category,
        rationale,
        disclaimer: 'This risk classification is for illustrative and planning purposes only and is not a legally certified suitability assessment.'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 4. Financial Goals CRUD
exports.getGoals = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    
    if (!memoryStore.goals[userId]) {
      memoryStore.goals[userId] = [
        {
          id: `goal_${Date.now()}`,
          user_id: userId,
          business_id: 'business_123',
          goal_name: 'Wealth Creation (10 Years)',
          category: 'Wealth Creation',
          target_amount: 2500000.00,
          current_amount: 150000.00,
          target_date: new Date(Date.now() + 10 * 365 * 24 * 3600 * 1000).toISOString().split('T')[0],
          monthly_contribution: 12000.00,
          risk_preference: 'Moderately Aggressive',
          status: 'Active'
        }
      ];
    }

    try {
      const [rows] = await mysqlPool.query('SELECT * FROM financial_goals WHERE user_id = ? ORDER BY created_at DESC', [userId]);
      if (rows.length > 0) return res.status(200).json({ status: 'success', data: rows });
    } catch (dbErr) {
      console.warn('MySQL goals fallback used:', dbErr.message);
    }

    res.status(200).json({ status: 'success', data: memoryStore.goals[userId] });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.createGoal = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const businessId = req.businessId?.toString() || 'business_123';
    const { goalName, category = 'Wealth Creation', targetAmount, currentAmount = 0, targetDate, monthlyContribution = 0, riskPreference = 'Moderate' } = req.body;

    const id = `goal_${Date.now()}`;
    const newGoal = {
      id, user_id: userId, business_id: businessId, goal_name: goalName, category,
      target_amount: Number(targetAmount), current_amount: Number(currentAmount),
      target_date: targetDate, monthly_contribution: Number(monthlyContribution),
      risk_preference: riskPreference, status: 'Active'
    };

    if (!memoryStore.goals[userId]) memoryStore.goals[userId] = [];
    memoryStore.goals[userId].push(newGoal);

    try {
      await mysqlPool.query(`
        INSERT INTO financial_goals (id, user_id, business_id, goal_name, category, target_amount, current_amount, target_date, monthly_contribution, risk_preference)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [id, userId, businessId, goalName, category, Number(targetAmount), Number(currentAmount), targetDate, Number(monthlyContribution), riskPreference]);
    } catch (dbErr) {
      console.warn('MySQL createGoal fallback used:', dbErr.message);
    }

    res.status(201).json({ status: 'success', message: 'Financial goal created', data: newGoal });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 5. Mutual Funds Catalog
exports.getFunds = async (req, res) => {
  try {
    const funds = await MutualFundProvider.getFunds(req.query);
    res.status(200).json({
      status: 'success',
      total: funds.length,
      dataSource: 'MockMutualFundProvider',
      dataDate: new Date().toISOString().split('T')[0],
      data: funds
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 6. Compare Mutual Funds (Up to 5)
exports.compareFunds = async (req, res) => {
  try {
    const { fundIds = [] } = req.body;
    const allFunds = await MutualFundProvider.getFunds();
    
    let selected = allFunds.filter(f => fundIds.includes(f.id) || fundIds.includes(f.schemeCode));
    if (selected.length < 2) {
      selected = allFunds.slice(0, 3);
    }

    const aiComparison = `Comparison of ${selected.map(f => f.schemeName).join(' vs ')}: ${selected[0].schemeName} provides high growth with ${selected[0].threeYearReturn}% 3Y CAGR, while ${selected[selected.length - 1].schemeName} offers lower volatility (${selected[selected.length - 1].riskLevel}) and an expense ratio of ${selected[selected.length - 1].expenseRatio}%.`;

    res.status(200).json({
      status: 'success',
      comparedCount: selected.length,
      aiComparison,
      data: selected
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 7. Get Recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const profile = getMemoryProfile(userId);
    const holdings = memoryStore.holdings[userId] || [];

    const recommendations = await RecommendationEngine.getRecommendations(profile, req.body.goal || {}, holdings);

    res.status(200).json({
      status: 'success',
      total: recommendations.length,
      disclaimer: 'Suitable to explore based on your investor profile. Past performance does not guarantee future returns.',
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 8. Deterministic SIP Calculator
exports.calculateSip = async (req, res) => {
  try {
    const { monthlyInvestment = 5000, annualReturn = 12, durationYears = 10, stepUpPercentage = 0 } = req.body;

    const monthly = Number(monthlyInvestment);
    const rate = Number(annualReturn) / 100 / 12;
    const months = Number(durationYears) * 12;
    const stepUp = Number(stepUpPercentage) / 100;

    let totalInvested = 0;
    let futureValue = 0;
    let currentMonthly = monthly;

    for (let m = 1; m <= months; m++) {
      if (m > 1 && (m - 1) % 12 === 0 && stepUp > 0) {
        currentMonthly = currentMonthly * (1 + stepUp);
      }
      totalInvested += currentMonthly;
      futureValue = (futureValue + currentMonthly) * (1 + rate);
    }

    totalInvested = Number(totalInvested.toFixed(2));
    futureValue = Number(futureValue.toFixed(2));
    const estimatedReturns = Number((futureValue - totalInvested).toFixed(2));

    res.status(200).json({
      status: 'success',
      label: 'Illustrative scenario — not guaranteed.',
      inputs: { monthlyInvestment: monthly, annualReturn, durationYears, stepUpPercentage },
      results: {
        totalInvested,
        estimatedReturns,
        futureValue,
        monthlyEndingAmount: Number(currentMonthly.toFixed(2))
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 9. Deterministic Lump Sum Calculator
exports.calculateLumpSum = async (req, res) => {
  try {
    const { initialInvestment = 50000, annualReturn = 12, durationYears = 5 } = req.body;

    const P = Number(initialInvestment);
    const r = Number(annualReturn) / 100;
    const t = Number(durationYears);

    const futureValue = Number((P * Math.pow(1 + r, t)).toFixed(2));
    const estimatedGrowth = Number((futureValue - P).toFixed(2));

    res.status(200).json({
      status: 'success',
      label: 'Illustrative scenario — not guaranteed.',
      inputs: { initialInvestment: P, annualReturn: r * 100, durationYears: t },
      results: {
        investedAmount: P,
        estimatedGrowth,
        futureValue
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 10. Get User Portfolio
exports.getPortfolio = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    
    if (!memoryStore.holdings[userId]) {
      memoryStore.holdings[userId] = [
        {
          id: `hold_${Date.now()}`,
          fundId: 'mf_ppfas_flexi',
          fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
          category: 'Flexi Cap',
          units: 60.7500,
          avgNav: 82.3000,
          currentNav: 82.3000,
          investedAmount: 5000.00,
          currentValue: 5000.00,
          gainLoss: 0.00,
          gainPercentage: 0.00,
          mode: 'SIMULATION'
        }
      ];
    }

    try {
      const [rows] = await mysqlPool.query('SELECT * FROM portfolio_holdings WHERE user_id = ?', [userId]);
      if (rows.length > 0) {
        memoryStore.holdings[userId] = rows.map(h => ({
          id: h.id,
          fundId: h.fund_id,
          fundName: h.fund_name,
          category: h.category,
          units: Number(h.units),
          avgNav: Number(h.avg_nav),
          currentNav: Number(h.current_nav),
          investedAmount: Number(h.invested_amount),
          currentValue: Number(h.current_value),
          gainLoss: Number(h.gain_loss),
          gainPercentage: Number(h.gain_percentage),
          mode: h.mode || 'SIMULATION'
        }));
      }
    } catch (dbErr) {
      console.warn('MySQL portfolio holdings fallback used:', dbErr.message);
    }

    const holdings = memoryStore.holdings[userId];
    const totalInvested = Number(holdings.reduce((s, h) => s + h.investedAmount, 0).toFixed(2));
    const currentValue = Number(holdings.reduce((s, h) => s + h.currentValue, 0).toFixed(2));
    const totalGainLoss = Number((currentValue - totalInvested).toFixed(2));
    const gainPercent = totalInvested > 0 ? Number(((totalGainLoss / totalInvested) * 100).toFixed(2)) : 0;

    let healthScore = 88;
    let healthInsight = 'Portfolio is well diversified across core market capitalization categories.';
    
    const flexiValue = holdings.filter(h => h.category === 'Flexi Cap').reduce((s, h) => s + h.currentValue, 0);
    if (currentValue > 0 && (flexiValue / currentValue) > 0.6) {
      healthScore = 75;
      healthInsight = 'Concentration Warning: Over 60% of portfolio is held in Flexi Cap category. Consider diversifying into debt liquid or large cap index funds.';
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalInvested,
        currentValue,
        totalGainLoss,
        gainPercent,
        xirr: 14.5,
        healthScore,
        healthInsight,
        holdings
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 11. Get Transactions History
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    
    if (!memoryStore.transactions[userId]) {
      memoryStore.transactions[userId] = [
        {
          id: `tx_${Date.now()}`,
          fundId: 'mf_ppfas_flexi',
          fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
          type: 'BUY_SIP',
          amount: 5000,
          nav: 82.30,
          units: 60.75,
          mode: 'SIMULATION',
          status: 'Completed',
          date: new Date()
        }
      ];
    }

    try {
      const [rows] = await mysqlPool.query('SELECT * FROM investment_transactions WHERE user_id = ? ORDER BY transaction_date DESC', [userId]);
      if (rows.length > 0) {
        memoryStore.transactions[userId] = rows.map(r => ({
          id: r.id,
          fundId: r.fund_id,
          fundName: r.fund_name,
          type: r.type,
          amount: Number(r.amount),
          nav: Number(r.nav),
          units: Number(r.units),
          mode: r.mode,
          status: r.status,
          date: r.transaction_date
        }));
      }
    } catch (dbErr) {
      console.warn('MySQL transactions fallback used:', dbErr.message);
    }

    res.status(200).json({
      status: 'success',
      total: memoryStore.transactions[userId].length,
      data: memoryStore.transactions[userId]
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 12. Simulate Investment (Buy)
exports.investSimulate = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const businessId = req.businessId?.toString() || 'business_123';
    const { fundId, amount, type = 'BUY_SIP' } = req.body;

    const fund = await MutualFundProvider.getFundById(fundId);
    const investmentAmount = Number(amount);
    const navVal = Number(fund.nav || 100);
    const unitsPurchased = Number((investmentAmount / navVal).toFixed(4));

    const txId = `tx_${Date.now()}`;
    const newTx = {
      id: txId,
      fundId: fund.id,
      fundName: fund.schemeName,
      type,
      amount: investmentAmount,
      nav: navVal,
      units: unitsPurchased,
      mode: 'SIMULATION',
      status: 'Completed',
      date: new Date()
    };

    if (!memoryStore.transactions[userId]) memoryStore.transactions[userId] = [];
    memoryStore.transactions[userId].unshift(newTx);

    // Update memory holdings
    if (!memoryStore.holdings[userId]) memoryStore.holdings[userId] = [];
    const existingIndex = memoryStore.holdings[userId].findIndex(h => h.fundId === fund.id);

    if (existingIndex >= 0) {
      const h = memoryStore.holdings[userId][existingIndex];
      const newUnits = Number((h.units + unitsPurchased).toFixed(4));
      const newInvested = Number((h.investedAmount + investmentAmount).toFixed(2));
      const newAvgNav = Number((newInvested / newUnits).toFixed(4));
      const newCurrentVal = Number((newUnits * navVal).toFixed(2));
      const newGainLoss = Number((newCurrentVal - newInvested).toFixed(2));
      const newGainPct = Number(((newGainLoss / newInvested) * 100).toFixed(2));

      memoryStore.holdings[userId][existingIndex] = {
        ...h,
        units: newUnits,
        avgNav: newAvgNav,
        investedAmount: newInvested,
        currentNav: navVal,
        currentValue: newCurrentVal,
        gainLoss: newGainLoss,
        gainPercentage: newGainPct
      };
    } else {
      memoryStore.holdings[userId].push({
        id: `hold_${Date.now()}`,
        fundId: fund.id,
        fundName: fund.schemeName,
        category: fund.category,
        units: unitsPurchased,
        avgNav: navVal,
        currentNav: navVal,
        investedAmount: investmentAmount,
        currentValue: investmentAmount,
        gainLoss: 0,
        gainPercentage: 0,
        mode: 'SIMULATION'
      });
    }

    try {
      await mysqlPool.query(`
        INSERT INTO investment_transactions (id, business_id, user_id, fund_id, fund_name, type, amount, nav, units, mode, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'SIMULATION', 'Completed')
      `, [txId, businessId, userId, fund.id, fund.schemeName, type, investmentAmount, navVal, unitsPurchased]);
    } catch (dbErr) {
      console.warn('MySQL investSimulate fallback used:', dbErr.message);
    }

    res.status(201).json({
      status: 'success',
      mode: 'SIMULATION',
      message: `Simulated investment of ₹${investmentAmount.toLocaleString('en-IN')} in ${fund.schemeName} completed successfully!`,
      data: {
        transactionId: txId,
        unitsPurchased,
        nav: navVal,
        mode: 'SIMULATION'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 13. Simulate Redemption
exports.redeemSimulate = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const { fundId, unitsToRedeem } = req.body;

    if (!memoryStore.holdings[userId]) memoryStore.holdings[userId] = [];
    const hIdx = memoryStore.holdings[userId].findIndex(h => h.fundId === fundId || h.id === fundId);

    if (hIdx < 0) {
      return res.status(400).json({ status: 'error', message: 'No holding found for redemption' });
    }

    const holding = memoryStore.holdings[userId][hIdx];
    const redeemUnits = Number(unitsToRedeem);
    if (holding.units < redeemUnits) {
      return res.status(400).json({ status: 'error', message: 'Redemption units exceed current holding units' });
    }

    const currentNav = Number(holding.currentNav);
    const grossRedemptionAmount = Number((redeemUnits * currentNav).toFixed(2));
    const exitLoadPct = holding.category === 'Liquid' || holding.category === 'Index' ? 0.0 : 0.01;
    const exitLoadAmount = Number((grossRedemptionAmount * exitLoadPct).toFixed(2));
    const netRedemptionAmount = Number((grossRedemptionAmount - exitLoadAmount).toFixed(2));

    const txId = `tx_${Date.now()}`;
    const newTx = {
      id: txId,
      fundId: holding.fundId,
      fundName: holding.fundName,
      type: 'REDEEM_SIM',
      amount: netRedemptionAmount,
      nav: currentNav,
      units: redeemUnits,
      mode: 'SIMULATION',
      status: 'Completed',
      date: new Date()
    };

    if (!memoryStore.transactions[userId]) memoryStore.transactions[userId] = [];
    memoryStore.transactions[userId].unshift(newTx);

    const remainingUnits = Number((holding.units - redeemUnits).toFixed(4));
    if (remainingUnits <= 0) {
      memoryStore.holdings[userId].splice(hIdx, 1);
    } else {
      const remainingInvested = Number((remainingUnits * holding.avgNav).toFixed(2));
      const remainingCurrentVal = Number((remainingUnits * currentNav).toFixed(2));
      const gainLoss = Number((remainingCurrentVal - remainingInvested).toFixed(2));
      const gainPct = remainingInvested > 0 ? Number(((gainLoss / remainingInvested) * 100).toFixed(2)) : 0;

      memoryStore.holdings[userId][hIdx] = {
        ...holding,
        units: remainingUnits,
        investedAmount: remainingInvested,
        currentValue: remainingCurrentVal,
        gainLoss,
        gainPercentage: gainPct
      };
    }

    res.status(200).json({
      status: 'success',
      mode: 'SIMULATION',
      message: `Simulated redemption of ${redeemUnits} units completed! Net estimated payout: ₹${netRedemptionAmount.toLocaleString('en-IN')}`,
      data: {
        transactionId: txId,
        grossRedemptionAmount,
        exitLoadApplied: exitLoadAmount,
        netRedemptionAmount,
        mode: 'SIMULATION'
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 14. Watchlist Management
exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    if (!memoryStore.watchlists[userId]) memoryStore.watchlists[userId] = ['mf_sbi_small_cap', 'mf_ppfas_flexi'];
    
    const allFunds = await MutualFundProvider.getFunds();
    const watchlistFunds = allFunds.filter(f => memoryStore.watchlists[userId].includes(f.id));

    res.status(200).json({ status: 'success', total: watchlistFunds.length, data: watchlistFunds });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const { fundId } = req.body;
    if (!memoryStore.watchlists[userId]) memoryStore.watchlists[userId] = [];
    if (!memoryStore.watchlists[userId].includes(fundId)) {
      memoryStore.watchlists[userId].push(fundId);
    }
    res.status(200).json({ status: 'success', message: 'Fund added to watchlist' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const { fundId } = req.params;
    if (memoryStore.watchlists[userId]) {
      memoryStore.watchlists[userId] = memoryStore.watchlists[userId].filter(id => id !== fundId);
    }
    res.status(200).json({ status: 'success', message: 'Fund removed from watchlist' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// 15. AI Wealth Chat Integration with n8n Webhook
exports.wealthChat = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString() || 'user_123';
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message is required' });
    }

    const n8nResult = await N8nService.triggerOrchestrator({
      userId,
      message,
      intent: 'WEALTH',
      context: { source: 'WealthAdvisorAI' }
    });

    if (n8nResult.success && n8nResult.message) {
      return res.status(200).json({ status: 'success', answer: n8nResult.message });
    }

    const fallbackAnswer = await AIService.generateText(`
      You are the **BizNest AI Wealth Advisor**.
      User Query: "${message}"
      Provide a helpful, educational, structured financial response. Remind user that mutual fund investments are subject to market risks.
    `);

    res.status(200).json({ status: 'success', answer: fallbackAnswer });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
