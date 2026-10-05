const MutualFundProvider = require('./mutualFundProvider');

/**
 * Explainable Mutual Fund Recommendation Engine
 */
class RecommendationEngine {
  /**
   * Calculate suitability scores for a list of funds against investor profile and goal.
   * @param {Object} profile - { age, monthlyIncome, monthlyExpenses, riskTolerance, horizonYears }
   * @param {Object} goal - { goalName, targetAmount, targetDate, riskPreference }
   * @param {Array} currentHoldings - Array of active portfolio holdings to evaluate overlap
   * @returns {Promise<Array>} - Funds with detailed suitability scores and rationale
   */
  static async getRecommendations(profile = {}, goal = {}, currentHoldings = []) {
    const funds = await MutualFundProvider.getFunds();

    const userRisk = profile.riskTolerance || goal.riskPreference || 'Moderate';
    const horizon = Number(profile.investmentHorizonYears) || 5;

    const scoredFunds = funds.map((fund) => {
      // 1. Goal Fit (Max 20)
      let goalFitScore = 15;
      if (goal.category === 'Tax Saving' && fund.category === 'ELSS') goalFitScore = 20;
      else if (goal.category === 'Emergency Fund' && fund.category === 'Liquid') goalFitScore = 20;
      else if (horizon >= 7 && (fund.category === 'Small Cap' || fund.category === 'Mid Cap' || fund.category === 'Flexi Cap')) goalFitScore = 19;
      else if (horizon >= 3 && (fund.category === 'Large Cap' || fund.category === 'Hybrid' || fund.category === 'Index')) goalFitScore = 18;
      else if (horizon < 3 && fund.category === 'Liquid') goalFitScore = 20;

      // 2. Risk Fit (Max 20)
      let riskFitScore = 14;
      if (userRisk === 'Aggressive' && (fund.riskLevel === 'Aggressive' || fund.riskLevel === 'Very High')) riskFitScore = 20;
      else if (userRisk === 'Moderately Aggressive' && (fund.category === 'Flexi Cap' || fund.category === 'Mid Cap' || fund.category === 'ELSS')) riskFitScore = 19;
      else if (userRisk === 'Moderate' && (fund.category === 'Index' || fund.category === 'Hybrid' || fund.category === 'Large Cap')) riskFitScore = 20;
      else if (userRisk === 'Moderately Conservative' && (fund.category === 'Large Cap' || fund.category === 'Liquid')) riskFitScore = 19;
      else if (userRisk === 'Conservative' && fund.category === 'Liquid') riskFitScore = 20;

      // 3. Time Horizon (Max 20)
      let horizonScore = 15;
      if (horizon >= 5 && fund.category !== 'Liquid') horizonScore = 19;
      else if (horizon >= 3 && fund.category !== 'Small Cap') horizonScore = 18;
      else if (horizon < 3 && fund.category === 'Liquid') horizonScore = 20;

      // 4. Historical Consistency (Max 20)
      let consistencyScore = Math.min(20, Math.round((fund.threeYearReturn / 25) * 20));

      // 5. Cost / Expense Ratio (Max 10)
      let costScore = 8;
      if (fund.expenseRatio <= 0.3) costScore = 10;
      else if (fund.expenseRatio <= 0.7) costScore = 9;
      else if (fund.expenseRatio <= 1.0) costScore = 7;
      else costScore = 5;

      // 6. Diversification / Overlap Check (Max 10)
      let divScore = 9;
      const isAlreadyHeld = currentHoldings.some(h => h.fund_id === fund.id || h.category === fund.category);
      if (isAlreadyHeld) divScore = 6; // Minor penalty for category overlap

      const totalScore = Math.min(99, goalFitScore + riskFitScore + horizonScore + consistencyScore + costScore + divScore);

      const whyItMatches = `Matches your ${userRisk} risk profile and ${horizon}-year horizon with a ${fund.threeYearReturn}% 3-Year CAGR and competitive ${fund.expenseRatio}% expense ratio.`;
      
      let keyRisks = 'Market volatility risk applies to equity holdings.';
      if (fund.category === 'Small Cap') keyRisks = 'High short-term downside volatility and liquidity risk during market corrections.';
      else if (fund.category === 'Mid Cap') keyRisks = 'Moderate-to-high downside swings during equity drawdowns.';
      else if (fund.category === 'ELSS') keyRisks = 'Mandatory statutory 3-year lock-in period applies.';

      return {
        fundName: fund.schemeName,
        schemeCode: fund.schemeCode,
        amc: fund.amc,
        category: fund.category,
        risk: fund.riskLevel,
        nav: fund.nav,
        navDate: fund.navDate,
        oneYearReturn: fund.oneYearReturn,
        threeYearReturn: fund.threeYearReturn,
        fiveYearReturn: fund.fiveYearReturn,
        expenseRatio: fund.expenseRatio,
        exitLoad: fund.exitLoad,
        minimumSIP: fund.minSip,
        minimumInvestment: fund.minLumpsum,
        suitabilityScore: totalScore,
        scoreBreakdown: {
          goalFit: goalFitScore,
          riskFit: riskFitScore,
          timeHorizon: horizonScore,
          consistency: consistencyScore,
          cost: costScore,
          diversification: divScore
        },
        whyItMatches,
        keyRisks,
        dataSource: fund.dataSource,
        dataDate: fund.dataDate
      };
    });

    return scoredFunds.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }
}

module.exports = RecommendationEngine;
