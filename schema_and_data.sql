-- ======================================================
-- BizNest AI Enterprise Business Assistant Database Script
-- Compatible with MySQL 5.7+ / 8.0+ / MySQL Workbench
-- Target Database / Schema Name: enterprise_assistant_db (or Product_dev)
-- ======================================================

CREATE DATABASE IF NOT EXISTS `enterprise_assistant_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `enterprise_assistant_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `portfolio_holdings`;
DROP TABLE IF EXISTS `mutual_funds`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `schemes`;
DROP TABLE IF EXISTS `documents`;
DROP TABLE IF EXISTS `hr_employees`;
DROP TABLE IF EXISTS `tickets`;
DROP TABLE IF EXISTS `orders`;
DROP TABLE IF EXISTS `expenses`;
DROP TABLE IF EXISTS `invoice_items`;
DROP TABLE IF EXISTS `invoices`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `suppliers`;
DROP TABLE IF EXISTS `customers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `businesses`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Businesses Table
CREATE TABLE `businesses` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `gstin` VARCHAR(50),
  `industry` VARCHAR(255),
  `currency` VARCHAR(10) DEFAULT 'INR',
  `street` VARCHAR(255),
  `city` VARCHAR(100),
  `state` VARCHAR(100),
  `zip` VARCHAR(20),
  `country` VARCHAR(100) DEFAULT 'India',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `businesses` (`id`, `name`, `gstin`, `industry`, `currency`, `street`, `city`, `state`, `zip`, `country`) VALUES (
  '6a9fa2b3a290f13a38ef94bb', 'Apex Dynamics Manufacturing Enterprises', '33AAAAA1234A1Z5', 'Industrial Equipment & Manufacturing', 'INR', 'Plot 45, Guindy Industrial Estate', 'Chennai', 'Tamil Nadu', '600032', 'India'
);

-- 2. Users Table
CREATE TABLE `users` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `clerk_id` VARCHAR(255),
  `email` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100),
  `last_name` VARCHAR(100),
  `role` VARCHAR(50) DEFAULT 'Business Owner',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `users` (`id`, `business_id`, `clerk_id`, `email`, `first_name`, `last_name`, `role`) VALUES (
  '6a9fa2b3a290f13a38ef94c3', '6a9fa2b3a290f13a38ef94bb', 'user_123', 'admin@apexdynamics.in', 'Rajesh', 'Kumar', 'Business Owner'
);

-- 3. Customers Table
CREATE TABLE `customers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `address` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94ca', '6a9fa2b3a290f13a38ef94bb', 'Tata Motors Ltd', 'procurement@tatamotors.com', '022-66658282', 'Mumbai, Maharashtra, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94cb', '6a9fa2b3a290f13a38ef94bb', 'Reliance Industries Ltd', 'purchasing@ril.com', '022-44770000', 'Navi Mumbai, Maharashtra, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94cc', '6a9fa2b3a290f13a38ef94bb', 'L&T Construction', 'contact@lntecc.com', '044-22526000', 'Chennai, Tamil Nadu, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94cd', '6a9fa2b3a290f13a38ef94bb', 'Godrej Enterprise', 'supply@godrej.com', '022-67965656', 'Mumbai, Maharashtra, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94ce', '6a9fa2b3a290f13a38ef94bb', 'Ashok Leyland Ltd', 'vendor@ashokleyland.com', '044-25301234', 'Chennai, Tamil Nadu, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94cf', '6a9fa2b3a290f13a38ef94bb', 'BHEL Heavy Electricals', 'materials@bhel.in', '040-23182000', 'Hyderabad, Telangana, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94d0', '6a9fa2b3a290f13a38ef94bb', 'TVS Motor Company', 'purchase@tvsmotor.com', '044-28332115', 'Hosur, Tamil Nadu, India'
);
INSERT INTO `customers` (`id`, `business_id`, `name`, `email`, `phone`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94d1', '6a9fa2b3a290f13a38ef94bb', 'Titan Company Ltd', 'supplychain@titan.co.in', '080-66609000', 'Bengaluru, Karnataka, India'
);

-- 4. Suppliers Table
CREATE TABLE `suppliers` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `name` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `gstin` VARCHAR(50),
  `address` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `gstin`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94d7', '6a9fa2b3a290f13a38ef94bb', 'JSW Steel Supply Corp', '', 'orders@jswsteel.com', '022-42861000', '', 'Bellary, Karnataka'
);
INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `gstin`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94d8', '6a9fa2b3a290f13a38ef94bb', 'Hindalco Aluminum Ltd', '', 'b2b@hindalco.adityabirla.com', '022-66626666', '', 'Renukoot, UP'
);
INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `gstin`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94d9', '6a9fa2b3a290f13a38ef94bb', 'Polycab Electricals India', '', 'sales@polycab.com', '022-24327074', '', 'Vadodara, Gujarat'
);
INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `gstin`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94da', '6a9fa2b3a290f13a38ef94bb', 'Bosch Industrial Fasteners', '', 'info@boschfasteners.in', '080-22992111', '', 'Bengaluru, Karnataka'
);
INSERT INTO `suppliers` (`id`, `business_id`, `name`, `contact_person`, `email`, `phone`, `gstin`, `address`) VALUES (
  '6a9fa2b3a290f13a38ef94db', '6a9fa2b3a290f13a38ef94bb', 'Supreme Polymer Components', '', 'support@supreme.co.in', '022-40430000', '', 'Jalgaon, Maharashtra'
);

-- 5. Products (Inventory) Table
CREATE TABLE `products` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `sku` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `quantity` INT DEFAULT 0,
  `unit` VARCHAR(50) DEFAULT 'units',
  `purchase_price` DECIMAL(12,2),
  `selling_price` DECIMAL(12,2),
  `min_threshold` INT DEFAULT 10,
  `supplier` VARCHAR(255),
  `hsn_code` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94dd', '6a9fa2b3a290f13a38ef94bb', 'STEEL-HD-001', 'Heavy Duty Steel Roll', 'Raw Materials', 4, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94de', '6a9fa2b3a290f13a38ef94bb', 'ALUM-XL-002', 'Aluminum Sheeting XL', 'Raw Materials', 18, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94df', '6a9fa2b3a290f13a38ef94bb', 'COP-WIRE-003', 'Precision Copper Wiring Coil', 'Electricals', 7, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e0', '6a9fa2b3a290f13a38ef94bb', 'ADH-COMM-004', 'Commercial Synthetic Resin Adhesive', 'Chemicals', 45, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e1', '6a9fa2b3a290f13a38ef94bb', 'BOLT-IND-005', 'Galvanized Industrial Anchor Bolts', 'Fasteners', 9, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e2', '6a9fa2b3a290f13a38ef94bb', 'SAFE-HELM-006', 'Industrial Safety Helmet Set', 'Safety Gear', 30, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e3', '6a9fa2b3a290f13a38ef94bb', 'HYD-VALV-007', 'High-Pressure Hydraulic Valve', 'Machinery Components', 12, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e4', '6a9fa2b3a290f13a38ef94bb', 'GEAR-PLAN-008', 'Planetary Gearbox Assembly', 'Machinery Components', 3, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e5', '6a9fa2b3a290f13a38ef94bb', 'PNEU-CYL-009', 'Double-Acting Pneumatic Cylinder', 'Pneumatics', 22, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e6', '6a9fa2b3a290f13a38ef94bb', 'SS-FAST-010', 'Stainless Steel Fasteners Set', 'Fasteners', 42, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e7', '6a9fa2b3a290f13a38ef94bb', 'MTR-SERVO-011', 'Heavy Duty Servo Motor 5kW', 'Electronics', 6, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e8', '6a9fa2b3a290f13a38ef94bb', 'HDPE-SHEET-012', 'High Density Polyethylene Sheet', 'Raw Materials', 25, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94e9', '6a9fa2b3a290f13a38ef94bb', 'COOL-IND-013', 'Industrial Coolant Fluid 20L', 'Chemicals', 14, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94ea', '6a9fa2b3a290f13a38ef94bb', 'COMP-REG-014', 'Air Compressor Pressure Regulator', 'Pneumatics', 19, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94eb', '6a9fa2b3a290f13a38ef94bb', 'FLG-CARB-015', 'Carbon Steel Flange 150mm', 'Machinery Components', 35, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94ec', '6a9fa2b3a290f13a38ef94bb', 'SAFE-GLOV-016', 'Insulated Electrical Glove Set', 'Safety Gear', 50, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94ed', '6a9fa2b3a290f13a38ef94bb', 'TOOL-CALIP-017', 'Digital Caliper & Micrometer Kit', 'Testing & Tools', 11, '', undefined, undefined, undefined, '', ''
);
INSERT INTO `products` (`id`, `business_id`, `sku`, `name`, `category`, `quantity`, `unit`, `purchase_price`, `selling_price`, `min_threshold`, `supplier`, `hsn_code`) VALUES (
  '6a9fa2b3a290f13a38ef94ee', '6a9fa2b3a290f13a38ef94bb', 'WELD-NOZ-018', 'Automatic Welder Nozzle Tip Set', 'Fasteners', 3, '', undefined, undefined, undefined, '', ''
);

-- 6. Invoices Table
CREATE TABLE `invoices` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `invoice_number` VARCHAR(100) NOT NULL,
  `customer_id` VARCHAR(50),
  `issue_date` DATE,
  `due_date` DATE,
  `subtotal` DECIMAL(12,2),
  `tax_total` DECIMAL(12,2),
  `discount` DECIMAL(12,2) DEFAULT 0,
  `total` DECIMAL(12,2),
  `status` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Sent',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE `invoice_items` (
  `id` VARCHAR(50) PRIMARY KEY,
  `invoice_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50),
  `name` VARCHAR(255),
  `quantity` INT,
  `rate` DECIMAL(12,2),
  `cgst` DECIMAL(12,2),
  `sgst` DECIMAL(12,2),
  `igst` DECIMAL(12,2),
  `amount` DECIMAL(12,2),
  FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94f0', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0501', '6a9fa2b3a290f13a38ef94ca', '2026-05-07', '2026-05-21', 146500, 26370, 2500, 170370, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f1', '6a9fa2b3a290f13a38ef94f0', '6a9fa2b3a290f13a38ef94dd', 'Heavy Duty Steel Roll', 4, 32000, 11520, 11520, 0, 151040
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f2', '6a9fa2b3a290f13a38ef94f0', '6a9fa2b3a290f13a38ef94e1', 'Galvanized Industrial Anchor Bolts', 10, 1850, 1665, 1665, 0, 21830
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94f3', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0502', '6a9fa2b3a290f13a38ef94cc', '2026-05-18', '2026-05-29', 217500, 39150, 5000, 251650, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f4', '6a9fa2b3a290f13a38ef94f3', '6a9fa2b3a290f13a38ef94de', 'Aluminum Sheeting XL', 15, 14500, 19575, 19575, 0, 256650
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94f5', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0503', '6a9fa2b3a290f13a38ef94ce', '2026-05-24', '2026-06-07', 125200, 22536, 2500, 145236, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f6', '6a9fa2b3a290f13a38ef94f5', '6a9fa2b3a290f13a38ef94e7', 'Heavy Duty Servo Motor 5kW', 4, 28500, 10260, 10260, 0, 134520
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f7', '6a9fa2b3a290f13a38ef94f5', '6a9fa2b3a290f13a38ef94ea', 'Air Compressor Pressure Regulator', 2, 5600, 1008, 1008, 0, 13216
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94f8', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0601', '6a9fa2b3a290f13a38ef94cb', '2026-06-04', '2026-06-19', 238000, 42840, 0, 280840, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94f9', '6a9fa2b3a290f13a38ef94f8', '6a9fa2b3a290f13a38ef94e3', 'High-Pressure Hydraulic Valve', 8, 18500, 13320, 13320, 0, 174640
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94fa', '6a9fa2b3a290f13a38ef94f8', '6a9fa2b3a290f13a38ef94e4', 'Planetary Gearbox Assembly', 2, 45000, 8100, 8100, 0, 106200
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94fb', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0602', '6a9fa2b3a290f13a38ef94cd', '2026-06-16', '2026-06-29', 110400, 19872, 2000, 128272, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94fc', '6a9fa2b3a290f13a38ef94fb', '6a9fa2b3a290f13a38ef94df', 'Precision Copper Wiring Coil', 12, 9200, 9936, 9936, 0, 130272
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94fd', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0603', '6a9fa2b3a290f13a38ef94ce', '2026-06-24', '2026-07-09', 160000, 28800, 0, 188800, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef94fe', '6a9fa2b3a290f13a38ef94fd', '6a9fa2b3a290f13a38ef94dd', 'Heavy Duty Steel Roll', 5, 32000, 14400, 14400, 0, 188800
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef94ff', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0604', '6a9fa2b3a290f13a38ef94d1', '2026-06-27', '2026-07-11', 81600, 14688, 1500, 94788, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9500', '6a9fa2b3a290f13a38ef94ff', '6a9fa2b3a290f13a38ef94ed', 'Digital Caliper & Micrometer Kit', 12, 6800, 7344, 7344, 0, 96288
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9501', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0701', '6a9fa2b3a290f13a38ef94cf', '2026-07-03', '2026-07-17', 180000, 32400, 0, 212400, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9502', '6a9fa2b3a290f13a38ef9501', '6a9fa2b3a290f13a38ef94e4', 'Planetary Gearbox Assembly', 4, 45000, 16200, 16200, 0, 212400
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9503', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0702', '6a9fa2b3a290f13a38ef94d0', '2026-07-14', '2026-07-29', 117000, 21060, 3000, 135120, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9504', '6a9fa2b3a290f13a38ef9503', '6a9fa2b3a290f13a38ef94e5', 'Double-Acting Pneumatic Cylinder', 15, 7800, 10530, 10530, 0, 138060
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9505', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0703', '6a9fa2b3a290f13a38ef94ca', '2026-07-09', '2026-07-23', 92000, 16560, 0, 108560, 'Overdue'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9506', '6a9fa2b3a290f13a38ef9505', '6a9fa2b3a290f13a38ef94df', 'Precision Copper Wiring Coil', 10, 9200, 8280, 8280, 0, 108560
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9507', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0704', '6a9fa2b3a290f13a38ef94cd', '2026-07-19', '2026-08-02', 149000, 26820, 0, 175820, 'Overdue'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9508', '6a9fa2b3a290f13a38ef9507', '6a9fa2b3a290f13a38ef94eb', 'Carbon Steel Flange 150mm', 15, 8200, 11070, 11070, 0, 145140
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9509', '6a9fa2b3a290f13a38ef9507', '6a9fa2b3a290f13a38ef94e8', 'High Density Polyethylene Sheet', 4, 6500, 2340, 2340, 0, 30680
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef950a', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0705', '6a9fa2b3a290f13a38ef94cb', '2026-07-26', '2026-08-09', 256000, 46080, 5000, 297080, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef950b', '6a9fa2b3a290f13a38ef950a', '6a9fa2b3a290f13a38ef94dd', 'Heavy Duty Steel Roll', 8, 32000, 23040, 23040, 0, 302080
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef950c', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0801', '6a9fa2b3a290f13a38ef94d1', '2026-08-02', '2026-08-17', 145000, 26100, 0, 171100, 'Sent'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef950d', '6a9fa2b3a290f13a38ef950c', '6a9fa2b3a290f13a38ef94de', 'Aluminum Sheeting XL', 10, 14500, 13050, 13050, 0, 171100
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef950e', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0802', '6a9fa2b3a290f13a38ef94cb', '2026-08-11', '2026-08-25', 192000, 34560, 4000, 222560, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef950f', '6a9fa2b3a290f13a38ef950e', '6a9fa2b3a290f13a38ef94dd', 'Heavy Duty Steel Roll', 6, 32000, 17280, 17280, 0, 226560
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9510', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0803', '6a9fa2b3a290f13a38ef94cd', '2026-08-19', '2026-09-04', 92500, 16650, 0, 109150, 'Sent'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9511', '6a9fa2b3a290f13a38ef9510', '6a9fa2b3a290f13a38ef94e3', 'High-Pressure Hydraulic Valve', 5, 18500, 8325, 8325, 0, 109150
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9512', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0804', '6a9fa2b3a290f13a38ef94cc', '2026-08-21', '2026-09-06', 212000, 38160, 3000, 247160, 'Sent'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9513', '6a9fa2b3a290f13a38ef9512', '6a9fa2b3a290f13a38ef94e7', 'Heavy Duty Servo Motor 5kW', 6, 28500, 15390, 15390, 0, 201780
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9514', '6a9fa2b3a290f13a38ef9512', '6a9fa2b3a290f13a38ef94eb', 'Carbon Steel Flange 150mm', 5, 8200, 3690, 3690, 0, 48380
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9515', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0805', '6a9fa2b3a290f13a38ef94cf', '2026-08-23', '2026-09-08', 135000, 24300, 0, 159300, 'Paid'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9516', '6a9fa2b3a290f13a38ef9515', '6a9fa2b3a290f13a38ef94e4', 'Planetary Gearbox Assembly', 3, 45000, 12150, 12150, 0, 159300
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9517', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0806', '6a9fa2b3a290f13a38ef94d0', '2026-08-25', '2026-09-10', 99750, 17955, 1000, 116705, 'Sent'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9518', '6a9fa2b3a290f13a38ef9517', '6a9fa2b3a290f13a38ef94e9', 'Industrial Coolant Fluid 20L', 20, 3900, 7020, 7020, 0, 92040
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef9519', '6a9fa2b3a290f13a38ef9517', '6a9fa2b3a290f13a38ef94ec', 'Insulated Electrical Glove Set', 15, 1450, 1957.5, 1957.5, 0, 25665
);
INSERT INTO `invoices` (`id`, `business_id`, `invoice_number`, `customer_id`, `issue_date`, `due_date`, `subtotal`, `tax_total`, `discount`, `total`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef951a', '6a9fa2b3a290f13a38ef94bb', 'INV-2026-0807', '6a9fa2b3a290f13a38ef94ca', '2026-08-26', '2026-09-12', 60000, 10800, 0, 70800, 'Draft'
);
INSERT INTO `invoice_items` (`id`, `invoice_id`, `product_id`, `name`, `quantity`, `rate`, `cgst`, `sgst`, `igst`, `amount`) VALUES (
  '6a9fa2b3a290f13a38ef951b', '6a9fa2b3a290f13a38ef951a', '6a9fa2b3a290f13a38ef94e6', 'Stainless Steel Fasteners Set', 25, 2400, 5400, 5400, 0, 70800
);

-- 7. Expenses (Finance Ledger) Table
CREATE TABLE `expenses` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `amount` DECIMAL(12,2) NOT NULL,
  `category` VARCHAR(100),
  `date` DATE,
  `description` TEXT,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef951d', '6a9fa2b3a290f13a38ef94bb', 45000, 'Rent', '2026-04-30', 'Guindy Industrial Estate Unit Monthly Lease'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef951e', '6a9fa2b3a290f13a38ef94bb', 18500, 'Utilities', '2026-05-04', 'TNEB Industrial High-Tension Electricity Bill'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef951f', '6a9fa2b3a290f13a38ef94bb', 88000, 'Inventory', '2026-05-09', 'JSW Steel Coil Bulk Purchase'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9520', '6a9fa2b3a290f13a38ef94bb', 125000, 'Payroll', '2026-05-27', 'May Staff & Factory Workers Salary Disbursement'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9521', '6a9fa2b3a290f13a38ef94bb', 6500, 'Others', '2026-05-13', 'CNC Lathe Machine Service & Calibration'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9522', '6a9fa2b3a290f13a38ef94bb', 45000, 'Rent', '2026-05-31', 'Guindy Industrial Estate Unit Monthly Lease'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9523', '6a9fa2b3a290f13a38ef94bb', 21200, 'Utilities', '2026-06-03', 'TNEB Industrial Electricity Bill'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9524', '6a9fa2b3a290f13a38ef94bb', 142000, 'Inventory', '2026-06-11', 'Hindalco Aluminum Panels Inward Shipment'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9525', '6a9fa2b3a290f13a38ef94bb', 128000, 'Payroll', '2026-06-28', 'June Staff & Factory Workers Salary'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9526', '6a9fa2b3a290f13a38ef94bb', 14500, 'Others', '2026-06-21', 'Inter-state Freight Carrier Charges to Mumbai'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9527', '6a9fa2b3a290f13a38ef94bb', 45000, 'Rent', '2026-06-30', 'Guindy Industrial Estate Unit Monthly Lease'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9528', '6a9fa2b3a290f13a38ef94bb', 19800, 'Utilities', '2026-07-04', 'TNEB Industrial Power Bill'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9529', '6a9fa2b3a290f13a38ef94bb', 76000, 'Inventory', '2026-07-14', 'Polycab Copper Wiring Wire Consignment'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952a', '6a9fa2b3a290f13a38ef94bb', 132000, 'Payroll', '2026-07-29', 'July Staff & Factory Workers Salary'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952b', '6a9fa2b3a290f13a38ef94bb', 9500, 'Others', '2026-07-09', 'Cloud ERP & AI Business Suite Subscription'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952c', '6a9fa2b3a290f13a38ef94bb', 16000, 'Marketing', '2026-07-17', 'B2B Industrial Trade Expo Stall Booking'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952d', '6a9fa2b3a290f13a38ef94bb', 45000, 'Rent', '2026-07-31', 'Guindy Industrial Estate Unit Monthly Lease'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952e', '6a9fa2b3a290f13a38ef94bb', 17900, 'Utilities', '2026-08-04', 'TNEB Industrial Power Bill'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef952f', '6a9fa2b3a290f13a38ef94bb', 52000, 'Inventory', '2026-08-10', 'Fasteners & Resin Adhesive Stock Refill'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9530', '6a9fa2b3a290f13a38ef94bb', 135000, 'Payroll', '2026-08-25', 'August Factory Workers Salary'
);
INSERT INTO `expenses` (`id`, `business_id`, `amount`, `category`, `date`, `description`) VALUES (
  '6a9fa2b3a290f13a38ef9531', '6a9fa2b3a290f13a38ef94bb', 11200, 'Others', '2026-08-18', 'Local Transport & Dispatch Vans'
);

-- 8. Orders Table
CREATE TABLE `orders` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `order_number` VARCHAR(100) NOT NULL,
  `customer_id` VARCHAR(50),
  `customer_name` VARCHAR(255),
  `total_amount` DECIMAL(12,2),
  `status` VARCHAR(50),
  `payment_status` VARCHAR(50),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef9533', '6a9fa2b3a290f13a38ef94bb', 'ORD-8901', '6a9fa2b3a290f13a38ef94ca', 'Tata Motors Ltd', 128000, 'Delivered', 'Paid'
);
INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef9535', '6a9fa2b3a290f13a38ef94bb', 'ORD-8902', '6a9fa2b3a290f13a38ef94cb', 'Reliance Industries Ltd', 148000, 'Delivered', 'Paid'
);
INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef9537', '6a9fa2b3a290f13a38ef94bb', 'ORD-8903', '6a9fa2b3a290f13a38ef94cc', 'L&T Construction', 217500, 'Delivered', 'Paid'
);
INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef9539', '6a9fa2b3a290f13a38ef94bb', 'ORD-8904', '6a9fa2b3a290f13a38ef94cf', 'BHEL Heavy Electricals', 180000, 'Delivered', 'Paid'
);
INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef953b', '6a9fa2b3a290f13a38ef94bb', 'ORD-8905', '6a9fa2b3a290f13a38ef94d1', 'Titan Company Ltd', 145000, 'Shipped', 'Unpaid'
);
INSERT INTO `orders` (`id`, `business_id`, `order_number`, `customer_id`, `customer_name`, `total_amount`, `status`, `payment_status`) VALUES (
  '6a9fa2b3a290f13a38ef953d', '6a9fa2b3a290f13a38ef94bb', 'ORD-8906', '6a9fa2b3a290f13a38ef94cd', 'Godrej Enterprise', 92500, 'Processing', 'Unpaid'
);

-- 9. Support Tickets Table
CREATE TABLE `tickets` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `customer_name` VARCHAR(255),
  `customer_email` VARCHAR(255),
  `status` ENUM('Open', 'In_Progress', 'Resolved', 'Closed') DEFAULT 'Open',
  `priority` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `tickets` (`id`, `business_id`, `title`, `description`, `customer_name`, `customer_email`, `status`, `priority`) VALUES (
  '6a9fa2b3a290f13a38ef9540', '6a9fa2b3a290f13a38ef94bb', 'GST E-Way Bill Generation Assistance', 'Need help attaching proper HSN codes for high-pressure hydraulic valve shipments exceeding ₹50,000 threshold.', 'Ashok Leyland Logistics Team', 'vendor@ashokleyland.com', 'Resolved', 'High'
);
INSERT INTO `tickets` (`id`, `business_id`, `title`, `description`, `customer_name`, `customer_email`, `status`, `priority`) VALUES (
  '6a9fa2b3a290f13a38ef9541', '6a9fa2b3a290f13a38ef94bb', 'Custom Low Stock Threshold Alert Setup', 'Requesting automated SMS and email alerts whenever steel rolls drop below 10 units threshold.', 'Rajesh Kumar (Internal)', 'admin@apexdynamics.in', 'Resolved', 'Medium'
);
INSERT INTO `tickets` (`id`, `business_id`, `title`, `description`, `customer_name`, `customer_email`, `status`, `priority`) VALUES (
  '6a9fa2b3a290f13a38ef9542', '6a9fa2b3a290f13a38ef94bb', 'PNEU-CYL-009 Specification Datasheet Request', 'Customer requesting ISO certification and 3D CAD step file for pneumatic cylinders.', 'TVS Motor Procurement', 'purchase@tvsmotor.com', 'In_Progress', 'Medium'
);
INSERT INTO `tickets` (`id`, `business_id`, `title`, `description`, `customer_name`, `customer_email`, `status`, `priority`) VALUES (
  '6a9fa2b3a290f13a38ef9543', '6a9fa2b3a290f13a38ef94bb', 'Payment Discrepancy Reconciliation for INV-2026-0703', 'Tata Motors procurement logged query regarding 2% TDS deduction on raw material invoice.', 'Tata Motors Accounts Payable', 'procurement@tatamotors.com', 'Open', 'High'
);

-- 10. HR Employees Table
CREATE TABLE `hr_employees` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `role` VARCHAR(100),
  `department` VARCHAR(100),
  `joining_date` DATE,
  `salary` DECIMAL(12,2),
  `attendance_days` INT DEFAULT 26,
  `leave_balance` INT DEFAULT 12,
  `status` VARCHAR(50) DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `hr_employees` (`id`, `business_id`, `name`, `email`, `phone`, `role`, `department`, `joining_date`, `salary`, `attendance_days`, `leave_balance`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9545', '6a9fa2b3a290f13a38ef94bb', 'Arun Varma', 'arun@apexdynamics.in', '9876543210', 'Factory Operations Manager', 'Operations', '2024-01-15', 45000, 26, 8, 'Active'
);
INSERT INTO `hr_employees` (`id`, `business_id`, `name`, `email`, `phone`, `role`, `department`, `joining_date`, `salary`, `attendance_days`, `leave_balance`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9546', '6a9fa2b3a290f13a38ef94bb', 'Deepa Sundaram', 'deepa@apexdynamics.in', '9876543211', 'Senior Accountant & Tax Specialist', 'Finance', '2024-03-01', 38000, 26, 10, 'Active'
);
INSERT INTO `hr_employees` (`id`, `business_id`, `name`, `email`, `phone`, `role`, `department`, `joining_date`, `salary`, `attendance_days`, `leave_balance`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9547', '6a9fa2b3a290f13a38ef94bb', 'Senthil Nathan', 'senthil@apexdynamics.in', '9876543212', 'CNC Lead Machinist', 'Manufacturing', '2024-06-10', 28000, 25, 6, 'Active'
);
INSERT INTO `hr_employees` (`id`, `business_id`, `name`, `email`, `phone`, `role`, `department`, `joining_date`, `salary`, `attendance_days`, `leave_balance`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9548', '6a9fa2b3a290f13a38ef94bb', 'Karthik Subramanian', 'karthik@apexdynamics.in', '9876543213', 'Inventory & Storekeeper', 'Logistics', '2025-02-01', 22000, 26, 12, 'Active'
);
INSERT INTO `hr_employees` (`id`, `business_id`, `name`, `email`, `phone`, `role`, `department`, `joining_date`, `salary`, `attendance_days`, `leave_balance`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef9549', '6a9fa2b3a290f13a38ef94bb', 'Priya Dharshini', 'priya@apexdynamics.in', '9876543214', 'Quality Control Inspector', 'Quality Assurance', '2025-05-15', 26000, 24, 7, 'Active'
);

-- 11. Documents Table (OCR Hub)
CREATE TABLE `documents` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `file_name` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255),
  `file_type` VARCHAR(100),
  `extracted_text` LONGTEXT,
  `summary` TEXT,
  `status` ENUM('Uploading', 'Processing', 'Completed', 'Failed') DEFAULT 'Completed',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `documents` (`id`, `business_id`, `file_name`, `file_path`, `file_type`, `extracted_text`, `summary`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef954b', '6a9fa2b3a290f13a38ef94bb', 'raw_material_jsw_steel_purchase_july.pdf', '/uploads/raw_material_jsw_steel_purchase_july.pdf', 'application/pdf', 'TAX INVOICE \n JSW Steel Corp \n Invoice No: JSW/2026/9912 \n GSTIN: 29AAAAA0000A1Z1 \n Items: Cold Rolled Steel Coils \n Amount: 176000 \n Tax: 31680 \n Net Paid: 207680', 'JSW Steel tax invoice for 8 tons of cold-rolled steel coils. Subtotal: ₹1,76,000, GST 18%: ₹31,680. Total: ₹2,07,680.', 'Completed'
);
INSERT INTO `documents` (`id`, `business_id`, `file_name`, `file_path`, `file_type`, `extracted_text`, `summary`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef954c', '6a9fa2b3a290f13a38ef94bb', 'tneb_industrial_power_bill_august.pdf', '/uploads/tneb_industrial_power_bill_august.pdf', 'application/pdf', 'TAMIL NADU GENERATION AND DISTRIBUTION CORP \n HT Consumer No: 04-902-1123 \n Tariff: Industrial HT-1 \n Consumption: 4890 units \n Total Payable: 17900 \n Payment Status: Paid via NEFT', 'TNEB industrial high tension monthly electricity bill. Meter reading: 4,890 kWh. Total due: ₹17,900.', 'Completed'
);
INSERT INTO `documents` (`id`, `business_id`, `file_name`, `file_path`, `file_type`, `extracted_text`, `summary`, `status`) VALUES (
  '6a9fa2b3a290f13a38ef954d', '6a9fa2b3a290f13a38ef94bb', 'msme_zed_certificate_2026.pdf', '/uploads/msme_zed_certificate_2026.pdf', 'application/pdf', 'GOVERNMENT OF INDIA \n Ministry of Micro, Small and Medium Enterprises \n ZED Gold Rating Certificate \n Issued to: Apex Dynamics Manufacturing Enterprises \n Valid till: August 2029', 'Zero Defect Zero Effect (ZED) Gold Certification awarded by Ministry of Micro, Small and Medium Enterprises, Govt of India.', 'Completed'
);

-- 12. Schemes Table (Government Advisor)
CREATE TABLE `schemes` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `ministry` VARCHAR(255),
  `description` TEXT,
  `eligibility_criteria` TEXT,
  `benefits` TEXT,
  `documents_required` TEXT,
  `application_procedure` TEXT,
  `official_link` VARCHAR(255),
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO `schemes` (`id`, `name`, `ministry`, `description`, `eligibility_criteria`, `benefits`, `documents_required`, `application_procedure`, `official_link`) VALUES (
  '6a9fa2b3a290f13a38ef954f', 'PMEGP - Prime Minister Employment Generation Programme', 'Ministry of Micro, Small & Medium Enterprises', 'Credit-linked subsidy program aimed at generating self-employment opportunities through setting up of micro-enterprises.', 'Any individual above 18 years of age; No income ceiling for setting up projects; Self Help Groups & Registered Societies', 'Margin money subsidy up to 35% of project cost for rural general/special categories, maximum project cost ₹50 Lakhs for manufacturing.', 'Aadhaar Card; Project Report / Business Plan; Caste/Category Certificate; Educational Qualification Certificate', 'Submit application online through KVIC PMEGP Portal (kviconline.gov.in) with detailed project profile.', 'https://msme.gov.in/pmegp'
);
INSERT INTO `schemes` (`id`, `name`, `ministry`, `description`, `eligibility_criteria`, `benefits`, `documents_required`, `application_procedure`, `official_link`) VALUES (
  '6a9fa2b3a290f13a38ef9550', 'CGTMSE - Credit Guarantee Fund Trust for Micro & Small Enterprises', 'Ministry of Micro, Small & Medium Enterprises & SIDBI', 'Provides collateral-free credit facility to new and existing small and medium enterprises.', 'New and existing Micro, Small and Medium Enterprises; Manufacturing and Service Sector units', 'Collateral-free credit limit up to ₹5 Crore with guarantee cover up to 85% for micro-enterprises and women entrepreneurs.', 'GST Registration Certificate; UDYAM Registration Certificate; Audited Financial Statements (Last 2 Years); Bank Statement', 'Apply directly through Member Lending Institutions (Scheduled Commercial Banks, RRBs, SIDBI).', 'https://www.cgtmse.in'
);
INSERT INTO `schemes` (`id`, `name`, `ministry`, `description`, `eligibility_criteria`, `benefits`, `documents_required`, `application_procedure`, `official_link`) VALUES (
  '6a9fa2b3a290f13a38ef9551', 'Pradhan Mantri MUDRA Yojana (PMMY)', 'Ministry of Finance & Micro, Small & Medium Enterprises', 'Provides loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises.', 'Artisans, Small Manufacturers, Shopkeepers, Agri-allied businesses', 'Three categories: Shishu (up to ₹50k), Kishor (₹50k to ₹5L), and Tarun (₹5L to ₹10L) with zero processing fees for Shishu/Kishor.', 'Identity Proof; Address Proof; Business License / UDYAM; Quotation of Machinery / Items', 'Apply through UdyamiMitra portal or visit any scheduled commercial bank or MFI.', 'https://www.mudra.org.in'
);
INSERT INTO `schemes` (`id`, `name`, `ministry`, `description`, `eligibility_criteria`, `benefits`, `documents_required`, `application_procedure`, `official_link`) VALUES (
  '6a9fa2b3a290f13a38ef9552', 'Enterprise ZED Certification Scheme (Zero Defect Zero Effect)', 'Ministry of Micro, Small & Medium Enterprises', 'Drives manufacturing excellence, quality enhancement, and eco-friendly sustainable practices among Enterprises.', 'All Enterprises registered on UDYAM Portal', '80% subsidy for Micro, 60% for Small, and 50% for Medium enterprises on certification cost plus financial support for testing & clean energy.', 'UDYAM Registration; Plant Layout; Quality Management System Documents', 'Register on zed.msme.gov.in and complete self-assessment.', 'https://zed.msme.gov.in'
);

-- 13. System Notifications Table
CREATE TABLE `notifications` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT,
  `type` VARCHAR(50),
  `is_read` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO `notifications` (`id`, `business_id`, `title`, `message`, `type`, `is_read`) VALUES (
  '6a9fa2b3a290f13a38ef9554', '6a9fa2b3a290f13a38ef94bb', '⚠️ Low Stock Alert: Heavy Duty Steel Roll', 'Stock level for "Heavy Duty Steel Roll" is currently 4 units (Threshold: 10). Reorder recommended.', 'Stock_Alert', 0
);
INSERT INTO `notifications` (`id`, `business_id`, `title`, `message`, `type`, `is_read`) VALUES (
  '6a9fa2b3a290f13a38ef9555', '6a9fa2b3a290f13a38ef94bb', '🚨 Overdue Invoice Warning: INV-2026-0703', 'Invoice INV-2026-0703 issued to Tata Motors for ₹1,08,560 is overdue by 34 days.', 'Invoice_Alert', 0
);
INSERT INTO `notifications` (`id`, `business_id`, `title`, `message`, `type`, `is_read`) VALUES (
  '6a9fa2b3a290f13a38ef9556', '6a9fa2b3a290f13a38ef94bb', '📈 Quarterly Growth Insight', 'Your Q2 revenues grew by 18.5% compared to Q1. Top revenue driver: Industrial Steel & Hydraulic Assemblies.', 'AI_Alert', 1
);
INSERT INTO `notifications` (`id`, `business_id`, `title`, `message`, `type`, `is_read`) VALUES (
  '6a9fa2b3a290f13a38ef9557', '6a9fa2b3a290f13a38ef94bb', '💰 Cashflow Positive Milestone', 'Net August Operating Margin is +34.2% with ₹5.95 Lakhs incoming collections.', 'Finance_Alert', 1
);

-- 14. Mutual Funds Table
CREATE TABLE `mutual_funds` (
  `id` VARCHAR(50) PRIMARY KEY,
  `scheme_code` VARCHAR(50),
  `scheme_name` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100),
  `nav` DECIMAL(10,4),
  `one_year_return` DECIMAL(6,2),
  `three_year_return` DECIMAL(6,2),
  `five_year_return` DECIMAL(6,2),
  `risk_level` VARCHAR(50),
  `min_sip` DECIMAL(10,2)
) ENGINE=InnoDB;

CREATE TABLE `portfolio_holdings` (
  `id` VARCHAR(50) PRIMARY KEY,
  `business_id` VARCHAR(50),
  `fund_id` VARCHAR(50),
  `units` DECIMAL(12,4),
  `invested_amount` DECIMAL(12,2),
  `current_value` DECIMAL(12,2),
  `purchase_date` DATE,
  FOREIGN KEY (`business_id`) REFERENCES `businesses`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`fund_id`) REFERENCES `mutual_funds`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab41', '', '', 'Large Cap', undefined, 0, 0, 0, '', 1000
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab43', '', '', 'Flexi Cap', undefined, 0, 0, 0, '', 1000
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab45', '', '', 'Small Cap', undefined, 0, 0, 0, '', 500
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab47', '', '', 'Index', undefined, 0, 0, 0, '', 500
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab49', '', '', 'ELSS', undefined, 0, 0, 0, '', 500
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab4b', '', '', 'Hybrid', undefined, 0, 0, 0, '', 1000
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab4d', '', '', 'Mid Cap', undefined, 0, 0, 0, '', 500
);
INSERT INTO `mutual_funds` (`id`, `scheme_code`, `scheme_name`, `category`, `nav`, `one_year_return`, `three_year_return`, `five_year_return`, `risk_level`, `min_sip`) VALUES (
  '6a9ef41e589b3ac730b2ab4f', '', '', 'Liquid', undefined, 0, 0, 0, '', 500
);

INSERT INTO `portfolio_holdings` (`id`, `business_id`, `fund_id`, `units`, `invested_amount`, `current_value`, `purchase_date`) VALUES (
  '6a9ef50fb6255dc040badc63', '6a9ef419e0c4dcad33b7ad2d', 'undefined', 121.50668286755771, undefined, 10000, NULL
);

-- ======================================================
-- End of SQL Script - All 16 Tables Created and Populated
-- ======================================================
