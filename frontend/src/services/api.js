import axios from 'axios';
import * as demoData from './demoData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

let getAuthToken = null;

/**
 * Configure dynamic JWT injection from Clerk.
 * Called in the main Auth/Context initializer.
 */
export const setTokenResolver = (fn) => {
  getAuthToken = fn;
};

export const getActiveToken = async () => {
  if (getAuthToken) {
    return await getAuthToken();
  }
  return null;
};

// Request interceptor to automatically add the Clerk bearer token
api.interceptors.request.use(
  async (config) => {
    if (getAuthToken) {
      try {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          config.headers.Authorization = `Bearer mock_clerk_user_123`;
        }
      } catch (err) {
        console.error('API Request Interceptor Auth Error:', err);
        config.headers.Authorization = `Bearer mock_clerk_user_123`;
      }
    } else {
      config.headers.Authorization = `Bearer mock_clerk_user_123`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with graceful offline / Netlify demo fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isNetworkError = !error.response || error.code === 'ERR_NETWORK' || error.message?.includes('Network Error') || error.code === 'ECONNABORTED';
    const config = error.config;

    // Gracefully fallback to rich demo data on Netlify or when local backend is unreachable
    if (isNetworkError && config) {
      console.warn(`[Netlify / Offline Fallback] Using demo store for: ${config.url}`);
      const url = config.url || '';
      const method = (config.method || 'get').toLowerCase();

      if (url.includes('/invoices')) {
        if (url.includes('/pdf')) {
          return Promise.reject(new Error('Backend PDF endpoint unavailable in offline/Netlify mode'));
        }
        if (method === 'get') {
          return {
            data: {
              status: 'success',
              total: demoData.invoices.length,
              pages: 1,
              currentPage: 1,
              data: demoData.invoices,
            },
          };
        } else if (method === 'post') {
          let body = {};
          try {
            body = typeof config.data === 'string' ? JSON.parse(config.data) : (config.data || {});
          } catch (e) {}

          const subtotal = (body.items || []).reduce((acc, i) => acc + (i.rate * i.quantity), 0);
          const taxTotal = (body.items || []).reduce((acc, i) => acc + (i.rate * i.quantity * ((i.gstPercent || 18) / 100)), 0);
          const newInv = {
            _id: `inv_${Date.now()}`,
            invoiceNumber: body.invoiceNumber || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            businessId: demoData.defaultBusiness,
            customerId: { name: body.customerName, email: body.customerEmail, phone: body.customerPhone, address: body.customerAddress, gstin: '27AAACT2727Q1ZW' },
            issueDate: new Date().toISOString(),
            dueDate: body.dueDate || new Date(Date.now() + 14 * 86400000).toISOString(),
            status: 'Sent',
            subtotal,
            taxTotal,
            discount: body.discount || 0,
            total: subtotal + taxTotal - (body.discount || 0),
            items: body.items || [],
          };
          demoData.invoices.unshift(newInv);
          return { data: { status: 'success', message: 'Invoice created successfully', data: newInv } };
        }
      }

      if (url.includes('/inventory')) {
        return { data: { status: 'success', data: demoData.products, total: demoData.products.length } };
      }

      if (url.includes('/dashboard/stats') || url.includes('/dashboard')) {
        return {
          data: {
            status: 'success',
            data: {
              totalRevenue: 342500,
              revenueGrowth: 12.4,
              totalSales: 154,
              salesGrowth: 8.2,
              totalExpenses: 112400,
              expensesGrowth: -4.5,
              totalProducts: demoData.products.length,
              lowStockCount: 3,
              totalCustomers: demoData.customers.length,
              recentActivities: [
                { id: 1, type: 'Sale', message: 'Invoice #INV-2026-0501 paid by Tata Motors Ltd', amount: '+ ₹1,51,040', time: '10 mins ago' },
                { id: 2, type: 'Stock', message: 'Low stock alert for "Heavy Duty Steel Roll"', amount: 'Qty: 4', time: '1 hour ago' },
                { id: 3, type: 'Expense', message: 'Guindy Industrial Unit Lease Paid', amount: '- ₹45,000', time: '4 hours ago' },
                { id: 4, type: 'Document', message: 'MSME ZED Gold Certificate 2026 Verified', amount: 'Completed', time: 'Yesterday' },
              ],
            },
          },
        };
      }

      if (url.includes('/finance')) {
        return {
          data: {
            status: 'success',
            data: {
              totalRevenue: 342500,
              totalExpenses: 112400,
              netProfit: 230100,
              margin: '67.2%',
              expenses: demoData.expenses,
              invoices: demoData.invoices,
            },
          },
        };
      }

      if (url.includes('/schemes')) {
        return { data: { status: 'success', data: demoData.schemes } };
      }

      if (url.includes('/support')) {
        return { data: { status: 'success', data: demoData.tickets } };
      }

      if (url.includes('/documents')) {
        return { data: { status: 'success', data: demoData.documents } };
      }
    }

    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request. Session may be expired.');
    }
    return Promise.reject(error);
  }
);

export default api;
