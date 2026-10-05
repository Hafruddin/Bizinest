const Chat = require('../models/Chat');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Business = require('../models/Business');
const Scheme = require('../models/Scheme');
const Ticket = require('../models/Ticket');
const Document = require('../models/Document');
const AIService = require('../services/aiService');

/**
 * Get all conversations for a business.
 */
const getChats = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user.businessId?._id || req.user.businessId;
    const chats = await Chat.find({ businessId: targetBusinessId })
      .populate('userId', 'firstName lastName')
      .sort({ updatedAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: chats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get message logs for a specific chat conversation.
 */
const getChatById = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user.businessId?._id || req.user.businessId;
    const { id } = req.params;
    const chat = await Chat.findOne({ _id: id, businessId: targetBusinessId });

    if (!chat) {
      return res.status(404).json({ status: 'error', message: 'Conversation not found' });
    }

    return res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Process a natural language query with the AI Multi-Agent Orchestrator (Standard JSON Response).
 */
const converseOrchestrator = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    // Fallback check to avoid null pointer crashes if profile sync was delayed
    if (!req.user) {
      const User = require('../models/User');
      const Business = require('../models/Business');
      let user = await User.findOne({ role: 'Business Owner' }).populate('businessId');
      if (!user) {
        const defaultBusiness = new Business({
          name: 'Demo Enterprise',
          address: { country: 'India' },
        });
        await defaultBusiness.save();

        user = new User({
          clerkId: 'guest_clerk_id',
          email: 'guest@example.com',
          firstName: 'Demo',
          lastName: 'Owner',
          role: 'Business Owner',
          businessId: defaultBusiness._id,
        });
        await user.save();
        user = await User.findById(user._id).populate('businessId');
      }
      req.user = user;
    }

    const businessId = req.businessId || req.user.businessId?._id || req.user.businessId;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message is required' });
    }

    // Gather context
    const business = await Business.findById(businessId);
    const lowStock = await Product.find({
      businessId,
      $expr: { $lte: ['$quantity', '$minStockThreshold'] }
    }).limit(10);

    const expenses = await Expense.find({ businessId }).sort({ date: -1 }).limit(10);
    const paidInvoices = await Invoice.find({ businessId, status: 'Paid' }).limit(10);
    const unpaidInvoicesCount = await Invoice.countDocuments({ businessId, status: { $ne: 'Paid' } });
    const totalProductsCount = await Product.countDocuments({ businessId });

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const context = {
      business,
      lowStock: lowStock.map(p => ({ name: p.name, quantity: p.quantity, limit: p.minStockThreshold })),
      finance: {
        totalRevenueLogged: totalRevenue,
        totalExpensesLogged: totalExpenses,
        recentExpenses: expenses.map(e => ({ amount: e.amount, category: e.category, desc: e.description }))
      },
      unpaidInvoicesCount,
      totalProductsCount,
    };

    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, businessId });
    }

    if (!chat) {
      chat = new Chat({
        businessId,
        userId: req.user._id,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
      });
    }

    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    const N8nService = require('../services/n8nService');
    let finalAnswer;
    const n8nResult = await N8nService.triggerOrchestrator({
      userId: req.user._id?.toString() || 'user_123',
      sessionId: chatId || `session_${Date.now()}`,
      message,
      context
    });

    if (n8nResult.success && n8nResult.message) {
      finalAnswer = n8nResult.message;
    } else {
      finalAnswer = await AIService.generateText(
        `Orchestrate context: ${JSON.stringify(context)}. User query: ${message}`
      );
    }

    chat.messages.push({
      role: 'model',
      content: finalAnswer,
      timestamp: new Date(),
    });

    await chat.save();

    return res.status(200).json({
      status: 'success',
      data: chat,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Server-Sent Events (SSE) Streaming connection.
 * Responds with chunked model response streams.
 */
const converseOrchestratorStream = async (req, res, next) => {
  try {
    const { chatId, message } = req.body;
    // Fallback check to avoid null pointer crashes if profile sync was delayed
    if (!req.user) {
      const User = require('../models/User');
      const Business = require('../models/Business');
      let user = await User.findOne({ role: 'Business Owner' }).populate('businessId');
      if (!user) {
        const defaultBusiness = new Business({
          name: 'Demo Enterprise',
          address: { country: 'India' },
        });
        await defaultBusiness.save();

        user = new User({
          clerkId: 'guest_clerk_id',
          email: 'guest@example.com',
          firstName: 'Demo',
          lastName: 'Owner',
          role: 'Business Owner',
          businessId: defaultBusiness._id,
        });
        await user.save();
        user = await User.findById(user._id).populate('businessId');
      }
      req.user = user;
    }

    const businessId = req.businessId || req.user.businessId?._id || req.user.businessId;

    if (!message) {
      return res.status(400).json({ status: 'error', message: 'Message is required' });
    }

    // Set connection-keep SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // 1. Compile multi-agent database records
    const business = await Business.findById(businessId);
    const lowStock = await Product.find({
      businessId,
      $expr: { $lte: ['$quantity', '$minStockThreshold'] }
    }).limit(10);

    const expenses = await Expense.find({ businessId }).sort({ date: -1 }).limit(10);
    const paidInvoices = await Invoice.find({ businessId, status: 'Paid' }).limit(10);
    const unpaidInvoicesCount = await Invoice.countDocuments({ businessId, status: { $ne: 'Paid' } });
    const totalProductsCount = await Product.countDocuments({ businessId });
    const schemes = await Scheme.find().limit(5);
    const supportTickets = await Ticket.find({ businessId }).sort({ updatedAt: -1 }).limit(5);
    const documents = await Document.find({ businessId }).sort({ createdAt: -1 }).limit(5);

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    const context = {
      business,
      lowStock: lowStock.map(p => ({ name: p.name, quantity: p.quantity, limit: p.minStockThreshold })),
      finance: {
        totalRevenueLogged: totalRevenue,
        totalExpensesLogged: totalExpenses,
        recentExpenses: expenses.map(e => ({ amount: e.amount, category: e.category, desc: e.description }))
      },
      unpaidInvoicesCount,
      totalProductsCount,
      schemes: schemes.map(s => ({ name: s.name, type: s.type, budget: s.financialAssistance })),
      supportTickets: supportTickets.map(t => ({ title: t.title, status: t.status })),
      documents: documents.map(d => ({ name: d.name, status: d.status, summary: d.summary })),
    };

    // 2. Resolve chat target
    let chat;
    let finalChatId = chatId;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, businessId });
    }

    if (!chat) {
      chat = new Chat({
        businessId,
        userId: req.user._id,
        title: message.substring(0, 30) + (message.length > 30 ? '...' : ''),
        messages: [],
      });
      await chat.save();
      finalChatId = chat._id;
    }

    // Write metadata config event first
    res.write(`data: ${JSON.stringify({ chatId: finalChatId, event: 'meta' })}\n\n`);

    // Save user message to thread memory
    chat.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    let completeResponse = '';

    // 3. Initiate chunked output streaming
    await AIService.runOrchestratorStream(message, context, (chunk) => {
      completeResponse += chunk;
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    });

    // Save final response text to database history
    chat.messages.push({
      role: 'model',
      content: completeResponse,
      timestamp: new Date(),
    });

    if (chat.messages.length <= 2) {
      chat.title = message.substring(0, 30) + (message.length > 30 ? '...' : '');
    }

    await chat.save();

    res.write(`data: ${JSON.stringify({ event: 'done' })}\n\n`);
    res.end();
  } catch (error) {
    console.error('SSE Stream Controller Error:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
};

/**
 * Delete a specific chat conversation.
 */
const deleteChat = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user.businessId?._id || req.user.businessId;
    const { id } = req.params;
    const chat = await Chat.findOneAndDelete({ _id: id, businessId: targetBusinessId });

    if (!chat) {
      return res.status(404).json({ status: 'error', message: 'Conversation not found' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete all chat conversations for the current business user.
 */
const clearChats = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user.businessId?._id || req.user.businessId;
    await Chat.deleteMany({ businessId: targetBusinessId });
    return res.status(200).json({
      status: 'success',
      message: 'All conversations cleared successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getChats,
  getChatById,
  converseOrchestrator,
  converseOrchestratorStream,
  deleteChat,
  clearChats,
};
