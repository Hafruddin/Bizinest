const mongoose = require('mongoose');
const Expense = require('../models/Expense');
const Invoice = require('../models/Invoice');
const AIService = require('../services/aiService');
const demoStore = require('../utils/demoStore');

/**
 * Get unified transaction statement (Incomes/Paid Invoices + Expenses) sorted chronologically.
 */
const getTransactions = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const businessId = req.businessId || req.user?.businessId?._id || req.user?.businessId || '6a9fa2b3a290f13a38ef94bb';
        const expenses = await Expense.find({ businessId }).sort({ date: -1 });
        const paidInvoices = await Invoice.find({ businessId, status: 'Paid' }).populate('customerId');

        if (expenses.length > 0 || paidInvoices.length > 0) {
          const incomesFormatted = paidInvoices.map((inv) => ({
            _id: inv._id,
            type: 'Income',
            amount: inv.total,
            category: 'Sales Invoice',
            date: inv.issueDate,
            description: `Sales revenue from ${inv.customerId?.name || 'Client'} (Inv #${inv.invoiceNumber})`,
          }));

          const expensesFormatted = expenses.map((exp) => ({
            _id: exp._id,
            type: 'Expense',
            amount: exp.amount,
            category: exp.category,
            date: exp.date,
            description: exp.description,
          }));

          const statement = [...incomesFormatted, ...expensesFormatted].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          return res.status(200).json({
            status: 'success',
            count: statement.length,
            data: statement,
          });
        }
      } catch (err) {
        console.warn('Finance DB fetch warning, using in-memory demoStore:', err.message);
      }
    }

    // In-memory fallback
    const paidInvoices = demoStore.invoices.filter(i => i.status === 'Paid');
    const incomesFormatted = paidInvoices.map((inv) => ({
      _id: inv._id,
      type: 'Income',
      amount: inv.total,
      category: 'Sales Invoice',
      date: inv.issueDate,
      description: `Sales revenue from ${inv.customer?.name || 'Enterprise Client'} (Inv #${inv.invoiceNumber})`,
    }));

    const expensesFormatted = demoStore.expenses.map((exp) => ({
      _id: exp._id,
      type: 'Expense',
      amount: exp.amount,
      category: exp.category,
      date: exp.date,
      description: exp.description,
    }));

    const statement = [...incomesFormatted, ...expensesFormatted].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return res.status(200).json({
      status: 'success',
      count: statement.length,
      data: statement,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a manual business expense.
 */
const createExpense = async (req, res, next) => {
  try {
    const { amount, category, date, description, receiptUrl } = req.query.amount ? req.query : req.body;

    const newExp = {
      _id: `exp_${Date.now()}`,
      amount: Number(amount || 0),
      category: category || 'Others',
      date: date ? new Date(date).toISOString() : new Date().toISOString(),
      description: description || 'Business Expense',
      receiptUrl,
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const expense = new Expense(newExp);
        await expense.save();
      } catch (err) {
        console.warn('DB Expense save warning:', err.message);
      }
    }

    demoStore.expenses.unshift(newExp);

    return res.status(201).json({
      status: 'success',
      message: 'Expense logged successfully',
      data: newExp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get logged expenses.
 */
const getExpenses = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const expenses = await Expense.find().sort({ date: -1 });
      if (expenses.length > 0) {
        return res.status(200).json({ status: 'success', data: expenses });
      }
    }
    return res.status(200).json({ status: 'success', data: demoStore.expenses });
  } catch (error) {
    next(error);
  }
};

/**
 * AI-driven Profit & Loss audits and cash flow forecasting.
 */
const getFinancialInsights = async (req, res, next) => {
  try {
    const paidInvoices = demoStore.invoices.filter(i => i.status === 'Paid');
    const unpaidInvoices = demoStore.invoices.filter(i => i.status !== 'Paid');
    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalReceivables = unpaidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = demoStore.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const financialData = {
      totalRevenue,
      totalExpenses,
      netProfit: totalRevenue - totalExpenses,
      receivablesStatus: totalReceivables,
    };

    const prompt = `
You are the **Enterprise AI Finance Advisor**. Audit the financial details for the business:
${JSON.stringify(financialData, null, 2)}

Provide:
1. Cash Flow Summary: Breakdown of Revenue vs operational Expenses.
2. Net Profit Margin Assessment: Is the profit margin healthy for an enterprise?
3. Accounts Receivable Warning: Suggestions for collecting the receivables (₹${totalReceivables.toLocaleString('en-IN')}).
4. Cost Reduction Recommendations: Review expenses and suggest optimization cuts.

Format your audit report in clean, professional markdown with tables or bullet points.
`;

    const insights = await AIService.generateText(prompt);

    return res.status(200).json({
      status: 'success',
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  createExpense,
  getExpenses,
  getFinancialInsights,
};
