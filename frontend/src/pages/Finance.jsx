import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  IndianRupee,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Sparkles,
  X,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Finance = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Others');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [formMsg, setFormMsg] = useState('');

  // Fetch Unified Transactions
  const { data: txRes, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const res = await api.get('/finance/transactions');
      return res.data;
    }
  });

  // Fetch AI Financial Audits
  const { data: insightsRes, isLoading: insightsLoading, refetch: fetchInsights } = useQuery({
    queryKey: ['financeInsights'],
    queryFn: async () => {
      const res = await api.get('/finance/insights');
      return res.data;
    },
    enabled: false
  });

  // Fetch charts data for graphing
  const { data: chartRes } = useQuery({
    queryKey: ['dashboardCharts'],
    queryFn: async () => {
      const res = await api.get('/dashboard/charts');
      return res.data;
    }
  });

  const transactions = Array.isArray(txRes) ? txRes : (txRes?.data || []);
  const chartData = Array.isArray(chartRes) ? chartRes : (chartRes?.data || []);

  // Log Expense Mutation
  const createMutation = useMutation({
    mutationFn: async (expData) => {
      return await api.post('/finance/expenses', expData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['dashboardCharts']);
      showToast('Expense logged in ledger successfully!', 'success');
      setShowAddForm(false);
      setAmount('');
      setCategory('Others');
      setDate('');
      setDescription('');
      setFormMsg('');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Failed to log expense.';
      setFormMsg(errMsg);
      showToast(errMsg, 'error');
    }
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    createMutation.mutate({
      amount,
      category,
      date,
      description,
    });
  };

  const triggerInsights = () => {
    setShowAIInsights(true);
    fetchInsights();
  };

  // Compute total Income and Expenses logged
  const totalIncomes = transactions.filter(t => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Finance Ledger & Cash Flow</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track and categorize company expenditures, audit incoming receipts, and review profit margins.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerInsights}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors hover:bg-indigo-500/15"
          >
            <Sparkles className="h-4 w-4" /> AI Cash Flow Audit
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" /> Log Expense
          </button>
        </div>
      </div>

      {/* KPI summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Income</span>
            <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">₹{totalIncomes.toLocaleString('en-IN')}</p>
          </div>
          <div className="h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operational Expense</span>
            <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">₹{totalExpenses.toLocaleString('en-IN')}</p>
          </div>
          <div className="h-10 w-10 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex justify-between items-center shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Profit Ledger</span>
            <p className={`text-2xl font-extrabold ${(totalIncomes - totalExpenses) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-rose-500'}`}>
              ₹{(totalIncomes - totalExpenses).toLocaleString('en-IN')}
            </p>
          </div>
          <div className="h-10 w-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* AI Financial insights modal */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-900/50 to-indigo-950/50 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-lg">AI Financial Audit & Forecast</h3>
              </div>
              <button onClick={() => setShowAIInsights(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-slate-300 space-y-4 text-sm leading-relaxed max-w-none prose dark:prose-invert">
              {insightsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs font-semibold">Running cash flow auditor...</p>
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  {insightsRes?.data || 'No transaction records found to compile report. Generate invoices and log expenses.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddExpense} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-base">Record Business Expense</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                {formMsg}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Expense Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Expense Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                >
                  <option value="Inventory">Inventory Purchase</option>
                  <option value="Payroll">Payroll / Wages</option>
                  <option value="Rent">Office Rent</option>
                  <option value="Utilities">Utilities (Power, Net)</option>
                  <option value="Marketing">Marketing / Sales</option>
                  <option value="Taxes">Taxes filed</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Payment Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="3"
                  placeholder="E.g. Monthly cloud server subscription"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Logging...' : 'Log Expense'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Body: Graph + Transactions list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History Column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col h-[65vh]">
          <h3 className="text-base font-bold mb-4">Unified Ledger Statements</h3>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 text-slate-400">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-xs font-medium mt-2">Loading statements...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-center">
              <IndianRupee className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2" />
              <h4 className="font-semibold text-slate-650 text-xs">No transactions documented</h4>
              <p className="text-[10px] text-slate-450 mt-0.5">Unified reports will construct as invoices get paid and expenses get logged.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 pr-2">
              {transactions.map((tx) => (
                <div key={tx._id} className="py-3.5 flex justify-between items-center gap-4 hover:bg-slate-50/20 dark:hover:bg-slate-900/10 px-2 rounded-xl transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider uppercase ${
                        tx.type === 'Income'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {tx.type}
                      </span>
                      <span className="text-[10px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 truncate">{tx.description}</p>
                    <p className="text-[10px] text-slate-450">Category: {tx.category}</p>
                  </div>
                  <div className={`font-bold text-sm shrink-0 ${tx.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {tx.type === 'Income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cash Flow Distribution Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6">Cash Flow Margin</h3>
          <div className="h-60 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#111827', borderColor: '#1f2937', color: '#fff' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[10px] text-slate-450 text-center leading-normal mt-4">
            Aggregated statement of cash margin distribution. Run the AI financial auditor tool to generate cost reduction audits.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
