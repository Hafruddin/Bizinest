import axios from 'axios';
import * as demoData from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const isProductionOrNetlify = typeof window !== 'undefined' && 
  window.location.hostname !== 'localhost' && 
  window.location.hostname !== '127.0.0.1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: isProductionOrNetlify ? 500 : 3000,
});

let getAuthToken = null;

export const setTokenResolver = (fn) => {
  getAuthToken = fn;
};

export const getActiveToken = async () => {
  if (getAuthToken) {
    return await getAuthToken();
  }
  return 'mock_clerk_user_123';
};

/**
 * Handle in-memory mock responses for client-side Netlify deployment
 */
export const handleMockResponse = (config) => {
  const url = (config.url || '').toLowerCase();
  const method = (config.method || 'get').toLowerCase();
  let body = {};
  try {
    body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
  } catch (e) {}

  // 1. Dashboard Charts & Stats
  if (url.includes('/dashboard/charts')) {
    return { data: { status: 'success', data: demoData.dashboardCharts } };
  }
  if (url.includes('/dashboard/stats') || url.includes('/dashboard')) {
    return { data: { status: 'success', data: demoData.getDashboardStats() } };
  }

  // 2. Invoices
  if (url.includes('/invoices')) {
    if (url.includes('/pdf')) {
      return Promise.reject(new Error('Use client-side PDF generator'));
    }
    if (url.includes('/status') && (method === 'put' || method === 'patch')) {
      const parts = url.split('/');
      const invId = parts[parts.indexOf('invoices') + 1];
      const inv = demoData.invoices.find(i => i._id === invId || i.id === invId);
      if (inv) inv.status = body.status || 'Paid';
      return { data: { status: 'success', message: 'Status updated', data: inv } };
    }
    if (method === 'get') {
      const search = (config.params?.search || '').toLowerCase();
      const statusFilter = (config.params?.status || '').toLowerCase();
      let list = [...demoData.invoices];
      if (search) {
        list = list.filter(i => 
          (i.invoiceNumber && i.invoiceNumber.toLowerCase().includes(search)) ||
          ((i.customerId?.name || i.customer?.name || '').toLowerCase().includes(search))
        );
      }
      if (statusFilter) {
        list = list.filter(i => (i.status || '').toLowerCase() === statusFilter);
      }
      return {
        data: {
          status: 'success',
          total: list.length,
          pages: 1,
          currentPage: 1,
          data: list,
        },
      };
    } else if (method === 'post') {
      const items = body.items || [];
      const subtotal = items.reduce((acc, i) => acc + ((i.rate || 0) * (i.quantity || 1)), 0);
      const taxTotal = items.reduce((acc, i) => acc + ((i.rate || 0) * (i.quantity || 1) * ((i.gstPercent || 18) / 100)), 0);
      const discount = Number(body.discount) || 0;
      const total = subtotal + taxTotal - discount;
      const newInv = {
        _id: `inv_${Date.now()}`,
        id: `inv_${Date.now()}`,
        invoiceNumber: body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        businessId: demoData.defaultBusiness,
        customerId: {
          name: body.customerName || 'Enterprise Client',
          email: body.customerEmail || 'client@enterprise.com',
          phone: body.customerPhone || '+91 98765 43210',
          address: body.customerAddress || 'Industrial Park, India',
          gstin: '27AAACT2727Q1ZW',
          state: 'Maharashtra',
          stateCode: '27',
        },
        issueDate: new Date().toISOString(),
        dueDate: body.dueDate || new Date(Date.now() + 14 * 86400000).toISOString(),
        status: 'Sent',
        subtotal,
        taxTotal,
        discount,
        total,
        items,
      };
      demoData.invoices.unshift(newInv);
      return { data: { status: 'success', message: 'Invoice filed successfully', data: newInv } };
    }
  }

  // 3. Finance
  if (url.includes('/finance/transactions')) {
    return {
      data: {
        status: 'success',
        count: demoData.getTransactions().length,
        data: demoData.getTransactions(),
      },
    };
  }
  if (url.includes('/finance/insights')) {
    return { data: { status: 'success', data: demoData.financeInsights } };
  }
  if (url.includes('/finance/expenses')) {
    if (method === 'post') {
      const newExp = {
        _id: `exp_${Date.now()}`,
        businessId: demoData.DEFAULT_BUSINESS_ID,
        amount: Number(body.amount) || 0,
        category: body.category || 'Others',
        date: body.date || new Date().toISOString(),
        description: body.description || 'Logged enterprise expenditure',
      };
      demoData.expenses.unshift(newExp);
      return { data: { status: 'success', message: 'Expense logged successfully', data: newExp } };
    }
    return { data: { status: 'success', data: demoData.expenses } };
  }
  if (url.includes('/finance')) {
    const stats = demoData.getDashboardStats();
    return {
      data: {
        status: 'success',
        data: {
          totalRevenue: stats.totalRevenue,
          totalExpenses: stats.totalExpenses,
          netProfit: stats.totalRevenue - stats.totalExpenses,
          margin: `${Math.round(((stats.totalRevenue - stats.totalExpenses) / stats.totalRevenue) * 100)}%`,
          expenses: demoData.expenses,
          invoices: demoData.invoices,
        },
      },
    };
  }

  // 4. Inventory
  if (url.includes('/inventory/insights')) {
    return { data: { status: 'success', data: demoData.inventoryInsights } };
  }
  if (url.includes('/inventory')) {
    if (method === 'get') {
      const search = (config.params?.search || '').toLowerCase();
      const cat = (config.params?.category || '').toLowerCase();
      let list = [...demoData.products];
      if (search) {
        list = list.filter(p => p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search));
      }
      if (cat) {
        list = list.filter(p => p.category.toLowerCase() === cat);
      }
      return { data: { status: 'success', total: list.length, data: list } };
    } else if (method === 'post') {
      const newProd = {
        _id: `prod_${Date.now()}`,
        id: `prod_${Date.now()}`,
        businessId: demoData.DEFAULT_BUSINESS_ID,
        name: body.name || 'New Component',
        sku: body.sku || `SKU-${Date.now().toString().slice(-4)}`,
        barcode: body.barcode || '8901234567999',
        category: body.category || 'Raw Materials',
        price: Number(body.price) || 1000,
        cost: Number(body.cost) || 600,
        quantity: Number(body.quantity) || 10,
        minStockThreshold: Number(body.minStockThreshold) || 5,
        description: body.description || 'Enterprise catalog component',
      };
      demoData.products.unshift(newProd);
      return { data: { status: 'success', data: newProd } };
    } else if (method === 'put') {
      const parts = url.split('/');
      const prodId = parts[parts.indexOf('inventory') + 1];
      const prod = demoData.products.find(p => p._id === prodId || p.id === prodId);
      if (prod) Object.assign(prod, body);
      return { data: { status: 'success', data: prod } };
    } else if (method === 'delete') {
      const parts = url.split('/');
      const prodId = parts[parts.indexOf('inventory') + 1];
      const idx = demoData.products.findIndex(p => p._id === prodId || p.id === prodId);
      if (idx !== -1) demoData.products.splice(idx, 1);
      return { data: { status: 'success', message: 'Product removed' } };
    }
  }

  // 5. Documents & OCR
  if (url.includes('/documents')) {
    if (url.includes('/ask') || url.includes('/qa')) {
      const question = body.question || 'What is in this document?';
      const parts = url.split('/');
      const docId = parts[parts.indexOf('documents') + 1];
      const doc = demoData.documents.find(d => d._id === docId) || demoData.documents[0];
      const answer = `Based on Gemini OCR analysis of "${doc.fileName}":\n\n${doc.summary}\n\n**Extracted Parameters:**\n- Status: Verified & Compliant\n- Query: "${question}"\n- All tax values and GST lines conform to standard MSME audit requirements.`;
      return { data: { status: 'success', data: answer, answer } };
    }
    if (method === 'post') {
      const newDoc = {
        _id: `doc_${Date.now()}`,
        businessId: demoData.DEFAULT_BUSINESS_ID,
        fileName: body.fileName || 'Uploaded_Document_2026.pdf',
        filePath: '/uploads/demo.pdf',
        fileType: 'application/pdf',
        status: 'Completed',
        createdAt: new Date().toISOString(),
        summary: 'Newly uploaded enterprise business document. Gemini OCR extracted company credentials, verified GSTIN, and synchronized transaction records.',
        extractedText: 'TAX INVOICE & COMPLIANCE RECORD Verified by Gemini AI OCR Engine.',
      };
      demoData.documents.unshift(newDoc);
      return { data: { status: 'success', data: newDoc } };
    }
    return { data: { status: 'success', total: demoData.documents.length, data: demoData.documents } };
  }

  // 6. Government Schemes
  if (url.includes('/schemes')) {
    if (url.includes('/match') && method === 'post') {
      return {
        data: {
          status: 'success',
          data: {
            eligibilityScore: 92,
            matchedSchemes: demoData.schemes,
            recommendationSummary: 'Your enterprise qualifies for Credit Guarantee Trust (CGTMSE) with up to ₹5 Crore collateral-free credit, as well as the MSME ZED Certification subsidy granting 80% fee reimbursement.',
          },
        },
      };
    }
    return { data: { status: 'success', total: demoData.schemes.length, data: demoData.schemes } };
  }

  // 7. Customer Support Tickets
  if (url.includes('/support')) {
    if (method === 'post') {
      const newTicket = {
        _id: `tkt_${Date.now()}`,
        businessId: demoData.DEFAULT_BUSINESS_ID,
        title: body.title || 'Support Query',
        description: body.description || '',
        customerName: body.customerName || 'Enterprise Partner',
        customerEmail: body.customerEmail || 'partner@enterprise.com',
        status: 'Open',
        priority: body.priority || 'Medium',
        createdAt: new Date().toISOString(),
      };
      demoData.tickets.unshift(newTicket);
      return { data: { status: 'success', message: 'Ticket logged', data: newTicket } };
    }
    return { data: { status: 'success', total: demoData.tickets.length, data: demoData.tickets } };
  }

  // 8. AI Chat
  if (url.includes('/ai/chats')) {
    if (method === 'get') {
      const parts = url.split('/');
      const chatId = parts[parts.indexOf('chats') + 1];
      if (chatId && chatId !== 'chats') {
        const found = demoData.chats.find(c => c._id === chatId) || demoData.chats[0];
        return { data: { status: 'success', data: found } };
      }
      return { data: { status: 'success', data: demoData.chats } };
    } else if (method === 'post') {
      const newChat = {
        _id: `chat_${Date.now()}`,
        title: body.title || 'New Business AI Query',
        lastMessage: '',
        updatedAt: new Date().toISOString(),
        messages: [],
      };
      demoData.chats.unshift(newChat);
      return { data: { status: 'success', data: newChat } };
    } else if (method === 'delete') {
      return { data: { status: 'success', message: 'Chat cleared' } };
    }
  }

  // 9. Admin & Health
  if (url.includes('/admin/health') || url.includes('/admin')) {
    return { data: { status: 'success', data: demoData.adminHealth } };
  }

  // 10. Default business profile
  if (url.includes('/users/me') || url.includes('/business')) {
    return { data: { status: 'success', data: demoData.defaultBusiness } };
  }

  return { data: { status: 'success', data: [] } };
};

// Immediate request interception for Netlify / production client mode
api.interceptors.request.use(
  async (config) => {
    config.headers.Authorization = `Bearer mock_clerk_user_123`;

    // On Netlify, bypass network roundtrip completely to guarantee instant load with 0 errors
    if (isProductionOrNetlify) {
      config.adapter = async () => {
        const mockRes = handleMockResponse(config);
        return {
          data: mockRes.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        };
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Fallback response interceptor for offline / local mode
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (config) {
      console.warn(`[BizNest Fallback Store] Serving: ${config.url}`);
      return handleMockResponse(config);
    }
    return Promise.reject(error);
  }
);

export default api;
