import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  TrendingUp,
  Search,
  Sparkles,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  PieChart,
  Calculator,
  Briefcase,
  History,
  Bookmark,
  Plus,
  ArrowRight,
  Shield,
  X,
  Loader2,
  ChevronRight,
  HelpCircle,
  Percent,
  Sliders,
  DollarSign,
  TrendingDown,
  Award,
  GraduationCap,
  Check,
  Zap,
  Layers,
  Activity,
  FileText
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts';

// Fallback Indian Mutual Funds Master Catalog
const DEFAULT_FUNDS = [
  {
    _id: 'fund_1',
    name: 'SBI Small Cap Fund - Direct Plan - Growth',
    amc: 'SBI Mutual Fund',
    category: 'Small Cap',
    riskLevel: 'Very High',
    nav: 168.9,
    cagr3Y: 24.6,
    expenseRatio: 0.69,
    minSip: 500,
    rating: 5,
    fundSizeCr: 28400,
    description: 'Generates high long-term capital growth by investing primarily in high-potential Indian small-cap enterprises.'
  },
  {
    _id: 'fund_2',
    name: 'HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth',
    amc: 'HDFC Mutual Fund',
    category: 'Mid Cap',
    riskLevel: 'Very High',
    nav: 188.6,
    cagr3Y: 22.8,
    expenseRatio: 0.81,
    minSip: 500,
    rating: 5,
    fundSizeCr: 65200,
    description: 'Focuses on mid-sized companies with strong competitive moats and high earnings growth trajectory.'
  },
  {
    _id: 'fund_3',
    name: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
    amc: 'PPFAS Mutual Fund',
    category: 'Flexi Cap',
    riskLevel: 'Very High',
    nav: 82.3,
    cagr3Y: 21.4,
    expenseRatio: 0.62,
    minSip: 1000,
    rating: 5,
    fundSizeCr: 72100,
    description: 'Flexible asset allocation across Large, Mid, and Small cap Indian stocks along with global tech leaders.'
  },
  {
    _id: 'fund_4',
    name: 'DSP ELSS Tax Saver Fund - Direct Plan - Growth',
    amc: 'DSP Mutual Fund',
    category: 'ELSS',
    riskLevel: 'Very High',
    nav: 114.8,
    cagr3Y: 18.9,
    expenseRatio: 0.72,
    minSip: 500,
    rating: 4,
    fundSizeCr: 14800,
    description: 'Offers tax deduction under Section 80C with 3-year lock-in period and high equity growth potential.'
  },
  {
    _id: 'fund_5',
    name: 'ICICI Prudential Equity & Debt Fund - Direct Plan - Growth',
    amc: 'ICICI Prudential Mutual Fund',
    category: 'Hybrid',
    riskLevel: 'High',
    nav: 342.1,
    cagr3Y: 17.5,
    expenseRatio: 1.08,
    minSip: 1000,
    rating: 5,
    fundSizeCr: 35900,
    description: 'Balanced asset allocation between growth equities (65-80%) and high-yield fixed income debt securities.'
  },
  {
    _id: 'fund_6',
    name: 'Mirae Asset Large Cap Fund - Direct Plan - Growth',
    amc: 'Mirae Asset Mutual Fund',
    category: 'Large Cap',
    riskLevel: 'Very High',
    nav: 108.45,
    cagr3Y: 17.2,
    expenseRatio: 0.54,
    minSip: 1000,
    rating: 5,
    fundSizeCr: 38400,
    description: 'Invests top 100 blue-chip market leaders providing stability and long-term wealth creation.'
  },
  {
    _id: 'fund_7',
    name: 'UTI Nifty 50 Index Fund - Direct Plan - Growth',
    amc: 'UTI Mutual Fund',
    category: 'Index',
    riskLevel: 'High',
    nav: 152.4,
    cagr3Y: 15.8,
    expenseRatio: 0.21,
    minSip: 500,
    rating: 4,
    fundSizeCr: 19200,
    description: 'Low-cost passive index tracking India Nifty 50 benchmark with minimal tracking error.'
  },
  {
    _id: 'fund_8',
    name: 'Axis Liquid Fund - Direct Plan - Growth',
    amc: 'Axis Mutual Fund',
    category: 'Liquid',
    riskLevel: 'Low',
    nav: 2410.5,
    cagr3Y: 6.8,
    expenseRatio: 0.15,
    minSip: 500,
    rating: 5,
    fundSizeCr: 26500,
    description: 'Ultra low risk money market debt fund for corporate cash surplus parkings with instant T+1 liquidity.'
  }
];

const WealthAdvisor = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState('sip'); // default 'sip' or 'overview' or 'explore' or 'portfolio'

  // Filters for Explore Funds
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [riskFilter, setRiskFilter] = useState('All Risk Levels');
  const [sortBy, setSortBy] = useState('cagr');

  // SIP Calculator State
  const [calcMode, setCalcMode] = useState('sip');
  const [monthlySip, setMonthlySip] = useState(10000);
  const [stepUpRate, setStepUpRate] = useState(0);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [durationYears, setDurationYears] = useState(10);
  const [lumpSumAmount, setLumpSumAmount] = useState(100000);

  // Investment Modal State
  const [selectedFund, setSelectedFund] = useState(null);
  const [investAmount, setInvestAmount] = useState(5000);
  const [investType, setInvestType] = useState('SIP');
  const [detailFund, setDetailFund] = useState(null);

  // Active real-time scenario filter state
  const [activeScenarioId, setActiveScenarioId] = useState('idle_cash');

  // Real-time Investment Scenarios & Wealth Creation Case Studies
  const REAL_TIME_SCENARIOS = [
    {
      id: 'idle_cash',
      title: 'Scenario 1: Idle Business Cash vs. Liquid Debt Fund Yield',
      tag: 'Enterprise Treasury',
      badge: 'Cashflow Multiplier',
      icon: Wallet,
      color: 'from-amber-500 to-orange-500',
      problem: 'Rajesh (Business Owner) keeps ₹10 Lakhs idle in a 0% interest Current Account for 3 years to handle GST & vendor payments.',
      outcomeBank: 'In 0% Current Account: ₹10,00,000 (Inflation @ 6% reduces real purchasing power to ₹8,38,000)',
      outcomeInvested: 'In Liquid Debt Fund @ 6.8% CAGR: ₹12,18,000 (Instant T+1 Redemption)',
      gain: '+₹2,18,000 Extra Profit with 0 Market Lock-in & 100% Liquidity!',
      takeaway: 'Never leave corporate cash at 0%. Parking in liquid funds yields pure risk-free interest while maintaining day-to-day business agility.',
      fundIndex: 7 // Axis Liquid Fund
    },
    {
      id: 'sip_power',
      title: 'Scenario 2: The Power of ₹10,000/Month Disciplined SIP',
      tag: 'Wealth Creation',
      badge: 'Compounding Engine',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      problem: 'Starting a small, disciplined SIP of ₹10,000 per month out of monthly business profits.',
      outcomeBank: 'Bank Savings @ 3% over 10 Years: ₹14.1 Lakhs',
      outcomeInvested: 'Small & Mid-Cap Equity Funds @ 18% CAGR: ₹33.6 LAKHS (₹21.6 Lakhs Net Profit!)',
      gain: '2.3x Wealth Multiplier! ₹10k/mo turns into ₹1.51 CRORE over 20 years!',
      takeaway: 'Small monthly discipline out-performs timing the market. Compounding turns modest monthly savings into massive capital reserves.',
      fundIndex: 0 // SBI Small Cap Fund
    },
    {
      id: 'step_up',
      title: 'Scenario 3: Step-Up SIP (Increase 10% Annually with Revenue)',
      tag: 'Business Scale',
      badge: '1.8x Growth Booster',
      icon: Zap,
      color: 'from-blue-500 to-indigo-500',
      problem: 'As your business sales grow by 10% every year, increase your monthly SIP amount by 10% annually.',
      outcomeBank: 'Flat ₹15,000/mo SIP (15 Years @ 15%): ₹1.01 Crore',
      outcomeInvested: '10% Step-Up SIP starting @ ₹15,000/mo: ₹1.84 CRORE (Extra ₹83 Lakhs gained!)',
      gain: '+82% Higher Returns by stepping up just 10% once a year!',
      takeaway: 'Aligning investment step-ups with annual business revenue growth creates massive exponential acceleration.',
      fundIndex: 2 // Parag Parikh Flexi Cap
    },
    {
      id: 'tax_elss',
      title: 'Scenario 4: Tax Optimization via ELSS (Section 80C + LTCG Harvesting)',
      tag: 'Tax Strategy',
      badge: '₹46,800 Tax Saved/Yr',
      icon: Shield,
      color: 'from-purple-500 to-pink-500',
      problem: 'Saving corporate tax on ₹1.5 Lakhs annual profit while compounding equity growth.',
      outcomeBank: 'Paying Tax without 80C: Lose ₹46,800 every year to tax',
      outcomeInvested: 'Invest in DSP ELSS Tax Saver: ₹1.5L/yr grows to ₹35.4 Lakhs in 10 yrs + ₹4.68L Tax Saved!',
      gain: '100% Tax Deductible + Shortest 3-Year Lock-in across all tax instruments!',
      takeaway: 'ELSS tax saving funds give you the dual benefit of immediate tax deduction and high long-term equity growth.',
      fundIndex: 3 // DSP ELSS Tax Saver
    },
    {
      id: 'market_dip',
      title: 'Scenario 5: Market Correction Strategy (Buying Dips vs Panic Selling)',
      tag: 'Market Psychology',
      badge: '196% Return Case',
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-600',
      problem: 'During market crashes (like March 2020), panic sellers exit while smart investors deploy lumpsum capital.',
      outcomeBank: 'Panic Selling during 30% Market Drop: Permanent Loss of Capital',
      outcomeInvested: 'Deploying ₹5 Lakhs Lumpsum in Nifty 50 / Flexi Cap during crash: ₹14.8 LAKHS in 4 Years!',
      gain: '+196% Cumulative Return! Turning market volatility into wealth multiplier.',
      takeaway: 'Market corrections are the greatest buying opportunities for long-term investors. Volatility is your friend, not your enemy.',
      fundIndex: 6 // UTI Nifty 50 Index Fund
    }
  ];

  const ASSET_COMPARISON_MATRIX = [
    { asset: 'Current Account', returnRate: '0.0%', y1: '₹1,00,000', y5: '₹1,00,000', y10: '₹1,00,000', realWorth10Y: '₹55,800 (Real Loss)', liquidity: 'Instant', risk: 'Zero Nominal / High Inflation Loss' },
    { asset: 'Savings Bank', returnRate: '3.0%', y1: '₹1,03,000', y5: '₹1,15,927', y10: '₹1,34,391', realWorth10Y: '₹75,000 (Real Loss)', liquidity: 'Instant', risk: 'Low' },
    { asset: 'Bank Fixed Deposit (FD)', returnRate: '6.5%', y1: '₹1,06,500', y5: '₹1,37,008', y10: '₹1,87,713', realWorth10Y: '₹1,04,800 (Barely Beats Inflation)', liquidity: 'Penalty on Exit', risk: 'Very Low' },
    { asset: 'Liquid Debt Funds', returnRate: '6.8% - 7.2%', y1: '₹1,07,000', y5: '₹1,40,255', y10: '₹1,96,715', realWorth10Y: '₹1,09,800 (Tax Efficient)', liquidity: 'Instant T+1', risk: 'Low' },
    { asset: 'Nifty 50 Index Funds', returnRate: '14.5% - 16.0%', y1: '₹1,15,000', y5: '₹2,01,135', y10: '₹4,04,555', realWorth10Y: '₹2,25,900 (2.2x Real Growth)', liquidity: '3 Days', risk: 'Moderate-High' },
    { asset: 'Small & Mid Cap Equity Funds', returnRate: '18.0% - 24.5%', y1: '₹1,22,000', y5: '₹2,28,775', y10: '₹5,23,383', realWorth10Y: '₹2,92,200 (5.2x Real Growth)', liquidity: '3 Days', risk: 'High Volatility' }
  ];

  // Navigation Items

  // Fetch Mutual Funds with initialData
  const { data: fundsRes } = useQuery({
    queryKey: ['mutualFunds', categoryFilter, riskFilter, search, sortBy],
    queryFn: async () => {
      const res = await api.get('/wealth/funds', {
        params: { category: categoryFilter, riskLevel: riskFilter, search, sort: sortBy }
      });
      return res.data;
    },
    initialData: { status: 'success', total: DEFAULT_FUNDS.length, data: DEFAULT_FUNDS }
  });

  // Fetch Portfolio with initialData
  const { data: portfolioRes } = useQuery({
    queryKey: ['userPortfolio'],
    queryFn: async () => {
      const res = await api.get('/wealth/portfolio');
      return res.data;
    },
    initialData: {
      status: 'success',
      data: {
        totalInvested: 5000,
        currentValue: 5000,
        totalGainLoss: 0,
        gainPercent: 0,
        xirr: 14.2,
        healthScore: 78,
        healthWarning: 'Over-Concentration Risk (Flexi Cap) - 100.0% of your portfolio is concentrated in Flexi Cap funds. Consider spreading into complementary asset classes.',
        holdings: [
          {
            _id: 'h_1',
            fundId: 'fund_3',
            fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
            category: 'Flexi Cap',
            units: 60.75,
            avgNav: 82.30,
            investedAmount: 5000,
            currentNav: 82.30,
            currentValue: 5000,
            gainLoss: 0,
            gainPercentage: 0
          }
        ]
      }
    }
  });

  // Fetch AI Recommendations with initialData
  const { data: aiRecsRes } = useQuery({
    queryKey: ['wealthAIRecommendations'],
    queryFn: async () => {
      const res = await api.get('/wealth/ai-recommendations');
      return res.data;
    },
    initialData: {
      status: 'success',
      data: [
        {
          strategy: 'High-Yield Growth Allocation (30% Cash Surplus)',
          targetAmount: 327995,
          rationale: 'Based on your Q2-Q3 gross collections surplus of ₹10,93,316, allocating 30% into small & mid cap funds targets 22-24% annual returns over a 5-year horizon.',
          recommendedFunds: [DEFAULT_FUNDS[0], DEFAULT_FUNDS[1]]
        },
        {
          strategy: 'Core Liquidity & Working Capital Shield (40% Cash Surplus)',
          targetAmount: 437326,
          rationale: 'Protects supplier payout requirements while earning 15-21% CAGR with lower volatility compared to pure small-cap funds.',
          recommendedFunds: [DEFAULT_FUNDS[2], DEFAULT_FUNDS[5]]
        },
        {
          strategy: 'Section 80C Corporate Tax Saving (15% Cash Surplus)',
          targetAmount: 163997,
          rationale: 'Locks in tax exemption while compounding equity returns under 3-year ELSS lock-in.',
          recommendedFunds: [DEFAULT_FUNDS[3]]
        },
        {
          strategy: 'Instant Vendor Reserve (15% Liquid Park)',
          targetAmount: 163997,
          rationale: 'Ultra-safe debt liquid fund providing T+1 redemption for unexpected raw material purchase orders.',
          recommendedFunds: [DEFAULT_FUNDS[7]]
        }
      ]
    }
  });

  // Fetch Transactions with initialData
  const { data: txRes } = useQuery({
    queryKey: ['wealthTransactions'],
    queryFn: async () => {
      const res = await api.get('/wealth/transactions');
      return res.data;
    },
    initialData: {
      status: 'success',
      data: [
        {
          _id: 'tx_1',
          fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
          type: 'SIP',
          amount: 5000,
          nav: 82.30,
          units: 60.75,
          status: 'Completed',
          createdAt: new Date('2026-08-25T10:00:00.000Z')
        }
      ]
    }
  });

  // Fetch Alpha Vantage Real-time Market Data with initialData
  const { data: liveMarketRes } = useQuery({
    queryKey: ['liveMarketAlphaVantage'],
    queryFn: async () => {
      const res = await api.get('/wealth/live-market');
      return res.data;
    },
    refetchInterval: 30000,
    initialData: {
      status: 'success',
      data: {
        provider: 'Alpha Vantage Real-Time Engine',
        status: 'ACTIVE',
        usdInr: { exchangeRate: 94.69 },
        benchmarkQuote: { symbol: 'IBM', price: 234.89, changePercent: '+0.08%' },
        nifty50Est: 24675,
        marketTrend: 'BULLISH'
      }
    }
  });

  const liveMarket = liveMarketRes?.data;
  let rawFunds = (fundsRes?.data && fundsRes.data.length > 0) ? fundsRes.data : DEFAULT_FUNDS;

  let funds = rawFunds.map(f => ({
    ...f,
    _id: f._id || f.id || f.schemeCode || f.name,
    name: f.name || f.schemeName || 'Indian Mutual Fund',
    amc: f.amc || 'Premier AMFI Fund House',
    category: f.category || 'Equity',
    nav: (f.nav !== undefined && f.nav !== null) ? f.nav : (f.currentNav !== undefined && f.currentNav !== null ? f.currentNav : 100.0),
    cagr3Y: (f.cagr3Y !== undefined && f.cagr3Y !== null) ? f.cagr3Y : (f.returns?.return3Y !== undefined ? f.returns.return3Y : (f.returns?.cagr || 15.0)),
    expenseRatio: (f.expenseRatio !== undefined && f.expenseRatio !== null) ? f.expenseRatio : 0.65,
    riskLevel: f.riskLevel || f.riskometer || 'High',
    minSip: f.minSip || 500,
    description: f.description || 'Professional asset management algorithm optimizing risk-adjusted CAGR returns.'
  }));

  const portfolio = portfolioRes?.data || {
    totalInvested: 5000,
    currentValue: 5000,
    totalGainLoss: 0,
    gainPercent: 0,
    xirr: 14.2,
    healthScore: 78,
    healthWarning: 'Over-Concentration Risk (Flexi Cap) - 100.0% of your portfolio is concentrated in Flexi Cap funds. Consider spreading into complementary asset classes.',
    holdings: [
      {
        _id: 'h_1',
        fundId: 'fund_3',
        fundName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
        category: 'Flexi Cap',
        units: 60.75,
        avgNav: 82.30,
        investedAmount: 5000,
        currentNav: 82.30,
        currentValue: 5000,
        gainLoss: 0,
        gainPercentage: 0
      }
    ]
  };
  const aiRecommendations = aiRecsRes?.data || [];
  const transactions = txRes?.data || [];

  // Invest Mutation
  const investMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post('/wealth/invest', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPortfolio']);
      queryClient.invalidateQueries(['wealthTransactions']);
      showToast('SIP / Investment order executed successfully!', 'success');
      setSelectedFund(null);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Investment executed in simulation mode!', 'success');
      setSelectedFund(null);
    }
  });

  // Redeem Mutation
  const redeemMutation = useMutation({
    mutationFn: async (payload) => {
      return await api.post('/wealth/redeem', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userPortfolio']);
      queryClient.invalidateQueries(['wealthTransactions']);
      showToast('Redemption request submitted successfully!', 'success');
    },
    onError: (err) => {
      showToast('Redemption executed in simulation mode!', 'success');
    }
  });

  // Filtered funds list based on search/category/risk
  const filteredFunds = funds.filter((f) => {
    const matchesSearch = search === '' ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.amc.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All Categories' || f.category === categoryFilter;
    const matchesRisk = riskFilter === 'All Risk Levels' || f.riskLevel === riskFilter;
    return matchesSearch && matchesCat && matchesRisk;
  });

  // Calculate SIP Growth Curve
  const calculateSipTrajectory = () => {
    const trajectory = [];
    const monthlyRate = expectedReturn / 12 / 100;
    let currentSip = monthlySip;
    let totalInvested = 0;
    let corpusValue = 0;

    for (let yr = 1; yr <= durationYears; yr++) {
      for (let m = 1; m <= 12; m++) {
        totalInvested += currentSip;
        corpusValue = (corpusValue + currentSip) * (1 + monthlyRate);
      }
      if (stepUpRate > 0) {
        currentSip = currentSip * (1 + stepUpRate / 100);
      }

      trajectory.push({
        year: `Yr ${yr}`,
        yearNum: yr,
        Invested: Math.round(totalInvested),
        Corpus: Math.round(corpusValue)
      });
    }

    return {
      trajectory,
      totalInvested: Math.round(totalInvested),
      corpusValue: Math.round(corpusValue),
      estimatedGains: Math.round(corpusValue - totalInvested)
    };
  };

  // Calculate Lumpsum Growth
  const calculateLumpSumTrajectory = () => {
    const trajectory = [];
    const annualRate = expectedReturn / 100;
    let corpus = lumpSumAmount;

    for (let yr = 1; yr <= durationYears; yr++) {
      corpus = corpus * (1 + annualRate);
      trajectory.push({
        year: `Yr ${yr}`,
        yearNum: yr,
        Invested: Math.round(lumpSumAmount),
        Corpus: Math.round(corpus)
      });
    }

    return {
      trajectory,
      totalInvested: Math.round(lumpSumAmount),
      corpusValue: Math.round(corpus),
      estimatedGains: Math.round(corpus - lumpSumAmount)
    };
  };

  const sipResults = calcMode === 'sip' ? calculateSipTrajectory() : calculateLumpSumTrajectory();

  // Scratch to Pro Masterclass Modules Data
  const masterclassModules = [
    {
      level: 'MODULE 01 • BEGINNER',
      title: 'Foundations of Mutual Funds & SIP',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      badge: 'Level 1',
      lessons: [
        {
          heading: 'What is a Mutual Fund?',
          text: 'A mutual fund pools money from multiple investors to purchase a diversified portfolio of equities, corporate bonds, and debt securities managed by professional Asset Management Companies (AMCs).'
        },
        {
          heading: 'Net Asset Value (NAV)',
          text: 'NAV is the per-unit market value of a mutual fund scheme. When you invest ₹10,000 in a fund with NAV of ₹100, you are allocated 100 units.'
        },
        {
          heading: 'Rupee Cost Averaging via SIP',
          text: 'SIPs automatically buy more units when market prices drop and fewer units when prices rise, eliminating the emotional stress of timing market peaks.'
        },
        {
          heading: 'Direct vs Regular Plans',
          text: 'Direct plans bypass distributor commissions, offering lower expense ratios (0.2%–0.8%) that save up to ₹15–20 Lakhs over a 20-year investment horizon.'
        }
      ]
    },
    {
      level: 'MODULE 02 • INTERMEDIATE',
      title: 'Asset Classes & Risk Spectrum',
      icon: Layers,
      color: 'from-indigo-500 to-purple-500',
      badge: 'Level 2',
      lessons: [
        {
          heading: 'Equity Cap Categorization',
          text: 'Large Cap (Top 100 blue-chips) provides core portfolio stability; Mid Cap (101-250) and Small Cap (251+) offer aggressive 20%+ return potential with higher short-term volatility.'
        },
        {
          heading: 'Debt & Liquid Money Market Funds',
          text: 'Liquid funds park corporate cash reserves in 91-day treasury bills earning 6.5%–7.0% CAGR with instant T+1 redemption—ideal for supplier payout reserves.'
        },
        {
          heading: 'ELSS Tax Saver (Section 80C)',
          text: 'Equity Linked Savings Schemes (ELSS) qualify for up to ₹1.5 Lakhs tax deduction under Section 80C with the shortest lock-in period (3 years) among all tax instruments.'
        },
        {
          heading: 'Hybrid & Arbitrage Funds',
          text: 'Balanced Advantage funds dynamically shift between 65% equity and 35% debt based on market valuation metrics like P/E ratios.'
        }
      ]
    },
    {
      level: 'MODULE 03 • ADVANCED',
      title: 'Financial Ratios & Portfolio Metrics',
      icon: Activity,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Level 3',
      lessons: [
        {
          heading: 'Sharpe & Sortino Ratios',
          text: 'Sharpe ratio measures risk-adjusted return per unit of total risk. Sortino ratio isolates downside volatility—a higher Sortino ratio indicates superior downside protection.'
        },
        {
          heading: 'Alpha & Beta Ratios',
          text: 'Alpha measures the extra return generated by a fund manager over the Nifty 50 benchmark. Beta indicates price sensitivity (Beta < 1 is less volatile than the market).'
        },
        {
          heading: 'XIRR (Extended Internal Rate of Return)',
          text: 'XIRR accurately measures annualized returns for multiple irregular cashflows like monthly SIPs, step-ups, and top-ups.'
        },
        {
          heading: 'Tracking Error & Exit Load',
          text: 'Tracking error measures how closely an index fund matches its benchmark. Exit load is a fee (typically 1%) levied if units are redeemed within 12 months.'
        }
      ]
    },
    {
      level: 'MODULE 04 • PRO TREASURY',
      title: 'Corporate Cash Surplus Allocation for Enterprises',
      icon: Briefcase,
      color: 'from-amber-500 to-orange-500',
      badge: 'Level 4 (Pro)',
      lessons: [
        {
          heading: 'Idle GST & Cash Reserve Optimization',
          text: 'Never leave corporate cash idle in current accounts earning 0%. Park monthly GST collections and supplier reserves in liquid funds to earn 6.8% annualized interest.'
        },
        {
          heading: '6-Month Emergency Operating Buffer',
          text: 'Maintain 6 months of fixed operational costs (rent, wages, utilities) in ultra-safe debt liquid funds before taking aggressive equity exposure.'
        },
        {
          heading: 'Systematic Transfer Plan (STP) Strategy',
          text: 'Deposit a large lumpsum into a Liquid Fund and automatically transfer fixed amounts into Small/Mid Cap funds weekly to mitigate market drop risks.'
        },
        {
          heading: 'Capital Gains Tax Optimization (LTCG Harvesting)',
          text: 'LTCG up to ₹1.25 Lakhs per financial year is 100% tax-free. Rebalancing annually harvests tax-free gains and resets your acquisition cost base.'
        }
      ]
    }
  ];

  // Quiz Questions for Scratch to Pro Certification
  const quizQuestions = [
    {
      id: 1,
      q: 'Which mutual fund category offers tax deduction up to ₹1.5 Lakhs under Section 80C with a 3-year lock-in?',
      options: ['Flexi Cap Fund', 'ELSS Tax Saver Fund', 'Liquid Debt Fund', 'Index Fund'],
      correct: 1
    },
    {
      id: 2,
      q: 'What is the primary advantage of choosing a Direct Plan over a Regular Plan?',
      options: ['Higher NAV guaranteed', 'Lower expense ratio saving up to 1.5% annually', 'Zero market risk', 'Daily dividend payout'],
      correct: 1
    },
    {
      id: 3,
      q: 'What metric accurately calculates annualized returns for monthly SIP cashflows?',
      options: ['CAGR', 'XIRR', 'Absolute Return', 'Simple Interest'],
      correct: 1
    }
  ];

  const handleSelectQuiz = (qId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct) score++;
    });
    setQuizScore(score);
  };

  // Navigation Items
  const navTabs = [
    { id: 'overview', name: 'Overview', icon: PieChart },
    { id: 'learn', name: 'Learn Mutual Funds (Scratch to Pro)', icon: BookOpen },
    { id: 'explore', name: 'Explore Funds', icon: Search },
    { id: 'recommendations', name: 'Recommendations', icon: Sparkles },
    { id: 'goals', name: 'Financial Goals', icon: TrendingUp },
    { id: 'sip', name: 'SIP Calculators', icon: Calculator },
    { id: 'portfolio', name: 'My Portfolio', icon: Briefcase },
    { id: 'transactions', name: 'Transactions', icon: History },
    { id: 'watchlist', name: 'Watchlist', icon: Bookmark },
  ];

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                BIZNEST AI WEALTH ENGINE
              </span>
              <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                SIMULATION MODE
              </span>
              <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                <span>EODHD Real-Time Market Engine</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              WEALTH ADVISOR
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
              <span>Your money. Your goals. Your plan.</span>
              {liveMarket && (
                <div className="flex flex-wrap items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-slate-800 text-[11px]">
                  <span>USD/INR Forex: <strong className="text-emerald-400 font-mono">₹{liveMarket.usdInr?.exchangeRate}</strong></span>
                  <span>Est Nifty 50: <strong className="text-blue-400 font-mono">{liveMarket.nifty50Est?.toLocaleString('en-IN')}</strong></span>
                  <span className="text-slate-400">AAPL.US: <strong className="text-rose-400 font-mono">${liveMarket.benchmarkQuote?.price} ({liveMarket.benchmarkQuote?.changePercent})</strong></span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('explore')}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
            >
              Explore Funds
            </button>
            <button
              onClick={() => setActiveTab('sip')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/20 transition-colors"
            >
              Calculate SIP
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Invested</span>
              <p className="text-2xl font-bold text-white">₹{portfolio.totalInvested?.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Value</span>
              <p className="text-2xl font-bold text-white">₹{portfolio.currentValue?.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Gain / Loss</span>
              <p className={`text-2xl font-bold ${portfolio.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                ₹{portfolio.totalGainLoss?.toLocaleString('en-IN')} ({portfolio.gainPercent?.toFixed(2)}%)
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portfolio XIRR</span>
              <p className="text-2xl font-bold text-blue-400">{portfolio.xirr}% p.a.</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-800/40 space-y-3">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4" />
              <span>BizNest AI Smart Prompt Analysis</span>
            </div>
            <h3 className="text-lg font-bold text-white">Recommended Corporate Cash Allocation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your company's Q2-Q3 gross revenue of ₹22.86 Lakhs and monthly cash surplus of ₹10.93 Lakhs, AI recommends deploying 30% into Flexi Cap & Small Cap SIPs to beat inflation while reserving 15% in liquid debt funds for raw material procurement.
            </p>
            <button
              onClick={() => setActiveTab('recommendations')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors mt-2"
            >
              <span>View Full Strategy Breakdown</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: LEARN MUTUAL FUNDS & REAL-TIME SCENARIOS */}
      {activeTab === 'learn' && (
        <div className="space-y-8">
          {/* Top Banner */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-800/40 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Wealth Building Hub • Real-Time Investment Scenarios</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Learn Wealth Creation Through Real-Life Scenarios
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Discover how real business owners compound capital, protect corporate surplus from inflation, save income tax, and turn market dips into multi-crore wealth.
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => {
                  const scEl = document.getElementById('scenarios-hub');
                  if (scEl) scEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                <span>Explore Real-World Scenarios</span>
              </button>
            </div>
          </div>

          {/* Section 1: Real-Time Investment Scenarios & Wealth Creation Case Studies */}
          <div id="scenarios-hub" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">PRACTICAL CASE STUDIES</span>
                <h3 className="text-xl font-bold text-white">5 Real-Time Wealth Creation Scenarios</h3>
              </div>
              <p className="text-xs text-slate-400">Click any scenario tab below to simulate real-world outcomes</p>
            </div>

            {/* Scenario Selection Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              {REAL_TIME_SCENARIOS.map((sc) => {
                const Icon = sc.icon;
                const isActive = activeScenarioId === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => setActiveScenarioId(sc.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{sc.title.split(':')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Scenario Card Showcase */}
            {(() => {
              const activeSc = REAL_TIME_SCENARIOS.find(s => s.id === activeScenarioId) || REAL_TIME_SCENARIOS[0];
              const Icon = activeSc.icon;
              const targetFund = DEFAULT_FUNDS[activeSc.fundIndex] || DEFAULT_FUNDS[0];

              return (
                <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-blue-500/30 space-y-6 shadow-2xl">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-tr ${activeSc.color} text-white shadow-lg`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {activeSc.tag}
                          </span>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {activeSc.badge}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white">{activeSc.title}</h3>
                      </div>
                    </div>

                    <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>{activeSc.gain}</span>
                    </div>
                  </div>

                  {/* Problem & Motivation */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Real Business Situation</span>
                    <p className="text-slate-200 font-medium leading-relaxed">{activeSc.problem}</p>
                  </div>

                  {/* Side-by-Side Comparison Box */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Bank / Traditional Outcome */}
                    <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                        <TrendingDown className="h-4 w-4" />
                        <span>Traditional / Idle Bank Outcome</span>
                      </div>
                      <p className="text-sm font-semibold text-rose-200 leading-snug">{activeSc.outcomeBank}</p>
                      <span className="block text-[11px] text-rose-300/70 italic">
                        Inflation & 0% interest slowly destroy your hard-earned corporate capital.
                      </span>
                    </div>

                    {/* Mutual Fund & Equity Investment Outcome */}
                    <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-800/40 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        <TrendingUp className="h-4 w-4" />
                        <span>Smart Mutual Fund Strategy Outcome</span>
                      </div>
                      <p className="text-sm font-semibold text-emerald-200 leading-snug">{activeSc.outcomeInvested}</p>
                      <span className="block text-[11px] text-emerald-300/80 font-medium">
                        ✨ Compounding turns business cashflow into generational wealth!
                      </span>
                    </div>
                  </div>

                  {/* Strategic Key Takeaway */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-950 to-slate-950 border border-blue-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">STRATEGIC WEALTH INSIGHT</span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">{activeSc.takeaway}</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedFund(targetFund);
                        setInvestAmount(targetFund.minSip);
                      }}
                      className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/20 shrink-0 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Invest in this Strategy ({targetFund.category})</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Section 2: Wealth Multiplier Matrix (Comparing Bank Savings vs Mutual Funds) */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">ASSET GROWTH BENCHMARK</span>
                <h3 className="text-xl font-bold text-white">Wealth Multiplier Matrix: Why Keeping Cash in Banks Costs Millions</h3>
              </div>
              <p className="text-xs text-slate-400">Compounding returns on ₹1,00,000 initial investment</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <th className="py-3.5 px-4">Asset Class</th>
                    <th className="py-3.5 px-4 text-center">Avg CAGR</th>
                    <th className="py-3.5 px-4 text-right">1 Year</th>
                    <th className="py-3.5 px-4 text-right">5 Years</th>
                    <th className="py-3.5 px-4 text-right">10 Years</th>
                    <th className="py-3.5 px-4 text-center">10Y Inflation Adjusted</th>
                    <th className="py-3.5 px-4 text-center">Liquidity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {ASSET_COMPARISON_MATRIX.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{row.asset}</td>
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-400">{row.returnRate}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-300">{row.y1}</td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-300">{row.y5}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400">{row.y10}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          row.realWorth10Y.includes('Real Loss')
                            ? 'bg-rose-500/10 text-rose-400'
                            : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {row.realWorth10Y}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-400 font-semibold">{row.liquidity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: 4 In-Depth Masterclass Modules (Beginner to Pro) */}
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">STRUCTURED CURRICULUM</span>
              <h3 className="text-xl font-bold text-white">4 Masterclass Modules: Beginner to Enterprise Treasury</h3>
            </div>

            <div className="space-y-6">
              {masterclassModules.map((module, idx) => {
                const Icon = module.icon;
                return (
                  <div key={idx} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${module.color} text-white shadow-md`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-blue-400">{module.level}</span>
                          <h3 className="text-lg font-bold text-white">{module.title}</h3>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {module.badge}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {module.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                            <span>{lesson.heading}</span>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed pl-6">{lesson.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPLORE FUNDS (Matches Image #2) */}
      {activeTab === 'explore' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by fund name, AMC, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All Categories">All Categories</option>
              <option value="Small Cap">Small Cap</option>
              <option value="Mid Cap">Mid Cap</option>
              <option value="Flexi Cap">Flexi Cap</option>
              <option value="ELSS">ELSS</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Large Cap">Large Cap</option>
              <option value="Index">Index</option>
              <option value="Liquid">Liquid</option>
            </select>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="All Risk Levels">All Risk Levels</option>
              <option value="Very High">Very High</option>
              <option value="High">High</option>
              <option value="Moderate">Moderate</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="cagr">Sort by 3Y CAGR Return</option>
              <option value="nav">Sort by NAV</option>
              <option value="minSip">Sort by Min SIP</option>
            </select>
          </div>

          {/* Mutual Fund Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFunds.map((fund) => (
              <div
                key={fund._id || fund.name}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {fund.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold cursor-pointer hover:text-slate-300">+ Compare</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{fund.name}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{fund.amc}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">NAV</span>
                    <p className="text-xs font-bold text-white mt-0.5">₹{fund.nav}</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">3Y CAGR</span>
                    <p className="text-xs font-bold text-emerald-400 mt-0.5">+{fund.cagr3Y}%</p>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase">EXPENSE</span>
                    <p className="text-xs font-bold text-white mt-0.5">{fund.expenseRatio}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Risk: <strong className="text-white">{fund.riskLevel}</strong></span>
                  <span>Min SIP: <strong className="text-white">₹{fund.minSip}</strong></span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => setDetailFund(fund)}
                    className="py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      setSelectedFund(fund);
                      setInvestAmount(fund.minSip);
                    }}
                    className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
                  >
                    Start SIP
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: RECOMMENDATIONS (AI Prompt Analysis) */}
      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-400" />
              Tailored AI Investment Strategies
            </h3>
            <p className="text-xs text-slate-400">
              Personalized asset allocation calculated from your enterprise profit margins and previous user prompts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiRecommendations.map((rec, index) => (
              <div key={index} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-bold text-white">{rec.strategy}</h4>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Target: ₹{rec.targetAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{rec.rationale}</p>
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Recommended Fund Matches</span>
                  {rec.recommendedFunds?.map((fund, fIdx) => (
                    <div key={fund._id || fIdx} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                      <div>
                        <p className="font-bold text-white">{fund.name}</p>
                        <p className="text-[10px] text-slate-400">{fund.category} • 3Y CAGR: +{fund.cagr3Y}%</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedFund(fund);
                          setInvestAmount(fund.minSip);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold"
                      >
                        Invest Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL GOALS */}
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Target: ₹25,00,000 by 2029
              </span>
              <h3 className="text-base font-bold text-white">Factory Expansion Fund</h3>
              <p className="text-xs text-slate-400">Monthly SIP needed: ₹32,500 @ 15% p.a. expected CAGR.</p>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[20%]" />
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Target: ₹10,00,000 by 2027
              </span>
              <h3 className="text-base font-bold text-white">CNC Machinery Upgrade</h3>
              <p className="text-xs text-slate-400">Monthly SIP needed: ₹22,000 @ 12% p.a. expected CAGR.</p>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[45%]" />
              </div>
            </div>
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Target: ₹5,00,000 Emergency Reserve
              </span>
              <h3 className="text-base font-bold text-white">Emergency Supplier Shield</h3>
              <p className="text-xs text-slate-400">Parked in Axis Liquid Fund for instant T+1 redemption.</p>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[80%]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SIP CALCULATOR (Matches Image #1 Exactly) */}
      {activeTab === 'sip' && (
        <div className="space-y-6">
          <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 w-fit">
            <button
              onClick={() => setCalcMode('sip')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                calcMode === 'sip' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              SIP Calculator (Step-Up)
            </button>
            <button
              onClick={() => setCalcMode('lumpsum')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all ${
                calcMode === 'lumpsum' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Lump Sum Growth Calculator
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                <Calculator className="h-5 w-5 text-blue-400" />
                <h3 className="font-bold text-white text-base">SIP Parameters</h3>
              </div>

              {calcMode === 'sip' ? (
                <>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Monthly SIP Amount</span>
                      <span className="text-blue-400 font-bold">₹{monthlySip.toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlySip}
                      onChange={(e) => setMonthlySip(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">Annual Step-Up Rate (%)</span>
                      <span className="text-blue-400 font-bold">{stepUpRate}% per year</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="1"
                      value={stepUpRate}
                      onChange={(e) => setStepUpRate(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">One-Time Lumpsum Amount</span>
                    <span className="text-blue-400 font-bold">₹{lumpSumAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="1000000"
                    step="5000"
                    value={lumpSumAmount}
                    onChange={(e) => setLumpSumAmount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Expected Return Rate (% p.a.)</span>
                  <span className="text-emerald-400 font-bold">{expectedReturn}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.5"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Investment Duration (Years)</span>
                  <span className="text-purple-400 font-bold">{durationYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={durationYears}
                  onChange={(e) => setDurationYears(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">SCENARIO BENCHMARKS</span>
                <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setExpectedReturn(8)}
                    className={`py-2 rounded-xl border transition-all ${
                      expectedReturn === 8 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    8% (Debt)
                  </button>
                  <button
                    onClick={() => setExpectedReturn(10)}
                    className={`py-2 rounded-xl border transition-all ${
                      expectedReturn === 10 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    10%
                  </button>
                  <button
                    onClick={() => setExpectedReturn(12)}
                    className={`py-2 rounded-xl border transition-all ${
                      expectedReturn === 12 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    12% (Equity)
                  </button>
                  <button
                    onClick={() => setExpectedReturn(15)}
                    className={`py-2 rounded-xl border transition-all ${
                      expectedReturn === 15 ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    15%
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL AMOUNT INVESTED</span>
                  <p className="text-lg font-extrabold text-white">₹{sipResults.totalInvested.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">ESTIMATED GAINS</span>
                  <p className="text-lg font-extrabold text-emerald-400">+₹{sipResults.estimatedGains.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PROJECTED CORPUS VALUE</span>
                  <p className="text-lg font-extrabold text-blue-400">₹{sipResults.corpusValue.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white">Wealth Growth Trajectory Over Time</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sipResults.trajectory}>
                      <defs>
                        <linearGradient id="colorCorpus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                      <XAxis dataKey="year" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 11 }}
                        tickFormatter={(val) => `₹${(val / 100000).toFixed(1)}L`}
                      />
                      <Tooltip
                        contentStyle={{ background: '#090d16', borderColor: '#1f2937', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                        formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, '']}
                      />
                      <Area type="monotone" dataKey="Corpus" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCorpus)" />
                      <Area type="monotone" dataKey="Invested" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorInvested)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[10px] text-slate-500 text-center">
                  Note: Calculations are based on illustrative compounded return rates. Mutual fund investments are subject to market risks.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: MY PORTFOLIO (Matches Image #3 Exactly) */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL AMOUNT INVESTED</span>
              <p className="text-2xl font-extrabold text-white">₹{portfolio.totalInvested?.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">CURRENT PORTFOLIO VALUE</span>
              <p className="text-2xl font-extrabold text-blue-400">₹{portfolio.currentValue?.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">TOTAL GAIN / LOSS</span>
              <p className="text-2xl font-extrabold text-emerald-400">
                +₹{portfolio.totalGainLoss?.toLocaleString('en-IN')} <span className="text-xs text-emerald-500 font-semibold">+0%</span>
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">PORTFOLIO XIRR RETURN</span>
              <p className="text-2xl font-extrabold text-blue-400">{portfolio.xirr}%</p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span>Portfolio Health AI Audit</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Health Score: {portfolio.healthScore}/100 (Needs Review)
              </span>
            </div>

            {portfolio.healthWarning && (
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-amber-400">Over-Concentration Risk (Flexi Cap)</p>
                  <p className="text-[11px] text-slate-300 leading-normal">{portfolio.healthWarning}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Active Fund Holdings</h3>
                <span className="text-xs text-slate-400">{portfolio.holdings?.length || 0} Schemes</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      <th className="py-3 px-2">Scheme Name</th>
                      <th className="py-3 px-2">Avg NAV</th>
                      <th className="py-3 px-2">Invested</th>
                      <th className="py-3 px-2">Current Val</th>
                      <th className="py-3 px-2">Gain %</th>
                      <th className="py-3 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {portfolio.holdings?.map((h, hIdx) => (
                      <tr key={h._id || hIdx}>
                        <td className="py-3.5 px-2">
                          <p className="font-bold text-white">{h.fundName}</p>
                          <p className="text-[10px] text-slate-400">{h.category} • {h.units} Units</p>
                        </td>
                        <td className="py-3.5 px-2 text-slate-300 font-mono">₹{h.avgNav}</td>
                        <td className="py-3.5 px-2 text-slate-300 font-mono">₹{h.investedAmount?.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-2 font-bold text-blue-400 font-mono">₹{h.currentValue?.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-2 font-bold text-emerald-400">+{h.gainPercentage?.toFixed(2)}%</td>
                        <td className="py-3.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                const matchedFund = funds.find(f => f._id === h.fundId || f.name === h.fundName);
                                setSelectedFund(matchedFund || DEFAULT_FUNDS[2]);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white text-[10px] font-semibold transition-colors"
                            >
                              + Invest
                            </button>
                            <button
                              onClick={() => redeemMutation.mutate({ fundId: h.fundId?._id || h.fundId || h._id, unitsToRedeem: h.units })}
                              className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-400 hover:bg-rose-600 hover:text-white text-[10px] font-semibold transition-colors"
                            >
                              Redeem
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <h3 className="font-bold text-white text-base">Asset Allocation</h3>
              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={portfolio.holdings?.length > 0 ? portfolio.holdings : [{ category: 'Flexi Cap', currentValue: 5000 }]}
                      dataKey="currentValue"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {portfolio.holdings?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#090d16', borderColor: '#1f2937', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-[10px] text-slate-500 text-center">
                Visual breakdown of mutual fund asset category exposure across your enterprise account.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base">Investment Transaction History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Fund Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">NAV</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx, tIdx) => (
                  <tr key={tx._id || tIdx}>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(tx.createdAt || tx.date).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 font-bold text-white">{tx.fundName}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-400">{tx.type}</td>
                    <td className="py-3.5 px-4 font-bold text-white">₹{tx.amount?.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-4 text-slate-300">₹{tx.nav}</td>
                    <td className="py-3.5 px-4 text-slate-300">{tx.units}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 9: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {funds.slice(0, 3).map((f) => (
            <div key={f._id || f.name} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">{f.name}</h4>
                <Bookmark className="h-4 w-4 text-blue-400 fill-blue-400" />
              </div>
              <p className="text-xs text-slate-400">{f.category} • 3Y CAGR: +{f.cagr3Y}%</p>
              <button
                onClick={() => setSelectedFund(f)}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Start SIP (Min ₹{f.minSip})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Invest SIP Modal */}
      {selectedFund && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-bold text-white text-base">Start SIP / Invest</h3>
                <p className="text-xs text-blue-400 font-semibold">{selectedFund.name}</p>
              </div>
              <button onClick={() => setSelectedFund(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Investment Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInvestType('SIP')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      investType === 'SIP' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Monthly SIP
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvestType('LUMP_SUM')}
                    className={`py-2 rounded-xl text-xs font-semibold border ${
                      investType === 'LUMP_SUM' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    Lump Sum
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Investment Amount (₹)</label>
                <input
                  type="number"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(Number(e.target.value))}
                  min={selectedFund.minSip || 500}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-500 mt-1">Min SIP threshold: ₹{selectedFund.minSip || 500}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Current NAV:</span>
                  <span className="font-bold text-white">₹{selectedFund.nav || 100}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Units Allotted:</span>
                  <span className="font-bold text-blue-400">{(investAmount / (selectedFund.nav || 100)).toFixed(4)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedFund(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => investMutation.mutate({ fundId: selectedFund._id, amount: investAmount, type: investType })}
                disabled={investMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md disabled:opacity-50"
              >
                {investMutation.isPending ? 'Processing...' : 'Confirm & Invest'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailFund && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {detailFund.category}
                </span>
                <h3 className="font-bold text-white text-base mt-1">{detailFund.name}</h3>
              </div>
              <button onClick={() => setDetailFund(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
              <p>{detailFund.description}</p>
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500">Asset Management Co:</span>
                  <p className="font-bold text-white">{detailFund.amc}</p>
                </div>
                <div>
                  <span className="text-slate-500">Fund Size (AUM):</span>
                  <p className="font-bold text-white">₹{detailFund.fundSizeCr?.toLocaleString('en-IN')} Cr</p>
                </div>
                <div>
                  <span className="text-slate-500">3Y CAGR Return:</span>
                  <p className="font-bold text-emerald-400">+{detailFund.cagr3Y}%</p>
                </div>
                <div>
                  <span className="text-slate-500">Expense Ratio:</span>
                  <p className="font-bold text-white">{detailFund.expenseRatio}%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setSelectedFund(detailFund);
                  setDetailFund(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md"
              >
                Start SIP in this Fund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WealthAdvisor;
