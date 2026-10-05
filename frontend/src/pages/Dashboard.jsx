import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  PlusCircle,
  UploadCloud,
  FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const Dashboard = () => {
  const { theme, userProfile } = useApp();

  // Fetch Dashboard Stats via React Query
  const { data: statsRes, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await api.get('/dashboard/stats');
      return res.data;
    },
    // Mock fallback data for offline / initial development
    initialData: {
      status: 'success',
      data: {
        totalRevenue: 342500,
        revenueGrowth: 12.4,
        totalSales: 154,
        salesGrowth: 8.2,
        totalExpenses: 112400,
        expensesGrowth: -4.5,
        totalProducts: 45,
        lowStockCount: 3,
        totalCustomers: 88,
        recentActivities: [
          { id: 1, type: 'Sale', message: 'Invoice #INV-0042 paid by Rajesh Kumar', amount: '+ ₹12,500', time: '10 mins ago' },
          { id: 2, type: 'Stock', message: 'Low stock warning for "Industrial Valve Pro"', amount: 'Qty: 4', time: '1 hour ago' },
          { id: 3, type: 'Expense', message: 'Office Internet charges approved', amount: '- ₹2,400', time: '4 hours ago' },
          { id: 4, type: 'Document', message: 'Extracted GST details from "Supplies_Invoice.pdf"', amount: 'Completed', time: 'Yesterday' },
        ],
        aiInsights: [
          { id: 1, type: 'inventory', text: 'Demand for "Standard Brass Fittings" is predicted to increase by 20% next month. Consider ordering 15 units now.' },
          { id: 2, type: 'finance', text: 'Operational costs rose 8% this week. Utilities and rent constitute 45% of total spend. AI recommends audit.' }
        ]
      }
    }
  });

  // Fetch Chart Data
  const { data: chartRes, isLoading: chartsLoading } = useQuery({
    queryKey: ['dashboardCharts'],
    queryFn: async () => {
      const res = await api.get('/dashboard/charts');
      return res.data;
    },
    initialData: {
      status: 'success',
      data: [
        { month: 'Jan', Revenue: 180000, Expenses: 95000 },
        { month: 'Feb', Revenue: 220000, Expenses: 110000 },
        { month: 'Mar', Revenue: 250000, Expenses: 105000 },
        { month: 'Apr', Revenue: 210000, Expenses: 120000 },
        { month: 'May', Revenue: 300000, Expenses: 115000 },
        { month: 'Jun', Revenue: 342500, Expenses: 112400 },
      ]
    }
  });

  const stats = statsRes?.data;
  const chartData = chartRes?.data;

  // Stat Card UI
  const StatCard = ({ title, value, growth, icon: Icon, isCurrency = true }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isCurrency ? `₹${value.toLocaleString('en-IN')}` : value}
          </p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4">
        {growth > 0 ? (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-3 w-3" /> +{growth}%
          </span>
        ) : (
          <span className="flex items-center gap-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <TrendingDown className="h-3 w-3" /> {growth}%
          </span>
        )}
        <span className="text-[10px] text-slate-400">vs last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome back, {userProfile?.firstName || 'Business Partner'}</h2>
          <p className="text-slate-550 dark:text-slate-400 text-xs">Here is a summary of your business activities and real-time AI suggestions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/chat"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-semibold text-xs transition-colors"
          >
            <Sparkles className="h-4 w-4" /> Ask AI Assistant
          </Link>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Revenue" value={stats?.totalRevenue || 0} growth={stats?.revenueGrowth || 0} icon={DollarSign} />
        <StatCard title="Sales Count" value={stats?.totalSales || 0} growth={stats?.salesGrowth || 0} icon={ShoppingCart} isCurrency={false} />
        <StatCard title="Expenses" value={stats?.totalExpenses || 0} growth={stats?.expensesGrowth || 0} icon={TrendingDown} />
        <StatCard title="Total Customers" value={stats?.totalCustomers || 0} growth={5.4} icon={Users} isCurrency={false} />
        <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 p-6 rounded-xl shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Wealth Portfolio</p>
              <p className="text-2xl font-bold text-white">
                ₹1,38,500
              </p>
              <p className="text-[11px] text-emerald-300 font-medium">Invested: ₹1,25,000 | Gain: +₹13,500</p>
            </div>
            <Link to="/wealth" className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30 transition-colors">
              <Sparkles className="h-5 w-5" />
            </Link>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            <span className="text-[10px] text-emerald-400 font-medium">SIP: ₹8,000/month | AI Score: 88/100</span>
          </div>
        </div>
      </div>

      {/* Main Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-6">Financial Statement Trends</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1e2937' : '#e2e8f0'} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#111827' : '#fff', borderColor: theme === 'dark' ? '#1f2937' : '#e2e8f0' }} />
                <Area type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Insights & Forecasting</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Enterprise AI Advisor Analysis</h3>
            
            <div className="space-y-3 pt-1">
              {stats?.aiInsights?.map((insight) => (
                <div key={insight.id} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-1 text-xs text-slate-650 dark:text-slate-400">
                  <div className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[9px] tracking-wider">
                    {insight.type} advisor
                  </div>
                  <p className="leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/chat"
            className="flex items-center justify-between text-xs font-semibold mt-6 text-blue-650 dark:text-blue-400 hover:underline transition-colors"
          >
            <span>Ask for a deep recommendation audit</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Quick Actions & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/invoices"
              className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-blue-500/5 hover:border-blue-500/20 text-slate-700 dark:text-slate-300 transition-all text-left"
            >
              <FileSpreadsheet className="h-6 w-6 text-blue-500" />
              <span className="text-xs font-semibold">Generate Invoice</span>
            </Link>
            <Link
              to="/inventory"
              className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-emerald-500/5 hover:border-emerald-500/20 text-slate-700 dark:text-slate-300 transition-all text-left"
            >
              <Package className="h-6 w-6 text-emerald-500" />
              <span className="text-xs font-semibold">Add New Product</span>
            </Link>
            <Link
              to="/documents"
              className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-violet-500/5 hover:border-violet-500/20 text-slate-700 dark:text-slate-300 transition-all text-left"
            >
              <UploadCloud className="h-6 w-6 text-violet-500" />
              <span className="text-xs font-semibold">Upload Invoice OCR</span>
            </Link>
            <Link
              to="/chat"
              className="flex flex-col gap-2 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-pink-500/5 hover:border-pink-500/20 text-slate-700 dark:text-slate-300 transition-all text-left"
            >
              <Sparkles className="h-6 w-6 text-pink-500" />
              <span className="text-xs font-semibold">Consult AI Bot</span>
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Critical Alerts</h3>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold text-[10px] uppercase">
              {stats?.lowStockCount || 0} alerts
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Reorder Suggested</p>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Fittings category products have crossed their minimum threshold settings.
                </p>
              </div>
            </div>
            <Link
              to="/inventory"
              className="block w-full text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-colors"
            >
              Configure restock schedules
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Recent Activities</h3>
          <div className="space-y-3.5">
            {stats?.recentActivities?.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center gap-3 text-xs">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{activity.message}</p>
                  <p className="text-[10px] text-slate-400">{activity.time}</p>
                </div>
                <div className="font-bold text-slate-700 dark:text-slate-300 shrink-0">
                  {activity.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
