import { jsPDF } from 'jspdf/dist/jspdf.umd.min.js';

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
 * Client-Side Indian GST Tax Invoice Generator using jsPDF.
 * Used seamlessly on Netlify / Client offline mode.
 */
export const downloadClientInvoicePDF = (invoice) => {
  const doc = new jsPDF({ format: 'a4', unit: 'pt' });

  const primaryR = 30, primaryG = 58, primaryB = 138;      // #1e3a8a
  const darkR = 15, darkG = 23, darkB = 42;               // #0f172a
  const grayR = 71, grayG = 85, grayB = 105;              // #475569
  const borderR = 203, borderG = 213, borderB = 225;      // #cbd5e1

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

  const customer = invoice.customerId || invoice.customer || {};
  const customerName = customer.name || 'Enterprise Client';
  const customerAddress = customer.address || 'Mumbai, Maharashtra, India';
  const customerGstin = customer.gstin || '27AAACT2727Q1ZW';
  const customerState = customer.state || 'Maharashtra';
  const customerStateCode = customer.stateCode || '27';

  const issueDateStr = invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const dueDateStr = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN');

  // --- Top Left: Enterprise Seller Details ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text(business.name, 36, 48);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('Industrial Equipment & Precision Engineering | MSME Reg: UDYAM-TN-02-0045129', 36, 60);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text(business.address?.street || 'Plot 45, Guindy Industrial Estate', 36, 72);
  doc.text(`${business.address?.city || 'Chennai'}, ${business.address?.state || 'Tamil Nadu'} - ${business.address?.zip || '600032'}`, 36, 82);
  doc.text(`GSTIN: ${business.gstin || '33AAAAA1234A1Z5'} | PAN: ${business.pan || 'AAAAA1234A'} | State: Tamil Nadu (33)`, 36, 92);
  doc.text(`Phone: ${business.phone || '+91 44 2250 8899'} | Email: ${business.email || 'billing@apexdynamics.in'}`, 36, 102);

  // --- Top Right: Tax Invoice Header ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('TAX INVOICE', 559, 48, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('(Original for Recipient | Under Rule 48 of CGST Rules, 2017)', 559, 60, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 559, 73, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Invoice Date: ${issueDateStr}`, 559, 85, { align: 'right' });
  doc.text(`Due Date: ${dueDateStr}`, 559, 97, { align: 'right' });

  const status = invoice.status || 'Sent';
  doc.setFont('helvetica', 'bold');
  if (status === 'Paid') {
    doc.setTextColor(22, 163, 74);
  } else if (status === 'Overdue') {
    doc.setTextColor(217, 119, 6);
  } else {
    doc.setTextColor(primaryR, primaryG, primaryB);
  }
  doc.text(`Status: ${status.toUpperCase()}`, 559, 109, { align: 'right' });

  // --- Bill To & Logistics Details Box ---
  const boxY = 122;
  const boxHeight = 72;
  doc.setDrawColor(borderR, borderG, borderB);
  doc.setFillColor(248, 250, 252);
  doc.rect(36, boxY, 523, boxHeight, 'FD');
  doc.line(295, boxY, 295, boxY + boxHeight);

  // Left: Bill To
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('BILL TO (BUYER / RECIPIENT DETAILS):', 44, boxY + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text(customerName, 44, boxY + 27);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text(customerAddress, 44, boxY + 39);
  doc.text(`GSTIN: ${customerGstin} | State: ${customerState} (${customerStateCode})`, 44, boxY + 50);
  doc.text(`Email: ${customer.email || 'procurement@client.in'} | Phone: ${customer.phone || '9876543210'}`, 44, boxY + 61);

  // Right: Logistics & Taxes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('DISPATCH & TAXATION PARTICULARS:', 305, boxY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text(`Place of Supply: ${customerState} (${customerStateCode})`, 305, boxY + 27);
  doc.text('Dispatch Location: Guindy Industrial Estate, Chennai (33)', 305, boxY + 39);
  doc.text('Reverse Charge (RCM): No | Transport Mode: Surface Freight', 305, boxY + 50);
  doc.text('Payment Terms: Net 14 Days (Direct Bank Transfer / NEFT / RTGS)', 305, boxY + 61);

  // --- Line Items Table ---
  let tableY = 204;
  const headerH = 20;
  doc.setFillColor(241, 245, 249);
  doc.rect(36, tableY, 523, headerH, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('#', 48, tableY + 13, { align: 'center' });
  doc.text('ITEM DESCRIPTION', 65, tableY + 13);
  doc.text('HSN/SAC', 245, tableY + 13, { align: 'center' });
  doc.text('QTY', 295, tableY + 13, { align: 'right' });
  doc.text('RATE', 355, tableY + 13, { align: 'right' });
  doc.text('TAXABLE VAL', 425, tableY + 13, { align: 'right' });
  doc.text('TAX %', 468, tableY + 13, { align: 'center' });
  doc.text('TOTAL (Rs)', 550, tableY + 13, { align: 'right' });

  tableY += headerH;

  const items = Array.isArray(invoice.items) && invoice.items.length > 0 ? invoice.items : [
    { name: 'Industrial Equipment & Materials', hsn: '7208', quantity: 1, rate: 50000, taxRate: 18, amount: 59000 }
  ];

  const taxSummaryMap = {};
  let calculatedSubtotal = 0;
  let calculatedTaxTotal = 0;

  items.forEach((item, idx) => {
    const qty = Number(item.quantity) || 1;
    const rate = Number(item.rate) || 0;
    const taxable = item.taxableAmount !== undefined ? Number(item.taxableAmount) : (qty * rate);

    let taxPercent = 18;
    if (typeof item.taxRate === 'number' && !isNaN(item.taxRate) && item.taxRate > 0) {
      taxPercent = item.taxRate;
    } else if (typeof item.gstPercent === 'number' && !isNaN(item.gstPercent) && item.gstPercent > 0) {
      taxPercent = item.gstPercent;
    } else if (item.cgstRate && item.sgstRate) {
      taxPercent = item.cgstRate + item.sgstRate;
    } else if (taxable > 0 && (item.cgst || item.sgst)) {
      const sumTax = (Number(item.cgst) || 0) + (Number(item.sgst) || 0) + (Number(item.igst) || 0);
      if (sumTax < 100) taxPercent = sumTax;
      else taxPercent = Math.round((sumTax / taxable) * 100);
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

    if (!taxSummaryMap[taxPercent]) {
      taxSummaryMap[taxPercent] = {
        hsn,
        taxPercent,
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

    const rowH = 19;
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(36, tableY, 523, rowH, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(darkR, darkG, darkB);
    doc.text((idx + 1).toString(), 48, tableY + 12, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(item.name || 'Industrial Product', 65, tableY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(hsn, 245, tableY + 12, { align: 'center' });
    doc.text(qty.toString(), 295, tableY + 12, { align: 'right' });
    doc.text(rate.toFixed(2), 355, tableY + 12, { align: 'right' });
    doc.text(taxable.toFixed(2), 425, tableY + 12, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(primaryR, primaryG, primaryB);
    doc.text(`${taxPercent}%`, 468, tableY + 12, { align: 'center' });
    doc.setTextColor(darkR, darkG, darkB);
    doc.text(itemFinalTotal.toFixed(2), 550, tableY + 12, { align: 'right' });

    tableY += rowH;
  });

  doc.line(36, tableY, 559, tableY);
  tableY += 10;

  const finalSubtotal = Number(invoice.subtotal) || calculatedSubtotal;
  const finalTaxTotal = Number(invoice.taxTotal) || calculatedTaxTotal;
  const finalDiscount = Number(invoice.discount) || 0;
  const finalGrandTotal = Number(invoice.total) || (finalSubtotal + finalTaxTotal - finalDiscount);

  // --- GST Tax Computation Breakdown Table ---
  const taxSectionY = tableY;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('GST TAX COMPUTATION BREAKDOWN (Central Govt Tax CGST + State Govt Tax SGST)', 36, taxSectionY + 8);

  const taxGridY = taxSectionY + 14;
  const taxHeaderH = 18;
  doc.setFillColor(241, 245, 249);
  doc.rect(36, taxGridY, 523, taxHeaderH, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text('HSN / SAC', 44, taxGridY + 12);
  doc.text('TAXABLE VALUE', 170, taxGridY + 12, { align: 'right' });
  doc.text('CENTRAL TAX (CGST)', 260, taxGridY + 12, { align: 'center' });
  doc.text('STATE TAX (SGST)', 375, taxGridY + 12, { align: 'center' });
  doc.text('TOTAL TAX AMOUNT', 550, taxGridY + 12, { align: 'right' });

  let taxRowY = taxGridY + taxHeaderH;
  Object.values(taxSummaryMap).forEach((ts) => {
    const rowH = 17;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(darkR, darkG, darkB);
    doc.text(ts.hsn, 44, taxRowY + 11);
    doc.text(formatCurrency(ts.taxable), 170, taxRowY + 11, { align: 'right' });
    doc.text(`${ts.cgstRate}% (${formatCurrency(ts.cgstAmt)})`, 260, taxRowY + 11, { align: 'center' });
    doc.text(`${ts.sgstRate}% (${formatCurrency(ts.sgstAmt)})`, 375, taxRowY + 11, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(ts.totalTax), 550, taxRowY + 11, { align: 'right' });
    taxRowY += rowH;
  });

  const totalCentralTax = Object.values(taxSummaryMap).reduce((acc, ts) => acc + ts.cgstAmt, 0);
  const totalStateTax = Object.values(taxSummaryMap).reduce((acc, ts) => acc + ts.sgstAmt, 0);

  doc.setFillColor(248, 250, 252);
  doc.rect(36, taxRowY, 523, 17, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('TOTAL TAX:', 44, taxRowY + 11);
  doc.text(formatCurrency(finalSubtotal), 170, taxRowY + 11, { align: 'right' });
  doc.text(`Govt CGST: ${formatCurrency(totalCentralTax)}`, 260, taxRowY + 11, { align: 'center' });
  doc.text(`State SGST: ${formatCurrency(totalStateTax)}`, 375, taxRowY + 11, { align: 'center' });
  doc.text(formatCurrency(finalTaxTotal), 550, taxRowY + 11, { align: 'right' });

  taxRowY += 24;

  // --- Summary & Settlement Section ---
  const summaryBoxY = taxRowY;
  const leftW = 280;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('Total Invoice Amount in Words:', 36, summaryBoxY + 8);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text(numberToIndianWords(finalGrandTotal), 36, summaryBoxY + 20, { maxWidth: leftW });

  // Bank Details Box
  const bankY = summaryBoxY + 36;
  doc.setFillColor(248, 250, 252);
  doc.rect(36, bankY, leftW, 58, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('BANK DETAILS FOR NEFT / RTGS / IMPS PAYMENT:', 42, bankY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('Bank Name: State Bank of India (SBI)', 42, bankY + 25);
  doc.text('Account Name: Apex Dynamics Manufacturing Enterprises', 42, bankY + 35);
  doc.text('Account Number: 987654321098 | Account Type: Current A/C', 42, bankY + 45);
  doc.text('IFSC Code: SBIN0001234 | Branch: Guindy Industrial Estate, Chennai', 42, bankY + 55);

  // Right: Calculation Summary Box
  const rightX = 330;
  const rightW = 229;
  doc.setFillColor(248, 250, 252);
  doc.rect(rightX, summaryBoxY, rightW, 94, 'FD');

  let calcY = summaryBoxY + 14;
  const printLine = (label, value, isBold = false, color = darkR, fontSize = 7.5) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    doc.setTextColor(color === darkR ? darkR : (color === primaryR ? primaryR : 225), color === darkR ? darkG : (color === primaryR ? primaryG : 29), color === darkR ? darkB : (color === primaryR ? primaryB : 72));
    doc.text(label, rightX + 10, calcY);
    doc.text(value, rightX + rightW - 10, calcY, { align: 'right' });
    calcY += 13;
  };

  printLine('Taxable Subtotal:', formatCurrency(finalSubtotal));
  printLine('Govt Central Tax (CGST):', formatCurrency(totalCentralTax));
  printLine('State Govt Tax (SGST):', formatCurrency(totalStateTax));
  printLine('Total GST Tax:', formatCurrency(finalTaxTotal));

  if (finalDiscount > 0) {
    printLine('Discount:', `- ${formatCurrency(finalDiscount)}`, false, 'rose');
  }

  doc.line(rightX + 10, calcY, rightX + rightW - 10, calcY);
  calcY += 8;

  printLine('Grand Total Due:', formatCurrency(finalGrandTotal), true, primaryR, 9);

  // --- Footer Terms & Signatory ---
  const footerY = summaryBoxY + 106;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(primaryR, primaryG, primaryB);
  doc.text('TERMS & CONDITIONS:', 36, footerY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('1. Goods once sold will not be accepted back or exchanged.', 36, footerY + 18);
  doc.text('2. Payment is strictly due within 14 days from invoice issue date.', 36, footerY + 26);
  doc.text('3. Interest @ 18% per annum will be charged on overdue payments beyond due date.', 36, footerY + 34);
  doc.text('4. Any legal disputes are subject to Chennai, Tamil Nadu jurisdiction only.', 36, footerY + 42);

  const sigX = 550;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text(`For ${business.name}`, sigX, footerY + 8, { align: 'right' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('[ Digitally Signed & Approved ]', sigX, footerY + 32, { align: 'right' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(darkR, darkG, darkB);
  doc.text('Authorized Signatory', sigX, footerY + 42, { align: 'right' });

  doc.line(36, 785, 559, 785);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(grayR, grayG, grayB);
  doc.text('This is an authenticated computer-generated GST tax invoice produced via MSME AI Business Assistant. No physical signature required.', 297, 795, { align: 'center' });

  // Download PDF file directly in browser
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};
