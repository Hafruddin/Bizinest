/**
 * Central In-Memory Demo Data Store for MSME AI Business Assistant
 * Provides fallback data and CRUD actions when external MongoDB daemon is disconnected.
 */

const DEFAULT_BUSINESS_ID = '6a9fa2b3a290f13a38ef94bb';

const customers = [
  { _id: 'cust_1', id: 'cust_1', businessId: DEFAULT_BUSINESS_ID, name: 'Tata Motors Ltd', email: 'procurement@tatamotors.com', phone: '022-66658282', address: 'Mumbai, Maharashtra, India' },
  { _id: 'cust_2', id: 'cust_2', businessId: DEFAULT_BUSINESS_ID, name: 'Reliance Industries Ltd', email: 'purchasing@ril.com', phone: '022-44770000', address: 'Navi Mumbai, Maharashtra, India' },
  { _id: 'cust_3', id: 'cust_3', businessId: DEFAULT_BUSINESS_ID, name: 'L&T Construction', email: 'contact@lntecc.com', phone: '044-22526000', address: 'Chennai, Tamil Nadu, India' },
  { _id: 'cust_4', id: 'cust_4', businessId: DEFAULT_BUSINESS_ID, name: 'Godrej Enterprise', email: 'supply@godrej.com', phone: '022-67965656', address: 'Mumbai, Maharashtra, India' },
  { _id: 'cust_5', id: 'cust_5', businessId: DEFAULT_BUSINESS_ID, name: 'Ashok Leyland Ltd', email: 'vendor@ashokleyland.com', phone: '044-25301234', address: 'Chennai, Tamil Nadu, India' },
  { _id: 'cust_6', id: 'cust_6', businessId: DEFAULT_BUSINESS_ID, name: 'BHEL Heavy Electricals', email: 'materials@bhel.in', phone: '040-23182000', address: 'Hyderabad, Telangana, India' },
  { _id: 'cust_7', id: 'cust_7', businessId: DEFAULT_BUSINESS_ID, name: 'TVS Motor Company', email: 'purchase@tvsmotor.com', phone: '044-28332115', address: 'Hosur, Tamil Nadu, India' },
  { _id: 'cust_8', id: 'cust_8', businessId: DEFAULT_BUSINESS_ID, name: 'Titan Company Ltd', email: 'supplychain@titan.co.in', phone: '080-66609000', address: 'Bengaluru, Karnataka, India' },
];

const suppliers = [
  { _id: 'supp_1', id: 'supp_1', businessId: DEFAULT_BUSINESS_ID, name: 'JSW Steel Supply Corp', contactName: 'Suresh Raina', email: 'orders@jswsteel.com', phone: '022-42861000', address: 'Bellary, Karnataka' },
  { _id: 'supp_2', id: 'supp_2', businessId: DEFAULT_BUSINESS_ID, name: 'Hindalco Aluminum Ltd', contactName: 'Anil Agarwal', email: 'b2b@hindalco.adityabirla.com', phone: '022-66626666', address: 'Renukoot, UP' },
  { _id: 'supp_3', id: 'supp_3', businessId: DEFAULT_BUSINESS_ID, name: 'Polycab Electricals India', contactName: 'Vikram Singh', email: 'sales@polycab.com', phone: '022-24327074', address: 'Vadodara, Gujarat' },
  { _id: 'supp_4', id: 'supp_4', businessId: DEFAULT_BUSINESS_ID, name: 'Bosch Industrial Fasteners', contactName: 'Marcus Weber', email: 'info@boschfasteners.in', phone: '080-22992111', address: 'Bengaluru, Karnataka' },
  { _id: 'supp_5', id: 'supp_5', businessId: DEFAULT_BUSINESS_ID, name: 'Supreme Polymer Components', contactName: 'Ramesh Shah', email: 'support@supreme.co.in', phone: '022-40430000', address: 'Jalgaon, Maharashtra' },
];

const products = [
  { _id: 'prod_1', id: 'prod_1', businessId: DEFAULT_BUSINESS_ID, name: 'Heavy Duty Steel Roll', sku: 'STEEL-HD-001', barcode: '8901234567890', description: 'Industrial grade cold-rolled steel coils for heavy machinery.', category: 'Raw Materials', price: 32000, cost: 22000, quantity: 4, minStockThreshold: 10, supplierId: suppliers[0] },
  { _id: 'prod_2', id: 'prod_2', businessId: DEFAULT_BUSINESS_ID, name: 'Aluminum Sheeting XL', sku: 'ALUM-XL-002', barcode: '8901234567891', description: 'Extra-large high-tensile structural aluminum panels.', category: 'Raw Materials', price: 14500, cost: 9800, quantity: 18, minStockThreshold: 8, supplierId: suppliers[1] },
  { _id: 'prod_3', id: 'prod_3', businessId: DEFAULT_BUSINESS_ID, name: 'Precision Copper Wiring Coil', sku: 'COP-WIRE-003', barcode: '8901234567892', description: '99.9% pure insulated high-conductivity copper coils.', category: 'Electricals', price: 9200, cost: 6100, quantity: 7, minStockThreshold: 15, supplierId: suppliers[2] },
  { _id: 'prod_4', id: 'prod_4', businessId: DEFAULT_BUSINESS_ID, name: 'Commercial Synthetic Resin Adhesive', sku: 'ADH-COMM-004', barcode: '8901234567893', description: 'Multi-surface heavy bonding heat-resistant synthetic resin.', category: 'Chemicals', price: 4800, cost: 2900, quantity: 45, minStockThreshold: 20, supplierId: suppliers[4] },
  { _id: 'prod_5', id: 'prod_5', businessId: DEFAULT_BUSINESS_ID, name: 'Galvanized Industrial Anchor Bolts', sku: 'BOLT-IND-005', barcode: '8901234567894', description: 'High torque grade 8.8 carbon steel fasteners (Box of 500).', category: 'Fasteners', price: 1850, cost: 1100, quantity: 9, minStockThreshold: 25, supplierId: suppliers[3] },
  { _id: 'prod_6', id: 'prod_6', businessId: DEFAULT_BUSINESS_ID, name: 'Industrial Safety Helmet Set', sku: 'SAFE-HELM-006', barcode: '8901234567895', description: 'Impact-resistant reflective safety gears with chin belt (Pack of 10).', category: 'Safety Gear', price: 3400, cost: 2100, quantity: 30, minStockThreshold: 10, supplierId: null },
  { _id: 'prod_7', id: 'prod_7', businessId: DEFAULT_BUSINESS_ID, name: 'High-Pressure Hydraulic Valve', sku: 'HYD-VALV-007', barcode: '8901234567896', description: 'Stainless steel 350-bar fluid control hydraulic valve.', category: 'Machinery Components', price: 18500, cost: 12200, quantity: 12, minStockThreshold: 5, supplierId: null },
  { _id: 'prod_8', id: 'prod_8', businessId: DEFAULT_BUSINESS_ID, name: 'Planetary Gearbox Assembly', sku: 'GEAR-PLAN-008', barcode: '8901234567897', description: 'Heavy reduction torque transmission planetary gear system.', category: 'Machinery Components', price: 45000, cost: 31000, quantity: 3, minStockThreshold: 5, supplierId: null },
  { _id: 'prod_9', id: 'prod_9', businessId: DEFAULT_BUSINESS_ID, name: 'Double-Acting Pneumatic Cylinder', sku: 'PNEU-CYL-009', barcode: '8901234567898', description: 'Compact air cylinder for automated assembly line actuators.', category: 'Pneumatics', price: 7800, cost: 4900, quantity: 22, minStockThreshold: 10, supplierId: null },
  { _id: 'prod_10', id: 'prod_10', businessId: DEFAULT_BUSINESS_ID, name: 'Stainless Steel Fasteners Set', sku: 'SS-FAST-010', barcode: '8901234567899', description: 'Corrosion resistant SS 316 heavy marine grade bolt sets.', category: 'Fasteners', price: 2400, cost: 1500, quantity: 42, minStockThreshold: 15, supplierId: null },
  { _id: 'prod_11', id: 'prod_11', businessId: DEFAULT_BUSINESS_ID, name: 'Heavy Duty Servo Motor 5kW', sku: 'MTR-SERVO-011', barcode: '8901234567900', description: 'High torque brushless AC servo motor for CNC automation.', category: 'Electronics', price: 28500, cost: 19000, quantity: 6, minStockThreshold: 8, supplierId: null },
  { _id: 'prod_12', id: 'prod_12', businessId: DEFAULT_BUSINESS_ID, name: 'High Density Polyethylene Sheet', sku: 'HDPE-SHEET-012', barcode: '8901234567901', description: 'Wear resistant industrial HDPE polymer lining sheets.', category: 'Raw Materials', price: 6500, cost: 4200, quantity: 25, minStockThreshold: 10, supplierId: null },
  { _id: 'prod_13', id: 'prod_13', businessId: DEFAULT_BUSINESS_ID, name: 'Industrial Coolant Fluid 20L', sku: 'COOL-IND-013', barcode: '8901234567902', description: 'Synthetic water-soluble cutting fluid for machining.', category: 'Chemicals', price: 3900, cost: 2200, quantity: 14, minStockThreshold: 20, supplierId: null },
  { _id: 'prod_14', id: 'prod_14', businessId: DEFAULT_BUSINESS_ID, name: 'Air Compressor Pressure Regulator', sku: 'COMP-REG-014', barcode: '8901234567903', description: 'Pneumatic filter regulator lubricator unit with gauge.', category: 'Pneumatics', price: 5600, cost: 3400, quantity: 19, minStockThreshold: 10, supplierId: null },
  { _id: 'prod_15', id: 'prod_15', businessId: DEFAULT_BUSINESS_ID, name: 'Carbon Steel Flange 150mm', sku: 'FLG-CARB-015', barcode: '8901234567904', description: 'High temperature forged carbon steel pipe flange.', category: 'Machinery Components', price: 8200, cost: 5100, quantity: 35, minStockThreshold: 15, supplierId: null },
  { _id: 'prod_16', id: 'prod_16', businessId: DEFAULT_BUSINESS_ID, name: 'Insulated Electrical Glove Set', sku: 'SAFE-GLOV-016', barcode: '8901234567905', description: 'Class 2 high-voltage electrical safety rubber gloves.', category: 'Safety Gear', price: 1450, cost: 850, quantity: 50, minStockThreshold: 15, supplierId: null },
  { _id: 'prod_17', id: 'prod_17', businessId: DEFAULT_BUSINESS_ID, name: 'Digital Caliper & Micrometer Kit', sku: 'TOOL-CALIP-017', barcode: '8901234567906', description: 'Precision electronic measuring instrument set (0-150mm).', category: 'Testing & Tools', price: 6800, cost: 4100, quantity: 11, minStockThreshold: 5, supplierId: null },
  { _id: 'prod_18', id: 'prod_18', businessId: DEFAULT_BUSINESS_ID, name: 'Automatic Welder Nozzle Tip Set', sku: 'WELD-NOZ-018', barcode: '8901234567907', description: 'MIG welding contact copper tips (Pack of 50).', category: 'Fasteners', price: 3100, cost: 1800, quantity: 3, minStockThreshold: 12, supplierId: null },
];

const invoices = [
  { _id: 'inv_1', invoiceNumber: 'INV-2026-0501', businessId: DEFAULT_BUSINESS_ID, customerId: customers[0], customer: customers[0], issueDate: '2026-05-08T00:00:00.000Z', dueDate: '2026-05-22T00:00:00.000Z', status: 'Paid', items: [{ productId: products[0], name: products[0].name, quantity: 4, rate: 32000, cgst: 11520, sgst: 11520, amount: 151040 }], subtotal: 128000, taxTotal: 23040, discount: 0, total: 151040 },
  { _id: 'inv_2', invoiceNumber: 'INV-2026-0502', businessId: DEFAULT_BUSINESS_ID, customerId: customers[2], customer: customers[2], issueDate: '2026-05-19T00:00:00.000Z', dueDate: '2026-05-30T00:00:00.000Z', status: 'Paid', items: [{ productId: products[1], name: products[1].name, quantity: 15, rate: 14500, cgst: 19575, sgst: 19575, amount: 256650 }], subtotal: 217500, taxTotal: 39150, discount: 0, total: 256650 },
  { _id: 'inv_3', invoiceNumber: 'INV-2026-0503', businessId: DEFAULT_BUSINESS_ID, customerId: customers[4], customer: customers[4], issueDate: '2026-05-25T00:00:00.000Z', dueDate: '2026-06-08T00:00:00.000Z', status: 'Paid', items: [{ productId: products[10], name: products[10].name, quantity: 4, rate: 28500, cgst: 10260, sgst: 10260, amount: 134520 }], subtotal: 114000, taxTotal: 20520, discount: 0, total: 134520 },
  { _id: 'inv_4', invoiceNumber: 'INV-2026-0601', businessId: DEFAULT_BUSINESS_ID, customerId: customers[1], customer: customers[1], issueDate: '2026-06-05T00:00:00.000Z', dueDate: '2026-06-20T00:00:00.000Z', status: 'Paid', items: [{ productId: products[6], name: products[6].name, quantity: 8, rate: 18500, cgst: 13320, sgst: 13320, amount: 174640 }], subtotal: 148000, taxTotal: 26640, discount: 0, total: 174640 },
  { _id: 'inv_5', invoiceNumber: 'INV-2026-0602', businessId: DEFAULT_BUSINESS_ID, customerId: customers[3], customer: customers[3], issueDate: '2026-06-17T00:00:00.000Z', dueDate: '2026-06-30T00:00:00.000Z', status: 'Paid', items: [{ productId: products[2], name: products[2].name, quantity: 12, rate: 9200, cgst: 9936, sgst: 9936, amount: 130272 }], subtotal: 110400, taxTotal: 19872, discount: 0, total: 130272 },
  { _id: 'inv_6', invoiceNumber: 'INV-2026-0603', businessId: DEFAULT_BUSINESS_ID, customerId: customers[4], customer: customers[4], issueDate: '2026-06-25T00:00:00.000Z', dueDate: '2026-07-10T00:00:00.000Z', status: 'Paid', items: [{ productId: products[0], name: products[0].name, quantity: 5, rate: 32000, cgst: 14400, sgst: 14400, amount: 188800 }], subtotal: 160000, taxTotal: 28800, discount: 0, total: 188800 },
  { _id: 'inv_7', invoiceNumber: 'INV-2026-0604', businessId: DEFAULT_BUSINESS_ID, customerId: customers[7], customer: customers[7], issueDate: '2026-06-28T00:00:00.000Z', dueDate: '2026-07-12T00:00:00.000Z', status: 'Paid', items: [{ productId: products[16], name: products[16].name, quantity: 12, rate: 6800, cgst: 7344, sgst: 7344, amount: 96288 }], subtotal: 81600, taxTotal: 14688, discount: 0, total: 96288 },
  { _id: 'inv_8', invoiceNumber: 'INV-2026-0701', businessId: DEFAULT_BUSINESS_ID, customerId: customers[5], customer: customers[5], issueDate: '2026-07-04T00:00:00.000Z', dueDate: '2026-07-18T00:00:00.000Z', status: 'Paid', items: [{ productId: products[7], name: products[7].name, quantity: 4, rate: 45000, cgst: 16200, sgst: 16200, amount: 212400 }], subtotal: 180000, taxTotal: 32400, discount: 0, total: 212400 },
  { _id: 'inv_9', invoiceNumber: 'INV-2026-0702', businessId: DEFAULT_BUSINESS_ID, customerId: customers[6], customer: customers[6], issueDate: '2026-07-15T00:00:00.000Z', dueDate: '2026-07-30T00:00:00.000Z', status: 'Paid', items: [{ productId: products[8], name: products[8].name, quantity: 15, rate: 7800, cgst: 10530, sgst: 10530, amount: 138060 }], subtotal: 117000, taxTotal: 21060, discount: 0, total: 138060 },
  { _id: 'inv_10', invoiceNumber: 'INV-2026-0703', businessId: DEFAULT_BUSINESS_ID, customerId: customers[0], customer: customers[0], issueDate: '2026-07-10T00:00:00.000Z', dueDate: '2026-07-24T00:00:00.000Z', status: 'Overdue', items: [{ productId: products[2], name: products[2].name, quantity: 10, rate: 9200, cgst: 8280, sgst: 8280, amount: 108560 }], subtotal: 92000, taxTotal: 16560, discount: 0, total: 108560 },
  { _id: 'inv_11', invoiceNumber: 'INV-2026-0704', businessId: DEFAULT_BUSINESS_ID, customerId: customers[3], customer: customers[3], issueDate: '2026-07-20T00:00:00.000Z', dueDate: '2026-08-03T00:00:00.000Z', status: 'Overdue', items: [{ productId: products[14], name: products[14].name, quantity: 15, rate: 8200, cgst: 11070, sgst: 11070, amount: 145140 }], subtotal: 123000, taxTotal: 22140, discount: 0, total: 145140 },
  { _id: 'inv_12', invoiceNumber: 'INV-2026-0705', businessId: DEFAULT_BUSINESS_ID, customerId: customers[1], customer: customers[1], issueDate: '2026-07-27T00:00:00.000Z', dueDate: '2026-08-10T00:00:00.000Z', status: 'Paid', items: [{ productId: products[0], name: products[0].name, quantity: 8, rate: 32000, cgst: 23040, sgst: 23040, amount: 302080 }], subtotal: 256000, taxTotal: 46080, discount: 0, total: 302080 },
  { _id: 'inv_13', invoiceNumber: 'INV-2026-0801', businessId: DEFAULT_BUSINESS_ID, customerId: customers[7], customer: customers[7], issueDate: '2026-08-03T00:00:00.000Z', dueDate: '2026-08-18T00:00:00.000Z', status: 'Sent', items: [{ productId: products[1], name: products[1].name, quantity: 10, rate: 14500, cgst: 13050, sgst: 13050, amount: 171100 }], subtotal: 145000, taxTotal: 26100, discount: 0, total: 171100 },
  { _id: 'inv_14', invoiceNumber: 'INV-2026-0802', businessId: DEFAULT_BUSINESS_ID, customerId: customers[1], customer: customers[1], issueDate: '2026-08-12T00:00:00.000Z', dueDate: '2026-08-26T00:00:00.000Z', status: 'Paid', items: [{ productId: products[0], name: products[0].name, quantity: 6, rate: 32000, cgst: 17280, sgst: 17280, amount: 226560 }], subtotal: 192000, taxTotal: 34560, discount: 0, total: 226560 },
  { _id: 'inv_15', invoiceNumber: 'INV-2026-0803', businessId: DEFAULT_BUSINESS_ID, customerId: customers[3], customer: customers[3], issueDate: '2026-08-20T00:00:00.000Z', dueDate: '2026-09-04T00:00:00.000Z', status: 'Sent', items: [{ productId: products[6], name: products[6].name, quantity: 5, rate: 18500, cgst: 8325, sgst: 8325, amount: 109150 }], subtotal: 92500, taxTotal: 16650, discount: 0, total: 109150 },
  { _id: 'inv_16', invoiceNumber: 'INV-2026-0804', businessId: DEFAULT_BUSINESS_ID, customerId: customers[2], customer: customers[2], issueDate: '2026-08-22T00:00:00.000Z', dueDate: '2026-09-06T00:00:00.000Z', status: 'Sent', items: [{ productId: products[10], name: products[10].name, quantity: 6, rate: 28500, cgst: 15390, sgst: 15390, amount: 201780 }], subtotal: 171000, taxTotal: 30780, discount: 0, total: 201780 },
  { _id: 'inv_17', invoiceNumber: 'INV-2026-0805', businessId: DEFAULT_BUSINESS_ID, customerId: customers[5], customer: customers[5], issueDate: '2026-08-24T00:00:00.000Z', dueDate: '2026-09-08T00:00:00.000Z', status: 'Paid', items: [{ productId: products[7], name: products[7].name, quantity: 3, rate: 45000, cgst: 12150, sgst: 12150, amount: 159300 }], subtotal: 135000, taxTotal: 24300, discount: 0, total: 159300 },
  { _id: 'inv_18', invoiceNumber: 'INV-2026-0806', businessId: DEFAULT_BUSINESS_ID, customerId: customers[6], customer: customers[6], issueDate: '2026-08-26T00:00:00.000Z', dueDate: '2026-09-10T00:00:00.000Z', status: 'Sent', items: [{ productId: products[12], name: products[12].name, quantity: 20, rate: 3900, cgst: 7020, sgst: 7020, amount: 92040 }], subtotal: 78000, taxTotal: 14040, discount: 0, total: 92040 },
  { _id: 'inv_19', invoiceNumber: 'INV-2026-0807', businessId: DEFAULT_BUSINESS_ID, customerId: customers[0], customer: customers[0], issueDate: '2026-08-27T00:00:00.000Z', dueDate: '2026-09-12T00:00:00.000Z', status: 'Draft', items: [{ productId: products[9], name: products[9].name, quantity: 25, rate: 2400, cgst: 5400, sgst: 5400, amount: 70800 }], subtotal: 60000, taxTotal: 10800, discount: 0, total: 70800 },
];

const schemes = [
  {
    _id: 'sch_1',
    id: 'sch_1',
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    ministry: "Ministry of Micro, Small & Medium Enterprises",
    description: "Credit-linked subsidy program for setting up new micro-enterprises in manufacturing and service sectors.",
    eligibilityCriteria: [
      "Individuals above 18 years of age",
      "At least VIII standard pass for projects costing above Rs. 10 Lakh in manufacturing and Rs. 5 Lakh in service",
      "Self Help Groups and Institutions registered under Societies Registration Act"
    ],
    benefits: "Subsidy of 15% to 35% on projects costing up to Rs. 50 Lakh (Manufacturing) or Rs. 20 Lakh (Service).",
    documentsRequired: [
      "Aadhaar Card",
      "Detailed Project Report (DPR)",
      "Highest Educational Qualification Certificate",
      "Caste/Special Category Certificate (if applicable)"
    ],
    applicationProcedure: "Apply online through the PMEGP e-Portal run by KVIC (kviconline.gov.in) and submit physical documents to selected bank branch.",
    officialLink: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
  },
  {
    _id: 'sch_2',
    id: 'sch_2',
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    ministry: "Ministry of Micro, Small & Medium Enterprises & SIDBI",
    description: "Collateral-free credit facility up to Rs. 5 Crore for new and existing micro and small enterprises.",
    eligibilityCriteria: [
      "New and existing Micro and Small Enterprises (MSEs) engaged in manufacturing or service activities",
      "Retail trade activities covered under specific guidelines"
    ],
    benefits: "Collateral-free loans (term loans and working capital) with credit guarantee cover up to 85% for third-party defaults.",
    documentsRequired: [
      "Udyam Registration Certificate",
      "Detailed Project Business Plan",
      "Audited Financial Reports for the last 2 years (for existing businesses)",
      "ITR filings"
    ],
    applicationProcedure: "Apply directly through registered Member Lending Institutions (MLIs) including nationalized banks, private sector banks, and SIDBI.",
    officialLink: "https://www.cgtmse.in/"
  },
  {
    _id: 'sch_3',
    id: 'sch_3',
    name: "Pradhan Mantri MUDRA Yojana (PMMY)",
    ministry: "Ministry of Finance",
    description: "Mudra Loans up to Rs. 10 Lakh categorized as Shishu (up to 50k), Kishor (50k-5L), and Tarun (5L-10L) for business startup and expansion.",
    eligibilityCriteria: [
      "Non-corporate, non-farm small and micro enterprises",
      "Business must be generating revenue through trading, manufacturing, or service sectors"
    ],
    benefits: "Working capital and term loans up to Rs. 10 Lakh without collateral and with low processing fees.",
    documentsRequired: [
      "Proof of identity (PAN/Aadhaar/Voter ID)",
      "Proof of business address",
      "Quotation of machinery/items to be purchased using the loan",
      "Udyam Registration"
    ],
    applicationProcedure: "Apply online through Udyamimitra portal (udyamimitra.in) or submit Mudra Application Form directly to commercial, cooperative, or rural banks.",
    officialLink: "https://www.mudra.org.in/"
  },
  {
    _id: 'sch_4',
    id: 'sch_4',
    name: "MSME ZED (Zero Defect Zero Effect) Certification Scheme",
    ministry: "Ministry of Micro, Small & Medium Enterprises",
    description: "Promotes Zero Defect manufacturing with Zero Environmental Effect by offering financial assistance on ZED Gold/Silver/Bronze certifications.",
    eligibilityCriteria: [
      "All MSMEs registered with Udyam Registration",
      "Manufacturing micro, small, or medium enterprises"
    ],
    benefits: "Up to 80% subsidy on certification costs, plus 10% concessions on bank processing fees and subventions.",
    documentsRequired: [
      "Udyam Registration Certificate",
      "Factory Licence / Pollution NOC",
      "Self-assessment checklist"
    ],
    applicationProcedure: "Register on ZED MSME portal (zed.msme.gov.in) and complete online assessment.",
    officialLink: "https://zed.msme.gov.in/"
  }
];

const expenses = [
  { _id: 'exp_1', businessId: DEFAULT_BUSINESS_ID, amount: 45000, category: 'Rent', date: '2026-05-01T00:00:00.000Z', description: 'Guindy Industrial Estate Unit Monthly Lease' },
  { _id: 'exp_2', businessId: DEFAULT_BUSINESS_ID, amount: 18500, category: 'Utilities', date: '2026-05-05T00:00:00.000Z', description: 'TNEB Industrial High-Tension Electricity Bill' },
  { _id: 'exp_3', businessId: DEFAULT_BUSINESS_ID, amount: 88000, category: 'Inventory', date: '2026-05-10T00:00:00.000Z', description: 'JSW Steel Coil Bulk Purchase' },
  { _id: 'exp_4', businessId: DEFAULT_BUSINESS_ID, amount: 125000, category: 'Payroll', date: '2026-05-28T00:00:00.000Z', description: 'May Staff & Factory Workers Salary Disbursement' },
  { _id: 'exp_5', businessId: DEFAULT_BUSINESS_ID, amount: 6500, category: 'Others', date: '2026-05-14T00:00:00.000Z', description: 'CNC Lathe Machine Service & Calibration' },
  { _id: 'exp_6', businessId: DEFAULT_BUSINESS_ID, amount: 45000, category: 'Rent', date: '2026-06-01T00:00:00.000Z', description: 'Guindy Industrial Estate Unit Monthly Lease' },
  { _id: 'exp_7', businessId: DEFAULT_BUSINESS_ID, amount: 21200, category: 'Utilities', date: '2026-06-04T00:00:00.000Z', description: 'TNEB Industrial Electricity Bill' },
  { _id: 'exp_8', businessId: DEFAULT_BUSINESS_ID, amount: 142000, category: 'Inventory', date: '2026-06-12T00:00:00.000Z', description: 'Hindalco Aluminum Panels Inward Shipment' },
  { _id: 'exp_9', businessId: DEFAULT_BUSINESS_ID, amount: 128000, category: 'Payroll', date: '2026-06-29T00:00:00.000Z', description: 'June Staff & Factory Workers Salary' },
  { _id: 'exp_10', businessId: DEFAULT_BUSINESS_ID, amount: 14500, category: 'Others', date: '2026-06-22T00:00:00.000Z', description: 'Inter-state Freight Carrier Charges to Mumbai' },
  { _id: 'exp_11', businessId: DEFAULT_BUSINESS_ID, amount: 45000, category: 'Rent', date: '2026-07-01T00:00:00.000Z', description: 'Guindy Industrial Estate Unit Monthly Lease' },
  { _id: 'exp_12', businessId: DEFAULT_BUSINESS_ID, amount: 19800, category: 'Utilities', date: '2026-07-05T00:00:00.000Z', description: 'TNEB Industrial Power Bill' },
  { _id: 'exp_13', businessId: DEFAULT_BUSINESS_ID, amount: 76000, category: 'Inventory', date: '2026-07-15T00:00:00.000Z', description: 'Polycab Copper Wiring Wire Consignment' },
  { _id: 'exp_14', businessId: DEFAULT_BUSINESS_ID, amount: 132000, category: 'Payroll', date: '2026-07-30T00:00:00.000Z', description: 'July Staff & Factory Workers Salary' },
  { _id: 'exp_15', businessId: DEFAULT_BUSINESS_ID, amount: 9500, category: 'Others', date: '2026-07-10T00:00:00.000Z', description: 'Cloud ERP & AI Business Suite Subscription' },
  { _id: 'exp_16', businessId: DEFAULT_BUSINESS_ID, amount: 16000, category: 'Marketing', date: '2026-07-18T00:00:00.000Z', description: 'B2B Industrial Trade Expo Stall Booking' },
  { _id: 'exp_17', businessId: DEFAULT_BUSINESS_ID, amount: 45000, category: 'Rent', date: '2026-08-01T00:00:00.000Z', description: 'Guindy Industrial Estate Unit Monthly Lease' },
  { _id: 'exp_18', businessId: DEFAULT_BUSINESS_ID, amount: 17900, category: 'Utilities', date: '2026-08-05T00:00:00.000Z', description: 'TNEB Industrial Power Bill' },
  { _id: 'exp_19', businessId: DEFAULT_BUSINESS_ID, amount: 52000, category: 'Inventory', date: '2026-08-11T00:00:00.000Z', description: 'Fasteners & Resin Adhesive Stock Refill' },
  { _id: 'exp_20', businessId: DEFAULT_BUSINESS_ID, amount: 135000, category: 'Payroll', date: '2026-08-26T00:00:00.000Z', description: 'August Factory Workers Salary' },
  { _id: 'exp_21', businessId: DEFAULT_BUSINESS_ID, amount: 11200, category: 'Others', date: '2026-08-19T00:00:00.000Z', description: 'Local Transport & Dispatch Vans' },
];

const documents = [
  { _id: 'doc_1', businessId: DEFAULT_BUSINESS_ID, fileName: 'raw_material_jsw_steel_purchase_july.pdf', filePath: '/uploads/raw_material_jsw_steel_purchase_july.pdf', fileType: 'application/pdf', status: 'Completed', createdAt: '2026-07-15T00:00:00.000Z', summary: 'JSW Steel tax invoice for 8 tons of cold-rolled steel coils. Subtotal: ₹1,76,000, GST 18%: ₹31,680. Total: ₹2,07,680.', extractedText: 'TAX INVOICE JSW Steel Corp Invoice No: JSW/2026/9912 GSTIN: 29AAAAA0000A1Z1 Amount: 176000 Net Paid: 207680' },
  { _id: 'doc_2', businessId: DEFAULT_BUSINESS_ID, fileName: 'tneb_industrial_power_bill_august.pdf', filePath: '/uploads/tneb_industrial_power_bill_august.pdf', fileType: 'application/pdf', status: 'Completed', createdAt: '2026-08-05T00:00:00.000Z', summary: 'TNEB industrial high tension monthly electricity bill. Meter reading: 4,890 kWh. Total due: ₹17,900.', extractedText: 'TAMIL NADU GENERATION AND DISTRIBUTION CORP HT Consumer No: 04-902-1123 Consumption: 4890 units Total Payable: 17900' },
  { _id: 'doc_3', businessId: DEFAULT_BUSINESS_ID, fileName: 'msme_zed_certificate_2026.pdf', filePath: '/uploads/msme_zed_certificate_2026.pdf', fileType: 'application/pdf', status: 'Completed', createdAt: '2026-08-15T00:00:00.000Z', summary: 'Zero Defect Zero Effect (ZED) Gold Certification awarded by Ministry of Micro, Small and Medium Enterprises, Govt of India.', extractedText: 'GOVERNMENT OF INDIA Ministry of Micro, Small and Medium Enterprises ZED Gold Rating Certificate Issued to: Apex Dynamics Manufacturing Enterprises' },
];

const tickets = [
  { _id: 'tkt_1', businessId: DEFAULT_BUSINESS_ID, title: 'GST E-Way Bill Generation Assistance', description: 'Need help attaching proper HSN codes for high-pressure hydraulic valve shipments exceeding ₹50,000 threshold.', customerName: 'Ashok Leyland Logistics Team', customerEmail: 'vendor@ashokleyland.com', status: 'Resolved', priority: 'High', createdAt: '2026-08-01T00:00:00.000Z' },
  { _id: 'tkt_2', businessId: DEFAULT_BUSINESS_ID, title: 'Custom Low Stock Threshold Alert Setup', description: 'Requesting automated SMS and email alerts whenever steel rolls drop below 10 units threshold.', customerName: 'Internal Ops Team', customerEmail: 'admin@apexdynamics.in', status: 'Resolved', priority: 'Medium', createdAt: '2026-08-10T00:00:00.000Z' },
  { _id: 'tkt_3', businessId: DEFAULT_BUSINESS_ID, title: 'PNEU-CYL-009 Specification Datasheet Request', description: 'Customer requesting ISO certification and 3D CAD step file for pneumatic cylinders.', customerName: 'TVS Motor Procurement', customerEmail: 'purchase@tvsmotor.com', status: 'In_Progress', priority: 'Medium', createdAt: '2026-08-18T00:00:00.000Z' },
  { _id: 'tkt_4', businessId: DEFAULT_BUSINESS_ID, title: 'Payment Discrepancy Reconciliation for INV-2026-0703', description: 'Tata Motors procurement logged query regarding 2% TDS deduction on raw material invoice.', customerName: 'Tata Motors Accounts Payable', customerEmail: 'procurement@tatamotors.com', status: 'Open', priority: 'High', createdAt: '2026-08-25T00:00:00.000Z' },
];

module.exports = {
  products,
  invoices,
  schemes,
  expenses,
  customers,
  suppliers,
  documents,
  tickets,
};
