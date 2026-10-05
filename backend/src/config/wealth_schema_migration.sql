-- ======================================================
-- BizNest AI Wealth Advisor Safe Database Migration
-- Target Database: enterprise_assistant_db
-- ======================================================

USE `enterprise_assistant_db`;

-- 1. Investor Profiles
CREATE TABLE IF NOT EXISTS `investor_profiles` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `business_id` VARCHAR(50) NOT NULL,
  `age` INT DEFAULT 30,
  `monthly_income` DECIMAL(12,2) DEFAULT 0.00,
  `monthly_expenses` DECIMAL(12,2) DEFAULT 0.00,
  `mandatory_commitments` DECIMAL(12,2) DEFAULT 0.00,
  `existing_savings` DECIMAL(12,2) DEFAULT 0.00,
  `emergency_fund` DECIMAL(12,2) DEFAULT 0.00,
  `total_liabilities` DECIMAL(12,2) DEFAULT 0.00,
  `existing_investments` DECIMAL(12,2) DEFAULT 0.00,
  `monthly_investment_target` DECIMAL(12,2) DEFAULT 0.00,
  `estimated_capacity_min` DECIMAL(12,2) DEFAULT 0.00,
  `estimated_capacity_max` DECIMAL(12,2) DEFAULT 0.00,
  `risk_tolerance` VARCHAR(50) DEFAULT 'Moderate',
  `investment_horizon_years` INT DEFAULT 5,
  `liquidity_need` VARCHAR(50) DEFAULT 'Medium',
  `investment_experience` VARCHAR(50) DEFAULT 'Intermediate',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_investor_user` (`user_id`),
  KEY `idx_investor_business` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Risk Assessments
CREATE TABLE IF NOT EXISTS `risk_assessments` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `business_id` VARCHAR(50) NOT NULL,
  `score` INT DEFAULT 50,
  `category` VARCHAR(50) NOT NULL DEFAULT 'Moderate',
  `rationale` TEXT,
  `loss_tolerance` VARCHAR(100),
  `income_stability` VARCHAR(100),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_risk_user` (`user_id`),
  KEY `idx_risk_business` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Financial Goals
CREATE TABLE IF NOT EXISTS `financial_goals` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `business_id` VARCHAR(50) NOT NULL,
  `goal_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Wealth Creation',
  `target_amount` DECIMAL(12,2) NOT NULL,
  `current_amount` DECIMAL(12,2) DEFAULT 0.00,
  `target_date` DATE NOT NULL,
  `monthly_contribution` DECIMAL(12,2) DEFAULT 0.00,
  `risk_preference` VARCHAR(50) DEFAULT 'Moderate',
  `status` VARCHAR(50) DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_goal_user` (`user_id`),
  KEY `idx_goal_business` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Mutual Funds Master Catalog
CREATE TABLE IF NOT EXISTS `mutual_funds` (
  `id` VARCHAR(50) PRIMARY KEY,
  `scheme_code` VARCHAR(50),
  `scheme_name` VARCHAR(255) NOT NULL,
  `amc` VARCHAR(255),
  `category` VARCHAR(100),
  `sub_category` VARCHAR(100),
  `plan_type` VARCHAR(50) DEFAULT 'Direct',
  `option_type` VARCHAR(50) DEFAULT 'Growth',
  `nav` DECIMAL(12,4) DEFAULT 100.0000,
  `nav_date` DATE,
  `one_year_return` DECIMAL(6,2) DEFAULT 0.00,
  `three_year_return` DECIMAL(6,2) DEFAULT 0.00,
  `five_year_return` DECIMAL(6,2) DEFAULT 0.00,
  `expense_ratio` DECIMAL(5,2) DEFAULT 0.50,
  `exit_load` VARCHAR(255) DEFAULT '1% if redeemed within 1 year',
  `aum_cr` DECIMAL(12,2) DEFAULT 1000.00,
  `benchmark` VARCHAR(255) DEFAULT 'Nifty 50 TRI',
  `risk_level` VARCHAR(50) DEFAULT 'Moderate',
  `min_sip` DECIMAL(10,2) DEFAULT 500.00,
  `min_lumpsum` DECIMAL(10,2) DEFAULT 1000.00,
  `fund_manager` VARCHAR(255),
  `rating` INT DEFAULT 4,
  `data_source` VARCHAR(50) DEFAULT 'MockProvider',
  `data_date` DATE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_mf_category` (`category`),
  KEY `idx_mf_risk` (`risk_level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Fund NAV History
CREATE TABLE IF NOT EXISTS `fund_nav_history` (
  `id` VARCHAR(50) PRIMARY KEY,
  `fund_id` VARCHAR(50) NOT NULL,
  `nav` DECIMAL(12,4) NOT NULL,
  `nav_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_fund_date` (`fund_id`, `nav_date`),
  KEY `idx_nav_date` (`nav_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Portfolio Holdings
CREATE TABLE IF NOT EXISTS `portfolio_holdings` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `fund_id` VARCHAR(50) NOT NULL,
  `fund_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `units` DECIMAL(14,4) NOT NULL DEFAULT 0.0000,
  `avg_nav` DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  `invested_amount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `current_nav` DECIMAL(12,4) NOT NULL DEFAULT 0.0000,
  `current_value` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `gain_loss` DECIMAL(12,2) DEFAULT 0.00,
  `gain_percentage` DECIMAL(8,2) DEFAULT 0.00,
  `purchase_date` DATE,
  `mode` VARCHAR(20) DEFAULT 'SIMULATION',
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_holding_user` (`user_id`),
  KEY `idx_holding_business` (`business_id`),
  KEY `idx_holding_fund` (`fund_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Investment Transactions
CREATE TABLE IF NOT EXISTS `investment_transactions` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `fund_id` VARCHAR(50) NOT NULL,
  `fund_name` VARCHAR(255) NOT NULL,
  `type` ENUM('BUY_SIP', 'BUY_LUMPSUM', 'REDEEM', 'SIP', 'REDEEM_SIM') NOT NULL DEFAULT 'BUY_SIP',
  `amount` DECIMAL(12,2) NOT NULL,
  `nav` DECIMAL(12,4) NOT NULL,
  `units` DECIMAL(14,4) NOT NULL,
  `exit_load_applied` DECIMAL(12,2) DEFAULT 0.00,
  `mode` VARCHAR(20) NOT NULL DEFAULT 'SIMULATION',
  `status` VARCHAR(50) DEFAULT 'Completed',
  `transaction_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_tx_user` (`user_id`),
  KEY `idx_tx_business` (`business_id`),
  KEY `idx_tx_date` (`transaction_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SIP Plans
CREATE TABLE IF NOT EXISTS `sip_plans` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50) NOT NULL,
  `user_id` VARCHAR(50) NOT NULL,
  `fund_id` VARCHAR(50) NOT NULL,
  `fund_name` VARCHAR(255) NOT NULL,
  `monthly_amount` DECIMAL(12,2) NOT NULL,
  `sip_day` INT DEFAULT 5,
  `step_up_percentage` DECIMAL(5,2) DEFAULT 0.00,
  `status` ENUM('Active', 'Paused', 'Cancelled') DEFAULT 'Active',
  `mode` VARCHAR(20) DEFAULT 'SIMULATION',
  `start_date` DATE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_sip_user` (`user_id`),
  KEY `idx_sip_business` (`business_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Watchlists
CREATE TABLE IF NOT EXISTS `watchlists` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `fund_id` VARCHAR(50) NOT NULL,
  `added_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_user_fund` (`user_id`, `fund_id`),
  KEY `idx_watchlist_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Wealth Recommendations Log
CREATE TABLE IF NOT EXISTS `wealth_recommendations` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `fund_id` VARCHAR(50) NOT NULL,
  `suitability_score` INT NOT NULL,
  `score_breakdown` JSON,
  `match_rationale` TEXT,
  `key_risks` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_rec_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Wealth Insights
CREATE TABLE IF NOT EXISTS `wealth_insights` (
  `id` VARCHAR(50) PRIMARY KEY,
  `user_id` VARCHAR(50) NOT NULL,
  `business_id` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `insight_type` VARCHAR(50) DEFAULT 'PORTFOLIO_HEALTH',
  `severity` ENUM('INFO', 'WARNING', 'CRITICAL') DEFAULT 'INFO',
  `message` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_insight_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
