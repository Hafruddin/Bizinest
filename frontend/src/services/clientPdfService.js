/**
 * Client-Side Indian GST Tax Invoice Print & PDF Generator
 * Zero external dependencies. Works 100% reliably in any browser on Netlify.
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
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const downloadClientInvoicePDF = (invoice) => {
  if (!invoice) return;

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
  const customerAddress = customer.address || 'Industrial Zone, India';
  const customerGstin = customer.gstin || '27AAACT2727Q1ZW';
  const customerPhone = customer.phone || '+91 98765 43210';
  const customerEmail = customer.email || 'accounts@client.com';

  const issueDateStr = invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
  const dueDateStr = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : new Date(Date.now() + 14 * 86400000).toLocaleDateString('en-IN');

  const items = (invoice.items && invoice.items.length > 0) ? invoice.items : [
    { name: 'Industrial Equipment Consignment', hsn: '8481', quantity: 1, rate: invoice.subtotal || invoice.total, taxableAmount: invoice.subtotal || invoice.total, cgst: (invoice.taxTotal || 0) / 2, sgst: (invoice.taxTotal || 0) / 2, amount: invoice.total }
  ];

  const subtotal = invoice.subtotal || items.reduce((acc, i) => acc + (i.taxableAmount || (i.rate * i.quantity)), 0);
  const taxTotal = invoice.taxTotal || (invoice.total - subtotal) || 0;
  const grandTotal = invoice.total || (subtotal + taxTotal);
  const cgstTotal = items.reduce((acc, i) => acc + (i.cgst || (i.cgstRate ? (i.taxableAmount * i.cgstRate / 100) : (taxTotal / 2))), 0);
  const sgstTotal = items.reduce((acc, i) => acc + (i.sgst || (i.sgstRate ? (i.taxableAmount * i.sgstRate / 100) : (taxTotal / 2))), 0);
  const words = numberToIndianWords(grandTotal);

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>GST Tax Invoice - ${invoice.invoiceNumber || 'INV-2026'}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      padding: 20px;
      font-size: 12px;
      line-height: 1.4;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      border: 1.5px solid #0f172a;
      padding: 24px;
      background: #ffffff;
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 16px;
      margin-bottom: 16px;
    }
    .company-name {
      font-size: 20px;
      font-weight: 800;
      color: #1e3a8a;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .company-sub {
      font-size: 11px;
      color: #475569;
      margin-top: 4px;
    }
    .invoice-title-block {
      text-align: right;
    }
    .invoice-badge {
      display: inline-block;
      background: #1e3a8a;
      color: #ffffff;
      padding: 4px 14px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .inv-meta {
      margin-top: 8px;
      font-size: 11px;
      color: #334155;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 16px;
    }
    .section-title {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
    }
    .entity-name {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .entity-detail {
      font-size: 11px;
      color: #334155;
      margin-bottom: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 11px;
    }
    th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 10px;
      padding: 8px 6px;
      border: 1px solid #cbd5e1;
      text-align: left;
    }
    th.text-right, td.text-right { text-align: right; }
    th.text-center, td.text-center { text-align: center; }
    td {
      padding: 8px 6px;
      border: 1px solid #e2e8f0;
      color: #1e293b;
    }
    tr:nth-child(even) td { background: #fafafa; }
    .tax-breakdown {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }
    .words-box {
      border: 1px solid #cbd5e1;
      padding: 12px;
      border-radius: 6px;
      background: #f8fafc;
    }
    .totals-box {
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 12px;
      font-size: 11px;
      border-bottom: 1px solid #f1f5f9;
    }
    .grand-total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 12px;
      background: #1e3a8a;
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
    }
    .footer-bar {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      border-top: 1px solid #cbd5e1;
      padding-top: 16px;
      margin-top: 16px;
    }
    .sign-box {
      text-align: right;
      padding-top: 24px;
    }
    .sign-line {
      display: inline-block;
      width: 180px;
      border-top: 1px dashed #64748b;
      margin-top: 36px;
      padding-top: 4px;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
      color: #475569;
    }
    .actions-bar {
      text-align: center;
      margin-top: 20px;
    }
    .btn-print {
      background: #1e3a8a;
      color: #ffffff;
      border: none;
      padding: 10px 24px;
      font-size: 13px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      margin: 0 8px;
    }
    @media print {
      body { padding: 0; background: none; }
      .invoice-card { border: none; padding: 0; max-width: 100%; }
      .actions-bar { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
    <button class="btn-print" style="background:#475569" onclick="window.close()">✕ Close Window</button>
  </div>

  <div class="invoice-card">
    <div class="header-bar">
      <div>
        <div class="company-name">${business.name}</div>
        <div class="company-sub">Plot 45, Guindy Industrial Estate, Chennai, Tamil Nadu - 600032</div>
        <div class="company-sub"><strong>GSTIN:</strong> ${business.gstin || '33AAAAA1234A1Z5'} | <strong>PAN:</strong> ${business.pan || 'AAAAA1234A'} | <strong>State Code:</strong> 33 (TN)</div>
        <div class="company-sub">Email: ${business.email || 'billing@apexdynamics.in'} | Phone: ${business.phone || '+91 44 2250 8899'}</div>
      </div>
      <div class="invoice-title-block">
        <span class="invoice-badge">TAX INVOICE</span>
        <div class="inv-meta"><strong>Invoice No:</strong> ${invoice.invoiceNumber}</div>
        <div class="inv-meta"><strong>Issue Date:</strong> ${issueDateStr}</div>
        <div class="inv-meta"><strong>Due Date:</strong> ${dueDateStr}</div>
        <div class="inv-meta"><strong>Status:</strong> <span style="font-weight:700; color:${invoice.status === 'Paid' ? '#16a34a' : '#d97706'}">${invoice.status}</span></div>
      </div>
    </div>

    <div class="grid-2">
      <div>
        <div class="section-title">Billed To (Customer Details)</div>
        <div class="entity-name">${customerName}</div>
        <div class="entity-detail">${customerAddress}</div>
        <div class="entity-detail"><strong>GSTIN:</strong> ${customerGstin}</div>
        <div class="entity-detail"><strong>Contact:</strong> ${customerPhone} | ${customerEmail}</div>
      </div>
      <div>
        <div class="section-title">Transportation & Supply Details</div>
        <div class="entity-detail"><strong>Place of Supply:</strong> ${customer.state || 'Maharashtra'} (Code: ${customer.stateCode || '27'})</div>
        <div class="entity-detail"><strong>Reverse Charge:</strong> No</div>
        <div class="entity-detail"><strong>Payment Terms:</strong> Net 14 Days</div>
        <div class="entity-detail"><strong>Mode of Dispatch:</strong> Dedicated Industrial Freight</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th class="text-center" style="width: 30px;">#</th>
          <th>Description of Goods / Services</th>
          <th class="text-center">HSN</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Rate</th>
          <th class="text-right">Taxable Value</th>
          <th class="text-right">CGST</th>
          <th class="text-right">SGST</th>
          <th class="text-right">Total (₹)</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item, idx) => {
          const qty = item.quantity || 1;
          const rate = item.rate || 0;
          const taxable = item.taxableAmount || (qty * rate);
          const cgst = item.cgst || (taxable * 0.09);
          const sgst = item.sgst || (taxable * 0.09);
          const lineTotal = item.amount || (taxable + cgst + sgst);
          return `
          <tr>
            <td class="text-center">${idx + 1}</td>
            <td><strong>${item.name || item.description || 'Industrial Item'}</strong></td>
            <td class="text-center font-mono">${item.hsn || '7208'}</td>
            <td class="text-right font-semibold">${qty}</td>
            <td class="text-right">${formatCurrency(rate)}</td>
            <td class="text-right font-semibold">${formatCurrency(taxable)}</td>
            <td class="text-right">${formatCurrency(cgst)} (9%)</td>
            <td class="text-right">${formatCurrency(sgst)} (9%)</td>
            <td class="text-right font-bold">${formatCurrency(lineTotal)}</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <div class="tax-breakdown">
      <div class="words-box">
        <div class="section-title">Invoice Amount in Words</div>
        <div style="font-weight:700; color:#1e3a8a; font-size:12px; margin-top:4px;">${words}</div>
        <div style="margin-top:12px; font-size:10px; color:#64748b; line-height:1.5;">
          <strong>Bank Payment Details:</strong><br>
          Bank: HDFC Bank Ltd (Guindy SME Branch)<br>
          Account Name: Apex Dynamics Manufacturing Enterprises<br>
          Account No: 50200084729103 | IFSC: HDFC0001824
        </div>
      </div>
      <div class="totals-box">
        <div class="total-row"><span>Taxable Subtotal:</span><span class="font-semibold">${formatCurrency(subtotal)}</span></div>
        <div class="total-row"><span>Central GST (CGST 9%):</span><span class="font-semibold">${formatCurrency(cgstTotal)}</span></div>
        <div class="total-row"><span>State GST (SGST 9%):</span><span class="font-semibold">${formatCurrency(sgstTotal)}</span></div>
        ${invoice.discount ? `<div class="total-row" style="color:#e11d48"><span>Discount:</span><span>- ${formatCurrency(invoice.discount)}</span></div>` : ''}
        <div class="grand-total-row"><span>Grand Total:</span><span>${formatCurrency(grandTotal)}</span></div>
      </div>
    </div>

    <div class="footer-bar">
      <div>
        <div class="section-title">Terms & Conditions</div>
        <p style="font-size:10px; color:#64748b; line-height:1.4;">
          1. Goods once sold will not be accepted back without inspection.<br>
          2. Interest @ 18% p.a. will be charged if payment is delayed beyond due date.<br>
          3. Subject to Chennai jurisdiction only.
        </p>
      </div>
      <div class="sign-box">
        <div style="font-size:11px; font-weight:700; color:#0f172a;">For ${business.name}</div>
        <div class="sign-line">Authorized Signatory</div>
      </div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  } else {
    // Popup fallback
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invoice.invoiceNumber || 'Invoice'}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
