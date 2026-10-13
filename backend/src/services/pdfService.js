const PDFDocument = require('pdfkit');

/**
 * Helper to convert numbers to Indian Rupee Words (Lakh, Crore system).
 */
function numberToIndianWords(num) {
  if (!num || isNaN(num)) return 'Zero Rupees Only';
  num = Math.round(Number(num));
  if (num === 0) return 'Zero Rupees Only';

  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertLessThanOneThousand(n) {
    if (n === 0) return '';
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  num %= 1000;
  let remainder = num;

  let result = '';
  if (crore > 0) result += convertLessThanOneThousand(crore) + ' Crore ';
  if (lakh > 0) result += convertLessThanOneThousand(lakh) + ' Lakh ';
  if (thousand > 0) result += convertLessThanOneThousand(thousand) + ' Thousand ';
  if (remainder > 0) result += convertLessThanOneThousand(remainder);

  return result.trim() + ' Rupees Only';
}

function formatCurrency(val) {
  const num = Number(val) || 0;
  return 'Rs. ' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Service to generate professional Indian GST Tax Invoice PDFs using PDFKit.
 */
class PDFService {
  /**
   * Generates invoice PDF stream.
   * @param {object} invoice - Invoice database object populated with customer & business info
   * @param {res} res - Express response stream
   */
  static generateInvoicePDF(invoice, res) {
    const doc = new PDFDocument({ margin: 36, size: 'A4', autoFirstPage: true, compress: false });

    // Set headers for PDF download if Express response
    if (typeof res.setHeader === 'function') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`);
    }
    doc.pipe(res);

    // Color Palette
    const primaryColor = '#1e3a8a';   // Deep Royal Navy
    const darkColor = '#0f172a';      // Slate 900
    const secondaryColor = '#475569'; // Slate 600
    const borderColor = '#cbd5e1';    // Slate 300
    const lightBg = '#f8fafc';        // Light Slate
    const headerBg = '#f1f5f9';       // Slate 100
    const emeraldColor = '#16a34a';   // Green badge
    const amberColor = '#d97706';     // Overdue badge

    // --- Resolved Business / Seller Profile ---
    const business = (invoice.businessId && typeof invoice.businessId === 'object' && invoice.businessId.name)
      ? invoice.businessId
      : {
          name: 'Apex Dynamics Manufacturing Enterprises',
          gstin: '33AAAAA1234A1Z5',
          pan: 'AAAAA1234A',
          phone: '+91 44 2250 8899',
          email: 'billing@apexdynamics.in',
          address: {
            street: 'Plot 45, Guindy Industrial Estate',
            city: 'Chennai',
            state: 'Tamil Nadu',
            zip: '600032',
            country: 'India',
          },
          stateCode: '33',
        };

    const businessStreet = business.address?.street || 'Plot 45, Guindy Industrial Estate';
    const businessCityState = `${business.address?.city || 'Chennai'}, ${business.address?.state || 'Tamil Nadu'} - ${business.address?.zip || '600032'}`;
    const businessGstin = business.gstin || '33AAAAA1234A1Z5';
    const businessPan = business.pan || 'AAAAA1234A';
    const businessPhone = business.phone || '+91 44 2250 8899';
    const businessEmail = business.email || 'billing@apexdynamics.in';
    const businessStateCode = business.stateCode || '33';

    // --- Resolved Buyer / Customer Profile ---
    const customer = invoice.customerId || invoice.customer || {};
    const customerName = customer.name || 'Enterprise Client';
    const customerAddress = customer.address || 'Mumbai, Maharashtra, India';
    const customerEmail = customer.email || 'procurement@client.in';
    const customerPhone = customer.phone || '+91 98765 43210';
    const customerGstin = customer.gstin || '27AAACT2727Q1ZW';
    const customerState = customer.state || 'Maharashtra';
    const customerStateCode = customer.stateCode || '27';

    // Dates
    const issueDateStr = invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    const dueDateStr = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN');

    // ==========================================
    // 1. TOP HEADER (Seller & Invoice Meta)
    // ==========================================
    doc
      .fillColor(primaryColor)
      .fontSize(15)
      .font('Helvetica-Bold')
      .text(business.name, 36, 36);

    doc
      .fillColor(secondaryColor)
      .fontSize(8)
      .font('Helvetica-Oblique')
      .text('Industrial Equipment & Precision Engineering | MSME Reg: UDYAM-TN-02-0045129', 36, 54);

    doc
      .fillColor(darkColor)
      .fontSize(8)
      .font('Helvetica')
      .text(businessStreet, 36, 66)
      .text(businessCityState, 36, 76)
      .text(`GSTIN: ${businessGstin} | PAN: ${businessPan} | State: ${business.address?.state || 'Tamil Nadu'} (${businessStateCode})`, 36, 86)
      .text(`Phone: ${businessPhone} | Email: ${businessEmail}`, 36, 96);

    // Right Header: Invoice Metadata
    doc
      .fillColor(primaryColor)
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('TAX INVOICE', 330, 36, { align: 'right', width: 229 });

    doc
      .fillColor(secondaryColor)
      .fontSize(7.5)
      .font('Helvetica-Oblique')
      .text('(Original for Recipient | Under Rule 48 of CGST Rules, 2017)', 330, 58, { align: 'right', width: 229 });

    doc
      .fillColor(darkColor)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text(`Invoice #: ${invoice.invoiceNumber}`, 330, 70, { align: 'right', width: 229 });

    doc
      .font('Helvetica')
      .fontSize(8)
      .text(`Invoice Date: ${issueDateStr}`, 330, 83, { align: 'right', width: 229 })
      .text(`Due Date: ${dueDateStr}`, 330, 95, { align: 'right', width: 229 });

    // Status Badge
    const status = invoice.status || 'Sent';
    const statusColor = status === 'Paid' ? emeraldColor : (status === 'Overdue' ? amberColor : primaryColor);
    doc
      .fillColor(statusColor)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text(`Status: ${status.toUpperCase()}`, 330, 107, { align: 'right', width: 229 });

    // ==========================================
    // 2. BILL TO & LOGISTICS DETAILS BOX
    // ==========================================
    const boxY = 122;
    const boxHeight = 72;
    doc
      .rect(36, boxY, 523, boxHeight)
      .fillAndStroke(lightBg, borderColor);

    // Vertical divider inside box
    doc.moveTo(295, boxY).lineTo(295, boxY + boxHeight).stroke(borderColor);

    // Left: Bill To
    doc
      .fillColor(primaryColor)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text('BILL TO (BUYER / RECIPIENT DETAILS):', 44, boxY + 6);

    doc
      .fillColor(darkColor)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text(customerName, 44, boxY + 18);

    doc
      .fillColor(secondaryColor)
      .fontSize(7.5)
      .font('Helvetica')
      .text(customerAddress, 44, boxY + 29)
      .text(`GSTIN: ${customerGstin} | State: ${customerState} (${customerStateCode})`, 44, boxY + 39)
      .text(`Email: ${customerEmail} | Phone: ${customerPhone}`, 44, boxY + 49);

    // Right: Logistics & Supply Terms
    doc
      .fillColor(primaryColor)
      .fontSize(8.5)
      .font('Helvetica-Bold')
      .text('DISPATCH & TAXATION PARTICULARS:', 305, boxY + 6);

    doc
      .fillColor(secondaryColor)
      .fontSize(7.5)
      .font('Helvetica')
      .text(`Place of Supply: ${customerState} (${customerStateCode})`, 305, boxY + 18)
      .text(`Dispatch Location: Guindy Industrial Estate, Chennai (${businessStateCode})`, 305, boxY + 29)
      .text('Reverse Charge (RCM): No | Transport Mode: Surface Freight', 305, boxY + 39)
      .text('Payment Terms: Net 14 Days (Direct Bank Transfer / NEFT / RTGS)', 305, boxY + 49);

    // ==========================================
    // 3. LINE ITEMS TABLE (With explicit Tax %)
    // ==========================================
    let tableY = 202;
    const headerH = 20;

    // Header bar background
    doc.rect(36, tableY, 523, headerH).fillAndStroke(headerBg, borderColor);

    // Header Text
    doc
      .fillColor(primaryColor)
      .fontSize(7.5)
      .font('Helvetica-Bold')
      .text('#', 40, tableY + 6, { width: 16, align: 'center' })
      .text('ITEM DESCRIPTION', 60, tableY + 6, { width: 165 })
      .text('HSN/SAC', 230, tableY + 6, { width: 45, align: 'center' })
      .text('QTY', 280, tableY + 6, { width: 30, align: 'right' })
      .text('RATE', 315, tableY + 6, { width: 55, align: 'right' })
      .text('TAXABLE VAL', 375, tableY + 6, { width: 60, align: 'right' })
      .text('TAX % (GST)', 440, tableY + 6, { width: 50, align: 'center' })
      .text('TOTAL AMOUNT', 495, tableY + 6, { width: 59, align: 'right' });

    tableY += headerH;

    // Process & Accumulate Items & Tax Breakdown
    const taxSummaryMap = {}; // { 18: { taxable: 0, cgst: 0, sgst: 0, totalTax: 0, hsn: '7208' } }
    let calculatedSubtotal = 0;
    let calculatedTaxTotal = 0;

    const items = Array.isArray(invoice.items) && invoice.items.length > 0 ? invoice.items : [
      { name: 'Industrial Equipment & Materials', hsn: '7208', quantity: 1, rate: 50000, taxRate: 18, amount: 59000 }
    ];

    items.forEach((item, idx) => {
      const qty = Number(item.quantity) || 1;
      const rate = Number(item.rate) || 0;
      const taxable = item.taxableAmount !== undefined ? Number(item.taxableAmount) : (qty * rate);

      // Determine accurate tax percent
      let taxPercent = 18; // Default Indian GST rate
      if (typeof item.taxRate === 'number' && !isNaN(item.taxRate) && item.taxRate > 0) {
        taxPercent = item.taxRate;
      } else if (typeof item.gstPercent === 'number' && !isNaN(item.gstPercent) && item.gstPercent > 0) {
        taxPercent = item.gstPercent;
      } else if (item.cgstRate && item.sgstRate) {
        taxPercent = item.cgstRate + item.sgstRate;
      } else if (taxable > 0 && (item.cgst || item.sgst)) {
        const sumTax = (Number(item.cgst) || 0) + (Number(item.sgst) || 0) + (Number(item.igst) || 0);
        if (sumTax < 100) {
          taxPercent = sumTax;
        } else {
          taxPercent = Math.round((sumTax / taxable) * 100);
        }
      } else if (item.amount && taxable > 0 && item.amount > taxable) {
        taxPercent = Math.round(((item.amount - taxable) / taxable) * 100);
      }

      const cgstPercent = taxPercent / 2;
      const sgstPercent = taxPercent / 2;
      const cgstAmt = taxable * (cgstPercent / 100);
      const sgstAmt = taxable * (sgstPercent / 100);
      const itemTaxTotal = cgstAmt + sgstAmt;
      const itemFinalTotal = taxable + itemTaxTotal;

      calculatedSubtotal += taxable;
      calculatedTaxTotal += itemTaxTotal;

      const hsn = item.hsn || '7208';

      // Accumulate for Tax Breakdown Table
      if (!taxSummaryMap[taxPercent]) {
        taxSummaryMap[taxPercent] = {
          hsn: hsn,
          taxPercent: taxPercent,
          cgstRate: cgstPercent,
          sgstRate: sgstPercent,
          taxable: 0,
          cgstAmt: 0,
          sgstAmt: 0,
          totalTax: 0,
        };
      }
      taxSummaryMap[taxPercent].taxable += taxable;
      taxSummaryMap[taxPercent].cgstAmt += cgstAmt;
      taxSummaryMap[taxPercent].sgstAmt += sgstAmt;
      taxSummaryMap[taxPercent].totalTax += itemTaxTotal;

      const rowH = 20;
      if (idx % 2 === 1) {
        doc.rect(36, tableY, 523, rowH).fill(lightBg);
      }

      doc
        .fillColor(darkColor)
        .fontSize(7.5)
        .font('Helvetica')
        .text((idx + 1).toString(), 40, tableY + 5, { width: 16, align: 'center' })
        .font('Helvetica-Bold')
        .text(item.name || 'Industrial Product', 60, tableY + 5, { width: 165 })
        .font('Helvetica')
        .text(hsn, 230, tableY + 5, { width: 45, align: 'center' })
        .text(qty.toString(), 280, tableY + 5, { width: 30, align: 'right' })
        .text(rate.toFixed(2), 315, tableY + 5, { width: 55, align: 'right' })
        .text(taxable.toFixed(2), 375, tableY + 5, { width: 60, align: 'right' })
        .font('Helvetica-Bold')
        .fillColor(primaryColor)
        .text(`${taxPercent}%`, 440, tableY + 5, { width: 50, align: 'center' })
        .fillColor(darkColor)
        .text(itemFinalTotal.toFixed(2), 495, tableY + 5, { width: 59, align: 'right' });

      tableY += rowH;
    });

    // Table bottom border
    doc.moveTo(36, tableY).lineTo(559, tableY).stroke(borderColor);
    tableY += 8;

    // Use reported totals if present and valid, otherwise computed
    const finalSubtotal = Number(invoice.subtotal) || calculatedSubtotal;
    const finalTaxTotal = Number(invoice.taxTotal) || calculatedTaxTotal;
    const finalDiscount = Number(invoice.discount) || 0;
    const finalGrandTotal = Number(invoice.total) || (finalSubtotal + finalTaxTotal - finalDiscount);

    // ==========================================
    // 4. GOVERNMENT & STATE TAX BREAKDOWN TABLE
    // ==========================================
    const taxSectionY = tableY;
    const taxTableW = 523;
    const taxHeaderH = 18;

    doc
      .fillColor(primaryColor)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('GST TAX COMPUTATION BREAKDOWN (Central Govt Tax CGST + State Govt Tax SGST)', 36, taxSectionY);

    const taxGridY = taxSectionY + 12;
    doc.rect(36, taxGridY, taxTableW, taxHeaderH).fillAndStroke(headerBg, borderColor);

    doc
      .fillColor(darkColor)
      .fontSize(7)
      .font('Helvetica-Bold')
      .text('HSN / SAC', 40, taxGridY + 5, { width: 55 })
      .text('TAXABLE VALUE', 100, taxGridY + 5, { width: 75, align: 'right' })
      .text('CENTRAL TAX (CGST)', 185, taxGridY + 5, { width: 110, align: 'center' })
      .text('STATE TAX (SGST)', 305, taxGridY + 5, { width: 110, align: 'center' })
      .text('TOTAL TAX AMOUNT', 425, taxGridY + 5, { width: 129, align: 'right' });

    let taxRowY = taxGridY + taxHeaderH;
    Object.values(taxSummaryMap).forEach((ts) => {
      const rowHeight = 18;
      doc
        .fillColor(darkColor)
        .fontSize(7)
        .font('Helvetica')
        .text(ts.hsn, 40, taxRowY + 5, { width: 55 })
        .text(formatCurrency(ts.taxable), 100, taxRowY + 5, { width: 75, align: 'right' })
        .text(`${ts.cgstRate}% (${formatCurrency(ts.cgstAmt)})`, 185, taxRowY + 5, { width: 110, align: 'center' })
        .text(`${ts.sgstRate}% (${formatCurrency(ts.sgstAmt)})`, 305, taxRowY + 5, { width: 110, align: 'center' })
        .font('Helvetica-Bold')
        .text(formatCurrency(ts.totalTax), 425, taxRowY + 5, { width: 129, align: 'right' });

      taxRowY += rowHeight;
    });

    // Tax Total Row
    const totalCentralTax = Object.values(taxSummaryMap).reduce((acc, ts) => acc + ts.cgstAmt, 0);
    const totalStateTax = Object.values(taxSummaryMap).reduce((acc, ts) => acc + ts.sgstAmt, 0);

    doc.rect(36, taxRowY, taxTableW, 18).fillAndStroke(lightBg, borderColor);
    doc
      .fillColor(primaryColor)
      .fontSize(7)
      .font('Helvetica-Bold')
      .text('TOTAL TAX:', 40, taxRowY + 5, { width: 55 })
      .text(formatCurrency(finalSubtotal), 100, taxRowY + 5, { width: 75, align: 'right' })
      .text(`Govt CGST: ${formatCurrency(totalCentralTax)}`, 185, taxRowY + 5, { width: 110, align: 'center' })
      .text(`State SGST: ${formatCurrency(totalStateTax)}`, 305, taxRowY + 5, { width: 110, align: 'center' })
      .text(formatCurrency(finalTaxTotal), 425, taxRowY + 5, { width: 129, align: 'right' });

    taxRowY += 24;

    // ==========================================
    // 5. SUMMARY & SETTLEMENT SECTION
    // ==========================================
    const summaryBoxY = taxRowY;

    // Left Column: Words & Bank Account Details
    const leftW = 280;
    doc
      .fillColor(primaryColor)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('Total Invoice Amount in Words:', 36, summaryBoxY);

    doc
      .fillColor(darkColor)
      .fontSize(7.5)
      .font('Helvetica-Oblique')
      .text(numberToIndianWords(finalGrandTotal), 36, summaryBoxY + 12, { width: leftW });

    // Bank Details Box
    const bankY = summaryBoxY + 32;
    doc.rect(36, bankY, leftW, 58).fillAndStroke(lightBg, borderColor);

    doc
      .fillColor(primaryColor)
      .fontSize(8)
      .font('Helvetica-Bold')
      .text('BANK DETAILS FOR NEFT / RTGS / IMPS PAYMENT:', 42, bankY + 6);

    doc
      .fillColor(secondaryColor)
      .fontSize(7)
      .font('Helvetica')
      .text('Bank Name: State Bank of India (SBI)', 42, bankY + 18)
      .text('Account Name: Apex Dynamics Manufacturing Enterprises', 42, bankY + 28)
      .text('Account Number: 987654321098 | Account Type: Current A/C', 42, bankY + 38)
      .text('IFSC Code: SBIN0001234 | Branch: Guindy Industrial Estate, Chennai', 42, bankY + 48);

    // Right Column: Financial Calculation Box
    const rightX = 330;
    const rightW = 229;
    doc.rect(rightX, summaryBoxY, rightW, 90).fillAndStroke(lightBg, borderColor);

    let calcY = summaryBoxY + 8;
    const printLine = (label, value, isBold = false, color = darkColor, fontSize = 7.5) => {
      doc
        .fillColor(color)
        .fontSize(fontSize)
        .font(isBold ? 'Helvetica-Bold' : 'Helvetica')
        .text(label, rightX + 10, calcY, { width: 120 })
        .text(value, rightX + 120, calcY, { width: 99, align: 'right' });
      calcY += 13;
    };

    printLine('Taxable Subtotal:', formatCurrency(finalSubtotal));
    printLine('Govt Central Tax (CGST):', formatCurrency(totalCentralTax));
    printLine('State Govt Tax (SGST):', formatCurrency(totalStateTax));
    printLine('Total GST Tax:', formatCurrency(finalTaxTotal));

    if (finalDiscount > 0) {
      printLine('Discount:', `- ${formatCurrency(finalDiscount)}`, false, '#e11d48');
    }

    doc.moveTo(rightX + 10, calcY + 2).lineTo(rightX + rightW - 10, calcY + 2).stroke(borderColor);
    calcY += 6;

    printLine('Grand Total Due:', formatCurrency(finalGrandTotal), true, primaryColor, 9.5);

    // ==========================================
    // 6. TERMS & AUTHORIZED SIGNATURE
    // ==========================================
    const footerY = summaryBoxY + 100;

    // Terms
    doc
      .fillColor(primaryColor)
      .fontSize(7.5)
      .font('Helvetica-Bold')
      .text('TERMS & CONDITIONS:', 36, footerY);

    doc
      .fillColor(secondaryColor)
      .fontSize(6.5)
      .font('Helvetica')
      .text('1. Goods once sold will not be accepted back or exchanged.', 36, footerY + 10)
      .text('2. Payment is strictly due within 14 days from invoice issue date.', 36, footerY + 18)
      .text('3. Interest @ 18% per annum will be charged on overdue payments beyond due date.', 36, footerY + 26)
      .text('4. Any legal disputes are subject to Chennai, Tamil Nadu jurisdiction only.', 36, footerY + 34);

    // Signatory
    const sigX = 360;
    doc
      .fillColor(darkColor)
      .fontSize(7.5)
      .font('Helvetica-Bold')
      .text(`For ${business.name}`, sigX, footerY, { align: 'right', width: 199 });

    doc
      .fillColor(secondaryColor)
      .fontSize(7)
      .font('Helvetica-Oblique')
      .text('[ Digitally Signed & Approved ]', sigX, footerY + 32, { align: 'right', width: 199 });

    doc
      .fillColor(darkColor)
      .fontSize(7.5)
      .font('Helvetica-Bold')
      .text('Authorized Signatory', sigX, footerY + 42, { align: 'right', width: 199 });

    // Bottom Notice
    doc
      .moveTo(36, 785)
      .lineTo(559, 785)
      .stroke(borderColor);

    doc
      .fillColor(secondaryColor)
      .fontSize(7)
      .font('Helvetica')
      .text('This is an authenticated computer-generated GST tax invoice produced via MSME AI Business Assistant. No physical signature required.', 36, 792, { align: 'center', width: 523 });

    doc.end();
  }
}

module.exports = PDFService;
