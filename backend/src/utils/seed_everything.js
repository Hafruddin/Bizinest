const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../../.env' });

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
const Chat = require('../models/Chat');

const seedEverything = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/enterprise_assistant';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected successfully.');

    // Clear existing Collections
    console.log('Clearing old collections...');
    await Promise.all([
      Business.deleteMany({}),
      User.deleteMany({}),
      Product.deleteMany({}),
      Customer.deleteMany({}),
      Supplier.deleteMany({}),
      Invoice.deleteMany({}),
      Expense.deleteMany({}),
      Order.deleteMany({}),
      Ticket.deleteMany({}),
      HREmployee.deleteMany({}),
      Document.deleteMany({}),
      Scheme.deleteMany({}),
      Notification.deleteMany({}),
      Chat.deleteMany({}),
    ]);

    // 1. Create Business
    console.log('Seeding Business Profile...');
    const business = await Business.create({
      name: 'Apex Dynamics Manufacturing Enterprises',
      gstin: '33AAAAA1234A1Z5',
      address: {
        street: 'Plot 45, Guindy Industrial Estate',
        city: 'Chennai',
        state: 'Tamil Nadu',
        zip: '600032',
        country: 'India',
      },
      industry: 'Industrial Equipment & Manufacturing',
      currency: 'INR',
    });

    // 2. Create User (Mock Clerk User for seamless demo login)
    console.log('Seeding Primary User...');
    const user = await User.create({
      clerkId: 'mock_clerk_user_123',
      email: 'admin@apexdynamics.in',
      firstName: 'Rajesh',
      lastName: 'Kumar',
      role: 'Business Owner',
      businessId: business._id,
    });

    // 3. Customers (8 Major Corporate Clients)
    console.log('Seeding Customers...');
    const customers = await Customer.insertMany([
      { businessId: business._id, name: 'Tata Motors Ltd', email: 'procurement@tatamotors.com', phone: '022-66658282', address: 'Mumbai, Maharashtra, India' },
      { businessId: business._id, name: 'Reliance Industries Ltd', email: 'purchasing@ril.com', phone: '022-44770000', address: 'Navi Mumbai, Maharashtra, India' },
      { businessId: business._id, name: 'L&T Construction', email: 'contact@lntecc.com', phone: '044-22526000', address: 'Chennai, Tamil Nadu, India' },
      { businessId: business._id, name: 'Godrej Enterprise', email: 'supply@godrej.com', phone: '022-67965656', address: 'Mumbai, Maharashtra, India' },
      { businessId: business._id, name: 'Ashok Leyland Ltd', email: 'vendor@ashokleyland.com', phone: '044-25301234', address: 'Chennai, Tamil Nadu, India' },
      { businessId: business._id, name: 'BHEL Heavy Electricals', email: 'materials@bhel.in', phone: '040-23182000', address: 'Hyderabad, Telangana, India' },
      { businessId: business._id, name: 'TVS Motor Company', email: 'purchase@tvsmotor.com', phone: '044-28332115', address: 'Hosur, Tamil Nadu, India' },
      { businessId: business._id, name: 'Titan Company Ltd', email: 'supplychain@titan.co.in', phone: '080-66609000', address: 'Bengaluru, Karnataka, India' },
    ]);

    // 4. Suppliers
    console.log('Seeding Suppliers...');
    const suppliers = await Supplier.insertMany([
      { businessId: business._id, name: 'JSW Steel Supply Corp', contactName: 'Suresh Raina', email: 'orders@jswsteel.com', phone: '022-42861000', address: 'Bellary, Karnataka' },
      { businessId: business._id, name: 'Hindalco Aluminum Ltd', contactName: 'Anil Agarwal', email: 'b2b@hindalco.adityabirla.com', phone: '022-66626666', address: 'Renukoot, UP' },
      { businessId: business._id, name: 'Polycab Electricals India', contactName: 'Vikram Singh', email: 'sales@polycab.com', phone: '022-24327074', address: 'Vadodara, Gujarat' },
      { businessId: business._id, name: 'Bosch Industrial Fasteners', contactName: 'Marcus Weber', email: 'info@boschfasteners.in', phone: '080-22992111', address: 'Bengaluru, Karnataka' },
      { businessId: business._id, name: 'Supreme Polymer Components', contactName: 'Ramesh Shah', email: 'support@supreme.co.in', phone: '022-40430000', address: 'Jalgaon, Maharashtra' },
    ]);

    // 5. Products (Inventory Items with real SKUs and Barcodes)
    console.log('Seeding Products (Inventory)...');
    const products = await Product.insertMany([
      { businessId: business._id, name: 'Heavy Duty Steel Roll', sku: 'STEEL-HD-001', barcode: '8901234567890', description: 'Industrial grade cold-rolled steel coils for heavy machinery.', category: 'Raw Materials', price: 32000, cost: 22000, quantity: 4, minStockThreshold: 10 },
      { businessId: business._id, name: 'Aluminum Sheeting XL', sku: 'ALUM-XL-002', barcode: '8901234567891', description: 'Extra-large high-tensile structural aluminum panels.', category: 'Raw Materials', price: 14500, cost: 9800, quantity: 18, minStockThreshold: 8 },
      { businessId: business._id, name: 'Precision Copper Wiring Coil', sku: 'COP-WIRE-003', barcode: '8901234567892', description: '99.9% pure insulated high-conductivity copper coils.', category: 'Electricals', price: 9200, cost: 6100, quantity: 7, minStockThreshold: 15 },
      { businessId: business._id, name: 'Commercial Synthetic Resin Adhesive', sku: 'ADH-COMM-004', barcode: '8901234567893', description: 'Multi-surface heavy bonding heat-resistant synthetic resin.', category: 'Chemicals', price: 4800, cost: 2900, quantity: 45, minStockThreshold: 20 },
      { businessId: business._id, name: 'Galvanized Industrial Anchor Bolts', sku: 'BOLT-IND-005', barcode: '8901234567894', description: 'High torque grade 8.8 carbon steel fasteners (Box of 500).', category: 'Fasteners', price: 1850, cost: 1100, quantity: 9, minStockThreshold: 25 },
      { businessId: business._id, name: 'Industrial Safety Helmet Set', sku: 'SAFE-HELM-006', barcode: '8901234567895', description: 'Impact-resistant reflective safety gears with chin belt (Pack of 10).', category: 'Safety Gear', price: 3400, cost: 2100, quantity: 30, minStockThreshold: 10 },
      { businessId: business._id, name: 'High-Pressure Hydraulic Valve', sku: 'HYD-VALV-007', barcode: '8901234567896', description: 'Stainless steel 350-bar fluid control hydraulic valve.', category: 'Machinery Components', price: 18500, cost: 12200, quantity: 12, minStockThreshold: 5 },
      { businessId: business._id, name: 'Planetary Gearbox Assembly', sku: 'GEAR-PLAN-008', barcode: '8901234567897', description: 'Heavy reduction torque transmission planetary gear system.', category: 'Machinery Components', price: 45000, cost: 31000, quantity: 3, minStockThreshold: 5 },
      { businessId: business._id, name: 'Double-Acting Pneumatic Cylinder', sku: 'PNEU-CYL-009', barcode: '8901234567898', description: 'Compact air cylinder for automated assembly line actuators.', category: 'Pneumatics', price: 7800, cost: 4900, quantity: 22, minStockThreshold: 10 },
      { businessId: business._id, name: 'Stainless Steel Fasteners Set', sku: 'SS-FAST-010', barcode: '8901234567899', description: 'Corrosion resistant SS 316 heavy marine grade bolt sets.', category: 'Fasteners', price: 2400, cost: 1500, quantity: 42, minStockThreshold: 15 },
      { businessId: business._id, name: 'Heavy Duty Servo Motor 5kW', sku: 'MTR-SERVO-011', barcode: '8901234567900', description: 'High torque brushless AC servo motor for CNC automation.', category: 'Electronics', price: 28500, cost: 19000, quantity: 6, minStockThreshold: 8 },
      { businessId: business._id, name: 'High Density Polyethylene Sheet', sku: 'HDPE-SHEET-012', barcode: '8901234567901', description: 'Wear resistant industrial HDPE polymer lining sheets.', category: 'Raw Materials', price: 6500, cost: 4200, quantity: 25, minStockThreshold: 10 },
      { businessId: business._id, name: 'Industrial Coolant Fluid 20L', sku: 'COOL-IND-013', barcode: '8901234567902', description: 'Synthetic water-soluble cutting fluid for machining.', category: 'Chemicals', price: 3900, cost: 2200, quantity: 14, minStockThreshold: 20 },
      { businessId: business._id, name: 'Air Compressor Pressure Regulator', sku: 'COMP-REG-014', barcode: '8901234567903', description: 'Pneumatic filter regulator lubricator unit with gauge.', category: 'Pneumatics', price: 5600, cost: 3400, quantity: 19, minStockThreshold: 10 },
      { businessId: business._id, name: 'Carbon Steel Flange 150mm', sku: 'FLG-CARB-015', barcode: '8901234567904', description: 'High temperature forged carbon steel pipe flange.', category: 'Machinery Components', price: 8200, cost: 5100, quantity: 35, minStockThreshold: 15 },
      { businessId: business._id, name: 'Insulated Electrical Glove Set', sku: 'SAFE-GLOV-016', barcode: '8901234567905', description: 'Class 2 high-voltage electrical safety rubber gloves.', category: 'Safety Gear', price: 1450, cost: 850, quantity: 50, minStockThreshold: 15 },
      { businessId: business._id, name: 'Digital Caliper & Micrometer Kit', sku: 'TOOL-CALIP-017', barcode: '8901234567906', description: 'Precision electronic measuring instrument set (0-150mm).', category: 'Testing & Tools', price: 6800, cost: 4100, quantity: 11, minStockThreshold: 5 },
      { businessId: business._id, name: 'Automatic Welder Nozzle Tip Set', sku: 'WELD-NOZ-018', barcode: '8901234567907', description: 'MIG welding contact copper tips (Pack of 50).', category: 'Fasteners', price: 3100, cost: 1800, quantity: 3, minStockThreshold: 12 },
    ]);

    // Helper date generator for 3-month timeline
    const now = new Date('2026-08-28T09:30:00.000Z');
    const getDateMonthsAgo = (monthsAgo, day) => {
      return new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);
    };

    // 6. Invoices (19+ Invoices Spanning May, June, July, August 2026)
    console.log('Seeding Invoices (3+ Months History)...');
    const invoicesData = [
      // May 2026
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0501',
        customerId: customers[0]._id, // Tata Motors
        issueDate: getDateMonthsAgo(3, 8),
        dueDate: getDateMonthsAgo(3, 22),
        status: 'Paid',
        items: [
          { productId: products[0]._id, name: products[0].name, quantity: 4, rate: 32000, cgst: 11520, sgst: 11520, amount: 128000 + 23040 },
          { productId: products[4]._id, name: products[4].name, quantity: 10, rate: 1850, cgst: 1665, sgst: 1665, amount: 18500 + 3330 }
        ],
        subtotal: 146500, taxTotal: 26370, discount: 2500, total: 170370,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0502',
        customerId: customers[2]._id, // L&T
        issueDate: getDateMonthsAgo(3, 19),
        dueDate: getDateMonthsAgo(3, 30),
        status: 'Paid',
        items: [
          { productId: products[1]._id, name: products[1].name, quantity: 15, rate: 14500, cgst: 19575, sgst: 19575, amount: 217500 + 39150 }
        ],
        subtotal: 217500, taxTotal: 39150, discount: 5000, total: 251650,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0503',
        customerId: customers[4]._id, // Ashok Leyland
        issueDate: getDateMonthsAgo(3, 25),
        dueDate: getDateMonthsAgo(2, 8),
        status: 'Paid',
        items: [
          { productId: products[10]._id, name: products[10].name, quantity: 4, rate: 28500, cgst: 10260, sgst: 10260, amount: 114000 + 20520 },
          { productId: products[13]._id, name: products[13].name, quantity: 2, rate: 5600, cgst: 1008, sgst: 1008, amount: 11200 + 2016 }
        ],
        subtotal: 125200, taxTotal: 22536, discount: 2500, total: 145236,
      },
      // June 2026
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0601',
        customerId: customers[1]._id, // Reliance
        issueDate: getDateMonthsAgo(2, 5),
        dueDate: getDateMonthsAgo(2, 20),
        status: 'Paid',
        items: [
          { productId: products[6]._id, name: products[6].name, quantity: 8, rate: 18500, cgst: 13320, sgst: 13320, amount: 148000 + 26640 },
          { productId: products[7]._id, name: products[7].name, quantity: 2, rate: 45000, cgst: 8100, sgst: 8100, amount: 90000 + 16200 }
        ],
        subtotal: 238000, taxTotal: 42840, discount: 0, total: 280840,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0602',
        customerId: customers[3]._id, // Godrej
        issueDate: getDateMonthsAgo(2, 17),
        dueDate: getDateMonthsAgo(2, 30),
        status: 'Paid',
        items: [
          { productId: products[2]._id, name: products[2].name, quantity: 12, rate: 9200, cgst: 9936, sgst: 9936, amount: 110400 + 19872 }
        ],
        subtotal: 110400, taxTotal: 19872, discount: 2000, total: 128272,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0603',
        customerId: customers[4]._id, // Ashok Leyland
        issueDate: getDateMonthsAgo(2, 25),
        dueDate: getDateMonthsAgo(1, 10),
        status: 'Paid',
        items: [
          { productId: products[0]._id, name: products[0].name, quantity: 5, rate: 32000, cgst: 14400, sgst: 14400, amount: 160000 + 28800 }
        ],
        subtotal: 160000, taxTotal: 28800, discount: 0, total: 188800,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0604',
        customerId: customers[7]._id, // Titan
        issueDate: getDateMonthsAgo(2, 28),
        dueDate: getDateMonthsAgo(1, 12),
        status: 'Paid',
        items: [
          { productId: products[16]._id, name: products[16].name, quantity: 12, rate: 6800, cgst: 7344, sgst: 7344, amount: 81600 + 14688 }
        ],
        subtotal: 81600, taxTotal: 14688, discount: 1500, total: 94788,
      },
      // July 2026
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0701',
        customerId: customers[5]._id, // BHEL
        issueDate: getDateMonthsAgo(1, 4),
        dueDate: getDateMonthsAgo(1, 18),
        status: 'Paid',
        items: [
          { productId: products[7]._id, name: products[7].name, quantity: 4, rate: 45000, cgst: 16200, sgst: 16200, amount: 180000 + 32400 }
        ],
        subtotal: 180000, taxTotal: 32400, discount: 0, total: 212400,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0702',
        customerId: customers[6]._id, // TVS Motors
        issueDate: getDateMonthsAgo(1, 15),
        dueDate: getDateMonthsAgo(1, 30),
        status: 'Paid',
        items: [
          { productId: products[8]._id, name: products[8].name, quantity: 15, rate: 7800, cgst: 10530, sgst: 10530, amount: 117000 + 21060 }
        ],
        subtotal: 117000, taxTotal: 21060, discount: 3000, total: 135120,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0703',
        customerId: customers[0]._id, // Tata Motors (OVERDUE)
        issueDate: getDateMonthsAgo(1, 10),
        dueDate: getDateMonthsAgo(1, 24),
        status: 'Overdue',
        items: [
          { productId: products[2]._id, name: products[2].name, quantity: 10, rate: 9200, cgst: 8280, sgst: 8280, amount: 92000 + 16560 }
        ],
        subtotal: 92000, taxTotal: 16560, discount: 0, total: 108560,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0704',
        customerId: customers[3]._id, // Godrej (OVERDUE)
        issueDate: getDateMonthsAgo(1, 20),
        dueDate: getDateMonthsAgo(0, 3),
        status: 'Overdue',
        items: [
          { productId: products[14]._id, name: products[14].name, quantity: 15, rate: 8200, cgst: 11070, sgst: 11070, amount: 123000 + 22140 },
          { productId: products[11]._id, name: products[11].name, quantity: 4, rate: 6500, cgst: 2340, sgst: 2340, amount: 26000 + 4680 }
        ],
        subtotal: 149000, taxTotal: 26820, discount: 0, total: 175820,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0705',
        customerId: customers[1]._id, // Reliance
        issueDate: getDateMonthsAgo(1, 27),
        dueDate: getDateMonthsAgo(0, 10),
        status: 'Paid',
        items: [
          { productId: products[0]._id, name: products[0].name, quantity: 8, rate: 32000, cgst: 23040, sgst: 23040, amount: 256000 + 46080 }
        ],
        subtotal: 256000, taxTotal: 46080, discount: 5000, total: 297080,
      },
      // August 2026 (Current Month)
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0801',
        customerId: customers[7]._id, // Titan Company
        issueDate: getDateMonthsAgo(0, 3),
        dueDate: getDateMonthsAgo(0, 18),
        status: 'Sent',
        items: [
          { productId: products[1]._id, name: products[1].name, quantity: 10, rate: 14500, cgst: 13050, sgst: 13050, amount: 145000 + 26100 }
        ],
        subtotal: 145000, taxTotal: 26100, discount: 0, total: 171100,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0802',
        customerId: customers[1]._id, // Reliance
        issueDate: getDateMonthsAgo(0, 12),
        dueDate: getDateMonthsAgo(0, 26),
        status: 'Paid',
        items: [
          { productId: products[0]._id, name: products[0].name, quantity: 6, rate: 32000, cgst: 17280, sgst: 17280, amount: 192000 + 34560 }
        ],
        subtotal: 192000, taxTotal: 34560, discount: 4000, total: 222560,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0803',
        customerId: customers[3]._id, // Godrej
        issueDate: getDateMonthsAgo(0, 20),
        dueDate: new Date('2026-09-04T00:00:00.000Z'),
        status: 'Sent',
        items: [
          { productId: products[6]._id, name: products[6].name, quantity: 5, rate: 18500, cgst: 8325, sgst: 8325, amount: 92500 + 16650 }
        ],
        subtotal: 92500, taxTotal: 16650, discount: 0, total: 109150,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0804',
        customerId: customers[2]._id, // L&T
        issueDate: getDateMonthsAgo(0, 22),
        dueDate: new Date('2026-09-06T00:00:00.000Z'),
        status: 'Sent',
        items: [
          { productId: products[10]._id, name: products[10].name, quantity: 6, rate: 28500, cgst: 15390, sgst: 15390, amount: 171000 + 30780 },
          { productId: products[14]._id, name: products[14].name, quantity: 5, rate: 8200, cgst: 3690, sgst: 3690, amount: 41000 + 7380 }
        ],
        subtotal: 212000, taxTotal: 38160, discount: 3000, total: 247160,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0805',
        customerId: customers[5]._id, // BHEL
        issueDate: getDateMonthsAgo(0, 24),
        dueDate: new Date('2026-09-08T00:00:00.000Z'),
        status: 'Paid',
        items: [
          { productId: products[7]._id, name: products[7].name, quantity: 3, rate: 45000, cgst: 12150, sgst: 12150, amount: 135000 + 24300 }
        ],
        subtotal: 135000, taxTotal: 24300, discount: 0, total: 159300,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0806',
        customerId: customers[6]._id, // TVS
        issueDate: getDateMonthsAgo(0, 26),
        dueDate: new Date('2026-09-10T00:00:00.000Z'),
        status: 'Sent',
        items: [
          { productId: products[12]._id, name: products[12].name, quantity: 20, rate: 3900, cgst: 7020, sgst: 7020, amount: 78000 + 14040 },
          { productId: products[15]._id, name: products[15].name, quantity: 15, rate: 1450, cgst: 1957.5, sgst: 1957.5, amount: 21750 + 3915 }
        ],
        subtotal: 99750, taxTotal: 17955, discount: 1000, total: 116705,
      },
      {
        businessId: business._id,
        invoiceNumber: 'INV-2026-0807',
        customerId: customers[0]._id, // Tata Motors
        issueDate: getDateMonthsAgo(0, 27),
        dueDate: new Date('2026-09-12T00:00:00.000Z'),
        status: 'Draft',
        items: [
          { productId: products[9]._id, name: products[9].name, quantity: 25, rate: 2400, cgst: 5400, sgst: 5400, amount: 60000 + 10800 }
        ],
        subtotal: 60000, taxTotal: 10800, discount: 0, total: 70800,
      },
    ];
    await Invoice.insertMany(invoicesData);


    // 7. Expenses (25+ Expenses Across May, June, July, August 2026)
    console.log('Seeding Expenses (Cashflow History)...');
    const expensesData = [
      // May 2026
      { businessId: business._id, amount: 45000, category: 'Rent', date: getDateMonthsAgo(3, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId: business._id, amount: 18500, category: 'Utilities', date: getDateMonthsAgo(3, 5), description: 'TNEB Industrial High-Tension Electricity Bill' },
      { businessId: business._id, amount: 88000, category: 'Inventory', date: getDateMonthsAgo(3, 10), description: 'JSW Steel Coil Bulk Purchase' },
      { businessId: business._id, amount: 125000, category: 'Payroll', date: getDateMonthsAgo(3, 28), description: 'May Staff & Factory Workers Salary Disbursement' },
      { businessId: business._id, amount: 6500, category: 'Others', date: getDateMonthsAgo(3, 14), description: 'CNC Lathe Machine Service & Calibration' },

      // June 2026
      { businessId: business._id, amount: 45000, category: 'Rent', date: getDateMonthsAgo(2, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId: business._id, amount: 21200, category: 'Utilities', date: getDateMonthsAgo(2, 4), description: 'TNEB Industrial Electricity Bill' },
      { businessId: business._id, amount: 142000, category: 'Inventory', date: getDateMonthsAgo(2, 12), description: 'Hindalco Aluminum Panels Inward Shipment' },
      { businessId: business._id, amount: 128000, category: 'Payroll', date: getDateMonthsAgo(2, 29), description: 'June Staff & Factory Workers Salary' },
      { businessId: business._id, amount: 14500, category: 'Others', date: getDateMonthsAgo(2, 22), description: 'Inter-state Freight Carrier Charges to Mumbai' },

      // July 2026
      { businessId: business._id, amount: 45000, category: 'Rent', date: getDateMonthsAgo(1, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId: business._id, amount: 19800, category: 'Utilities', date: getDateMonthsAgo(1, 5), description: 'TNEB Industrial Power Bill' },
      { businessId: business._id, amount: 76000, category: 'Inventory', date: getDateMonthsAgo(1, 15), description: 'Polycab Copper Wiring Wire Consignment' },
      { businessId: business._id, amount: 132000, category: 'Payroll', date: getDateMonthsAgo(1, 30), description: 'July Staff & Factory Workers Salary' },
      { businessId: business._id, amount: 9500, category: 'Others', date: getDateMonthsAgo(1, 10), description: 'Cloud ERP & AI Business Suite Subscription' },
      { businessId: business._id, amount: 16000, category: 'Marketing', date: getDateMonthsAgo(1, 18), description: 'B2B Industrial Trade Expo Stall Booking' },

      // August 2026 (Current)
      { businessId: business._id, amount: 45000, category: 'Rent', date: getDateMonthsAgo(0, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId: business._id, amount: 17900, category: 'Utilities', date: getDateMonthsAgo(0, 5), description: 'TNEB Industrial Power Bill' },
      { businessId: business._id, amount: 52000, category: 'Inventory', date: getDateMonthsAgo(0, 11), description: 'Fasteners & Resin Adhesive Stock Refill' },
      { businessId: business._id, amount: 135000, category: 'Payroll', date: getDateMonthsAgo(0, 26), description: 'August Factory Workers Salary' },
      { businessId: business._id, amount: 11200, category: 'Others', date: getDateMonthsAgo(0, 19), description: 'Local Transport & Dispatch Vans' },

    ];
    await Expense.insertMany(expensesData);

    // 8. Orders (Sales Orders)
    console.log('Seeding Orders...');
    await Order.insertMany([
      { businessId: business._id, orderNumber: 'ORD-8901', customerId: customers[0]._id, customerName: customers[0].name, items: [{ productName: 'Heavy Duty Steel Roll', quantity: 4, price: 32000 }], totalAmount: 128000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId: business._id, orderNumber: 'ORD-8902', customerId: customers[1]._id, customerName: customers[1].name, items: [{ productName: 'High-Pressure Hydraulic Valve', quantity: 8, price: 18500 }], totalAmount: 148000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId: business._id, orderNumber: 'ORD-8903', customerId: customers[2]._id, customerName: customers[2].name, items: [{ productName: 'Aluminum Sheeting XL', quantity: 15, price: 14500 }], totalAmount: 217500, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId: business._id, orderNumber: 'ORD-8904', customerId: customers[5]._id, customerName: customers[5].name, items: [{ productName: 'Planetary Gearbox Assembly', quantity: 4, price: 45000 }], totalAmount: 180000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId: business._id, orderNumber: 'ORD-8905', customerId: customers[7]._id, customerName: customers[7].name, items: [{ productName: 'Aluminum Sheeting XL', quantity: 10, price: 14500 }], totalAmount: 145000, status: 'Shipped', paymentStatus: 'Unpaid' },
      { businessId: business._id, orderNumber: 'ORD-8906', customerId: customers[3]._id, customerName: customers[3].name, items: [{ productName: 'High-Pressure Hydraulic Valve', quantity: 5, price: 18500 }], totalAmount: 92500, status: 'Processing', paymentStatus: 'Unpaid' },
    ]);

    // 9. Support Tickets
    console.log('Seeding Support Tickets...');
    await Ticket.insertMany([
      {
        businessId: business._id,
        title: 'GST E-Way Bill Generation Assistance',
        description: 'Need help attaching proper HSN codes for high-pressure hydraulic valve shipments exceeding ₹50,000 threshold.',
        customerName: 'Ashok Leyland Logistics Team',
        customerEmail: 'vendor@ashokleyland.com',
        status: 'Resolved',
        priority: 'High',
      },
      {
        businessId: business._id,
        title: 'Custom Low Stock Threshold Alert Setup',
        description: 'Requesting automated SMS and email alerts whenever steel rolls drop below 10 units threshold.',
        customerName: 'Rajesh Kumar (Internal)',
        customerEmail: 'admin@apexdynamics.in',
        status: 'Resolved',
        priority: 'Medium',
      },
      {
        businessId: business._id,
        title: 'PNEU-CYL-009 Specification Datasheet Request',
        description: 'Customer requesting ISO certification and 3D CAD step file for pneumatic cylinders.',
        customerName: 'TVS Motor Procurement',
        customerEmail: 'purchase@tvsmotor.com',
        status: 'In_Progress',
        priority: 'Medium',
      },
      {
        businessId: business._id,
        title: 'Payment Discrepancy Reconciliation for INV-2026-0703',
        description: 'Tata Motors procurement logged query regarding 2% TDS deduction on raw material invoice.',
        customerName: 'Tata Motors Accounts Payable',
        customerEmail: 'procurement@tatamotors.com',
        status: 'Open',
        priority: 'High',
      },
    ]);

    // 10. HR Employees
    console.log('Seeding HR Payroll & Employees...');
    await HREmployee.insertMany([
      { businessId: business._id, name: 'Arun Varma', email: 'arun@apexdynamics.in', phone: '9876543210', role: 'Factory Operations Manager', department: 'Operations', joiningDate: new Date('2024-01-15'), salary: 45000, attendanceDays: 26, leaveBalance: 8, status: 'Active' },
      { businessId: business._id, name: 'Deepa Sundaram', email: 'deepa@apexdynamics.in', phone: '9876543211', role: 'Senior Accountant & Tax Specialist', department: 'Finance', joiningDate: new Date('2024-03-01'), salary: 38000, attendanceDays: 26, leaveBalance: 10, status: 'Active' },
      { businessId: business._id, name: 'Senthil Nathan', email: 'senthil@apexdynamics.in', phone: '9876543212', role: 'CNC Lead Machinist', department: 'Manufacturing', joiningDate: new Date('2024-06-10'), salary: 28000, attendanceDays: 25, leaveBalance: 6, status: 'Active' },
      { businessId: business._id, name: 'Karthik Subramanian', email: 'karthik@apexdynamics.in', phone: '9876543213', role: 'Inventory & Storekeeper', department: 'Logistics', joiningDate: new Date('2025-02-01'), salary: 22000, attendanceDays: 26, leaveBalance: 12, status: 'Active' },
      { businessId: business._id, name: 'Priya Dharshini', email: 'priya@apexdynamics.in', phone: '9876543214', role: 'Quality Control Inspector', department: 'Quality Assurance', joiningDate: new Date('2025-05-15'), salary: 26000, attendanceDays: 24, leaveBalance: 7, status: 'Active' },
    ]);

    // 11. Documents
    console.log('Seeding Scanned Documents & OCR Data...');
    await Document.insertMany([
      {
        businessId: business._id,
        fileName: 'raw_material_jsw_steel_purchase_july.pdf',
        filePath: '/uploads/raw_material_jsw_steel_purchase_july.pdf',
        fileType: 'application/pdf',
        status: 'Completed',
        summary: 'JSW Steel tax invoice for 8 tons of cold-rolled steel coils. Subtotal: ₹1,76,000, GST 18%: ₹31,680. Total: ₹2,07,680.',
        extractedText: 'TAX INVOICE \n JSW Steel Corp \n Invoice No: JSW/2026/9912 \n GSTIN: 29AAAAA0000A1Z1 \n Items: Cold Rolled Steel Coils \n Amount: 176000 \n Tax: 31680 \n Net Paid: 207680',
      },
      {
        businessId: business._id,
        fileName: 'tneb_industrial_power_bill_august.pdf',
        filePath: '/uploads/tneb_industrial_power_bill_august.pdf',
        fileType: 'application/pdf',
        status: 'Completed',
        summary: 'TNEB industrial high tension monthly electricity bill. Meter reading: 4,890 kWh. Total due: ₹17,900.',
        extractedText: 'TAMIL NADU GENERATION AND DISTRIBUTION CORP \n HT Consumer No: 04-902-1123 \n Tariff: Industrial HT-1 \n Consumption: 4890 units \n Total Payable: 17900 \n Payment Status: Paid via NEFT',
      },
      {
        businessId: business._id,
        fileName: 'msme_zed_certificate_2026.pdf',
        filePath: '/uploads/msme_zed_certificate_2026.pdf',
        fileType: 'application/pdf',
        status: 'Completed',
        summary: 'Zero Defect Zero Effect (ZED) Gold Certification awarded by Ministry of Micro, Small and Medium Enterprises, Govt of India.',
        extractedText: 'GOVERNMENT OF INDIA \n Ministry of Micro, Small and Medium Enterprises \n ZED Gold Rating Certificate \n Issued to: Apex Dynamics Manufacturing Enterprises \n Valid till: August 2029',
      },
    ]);

    // 12. Enterprise Government Schemes
    console.log('Seeding Enterprise Government Schemes...');
    await Scheme.insertMany([
      {
        name: 'PMEGP - Prime Minister Employment Generation Programme',
        ministry: 'Ministry of Micro, Small & Medium Enterprises',
        description: 'Credit-linked subsidy program aimed at generating self-employment opportunities through setting up of micro-enterprises.',
        eligibilityCriteria: ['Any individual above 18 years of age', 'No income ceiling for setting up projects', 'Self Help Groups & Registered Societies'],
        benefits: 'Margin money subsidy up to 35% of project cost for rural general/special categories, maximum project cost ₹50 Lakhs for manufacturing.',
        documentsRequired: ['Aadhaar Card', 'Project Report / Business Plan', 'Caste/Category Certificate', 'Educational Qualification Certificate'],
        applicationProcedure: 'Submit application online through KVIC PMEGP Portal (kviconline.gov.in) with detailed project profile.',
        officialLink: 'https://msme.gov.in/pmegp',
      },
      {
        name: 'CGTMSE - Credit Guarantee Fund Trust for Micro & Small Enterprises',
        ministry: 'Ministry of Micro, Small & Medium Enterprises & SIDBI',
        description: 'Provides collateral-free credit facility to new and existing small and medium enterprises.',
        eligibilityCriteria: ['New and existing Micro, Small and Medium Enterprises', 'Manufacturing and Service Sector units'],
        benefits: 'Collateral-free credit limit up to ₹5 Crore with guarantee cover up to 85% for micro-enterprises and women entrepreneurs.',
        documentsRequired: ['GST Registration Certificate', 'UDYAM Registration Certificate', 'Audited Financial Statements (Last 2 Years)', 'Bank Statement'],
        applicationProcedure: 'Apply directly through Member Lending Institutions (Scheduled Commercial Banks, RRBs, SIDBI).',
        officialLink: 'https://www.cgtmse.in',
      },
      {
        name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
        ministry: 'Ministry of Finance & Micro, Small & Medium Enterprises',
        description: 'Provides loans up to ₹10 Lakhs to non-corporate, non-farm small/micro enterprises.',
        eligibilityCriteria: ['Artisans, Small Manufacturers, Shopkeepers, Agri-allied businesses'],
        benefits: 'Three categories: Shishu (up to ₹50k), Kishor (₹50k to ₹5L), and Tarun (₹5L to ₹10L) with zero processing fees for Shishu/Kishor.',
        documentsRequired: ['Identity Proof', 'Address Proof', 'Business License / UDYAM', 'Quotation of Machinery / Items'],
        applicationProcedure: 'Apply through UdyamiMitra portal or visit any scheduled commercial bank or MFI.',
        officialLink: 'https://www.mudra.org.in',
      },
      {
        name: 'Enterprise ZED Certification Scheme (Zero Defect Zero Effect)',
        ministry: 'Ministry of Micro, Small & Medium Enterprises',
        description: 'Drives manufacturing excellence, quality enhancement, and eco-friendly sustainable practices among Enterprises.',
        eligibilityCriteria: ['All Enterprises registered on UDYAM Portal'],
        benefits: '80% subsidy for Micro, 60% for Small, and 50% for Medium enterprises on certification cost plus financial support for testing & clean energy.',
        documentsRequired: ['UDYAM Registration', 'Plant Layout', 'Quality Management System Documents'],
        applicationProcedure: 'Register on zed.msme.gov.in and complete self-assessment.',
        officialLink: 'https://zed.msme.gov.in',
      },
    ]);

    // 13. System Notifications
    console.log('Seeding Real-time System Notifications...');
    await Notification.insertMany([
      {
        businessId: business._id,
        userId: user._id,
        title: '⚠️ Low Stock Alert: Heavy Duty Steel Roll',
        message: 'Stock level for "Heavy Duty Steel Roll" is currently 4 units (Threshold: 10). Reorder recommended.',
        type: 'Stock_Alert',
        read: false,
      },
      {
        businessId: business._id,
        userId: user._id,
        title: '🚨 Overdue Invoice Warning: INV-2026-0703',
        message: 'Invoice INV-2026-0703 issued to Tata Motors for ₹1,08,560 is overdue by 34 days.',
        type: 'Invoice_Alert',
        read: false,
      },
      {
        businessId: business._id,
        userId: user._id,
        title: '📈 Quarterly Growth Insight',
        message: 'Your Q2 revenues grew by 18.5% compared to Q1. Top revenue driver: Industrial Steel & Hydraulic Assemblies.',
        type: 'AI_Alert',
        read: true,
      },
      {
        businessId: business._id,
        userId: user._id,
        title: '💰 Cashflow Positive Milestone',
        message: 'Net August Operating Margin is +34.2% with ₹5.95 Lakhs incoming collections.',
        type: 'Finance_Alert',
        read: true,
      },
    ]);

    // 14. AI Swarm Chat History
    console.log('Seeding AI Swarm Conversation History...');
    await Chat.create({
      businessId: business._id,
      userId: user._id,
      title: 'Q3 Financial & Inventory Optimization Plan',
      messages: [
        {
          role: 'user',
          content: 'Analyze our sales and inventory for the past 3 months and suggest cost-saving measures.',
          timestamp: getDateMonthsAgo(0, 10),
        },
        {
          role: 'model',
          content: 'Based on your 3-month transactions:\n1. **High Turnover Items**: Heavy Duty Steel Rolls & Aluminum Sheeting account for 62% of revenue. However, Steel Rolls are currently at 4 units (Low Stock).\n2. **Cashflow Health**: May-August gross collections total ₹17.65 Lakhs with an average gross margin of 34%.\n3. **Recommendation**: Re-negotiate bulk pricing with JSW Steel to reduce cost by 4-6% and claim 80% ZED Certification subsidy on quality testing.',
          timestamp: getDateMonthsAgo(0, 10),
        },
      ],
    });

    console.log('\n======================================================');
    console.log('✅ ALL 16 MONGO DB COLLECTIONS SEEDED SUCCESSFULLY!');
    console.log('Business: Apex Dynamics Manufacturing Enterprises');
    console.log('User: Rajesh Kumar (admin@apexdynamics.in)');
    console.log('Data Span: May 2026 - August 2026 (3-4 Months Historical Data)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during database seeding:', err);
    process.exit(1);
  }
};

seedEverything();
