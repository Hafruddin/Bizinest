import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Boxes,
  FileSpreadsheet,
  IndianRupee,
  FileText,
  MessageSquareCode,
  GraduationCap,
  LifeBuoy,
  ShieldCheck,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Bot,
  Zap,
  Shield,
  TrendingUp,
  Users,
  Briefcase,
  PlayCircle,
  ChevronRight,
  LogIn,
  Layers,
  Search,
  Check,
  Star,
  Building2,
  Award
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const LandingPage = () => {
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  let isSignedIn = false;
  let user = null;

  const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

  try {
    const clerkUser = useUser();
    isSignedIn = clerkUser?.isSignedIn || BYPASS_AUTH;
    user = clerkUser?.user;
  } catch (e) {
    isSignedIn = BYPASS_AUTH;
  }

  const [activeTab, setActiveTab] = useState('agents');
  const [activeStep, setActiveStep] = useState(0);

  // 10 Domain-Specialized AI Agents
  const agents = [
    {
      id: 'invoice',
      name: 'Invoice Agent',
      icon: FileSpreadsheet,
      badge: 'GST Ready',
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-500',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      description: 'Generates compliant GST tax invoices, automatically updates inventory stock, exports PDFs, and embeds UPI QR codes for instant payments.',
      features: ['Automated GST Calculation', 'Stock Auto-Deduction', 'PDF & Instant QR Generation', 'Payment Reminders']
    },
    {
      id: 'inventory',
      name: 'Inventory Agent',
      icon: Boxes,
      badge: 'Real-time SKU',
      color: 'from-indigo-500 to-purple-500',
      textColor: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      description: 'Monitors stock levels, predicts inventory depletion, triggers low-stock alerts, and auto-generates printable barcode & QR tags.',
      features: ['Real-time SKU Tracker', 'Predictive Low Stock Alerts', 'Barcode & QR Generator', 'Batch & Expiry Management']
    },
    {
      id: 'finance',
      name: 'Finance Agent',
      icon: IndianRupee,
      badge: 'Cash Flow',
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      description: 'Tracks cash flow, generates Profit & Loss statements, summarizes tax liabilities, and projects monthly financial runway.',
      features: ['P&L Statement Generator', 'Cash Flow Projections', 'Tax Liability Summaries', 'Expense Categorization']
    },
    {
      id: 'document',
      name: 'Document Agent',
      icon: FileText,
      badge: 'OCR & RAG',
      color: 'from-amber-500 to-orange-500',
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      description: 'Extracts structured data from uploaded PDFs, bills, and Excel sheets using OCR, enabling instant semantic Q&A over enterprise docs.',
      features: ['OCR Text & Table Extraction', 'Semantic Document Search', 'Multi-file RAG Querying', 'Instant Key-Value Parsing']
    },
    {
      id: 'support',
      name: 'Customer Support Agent',
      icon: LifeBuoy,
      badge: '24/7 Ticketing',
      color: 'from-pink-500 to-rose-500',
      textColor: 'text-pink-500',
      bgColor: 'bg-pink-500/10 border-pink-500/20',
      description: 'Handles customer inquiries, logs support tickets, auto-resolves FAQs, and routes complex issues to human managers.',
      features: ['Automated Ticket Logging', 'FAQ Knowledge Base Bot', 'Sentiment Analysis', 'Escalation Workflows']
    },
    {
      id: 'schemes',
      name: 'Govt Scheme Advisor',
      icon: GraduationCap,
      badge: 'Enterprise Schemes',
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-500',
      bgColor: 'bg-violet-500/10 border-violet-500/20',
      description: 'Matches your business profile against government subsidy schemes like PMEGP, Mudra Loans, CGTMSE, and ZED Certification.',
      features: ['PMEGP & Mudra Eligibility', 'Subsidy Calculator', 'Required Docs Checklist', 'Direct Application Guidance']
    },
    {
      id: 'analytics',
      name: 'Business Analytics Agent',
      icon: TrendingUp,
      badge: 'Forecasting',
      color: 'from-sky-500 to-blue-600',
      textColor: 'text-sky-500',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
      description: 'Analyzes sales trends, customer churn rate, peak buying cycles, and provides data-backed growth recommendations.',
      features: ['Revenue Trend Analysis', 'Demand Forecasting', 'Customer Lifetime Value', 'Actionable Growth Insights']
    },
    {
      id: 'marketing',
      name: 'Marketing Agent',
      icon: Zap,
      badge: 'Content AI',
      color: 'from-fuchsia-500 to-pink-600',
      textColor: 'text-fuchsia-500',
      bgColor: 'bg-fuchsia-500/10 border-fuchsia-500/20',
      description: 'Generates promotional social media posts, WhatsApp marketing copy, email campaigns, and festive discount announcements.',
      features: ['Social Media Copywriting', 'WhatsApp Campaign Builder', 'Festival Offer Templates', 'SEO & Ad Copy Assistant']
    },
    {
      id: 'hr',
      name: 'HR & Payroll Agent',
      icon: Users,
      badge: 'Payroll & Leave',
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-500',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      description: 'Estimates monthly salary payouts, tracks employee attendance and leaves, and drafts offer letters or policy updates.',
      features: ['Payroll Calculation', 'Attendance & Leave Log', 'Offer Letter Generator', 'Compliance Policy Templates']
    },
    {
      id: 'advisor',
      name: 'AI Executive Advisor',
      icon: Briefcase,
      badge: 'Strategic AI',
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-600/10 border-blue-600/20',
      description: 'Acts as your virtual COO/CFO providing strategic business recommendations, risk management advice, and expansion guidance.',
      features: ['Strategic Decision Support', 'Risk Assessment', 'Market Expansion Planning', 'Competitor Insights']
    }
  ];

  // How to use application steps
  const usageSteps = [
    {
      step: '01',
      title: 'Sign In & Connect Your Business',
      description: 'Create your free account or sign in with Google. Set up your business profile, GST details, and industry type in under 60 seconds.',
      icon: LogIn,
      tag: 'Quick Onboarding',
      details: [
        'Secure Clerk Authentication',
        'Automatic profile initialization',
        'Role-based access (Owner, Manager, Staff)'
      ]
    },
    {
      step: '02',
      title: 'Chat with 10 Multi-Agent AI Assistants',
      description: 'Instruct specialized AI agents in plain conversational language. Ask "Generate GST invoice for 50 units", "Check low stock items", or "Recommend Enterprise subsidies".',
      icon: MessageSquareCode,
      tag: 'LangGraph Engine',
      details: [
        'Natural language voice/text prompt',
        'Dynamic swarm routing between 10 agents',
        'Real-time streaming responses (SSE)'
      ]
    },
    {
      step: '03',
      title: 'Automate Invoices, Stock & Billing',
      description: 'Create professional tax invoices with auto QR codes. Your stock levels automatically update upon invoice generation with full audit trails.',
      icon: FileSpreadsheet,
      tag: 'GST & Inventory',
      details: [
        'Instant PDF invoice export',
        'Automatic stock deduction',
        'Low inventory warning notifications'
      ]
    },
    {
      step: '04',
      title: 'Scan Documents & Track Cash Flow',
      description: 'Upload purchase bills, supplier contracts, or bank statements. The OCR Document Agent reads them and updates your financial dashboards instantly.',
      icon: FileText,
      tag: 'OCR & Financial RAG',
      details: [
        'Intelligent PDF/Excel data extraction',
        'Real-time Profit & Loss calculation',
        'Tax estimation & expense tags'
      ]
    },
    {
      step: '05',
      title: 'Unlock Indian Enterprise Govt Schemes',
      description: 'Discover government subsidies, Mudra loans, PMEGP grants, and collateral-free credit schemes matching your location and business metrics.',
      icon: GraduationCap,
      tag: 'Subsidy Matcher',
      details: [
        'Custom eligibility scoring',
        'Required documentation list',
        'Direct link to official portals'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background Glow effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 blur-3xl pointer-events-none -z-0" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                BizNest AI
              </span>
              <span className="block text-[10px] text-blue-400 font-medium tracking-wider uppercase">
                Enterprise Business Assistant
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How To Use</a>
            <a href="#agents" className="hover:text-white transition-colors">AI Agents</a>
            <a href="#schemes" className="hover:text-white transition-colors">Govt Schemes</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all duration-200"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Go to Dashboard</span>
                </button>
                {!BYPASS_AUTH && <UserButton afterSignOutUrl="/" />}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate('/sign-in')}
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/sign-in')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Multi-Agent AI Swarm for Enterprises</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
          >
            Automate Your Small Business With <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Intelligent AI Agents</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            From instant GST invoicing and inventory SKU tracking to cash flow forecasting and government scheme matching — let 10 specialized AI agents handle operations while you grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            {isSignedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Launch Business Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/sign-in')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In / Login to Start</span>
              </button>
            )}

            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white font-semibold transition-all"
            >
              <PlayCircle className="h-5 w-5 text-blue-400" />
              <span>See How It Works</span>
            </a>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/60 mt-12 text-left">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
              <p className="text-2xl font-bold text-white">10 Specialized</p>
              <p className="text-xs text-slate-400 font-medium">Domain AI Agents</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
              <p className="text-2xl font-bold text-white">25+ Hours</p>
              <p className="text-xs text-slate-400 font-medium">Saved Weekly / Business</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
              <p className="text-2xl font-bold text-white">100% Ready</p>
              <p className="text-xs text-slate-400 font-medium">GST Tax Compliance</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/40">
              <p className="text-2xl font-bold text-white">Govt Schemes</p>
              <p className="text-xs text-slate-400 font-medium">PMEGP & Mudra Matcher</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Platform Mockup Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 md:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Live Platform Interactive Preview</span>
              <h3 className="text-xl font-bold text-white mt-1">Explore AI Swarm Capabilities</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveTab('agents')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'agents' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                AI Swarm Chat
              </button>
              <button
                onClick={() => setActiveTab('invoices')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'invoices' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                GST Invoicing
              </button>
              <button
                onClick={() => setActiveTab('inventory')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'inventory' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Inventory Tracker
              </button>
              <button
                onClick={() => setActiveTab('schemes')}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'schemes' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Scheme Advisor
              </button>
            </div>
          </div>

          {/* Interactive Mock Content Display */}
          <div className="min-h-[320px] bg-slate-950/80 rounded-2xl border border-slate-800/80 p-6">
            {activeTab === 'agents' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">You</div>
                  <div className="bg-slate-800/80 p-3.5 rounded-2xl max-w-lg text-sm text-slate-200">
                    "I need to generate a GST invoice for 25 units of Industrial Roller Bearings and check if stock is sufficient."
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-blue-950/40 border border-blue-800/40 p-4 rounded-2xl max-w-xl text-sm space-y-3">
                    <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Routed to Invoice Agent & Inventory Agent</span>
                    </div>
                    <p className="text-slate-200">
                      ✅ Stock verified! Current inventory: <strong>140 units</strong>. After deducting 25 units, remaining stock will be <strong>115 units</strong>.
                    </p>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span>Invoice #INV-2026-089</span>
                        <span className="font-semibold text-emerald-400">Total: ₹44,250 (18% GST included)</span>
                      </div>
                      <p className="text-slate-500">Auto stock deduction triggered & QR Code generated.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">Total Monthly Invoices</span>
                  <p className="text-2xl font-bold text-white">₹4,85,200</p>
                  <span className="text-xs text-emerald-400 flex items-center gap-1">+14.2% from last month</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">GST Collected</span>
                  <p className="text-2xl font-bold text-white">₹87,336</p>
                  <span className="text-xs text-blue-400">GSTR-1 Ready File</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs text-slate-400">Pending Payments</span>
                  <p className="text-2xl font-bold text-amber-400">₹32,500</p>
                  <span className="text-xs text-amber-500">3 invoices pending QR scan</span>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <p className="font-semibold text-white">SKU-8821: High-Speed Electric Motors</p>
                    <p className="text-slate-400">Category: Electrical Components</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">45 in Stock</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <div>
                    <p className="font-semibold text-white">SKU-1042: Synthetic Lubricant 5L</p>
                    <p className="text-slate-400">Category: Consumables</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">5 Left (Low Stock Alert)</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'schemes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400">PMEGP Scheme</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">95% Match</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Prime Minister's Employment Generation Programme</p>
                  <p className="text-xs text-slate-400">Up to 35% credit-linked subsidy for setting up new micro-enterprises.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400">Mudra Loan (Tarun)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">90% Match</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Pradhan Mantri MUDRA Yojana</p>
                  <p className="text-xs text-slate-400">Collateral-free business loans up to ₹10 Lakhs with flexible repayment.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How To Use Application Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
            Simple 5-Step Guide
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            How To Use BizNest AI Application
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Get started in under 2 minutes. Follow this step-by-step walkthrough to automate your business operations.
          </p>
        </div>

        {/* Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {usageSteps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  activeStep === idx
                    ? 'bg-blue-950/40 border-blue-500/50 shadow-xl shadow-blue-500/10 scale-105'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-blue-500/40 font-mono">{item.step}</span>
                    <div className="p-2.5 rounded-xl bg-slate-800 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {item.tag}
                  </span>
                  <h4 className="text-base font-bold text-white mt-3 mb-2">{item.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-1.5">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-2 text-[11px] text-slate-300">
                      <Check className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 10 AI Agents Showcase Section */}
      <section id="agents" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            Multi-Agent Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            10 Domain-Specialized AI Agents
          </h2>
          <p className="text-slate-400 mt-3 text-sm">
            Each agent is trained on specialized domain workflows to handle every department of your enterprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.id}
                className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${agent.color} shadow-lg shadow-blue-500/10 text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${agent.bgColor} ${agent.textColor}`}>
                      {agent.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{agent.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">{agent.description}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-2">
                  {agent.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Govt Schemes Section */}
      <section id="schemes" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border border-blue-800/40 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
              Indian Enterprise Growth Portal
            </span>
            <h2 className="text-3xl font-bold text-white">
              Instant Government Scheme & Subsidy Advisor
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Never miss government benefits again. Our Scheme Advisor agent continuously scans government schemes and notifications, matching your turnover, sector, and registration status against subsidies like PMEGP, Mudra, CGTMSE, and TReDS.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              {isSignedIn ? (
                <button
                  onClick={() => navigate('/schemes')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Check My Scheme Eligibility</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/sign-in')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/25 transition-all"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In to Match Schemes</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 md:p-16 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Automate Your Business Operations?
            </h2>
            <p className="text-slate-400 text-sm">
              Join small businesses across Tamil Nadu and India standardizing their invoicing, inventory, and compliance with AI.
            </p>
            <div>
              {isSignedIn ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Go to My Business Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/sign-in')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-xl shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Click Here to Sign In / Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BizNest AI</span>
            <span>— Enterprise Business Assistant Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <span>RMD Engineering College</span>
            <span>Theme: Industry 4.0 and 5.0</span>
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
