const mysqlPool = require('../config/mysql_db');

// Catalog of default funds
const MASTER_FUNDS = [
  {
    id: 'mf_sbi_small_cap',
    schemeCode: '125497',
    schemeName: 'SBI Small Cap Fund - Direct Plan - Growth',
    amc: 'SBI Mutual Fund',
    category: 'Small Cap',
    subCategory: 'Equity Small Cap',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 168.9000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 28.40,
    threeYearReturn: 24.60,
    fiveYearReturn: 21.80,
    expenseRatio: 0.69,
    exitLoad: '1% if redeemed within 1 year',
    aumCr: 28400.00,
    benchmark: 'BSE SmallCap TRI',
    riskLevel: 'Aggressive',
    minSip: 500.00,
    minLumpsum: 5000.00,
    fundManager: 'R. Srinivasan',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_hdfc_mid_cap',
    schemeCode: '118989',
    schemeName: 'HDFC Mid-Cap Opportunities Fund - Direct Plan - Growth',
    amc: 'HDFC Mutual Fund',
    category: 'Mid Cap',
    subCategory: 'Equity Mid Cap',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 188.6000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 25.20,
    threeYearReturn: 22.80,
    fiveYearReturn: 19.40,
    expenseRatio: 0.81,
    exitLoad: '1% if redeemed within 1 year',
    aumCr: 65200.00,
    benchmark: 'Nifty Midcap 150 TRI',
    riskLevel: 'Moderately Aggressive',
    minSip: 500.00,
    minLumpsum: 1000.00,
    fundManager: 'Chirag Setalvad',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_ppfas_flexi',
    schemeCode: '122639',
    schemeName: 'Parag Parikh Flexi Cap Fund - Direct Plan - Growth',
    amc: 'PPFAS Mutual Fund',
    category: 'Flexi Cap',
    subCategory: 'Equity Flexi Cap',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 82.3000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 21.80,
    threeYearReturn: 21.40,
    fiveYearReturn: 18.90,
    expenseRatio: 0.62,
    exitLoad: '2% within 365 days, 1% between 366-730 days',
    aumCr: 72100.00,
    benchmark: 'Nifty 500 TRI',
    riskLevel: 'Moderate',
    minSip: 1000.00,
    minLumpsum: 1000.00,
    fundManager: 'Rajeev Thakkar',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_dsp_elss',
    schemeCode: '102571',
    schemeName: 'DSP ELSS Tax Saver Fund - Direct Plan - Growth',
    amc: 'DSP Mutual Fund',
    category: 'ELSS',
    subCategory: 'Tax Saving (ELSS)',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 114.8000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 19.50,
    threeYearReturn: 18.90,
    fiveYearReturn: 16.20,
    expenseRatio: 0.72,
    exitLoad: 'Nil (3-Year Mandatory Statutory Lock-in)',
    aumCr: 14800.00,
    benchmark: 'Nifty 500 TRI',
    riskLevel: 'Moderately Aggressive',
    minSip: 500.00,
    minLumpsum: 500.00,
    fundManager: 'Rohit Singhania',
    rating: 4,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_icici_hybrid',
    schemeCode: '100356',
    schemeName: 'ICICI Prudential Equity & Debt Fund - Direct Plan - Growth',
    amc: 'ICICI Prudential Mutual Fund',
    category: 'Hybrid',
    subCategory: 'Aggressive Hybrid',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 342.1000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 18.40,
    threeYearReturn: 17.50,
    fiveYearReturn: 15.80,
    expenseRatio: 1.08,
    exitLoad: '1% within 1 year for >10% units',
    aumCr: 35900.00,
    benchmark: 'CRISIL Hybrid 35+65 Aggressive Index',
    riskLevel: 'Moderate',
    minSip: 1000.00,
    minLumpsum: 5000.00,
    fundManager: 'Sankaran Naren',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_mirae_large',
    schemeCode: '113421',
    schemeName: 'Mirae Asset Large Cap Fund - Direct Plan - Growth',
    amc: 'Mirae Asset Mutual Fund',
    category: 'Large Cap',
    subCategory: 'Equity Large Cap',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 108.4500,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 16.80,
    threeYearReturn: 17.20,
    fiveYearReturn: 14.90,
    expenseRatio: 0.54,
    exitLoad: '1% if redeemed within 1 year',
    aumCr: 38400.00,
    benchmark: 'Nifty 100 TRI',
    riskLevel: 'Moderately Conservative',
    minSip: 1000.00,
    minLumpsum: 5000.00,
    fundManager: 'Gaurav Khandelwal',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_uti_nifty',
    schemeCode: '120716',
    schemeName: 'UTI Nifty 50 Index Fund - Direct Plan - Growth',
    amc: 'UTI Mutual Fund',
    category: 'Index',
    subCategory: 'Index Fund',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 152.4000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 15.60,
    threeYearReturn: 15.80,
    fiveYearReturn: 14.20,
    expenseRatio: 0.21,
    exitLoad: 'Nil',
    aumCr: 19200.00,
    benchmark: 'Nifty 50 TRI',
    riskLevel: 'Moderately Conservative',
    minSip: 500.00,
    minLumpsum: 5000.00,
    fundManager: 'Sharwan Kumar Goyal',
    rating: 4,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  },
  {
    id: 'mf_axis_liquid',
    schemeCode: '112090',
    schemeName: 'Axis Liquid Fund - Direct Plan - Growth',
    amc: 'Axis Mutual Fund',
    category: 'Liquid',
    subCategory: 'Debt Liquid',
    planType: 'Direct',
    optionType: 'Growth',
    nav: 2410.5000,
    navDate: new Date().toISOString().split('T')[0],
    oneYearReturn: 7.10,
    threeYearReturn: 6.80,
    fiveYearReturn: 6.10,
    expenseRatio: 0.15,
    exitLoad: 'Graduated exit load up to 7 days',
    aumCr: 26500.00,
    benchmark: 'NIFTY Liquid Index A-I',
    riskLevel: 'Conservative',
    minSip: 500.00,
    minLumpsum: 500.00,
    fundManager: 'Devang Shah',
    rating: 5,
    dataSource: 'MockMutualFundProvider',
    dataDate: new Date().toISOString().split('T')[0],
    isDemoData: true,
  }
];

class MutualFundProvider {
  /**
   * Seed mutual funds catalog into MySQL table if empty.
   */
  static async ensureSeeded() {
    try {
      const [rows] = await mysqlPool.query('SELECT COUNT(*) as cnt FROM mutual_funds');
      if (rows[0].cnt < MASTER_FUNDS.length) {
        for (const mf of MASTER_FUNDS) {
          await mysqlPool.query(`
            INSERT INTO mutual_funds (
              id, scheme_code, scheme_name, amc, category, sub_category, plan_type, option_type,
              nav, nav_date, one_year_return, three_year_return, five_year_return, expense_ratio,
              exit_load, aum_cr, benchmark, risk_level, min_sip, min_lumpsum, fund_manager, rating,
              data_source, data_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              nav = VALUES(nav),
              three_year_return = VALUES(three_year_return),
              data_date = VALUES(data_date)
          `, [
            mf.id, mf.schemeCode, mf.schemeName, mf.amc, mf.category, mf.subCategory, mf.planType, mf.optionType,
            mf.nav, mf.navDate, mf.oneYearReturn, mf.threeYearReturn, mf.fiveYearReturn, mf.expenseRatio,
            mf.exitLoad, mf.aumCr, mf.benchmark, mf.riskLevel, mf.minSip, mf.minLumpsum, mf.fundManager, mf.rating,
            mf.dataSource, mf.dataDate
          ]);
        }
      }
    } catch (error) {
      console.warn('MutualFundProvider seed warning:', error.message);
    }
  }

  /**
   * Fetch Real-Time Live NAV from Indian AMFI / MFAPI Engine
   */
  static async fetchLiveNav(schemeCode) {
    if (!schemeCode) return null;
    try {
      const axios = require('axios');
      const res = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`, { timeout: 3000 });
      if (res.data && res.data.data && res.data.data.length > 0) {
        const latest = res.data.data[0];
        return {
          nav: parseFloat(latest.nav),
          navDate: latest.date,
          schemeName: res.data.meta?.scheme_name
        };
      }
    } catch (err) {
      console.warn(`MFAPI live NAV fetch warning for ${schemeCode}:`, err.message);
    }
    return null;
  }

  /**
   * Fetch list of mutual funds with filtering and sorting.
   */
  static async getFunds(filters = {}) {
    await this.ensureSeeded();
    try {
      let sql = 'SELECT * FROM mutual_funds WHERE 1=1';
      const params = [];

      if (filters.category && filters.category !== 'All Categories') {
        sql += ' AND category = ?';
        params.push(filters.category);
      }

      if (filters.riskLevel && filters.riskLevel !== 'All Risk Levels') {
        sql += ' AND risk_level = ?';
        params.push(filters.riskLevel);
      }

      if (filters.search) {
        sql += ' AND (scheme_name LIKE ? OR amc LIKE ? OR category LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (filters.sort === 'nav') sql += ' ORDER BY nav DESC';
      else if (filters.sort === 'minSip') sql += ' ORDER BY min_sip ASC';
      else if (filters.sort === 'expenseRatio') sql += ' ORDER BY expense_ratio ASC';
      else if (filters.sort === '1Y') sql += ' ORDER BY one_year_return DESC';
      else sql += ' ORDER BY three_year_return DESC';

      const [rows] = await mysqlPool.query(sql, params);
      
      const mapped = rows.map(r => ({
        id: r.id,
        schemeCode: r.scheme_code,
        schemeName: r.scheme_name,
        amc: r.amc,
        category: r.category,
        subCategory: r.sub_category,
        planType: r.plan_type,
        optionType: r.option_type,
        nav: Number(r.nav),
        navDate: r.nav_date,
        oneYearReturn: Number(r.one_year_return),
        threeYearReturn: Number(r.three_year_return),
        fiveYearReturn: Number(r.five_year_return),
        expenseRatio: Number(r.expense_ratio),
        exitLoad: r.exit_load,
        aumCr: Number(r.aum_cr),
        benchmark: r.benchmark,
        riskLevel: r.risk_level,
        minSip: Number(r.min_sip),
        minLumpsum: Number(r.min_lumpsum),
        fundManager: r.fund_manager,
        rating: r.rating,
        dataSource: r.data_source || 'MockMutualFundProvider',
        dataDate: r.data_date ? new Date(r.data_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        isDemoData: r.data_source === 'MockMutualFundProvider' || true,
      }));

      let list = mapped.length > 0 ? mapped : MASTER_FUNDS;
      for (let f of list) {
        if (f.schemeCode) {
          const live = await this.fetchLiveNav(f.schemeCode);
          if (live && live.nav) {
            f.nav = live.nav;
            f.navDate = live.navDate;
            f.dataDate = live.navDate;
            f.dataSource = 'AMFI India Real-Time Feed';
            f.isDemoData = false;
          }
        }
      }
      return list;
    } catch (error) {
      console.warn('Database query error, returning in-memory funds:', error.message);
      for (let f of MASTER_FUNDS) {
        if (f.schemeCode) {
          const live = await this.fetchLiveNav(f.schemeCode);
          if (live && live.nav) {
            f.nav = live.nav;
            f.navDate = live.navDate;
            f.dataDate = live.navDate;
            f.dataSource = 'AMFI India Real-Time Feed';
            f.isDemoData = false;
          }
        }
      }
      return MASTER_FUNDS;
    }
  }

  static async getFundById(id) {
    const funds = await this.getFunds();
    return funds.find(f => f.id === id || f.schemeCode === id) || funds[0];
  }
}

module.exports = MutualFundProvider;
