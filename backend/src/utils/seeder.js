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

/**
 * Seeds rich historical demo data spanning the last 3-4 months for a given businessId across ALL 16 models.
 */
const seedBusinessDemoData = async (businessId, force = false) => {
  try {
    const productCount = await Product.countDocuments({ businessId });
    if (productCount > 0 && !force) {
      console.log(`Business ${businessId} already has data. Skipping demo seeder.`);
      return;
    }

    console.log(`Seeding 3-4 month rich demo data for business: ${businessId}...`);

    // Clear existing items for this business if force is true
    if (force) {
      await Promise.all([
        Product.deleteMany({ businessId }),
        Customer.deleteMany({ businessId }),
        Supplier.deleteMany({ businessId }),
        Invoice.deleteMany({ businessId }),
        Expense.deleteMany({ businessId }),
        Order.deleteMany({ businessId }),
        Ticket.deleteMany({ businessId }),
        HREmployee.deleteMany({ businessId }),
        Document.deleteMany({ businessId }),
        Notification.deleteMany({ businessId }),
        Chat.deleteMany({ businessId }),
      ]);
    }

    // 1. Seed Customers
    const customers = await Customer.insertMany([
      { businessId, name: 'Tata Motors Ltd', email: 'procurement@tatamotors.com', phone: '022-66658282', address: 'Mumbai, Maharashtra, India' },
      { businessId, name: 'Reliance Industries Ltd', email: 'purchasing@ril.com', phone: '022-44770000', address: 'Navi Mumbai, Maharashtra, India' },
      { businessId, name: 'L&T Construction', email: 'contact@lntecc.com', phone: '044-22526000', address: 'Chennai, Tamil Nadu, India' },
      { businessId, name: 'Godrej Enterprise', email: 'supply@godrej.com', phone: '022-67965656', address: 'Mumbai, Maharashtra, India' },
      { businessId, name: 'Ashok Leyland Ltd', email: 'vendor@ashokleyland.com', phone: '044-25301234', address: 'Chennai, Tamil Nadu, India' },
      { businessId, name: 'BHEL Heavy Electricals', email: 'materials@bhel.in', phone: '040-23182000', address: 'Hyderabad, Telangana, India' },
      { businessId, name: 'TVS Motor Company', email: 'purchase@tvsmotor.com', phone: '044-28332115', address: 'Hosur, Tamil Nadu, India' },
      { businessId, name: 'Titan Company Ltd', email: 'supplychain@titan.co.in', phone: '080-66609000', address: 'Bengaluru, Karnataka, India' },
    ]);

    // 2. Seed Suppliers
    const suppliers = await Supplier.insertMany([
      { businessId, name: 'JSW Steel Supply Corp', contactName: 'Suresh Raina', email: 'orders@jswsteel.com', phone: '022-42861000', address: 'Bellary, Karnataka' },
      { businessId, name: 'Hindalco Aluminum Ltd', contactName: 'Anil Agarwal', email: 'b2b@hindalco.adityabirla.com', phone: '022-66626666', address: 'Renukoot, UP' },
      { businessId, name: 'Polycab Electricals India', contactName: 'Vikram Singh', email: 'sales@polycab.com', phone: '022-24327074', address: 'Vadodara, Gujarat' },
      { businessId, name: 'Bosch Industrial Fasteners', contactName: 'Marcus Weber', email: 'info@boschfasteners.in', phone: '080-22992111', address: 'Bengaluru, Karnataka' },
      { businessId, name: 'Supreme Polymer Components', contactName: 'Ramesh Shah', email: 'support@supreme.co.in', phone: '022-40430000', address: 'Jalgaon, Maharashtra' },
    ]);

    // 3. Seed Products (18 Inventory SKUs)
    const products = await Product.insertMany([
      { businessId, name: 'Heavy Duty Steel Roll', sku: 'STEEL-HD-001', barcode: '8901234567890', description: 'Industrial grade cold-rolled steel coils for heavy machinery.', category: 'Raw Materials', price: 32000, cost: 22000, quantity: 4, minStockThreshold: 10, supplierId: suppliers[0]._id },
      { businessId, name: 'Aluminum Sheeting XL', sku: 'ALUM-XL-002', barcode: '8901234567891', description: 'Extra-large high-tensile structural aluminum panels.', category: 'Raw Materials', price: 14500, cost: 9800, quantity: 18, minStockThreshold: 8, supplierId: suppliers[1]._id },
      { businessId, name: 'Precision Copper Wiring Coil', sku: 'COP-WIRE-003', barcode: '8901234567892', description: '99.9% pure insulated high-conductivity copper coils.', category: 'Electricals', price: 9200, cost: 6100, quantity: 7, minStockThreshold: 15, supplierId: suppliers[2]._id },
      { businessId, name: 'Commercial Synthetic Resin Adhesive', sku: 'ADH-COMM-004', barcode: '8901234567893', description: 'Multi-surface heavy bonding heat-resistant synthetic resin.', category: 'Chemicals', price: 4800, cost: 2900, quantity: 45, minStockThreshold: 20, supplierId: suppliers[4]._id },
      { businessId, name: 'Galvanized Industrial Anchor Bolts', sku: 'BOLT-IND-005', barcode: '8901234567894', description: 'High torque grade 8.8 carbon steel fasteners (Box of 500).', category: 'Fasteners', price: 1850, cost: 1100, quantity: 9, minStockThreshold: 25, supplierId: suppliers[3]._id },
      { businessId, name: 'Industrial Safety Helmet Set', sku: 'SAFE-HELM-006', barcode: '8901234567895', description: 'Impact-resistant reflective safety gears with chin belt (Pack of 10).', category: 'Safety Gear', price: 3400, cost: 2100, quantity: 30, minStockThreshold: 10 },
      { businessId, name: 'High-Pressure Hydraulic Valve', sku: 'HYD-VALV-007', barcode: '8901234567896', description: 'Stainless steel 350-bar fluid control hydraulic valve.', category: 'Machinery Components', price: 18500, cost: 12200, quantity: 12, minStockThreshold: 5 },
      { businessId, name: 'Planetary Gearbox Assembly', sku: 'GEAR-PLAN-008', barcode: '8901234567897', description: 'Heavy reduction torque transmission planetary gear system.', category: 'Machinery Components', price: 45000, cost: 31000, quantity: 3, minStockThreshold: 5 },
      { businessId, name: 'Double-Acting Pneumatic Cylinder', sku: 'PNEU-CYL-009', barcode: '8901234567898', description: 'Compact air cylinder for automated assembly line actuators.', category: 'Pneumatics', price: 7800, cost: 4900, quantity: 22, minStockThreshold: 10 },
      { businessId, name: 'Stainless Steel Fasteners Set', sku: 'SS-FAST-010', barcode: '8901234567899', description: 'Corrosion resistant SS 316 heavy marine grade bolt sets.', category: 'Fasteners', price: 2400, cost: 1500, quantity: 42, minStockThreshold: 15 },
      { businessId, name: 'Heavy Duty Servo Motor 5kW', sku: 'MTR-SERVO-011', barcode: '8901234567900', description: 'High torque brushless AC servo motor for CNC automation.', category: 'Electronics', price: 28500, cost: 19000, quantity: 6, minStockThreshold: 8 },
      { businessId, name: 'High Density Polyethylene Sheet', sku: 'HDPE-SHEET-012', barcode: '8901234567901', description: 'Wear resistant industrial HDPE polymer lining sheets.', category: 'Raw Materials', price: 6500, cost: 4200, quantity: 25, minStockThreshold: 10 },
      { businessId, name: 'Industrial Coolant Fluid 20L', sku: 'COOL-IND-013', barcode: '8901234567902', description: 'Synthetic water-soluble cutting fluid for machining.', category: 'Chemicals', price: 3900, cost: 2200, quantity: 14, minStockThreshold: 20 },
      { businessId, name: 'Air Compressor Pressure Regulator', sku: 'COMP-REG-014', barcode: '8901234567903', description: 'Pneumatic filter regulator lubricator unit with gauge.', category: 'Pneumatics', price: 5600, cost: 3400, quantity: 19, minStockThreshold: 10 },
      { businessId, name: 'Carbon Steel Flange 150mm', sku: 'FLG-CARB-015', barcode: '8901234567904', description: 'High temperature forged carbon steel pipe flange.', category: 'Machinery Components', price: 8200, cost: 5100, quantity: 35, minStockThreshold: 15 },
      { businessId, name: 'Insulated Electrical Glove Set', sku: 'SAFE-GLOV-016', barcode: '8901234567905', description: 'Class 2 high-voltage electrical safety rubber gloves.', category: 'Safety Gear', price: 1450, cost: 850, quantity: 50, minStockThreshold: 15 },
      { businessId, name: 'Digital Caliper & Micrometer Kit', sku: 'TOOL-CALIP-017', barcode: '8901234567906', description: 'Precision electronic measuring instrument set (0-150mm).', category: 'Testing & Tools', price: 6800, cost: 4100, quantity: 11, minStockThreshold: 5 },
      { businessId, name: 'Automatic Welder Nozzle Tip Set', sku: 'WELD-NOZ-018', barcode: '8901234567907', description: 'MIG welding contact copper tips (Pack of 50).', category: 'Fasteners', price: 3100, cost: 1800, quantity: 3, minStockThreshold: 12 },
    ]);

    const now = new Date('2026-08-28T09:30:00.000Z');
    const getDateMonthsAgo = (monthsAgo, day) => new Date(now.getFullYear(), now.getMonth() - monthsAgo, day);

    // 4. Seed Invoices (19 Bills spanning 4 months)
    await Invoice.insertMany([
      {
        businessId, invoiceNumber: 'INV-2026-0501', customerId: customers[0]._id, issueDate: getDateMonthsAgo(3, 8), dueDate: getDateMonthsAgo(3, 22), status: 'Paid',
        items: [{ productId: products[0]._id, name: products[0].name, quantity: 4, rate: 32000, cgst: 11520, sgst: 11520, amount: 151040 }],
        subtotal: 128000, taxTotal: 23040, discount: 0, total: 151040,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0502', customerId: customers[2]._id, issueDate: getDateMonthsAgo(3, 19), dueDate: getDateMonthsAgo(3, 30), status: 'Paid',
        items: [{ productId: products[1]._id, name: products[1].name, quantity: 15, rate: 14500, cgst: 19575, sgst: 19575, amount: 256650 }],
        subtotal: 217500, taxTotal: 39150, discount: 0, total: 256650,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0503', customerId: customers[4]._id, issueDate: getDateMonthsAgo(3, 25), dueDate: getDateMonthsAgo(2, 8), status: 'Paid',
        items: [{ productId: products[10]._id, name: products[10].name, quantity: 4, rate: 28500, cgst: 10260, sgst: 10260, amount: 134520 }],
        subtotal: 114000, taxTotal: 20520, discount: 0, total: 134520,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0601', customerId: customers[1]._id, issueDate: getDateMonthsAgo(2, 5), dueDate: getDateMonthsAgo(2, 20), status: 'Paid',
        items: [{ productId: products[6]._id, name: products[6].name, quantity: 8, rate: 18500, cgst: 13320, sgst: 13320, amount: 174640 }],
        subtotal: 148000, taxTotal: 26640, discount: 0, total: 174640,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0602', customerId: customers[3]._id, issueDate: getDateMonthsAgo(2, 17), dueDate: getDateMonthsAgo(2, 30), status: 'Paid',
        items: [{ productId: products[2]._id, name: products[2].name, quantity: 12, rate: 9200, cgst: 9936, sgst: 9936, amount: 130272 }],
        subtotal: 110400, taxTotal: 19872, discount: 0, total: 130272,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0603', customerId: customers[4]._id, issueDate: getDateMonthsAgo(2, 25), dueDate: getDateMonthsAgo(1, 10), status: 'Paid',
        items: [{ productId: products[0]._id, name: products[0].name, quantity: 5, rate: 32000, cgst: 14400, sgst: 14400, amount: 188800 }],
        subtotal: 160000, taxTotal: 28800, discount: 0, total: 188800,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0604', customerId: customers[7]._id, issueDate: getDateMonthsAgo(2, 28), dueDate: getDateMonthsAgo(1, 12), status: 'Paid',
        items: [{ productId: products[16]._id, name: products[16].name, quantity: 12, rate: 6800, cgst: 7344, sgst: 7344, amount: 96288 }],
        subtotal: 81600, taxTotal: 14688, discount: 0, total: 96288,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0701', customerId: customers[5]._id, issueDate: getDateMonthsAgo(1, 4), dueDate: getDateMonthsAgo(1, 18), status: 'Paid',
        items: [{ productId: products[7]._id, name: products[7].name, quantity: 4, rate: 45000, cgst: 16200, sgst: 16200, amount: 212400 }],
        subtotal: 180000, taxTotal: 32400, discount: 0, total: 212400,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0702', customerId: customers[6]._id, issueDate: getDateMonthsAgo(1, 15), dueDate: getDateMonthsAgo(1, 30), status: 'Paid',
        items: [{ productId: products[8]._id, name: products[8].name, quantity: 15, rate: 7800, cgst: 10530, sgst: 10530, amount: 138060 }],
        subtotal: 117000, taxTotal: 21060, discount: 0, total: 138060,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0703', customerId: customers[0]._id, issueDate: getDateMonthsAgo(1, 10), dueDate: getDateMonthsAgo(1, 24), status: 'Overdue',
        items: [{ productId: products[2]._id, name: products[2].name, quantity: 10, rate: 9200, cgst: 8280, sgst: 8280, amount: 108560 }],
        subtotal: 92000, taxTotal: 16560, discount: 0, total: 108560,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0704', customerId: customers[3]._id, issueDate: getDateMonthsAgo(1, 20), dueDate: getDateMonthsAgo(0, 3), status: 'Overdue',
        items: [{ productId: products[14]._id, name: products[14].name, quantity: 15, rate: 8200, cgst: 11070, sgst: 11070, amount: 145140 }],
        subtotal: 123000, taxTotal: 22140, discount: 0, total: 145140,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0705', customerId: customers[1]._id, issueDate: getDateMonthsAgo(1, 27), dueDate: getDateMonthsAgo(0, 10), status: 'Paid',
        items: [{ productId: products[0]._id, name: products[0].name, quantity: 8, rate: 32000, cgst: 23040, sgst: 23040, amount: 302080 }],
        subtotal: 256000, taxTotal: 46080, discount: 0, total: 302080,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0801', customerId: customers[7]._id, issueDate: getDateMonthsAgo(0, 3), dueDate: getDateMonthsAgo(0, 18), status: 'Sent',
        items: [{ productId: products[1]._id, name: products[1].name, quantity: 10, rate: 14500, cgst: 13050, sgst: 13050, amount: 171100 }],
        subtotal: 145000, taxTotal: 26100, discount: 0, total: 171100,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0802', customerId: customers[1]._id, issueDate: getDateMonthsAgo(0, 12), dueDate: getDateMonthsAgo(0, 26), status: 'Paid',
        items: [{ productId: products[0]._id, name: products[0].name, quantity: 6, rate: 32000, cgst: 17280, sgst: 17280, amount: 226560 }],
        subtotal: 192000, taxTotal: 34560, discount: 0, total: 226560,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0803', customerId: customers[3]._id, issueDate: getDateMonthsAgo(0, 20), dueDate: new Date('2026-09-04T00:00:00.000Z'), status: 'Sent',
        items: [{ productId: products[6]._id, name: products[6].name, quantity: 5, rate: 18500, cgst: 8325, sgst: 8325, amount: 109150 }],
        subtotal: 92500, taxTotal: 16650, discount: 0, total: 109150,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0804', customerId: customers[2]._id, issueDate: getDateMonthsAgo(0, 22), dueDate: new Date('2026-09-06T00:00:00.000Z'), status: 'Sent',
        items: [{ productId: products[10]._id, name: products[10].name, quantity: 6, rate: 28500, cgst: 15390, sgst: 15390, amount: 201780 }],
        subtotal: 171000, taxTotal: 30780, discount: 0, total: 201780,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0805', customerId: customers[5]._id, issueDate: getDateMonthsAgo(0, 24), dueDate: new Date('2026-09-08T00:00:00.000Z'), status: 'Paid',
        items: [{ productId: products[7]._id, name: products[7].name, quantity: 3, rate: 45000, cgst: 12150, sgst: 12150, amount: 159300 }],
        subtotal: 135000, taxTotal: 24300, discount: 0, total: 159300,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0806', customerId: customers[6]._id, issueDate: getDateMonthsAgo(0, 26), dueDate: new Date('2026-09-10T00:00:00.000Z'), status: 'Sent',
        items: [{ productId: products[12]._id, name: products[12].name, quantity: 20, rate: 3900, cgst: 7020, sgst: 7020, amount: 92040 }],
        subtotal: 78000, taxTotal: 14040, discount: 0, total: 92040,
      },
      {
        businessId, invoiceNumber: 'INV-2026-0807', customerId: customers[0]._id, issueDate: getDateMonthsAgo(0, 27), dueDate: new Date('2026-09-12T00:00:00.000Z'), status: 'Draft',
        items: [{ productId: products[9]._id, name: products[9].name, quantity: 25, rate: 2400, cgst: 5400, sgst: 5400, amount: 70800 }],
        subtotal: 60000, taxTotal: 10800, discount: 0, total: 70800,
      },
    ]);

    // 5. Seed Expenses
    await Expense.insertMany([
      { businessId, amount: 45000, category: 'Rent', date: getDateMonthsAgo(3, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId, amount: 18500, category: 'Utilities', date: getDateMonthsAgo(3, 5), description: 'TNEB Industrial High-Tension Electricity Bill' },
      { businessId, amount: 88000, category: 'Inventory', date: getDateMonthsAgo(3, 10), description: 'JSW Steel Coil Bulk Purchase' },
      { businessId, amount: 125000, category: 'Payroll', date: getDateMonthsAgo(3, 28), description: 'May Staff & Factory Workers Salary Disbursement' },
      { businessId, amount: 6500, category: 'Others', date: getDateMonthsAgo(3, 14), description: 'CNC Lathe Machine Service & Calibration' },
      { businessId, amount: 45000, category: 'Rent', date: getDateMonthsAgo(2, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId, amount: 21200, category: 'Utilities', date: getDateMonthsAgo(2, 4), description: 'TNEB Industrial Electricity Bill' },
      { businessId, amount: 142000, category: 'Inventory', date: getDateMonthsAgo(2, 12), description: 'Hindalco Aluminum Panels Inward Shipment' },
      { businessId, amount: 128000, category: 'Payroll', date: getDateMonthsAgo(2, 29), description: 'June Staff & Factory Workers Salary' },
      { businessId, amount: 14500, category: 'Others', date: getDateMonthsAgo(2, 22), description: 'Inter-state Freight Carrier Charges to Mumbai' },
      { businessId, amount: 45000, category: 'Rent', date: getDateMonthsAgo(1, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId, amount: 19800, category: 'Utilities', date: getDateMonthsAgo(1, 5), description: 'TNEB Industrial Power Bill' },
      { businessId, amount: 76000, category: 'Inventory', date: getDateMonthsAgo(1, 15), description: 'Polycab Copper Wiring Wire Consignment' },
      { businessId, amount: 132000, category: 'Payroll', date: getDateMonthsAgo(1, 30), description: 'July Staff & Factory Workers Salary' },
      { businessId, amount: 9500, category: 'Others', date: getDateMonthsAgo(1, 10), description: 'Cloud ERP & AI Business Suite Subscription' },
      { businessId, amount: 16000, category: 'Marketing', date: getDateMonthsAgo(1, 18), description: 'B2B Industrial Trade Expo Stall Booking' },
      { businessId, amount: 45000, category: 'Rent', date: getDateMonthsAgo(0, 1), description: 'Guindy Industrial Estate Unit Monthly Lease' },
      { businessId, amount: 17900, category: 'Utilities', date: getDateMonthsAgo(0, 5), description: 'TNEB Industrial Power Bill' },
      { businessId, amount: 52000, category: 'Inventory', date: getDateMonthsAgo(0, 11), description: 'Fasteners & Resin Adhesive Stock Refill' },
      { businessId, amount: 135000, category: 'Payroll', date: getDateMonthsAgo(0, 26), description: 'August Factory Workers Salary' },
      { businessId, amount: 11200, category: 'Others', date: getDateMonthsAgo(0, 19), description: 'Local Transport & Dispatch Vans' },
    ]);

    // 6. Seed Orders
    await Order.insertMany([
      { businessId, orderNumber: 'ORD-8901', customerId: customers[0]._id, customerName: customers[0].name, items: [{ productName: 'Heavy Duty Steel Roll', quantity: 4, price: 32000 }], totalAmount: 128000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId, orderNumber: 'ORD-8902', customerId: customers[1]._id, customerName: customers[1].name, items: [{ productName: 'High-Pressure Hydraulic Valve', quantity: 8, price: 18500 }], totalAmount: 148000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId, orderNumber: 'ORD-8903', customerId: customers[2]._id, customerName: customers[2].name, items: [{ productName: 'Aluminum Sheeting XL', quantity: 15, price: 14500 }], totalAmount: 217500, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId, orderNumber: 'ORD-8904', customerId: customers[5]._id, customerName: customers[5].name, items: [{ productName: 'Planetary Gearbox Assembly', quantity: 4, price: 45000 }], totalAmount: 180000, status: 'Delivered', paymentStatus: 'Paid' },
      { businessId, orderNumber: 'ORD-8905', customerId: customers[7]._id, customerName: customers[7].name, items: [{ productName: 'Aluminum Sheeting XL', quantity: 10, price: 14500 }], totalAmount: 145000, status: 'Shipped', paymentStatus: 'Unpaid' },
      { businessId, orderNumber: 'ORD-8906', customerId: customers[3]._id, customerName: customers[3].name, items: [{ productName: 'High-Pressure Hydraulic Valve', quantity: 5, price: 18500 }], totalAmount: 92500, status: 'Processing', paymentStatus: 'Unpaid' },
    ]);

    // 7. Seed Support Tickets
    await Ticket.insertMany([
      { businessId, title: 'GST E-Way Bill Generation Assistance', description: 'Need help attaching proper HSN codes for high-pressure hydraulic valve shipments exceeding ₹50,000 threshold.', customerName: 'Ashok Leyland Logistics Team', customerEmail: 'vendor@ashokleyland.com', status: 'Resolved', priority: 'High' },
      { businessId, title: 'Custom Low Stock Threshold Alert Setup', description: 'Requesting automated SMS and email alerts whenever steel rolls drop below 10 units threshold.', customerName: 'Internal Ops Team', customerEmail: 'admin@apexdynamics.in', status: 'Resolved', priority: 'Medium' },
      { businessId, title: 'PNEU-CYL-009 Specification Datasheet Request', description: 'Customer requesting ISO certification and 3D CAD step file for pneumatic cylinders.', customerName: 'TVS Motor Procurement', customerEmail: 'purchase@tvsmotor.com', status: 'In_Progress', priority: 'Medium' },
      { businessId, title: 'Payment Discrepancy Reconciliation for INV-2026-0703', description: 'Tata Motors procurement logged query regarding 2% TDS deduction on raw material invoice.', customerName: 'Tata Motors Accounts Payable', customerEmail: 'procurement@tatamotors.com', status: 'Open', priority: 'High' },
    ]);

    // 8. Seed HR Employees
    await HREmployee.insertMany([
      { businessId, name: 'Arun Varma', email: 'arun@apexdynamics.in', phone: '9876543210', role: 'Factory Operations Manager', department: 'Operations', joiningDate: new Date('2024-01-15'), salary: 45000, attendanceDays: 26, leaveBalance: 8, status: 'Active' },
      { businessId, name: 'Deepa Sundaram', email: 'deepa@apexdynamics.in', phone: '9876543211', role: 'Senior Accountant & Tax Specialist', department: 'Finance', joiningDate: new Date('2024-03-01'), salary: 38000, attendanceDays: 26, leaveBalance: 10, status: 'Active' },
      { businessId, name: 'Senthil Nathan', email: 'senthil@apexdynamics.in', phone: '9876543212', role: 'CNC Lead Machinist', department: 'Manufacturing', joiningDate: new Date('2024-06-10'), salary: 28000, attendanceDays: 25, leaveBalance: 6, status: 'Active' },
      { businessId, name: 'Karthik Subramanian', email: 'karthik@apexdynamics.in', phone: '9876543213', role: 'Inventory & Storekeeper', department: 'Logistics', joiningDate: new Date('2025-02-01'), salary: 22000, attendanceDays: 26, leaveBalance: 12, status: 'Active' },
      { businessId, name: 'Priya Dharshini', email: 'priya@apexdynamics.in', phone: '9876543214', role: 'Quality Control Inspector', department: 'Quality Assurance', joiningDate: new Date('2025-05-15'), salary: 26000, attendanceDays: 24, leaveBalance: 7, status: 'Active' },
    ]);

    // 9. Seed Documents
    await Document.insertMany([
      { businessId, fileName: 'raw_material_jsw_steel_purchase_july.pdf', filePath: '/uploads/raw_material_jsw_steel_purchase_july.pdf', fileType: 'application/pdf', status: 'Completed', summary: 'JSW Steel tax invoice for 8 tons of cold-rolled steel coils. Subtotal: ₹1,76,000, GST 18%: ₹31,680. Total: ₹2,07,680.', extractedText: 'TAX INVOICE \n JSW Steel Corp \n Invoice No: JSW/2026/9912 \n GSTIN: 29AAAAA0000A1Z1 \n Items: Cold Rolled Steel Coils \n Amount: 176000 \n Tax: 31680 \n Net Paid: 207680' },
      { businessId, fileName: 'tneb_industrial_power_bill_august.pdf', filePath: '/uploads/tneb_industrial_power_bill_august.pdf', fileType: 'application/pdf', status: 'Completed', summary: 'TNEB industrial high tension monthly electricity bill. Meter reading: 4,890 kWh. Total due: ₹17,900.', extractedText: 'TAMIL NADU GENERATION AND DISTRIBUTION CORP \n HT Consumer No: 04-902-1123 \n Tariff: Industrial HT-1 \n Consumption: 4890 units \n Total Payable: 17900 \n Payment Status: Paid via NEFT' },
      { businessId, fileName: 'msme_zed_certificate_2026.pdf', filePath: '/uploads/msme_zed_certificate_2026.pdf', fileType: 'application/pdf', status: 'Completed', summary: 'Zero Defect Zero Effect (ZED) Gold Certification awarded by Ministry of Micro, Small and Medium Enterprises, Govt of India.', extractedText: 'GOVERNMENT OF INDIA \n Ministry of Micro, Small and Medium Enterprises \n ZED Gold Rating Certificate \n Issued to: Apex Dynamics Manufacturing Enterprises \n Valid till: August 2029' },
    ]);

    // 10. Seed Notifications
    await Notification.insertMany([
      { businessId, title: '⚠️ Low Stock Alert: Heavy Duty Steel Roll', message: 'Stock level for "Heavy Duty Steel Roll" is currently 4 units (Threshold: 10). Reorder recommended.', type: 'Stock_Alert', read: false },
      { businessId, title: '🚨 Overdue Invoice Warning: INV-2026-0703', message: 'Invoice INV-2026-0703 issued to Tata Motors for ₹1,08,560 is overdue by 34 days.', type: 'Invoice_Alert', read: false },
      { businessId, title: '📈 Quarterly Growth Insight', message: 'Your Q2 revenues grew by 18.5% compared to Q1. Top revenue driver: Industrial Steel & Hydraulic Assemblies.', type: 'AI_Alert', read: true },
      { businessId, title: '💰 Cashflow Positive Milestone', message: 'Net August Operating Margin is +34.2% with ₹5.95 Lakhs incoming collections.', type: 'Finance_Alert', read: true },
    ]);

    // 11. Seed Chat
    const userObj = await User.findOne({ businessId });
    if (userObj) {
      await Chat.create({
        businessId, userId: userObj._id, title: 'Q3 Financial & Inventory Optimization Plan',
        messages: [
          { role: 'user', content: 'Analyze our sales and inventory for the past 3 months and suggest cost-saving measures.', timestamp: getDateMonthsAgo(0, 10) },
          { role: 'model', content: 'Based on your 3-month transactions:\n1. **High Turnover Items**: Heavy Duty Steel Rolls & Aluminum Sheeting account for 62% of revenue.\n2. **Cashflow Health**: May-August gross collections total ₹17.65 Lakhs with an average gross margin of 34%.\n3. **Recommendation**: Re-negotiate bulk pricing with JSW Steel to reduce cost by 4-6%.', timestamp: getDateMonthsAgo(0, 10) },
        ],
      });
    }

    console.log(`Demo data seeded successfully for business: ${businessId}.`);
  } catch (error) {
    console.error('Error seeding demo business data:', error);
  }
};

module.exports = { seedBusinessDemoData };
