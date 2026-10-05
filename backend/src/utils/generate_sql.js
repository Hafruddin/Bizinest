const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const Business = require('../models/Business');
const User = require('../models/User');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const Order = require('../models/Order');
const Ticket = require('../models/Ticket');
const HREmployee = require('../models/HREmployee');
const Document = require('../models/Document');
const Scheme = require('../models/Scheme');
const Notification = require('../models/Notification');
const MutualFund = require('../models/MutualFund');
const PortfolioHolding = require('../models/PortfolioHolding');

async function generateSQL() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/enterprise_assistant';
    await mongoose.connect(mongoUri);

    let sql = `-- ======================================================\n`;
    sql += `-- BizNest AI Enterprise Business Assistant Database Script\n`;
    sql += `-- Compatible with MySQL 5.7+ / 8.0+ / MySQL Workbench\n`;
    sql += `-- Target Database / Schema Name: enterprise_assistant_db (or Product_dev)\n`;
    sql += `-- ======================================================\n\n`;

    sql += `CREATE DATABASE IF NOT EXISTS \`enterprise_assistant_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\n`;
    sql += `USE \`enterprise_assistant_db\`;\n\n`;

    sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
    sql += `DROP TABLE IF EXISTS \`portfolio_holdings\`;\n`;
    sql += `DROP TABLE IF EXISTS \`mutual_funds\`;\n`;
    sql += `DROP TABLE IF EXISTS \`notifications\`;\n`;
    sql += `DROP TABLE IF EXISTS \`schemes\`;\n`;
    sql += `DROP TABLE IF EXISTS \`documents\`;\n`;
    sql += `DROP TABLE IF EXISTS \`hr_employees\`;\n`;
    sql += `DROP TABLE IF EXISTS \`tickets\`;\n`;
    sql += `DROP TABLE IF EXISTS \`orders\`;\n`;
    sql += `DROP TABLE IF EXISTS \`expenses\`;\n`;
    sql += `DROP TABLE IF EXISTS \`invoice_items\`;\n`;
    sql += `DROP TABLE IF EXISTS \`invoices\`;\n`;
    sql += `DROP TABLE IF EXISTS \`products\`;\n`;
    sql += `DROP TABLE IF EXISTS \`suppliers\`;\n`;
    sql += `DROP TABLE IF EXISTS \`customers\`;\n`;
    sql += `DROP TABLE IF EXISTS \`users\`;\n`;
    sql += `DROP TABLE IF EXISTS \`businesses\`;\n`;
    sql += `SET FOREIGN_KEY_CHECKS = 1;\n\n`;

    const esc = (str) => {
      if (str === null || str === undefined) return '';
      return String(str).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r');
    };

    const fmtDate = (d) => (d ? `'${new Date(d).toISOString().slice(0, 19).replace('T', ' ')}'` : 'NULL');
    const fmtDateOnly = (d) => (d ? `'${new Date(d).toISOString().split('T')[0]}'` : 'NULL');

    // 1. Businesses Table
    sql += `-- 1. Businesses Table\n`;
    sql += `CREATE TABLE \`businesses\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`gstin\` VARCHAR(50),\n`;
    sql += `  \`industry\` VARCHAR(255),\n`;
    sql += `  \`currency\` VARCHAR(10) DEFAULT 'INR',\n`;
    sql += `  \`street\` VARCHAR(255),\n`;
    sql += `  \`city\` VARCHAR(100),\n`;
    sql += `  \`state\` VARCHAR(100),\n`;
    sql += `  \`zip\` VARCHAR(20),\n`;
    sql += `  \`country\` VARCHAR(100) DEFAULT 'India',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const businesses = await Business.find();
    for (const b of businesses) {
      sql += `INSERT INTO \`businesses\` (\`id\`, \`name\`, \`gstin\`, \`industry\`, \`currency\`, \`street\`, \`city\`, \`state\`, \`zip\`, \`country\`) VALUES (\n`;
      sql += `  '${b._id}', '${esc(b.name)}', '${esc(b.gstin)}', '${esc(b.industry)}', '${esc(b.currency)}', '${esc(b.address?.street)}', '${esc(b.address?.city)}', '${esc(b.address?.state)}', '${esc(b.address?.zip)}', '${esc(b.address?.country)}'\n`;
      sql += `);\n\n`;
    }

    // 2. Users Table
    sql += `-- 2. Users Table\n`;
    sql += `CREATE TABLE \`users\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`clerk_id\` VARCHAR(255),\n`;
    sql += `  \`email\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`first_name\` VARCHAR(100),\n`;
    sql += `  \`last_name\` VARCHAR(100),\n`;
    sql += `  \`role\` VARCHAR(50) DEFAULT 'Business Owner',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE SET NULL\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const users = await User.find();
    for (const u of users) {
      sql += `INSERT INTO \`users\` (\`id\`, \`business_id\`, \`clerk_id\`, \`email\`, \`first_name\`, \`last_name\`, \`role\`) VALUES (\n`;
      sql += `  '${u._id}', '${u.businessId}', '${esc(u.clerkId)}', '${esc(u.email)}', '${esc(u.firstName)}', '${esc(u.lastName)}', '${esc(u.role)}'\n`;
      sql += `);\n\n`;
    }

    // 3. Customers Table
    sql += `-- 3. Customers Table\n`;
    sql += `CREATE TABLE \`customers\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255),\n`;
    sql += `  \`phone\` VARCHAR(50),\n`;
    sql += `  \`address\` TEXT,\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const customers = await Customer.find();
    for (const c of customers) {
      sql += `INSERT INTO \`customers\` (\`id\`, \`business_id\`, \`name\`, \`email\`, \`phone\`, \`address\`) VALUES (\n`;
      sql += `  '${c._id}', '${c.businessId}', '${esc(c.name)}', '${esc(c.email)}', '${esc(c.phone)}', '${esc(c.address)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 4. Suppliers Table
    sql += `-- 4. Suppliers Table\n`;
    sql += `CREATE TABLE \`suppliers\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`contact_person\` VARCHAR(255),\n`;
    sql += `  \`email\` VARCHAR(255),\n`;
    sql += `  \`phone\` VARCHAR(50),\n`;
    sql += `  \`gstin\` VARCHAR(50),\n`;
    sql += `  \`address\` TEXT,\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const suppliers = await Supplier.find();
    for (const s of suppliers) {
      sql += `INSERT INTO \`suppliers\` (\`id\`, \`business_id\`, \`name\`, \`contact_person\`, \`email\`, \`phone\`, \`gstin\`, \`address\`) VALUES (\n`;
      sql += `  '${s._id}', '${s.businessId}', '${esc(s.name)}', '${esc(s.contactPerson)}', '${esc(s.email)}', '${esc(s.phone)}', '${esc(s.gstin)}', '${esc(s.address)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 5. Products Table (Inventory)
    sql += `-- 5. Products (Inventory) Table\n`;
    sql += `CREATE TABLE \`products\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`sku\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100),\n`;
    sql += `  \`quantity\` INT DEFAULT 0,\n`;
    sql += `  \`unit\` VARCHAR(50) DEFAULT 'units',\n`;
    sql += `  \`purchase_price\` DECIMAL(12,2),\n`;
    sql += `  \`selling_price\` DECIMAL(12,2),\n`;
    sql += `  \`min_threshold\` INT DEFAULT 10,\n`;
    sql += `  \`supplier\` VARCHAR(255),\n`;
    sql += `  \`hsn_code\` VARCHAR(50),\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const products = await Product.find();
    for (const p of products) {
      sql += `INSERT INTO \`products\` (\`id\`, \`business_id\`, \`sku\`, \`name\`, \`category\`, \`quantity\`, \`unit\`, \`purchase_price\`, \`selling_price\`, \`min_threshold\`, \`supplier\`, \`hsn_code\`) VALUES (\n`;
      sql += `  '${p._id}', '${p.businessId}', '${esc(p.sku)}', '${esc(p.name)}', '${esc(p.category)}', ${p.quantity}, '${esc(p.unit)}', ${p.purchasePrice}, ${p.sellingPrice}, ${p.minThreshold}, '${esc(p.supplier)}', '${esc(p.hsnCode)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 6. Invoices Table & Invoice Items Table
    sql += `-- 6. Invoices Table\n`;
    sql += `CREATE TABLE \`invoices\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`invoice_number\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`customer_id\` VARCHAR(50),\n`;
    sql += `  \`issue_date\` DATE,\n`;
    sql += `  \`due_date\` DATE,\n`;
    sql += `  \`subtotal\` DECIMAL(12,2),\n`;
    sql += `  \`tax_total\` DECIMAL(12,2),\n`;
    sql += `  \`discount\` DECIMAL(12,2) DEFAULT 0,\n`;
    sql += `  \`total\` DECIMAL(12,2),\n`;
    sql += `  \`status\` ENUM('Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled') DEFAULT 'Sent',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE,\n`;
    sql += `  FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE SET NULL\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    sql += `CREATE TABLE \`invoice_items\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`invoice_id\` VARCHAR(50) NOT NULL,\n`;
    sql += `  \`product_id\` VARCHAR(50),\n`;
    sql += `  \`name\` VARCHAR(255),\n`;
    sql += `  \`quantity\` INT,\n`;
    sql += `  \`rate\` DECIMAL(12,2),\n`;
    sql += `  \`cgst\` DECIMAL(12,2),\n`;
    sql += `  \`sgst\` DECIMAL(12,2),\n`;
    sql += `  \`igst\` DECIMAL(12,2),\n`;
    sql += `  \`amount\` DECIMAL(12,2),\n`;
    sql += `  FOREIGN KEY (\`invoice_id\`) REFERENCES \`invoices\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const invoices = await Invoice.find();
    for (const inv of invoices) {
      sql += `INSERT INTO \`invoices\` (\`id\`, \`business_id\`, \`invoice_number\`, \`customer_id\`, \`issue_date\`, \`due_date\`, \`subtotal\`, \`tax_total\`, \`discount\`, \`total\`, \`status\`) VALUES (\n`;
      sql += `  '${inv._id}', '${inv.businessId}', '${esc(inv.invoiceNumber)}', '${inv.customerId}', ${fmtDateOnly(inv.issueDate)}, ${fmtDateOnly(inv.dueDate)}, ${inv.subtotal}, ${inv.taxTotal}, ${inv.discount || 0}, ${inv.total}, '${esc(inv.status)}'\n`;
      sql += `);\n`;

      for (const item of inv.items || []) {
        sql += `INSERT INTO \`invoice_items\` (\`id\`, \`invoice_id\`, \`product_id\`, \`name\`, \`quantity\`, \`rate\`, \`cgst\`, \`sgst\`, \`igst\`, \`amount\`) VALUES (\n`;
        sql += `  '${item._id}', '${inv._id}', '${item.productId}', '${esc(item.name)}', ${item.quantity}, ${item.rate}, ${item.cgst || 0}, ${item.sgst || 0}, ${item.igst || 0}, ${item.amount}\n`;
        sql += `);\n`;
      }
    }
    sql += `\n`;

    // 7. Expenses Table (Finance Ledger)
    sql += `-- 7. Expenses (Finance Ledger) Table\n`;
    sql += `CREATE TABLE \`expenses\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`amount\` DECIMAL(12,2) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100),\n`;
    sql += `  \`date\` DATE,\n`;
    sql += `  \`description\` TEXT,\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const expenses = await Expense.find();
    for (const exp of expenses) {
      sql += `INSERT INTO \`expenses\` (\`id\`, \`business_id\`, \`amount\`, \`category\`, \`date\`, \`description\`) VALUES (\n`;
      sql += `  '${exp._id}', '${exp.businessId}', ${exp.amount}, '${esc(exp.category)}', ${fmtDateOnly(exp.date)}, '${esc(exp.description)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 8. Orders Table
    sql += `-- 8. Orders Table\n`;
    sql += `CREATE TABLE \`orders\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`order_number\` VARCHAR(100) NOT NULL,\n`;
    sql += `  \`customer_id\` VARCHAR(50),\n`;
    sql += `  \`customer_name\` VARCHAR(255),\n`;
    sql += `  \`total_amount\` DECIMAL(12,2),\n`;
    sql += `  \`status\` VARCHAR(50),\n`;
    sql += `  \`payment_status\` VARCHAR(50),\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const orders = await Order.find();
    for (const o of orders) {
      sql += `INSERT INTO \`orders\` (\`id\`, \`business_id\`, \`order_number\`, \`customer_id\`, \`customer_name\`, \`total_amount\`, \`status\`, \`payment_status\`) VALUES (\n`;
      sql += `  '${o._id}', '${o.businessId}', '${esc(o.orderNumber)}', '${o.customerId}', '${esc(o.customerName)}', ${o.totalAmount}, '${esc(o.status)}', '${esc(o.paymentStatus)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 9. Support Tickets Table
    sql += `-- 9. Support Tickets Table\n`;
    sql += `CREATE TABLE \`tickets\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`description\` TEXT,\n`;
    sql += `  \`customer_name\` VARCHAR(255),\n`;
    sql += `  \`customer_email\` VARCHAR(255),\n`;
    sql += `  \`status\` ENUM('Open', 'In_Progress', 'Resolved', 'Closed') DEFAULT 'Open',\n`;
    sql += `  \`priority\` ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const tickets = await Ticket.find();
    for (const t of tickets) {
      sql += `INSERT INTO \`tickets\` (\`id\`, \`business_id\`, \`title\`, \`description\`, \`customer_name\`, \`customer_email\`, \`status\`, \`priority\`) VALUES (\n`;
      sql += `  '${t._id}', '${t.businessId}', '${esc(t.title)}', '${esc(t.description)}', '${esc(t.customerName)}', '${esc(t.customerEmail)}', '${esc(t.status)}', '${esc(t.priority)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 10. HR Employees Table
    sql += `-- 10. HR Employees Table\n`;
    sql += `CREATE TABLE \`hr_employees\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`email\` VARCHAR(255),\n`;
    sql += `  \`phone\` VARCHAR(50),\n`;
    sql += `  \`role\` VARCHAR(100),\n`;
    sql += `  \`department\` VARCHAR(100),\n`;
    sql += `  \`joining_date\` DATE,\n`;
    sql += `  \`salary\` DECIMAL(12,2),\n`;
    sql += `  \`attendance_days\` INT DEFAULT 26,\n`;
    sql += `  \`leave_balance\` INT DEFAULT 12,\n`;
    sql += `  \`status\` VARCHAR(50) DEFAULT 'Active',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const employees = await HREmployee.find();
    for (const emp of employees) {
      sql += `INSERT INTO \`hr_employees\` (\`id\`, \`business_id\`, \`name\`, \`email\`, \`phone\`, \`role\`, \`department\`, \`joining_date\`, \`salary\`, \`attendance_days\`, \`leave_balance\`, \`status\`) VALUES (\n`;
      sql += `  '${emp._id}', '${emp.businessId}', '${esc(emp.name)}', '${esc(emp.email)}', '${esc(emp.phone)}', '${esc(emp.role)}', '${esc(emp.department)}', ${fmtDateOnly(emp.joiningDate)}, ${emp.salary}, ${emp.attendanceDays}, ${emp.leaveBalance}, '${esc(emp.status)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 11. Documents Table (OCR Hub)
    sql += `-- 11. Documents Table (OCR Hub)\n`;
    sql += `CREATE TABLE \`documents\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`file_name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`file_path\` VARCHAR(255),\n`;
    sql += `  \`file_type\` VARCHAR(100),\n`;
    sql += `  \`extracted_text\` LONGTEXT,\n`;
    sql += `  \`summary\` TEXT,\n`;
    sql += `  \`status\` ENUM('Uploading', 'Processing', 'Completed', 'Failed') DEFAULT 'Completed',\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const documents = await Document.find();
    for (const d of documents) {
      sql += `INSERT INTO \`documents\` (\`id\`, \`business_id\`, \`file_name\`, \`file_path\`, \`file_type\`, \`extracted_text\`, \`summary\`, \`status\`) VALUES (\n`;
      sql += `  '${d._id}', '${d.businessId}', '${esc(d.fileName)}', '${esc(d.filePath)}', '${esc(d.fileType)}', '${esc(d.extractedText)}', '${esc(d.summary)}', '${esc(d.status)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 12. Schemes Table (Government Advisor)
    sql += `-- 12. Schemes Table (Government Advisor)\n`;
    sql += `CREATE TABLE \`schemes\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`ministry\` VARCHAR(255),\n`;
    sql += `  \`description\` TEXT,\n`;
    sql += `  \`eligibility_criteria\` TEXT,\n`;
    sql += `  \`benefits\` TEXT,\n`;
    sql += `  \`documents_required\` TEXT,\n`;
    sql += `  \`application_procedure\` TEXT,\n`;
    sql += `  \`official_link\` VARCHAR(255),\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const schemes = await Scheme.find();
    for (const sc of schemes) {
      const el = Array.isArray(sc.eligibilityCriteria) ? sc.eligibilityCriteria.join('; ') : sc.eligibilityCriteria;
      const doc = Array.isArray(sc.documentsRequired) ? sc.documentsRequired.join('; ') : sc.documentsRequired;
      sql += `INSERT INTO \`schemes\` (\`id\`, \`name\`, \`ministry\`, \`description\`, \`eligibility_criteria\`, \`benefits\`, \`documents_required\`, \`application_procedure\`, \`official_link\`) VALUES (\n`;
      sql += `  '${sc._id}', '${esc(sc.name)}', '${esc(sc.ministry)}', '${esc(sc.description)}', '${esc(el)}', '${esc(sc.benefits)}', '${esc(doc)}', '${esc(sc.applicationProcedure)}', '${esc(sc.officialLink)}'\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 13. System Notifications Table
    sql += `-- 13. System Notifications Table\n`;
    sql += `CREATE TABLE \`notifications\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`title\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`message\` TEXT,\n`;
    sql += `  \`type\` VARCHAR(50),\n`;
    sql += `  \`is_read\` TINYINT(1) DEFAULT 0,\n`;
    sql += `  \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const notifications = await Notification.find();
    for (const n of notifications) {
      sql += `INSERT INTO \`notifications\` (\`id\`, \`business_id\`, \`title\`, \`message\`, \`type\`, \`is_read\`) VALUES (\n`;
      sql += `  '${n._id}', '${n.businessId}', '${esc(n.title)}', '${esc(n.message)}', '${esc(n.type)}', ${n.read ? 1 : 0}\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    // 14. Mutual Funds & Portfolio Holdings Tables
    sql += `-- 14. Mutual Funds Table\n`;
    sql += `CREATE TABLE \`mutual_funds\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`scheme_code\` VARCHAR(50),\n`;
    sql += `  \`scheme_name\` VARCHAR(255) NOT NULL,\n`;
    sql += `  \`category\` VARCHAR(100),\n`;
    sql += `  \`nav\` DECIMAL(10,4),\n`;
    sql += `  \`one_year_return\` DECIMAL(6,2),\n`;
    sql += `  \`three_year_return\` DECIMAL(6,2),\n`;
    sql += `  \`five_year_return\` DECIMAL(6,2),\n`;
    sql += `  \`risk_level\` VARCHAR(50),\n`;
    sql += `  \`min_sip\` DECIMAL(10,2)\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    sql += `CREATE TABLE \`portfolio_holdings\` (\n`;
    sql += `  \`id\` VARCHAR(50) PRIMARY KEY,\n`;
    sql += `  \`business_id\` VARCHAR(50),\n`;
    sql += `  \`fund_id\` VARCHAR(50),\n`;
    sql += `  \`units\` DECIMAL(12,4),\n`;
    sql += `  \`invested_amount\` DECIMAL(12,2),\n`;
    sql += `  \`current_value\` DECIMAL(12,2),\n`;
    sql += `  \`purchase_date\` DATE,\n`;
    sql += `  FOREIGN KEY (\`business_id\`) REFERENCES \`businesses\`(\`id\`) ON DELETE CASCADE,\n`;
    sql += `  FOREIGN KEY (\`fund_id\`) REFERENCES \`mutual_funds\`(\`id\`) ON DELETE SET NULL\n`;
    sql += `) ENGINE=InnoDB;\n\n`;

    const funds = await MutualFund.find();
    for (const f of funds) {
      sql += `INSERT INTO \`mutual_funds\` (\`id\`, \`scheme_code\`, \`scheme_name\`, \`category\`, \`nav\`, \`one_year_return\`, \`three_year_return\`, \`five_year_return\`, \`risk_level\`, \`min_sip\`) VALUES (\n`;
      sql += `  '${f._id}', '${esc(f.schemeCode)}', '${esc(f.schemeName)}', '${esc(f.category)}', ${f.nav}, ${f.returns?.oneYear || 0}, ${f.returns?.threeYear || 0}, ${f.returns?.fiveYear || 0}, '${esc(f.riskLevel)}', ${f.minSip || 500}\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    const holdings = await PortfolioHolding.find();
    for (const h of holdings) {
      sql += `INSERT INTO \`portfolio_holdings\` (\`id\`, \`business_id\`, \`fund_id\`, \`units\`, \`invested_amount\`, \`current_value\`, \`purchase_date\`) VALUES (\n`;
      sql += `  '${h._id}', '${h.businessId}', '${h.fundId}', ${h.units}, ${h.investedAmount}, ${h.currentValue}, ${fmtDateOnly(h.purchaseDate)}\n`;
      sql += `);\n`;
    }
    sql += `\n`;

    sql += `-- ======================================================\n`;
    sql += `-- End of SQL Script - All 16 Tables Created and Populated\n`;
    sql += `-- ======================================================\n`;

    const outputPath = path.join(__dirname, '../../../schema_and_data.sql');
    fs.writeFileSync(outputPath, sql, 'utf8');
    console.log('✅ Generated schema_and_data.sql successfully at:', outputPath);

    process.exit(0);
  } catch (err) {
    console.error('Error generating SQL script:', err);
    process.exit(1);
  }
}

generateSQL();
