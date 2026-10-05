const PDFDocument = require('pdfkit');

/**
 * Service to generate professional invoice PDFs using PDFKit.
 */
class PDFService {
  /**
   * Generates invoice PDF stream.
   * @param {object} invoice - Invoice database object populated with customer & business info
   * @param {res} res - Express response stream
   */
  static generateInvoicePDF(invoice, res) {
    const doc = new PDFDocument({ margin: 50 });

    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${invoice.invoiceNumber}.pdf`);
    doc.pipe(res);

    // Color Palette
    const primaryColor = '#1e3a8a'; // Deep Navy
    const secondaryColor = '#4b5563'; // Slate gray
    const lightGray = '#f3f4f6';

    // --- Header ---
    doc
      .fillColor(primaryColor)
      .fontSize(20)
      .text(invoice.businessId?.name || 'My Enterprise', 50, 50, { bold: true })
      .fontSize(10)
      .fillColor(secondaryColor)
      .text(invoice.businessId?.address?.street || '')
      .text(`${invoice.businessId?.address?.city || ''}, ${invoice.businessId?.address?.state || ''} - ${invoice.businessId?.address?.zip || ''}`)
      .text(`GSTIN: ${invoice.businessId?.gstin || 'N/A'}`)
      .moveDown();

    doc
      .fillColor(primaryColor)
      .fontSize(24)
      .text('TAX INVOICE', 350, 50, { align: 'right' })
      .fontSize(10)
      .fillColor(secondaryColor)
      .text(`Invoice #: ${invoice.invoiceNumber}`, 350, 80, { align: 'right' })
      .text(`Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}`, 350, 95, { align: 'right' })
      .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 350, 110, { align: 'right' });

    // Draw horizontal separator
    doc.moveTo(50, 140).lineTo(550, 140).stroke('#e5e7eb');

    // --- Bill To ---
    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .text('BILL TO:', 50, 160, { bold: true })
      .fontSize(10)
      .fillColor(secondaryColor)
      .text(invoice.customerId?.name || 'Customer Name')
      .text(invoice.customerId?.email || '')
      .text(invoice.customerId?.phone || '')
      .text(invoice.customerId?.address || '');

    doc.moveDown(2);

    // --- Items Table ---
    let y = 250;
    
    // Table Headers
    doc
      .fillColor(primaryColor)
      .fontSize(10)
      .text('ITEM', 50, y, { bold: true })
      .text('QTY', 230, y, { width: 40, align: 'right', bold: true })
      .text('RATE', 280, y, { width: 60, align: 'right', bold: true })
      .text('TAX', 350, y, { width: 50, align: 'right', bold: true })
      .text('AMOUNT', 450, y, { width: 100, align: 'right', bold: true });

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke('#d1d5db');
    y += 20;

    // Table Rows
    doc.fillColor('#000000');
    invoice.items.forEach((item) => {
      const taxRate = item.cgst + item.sgst + item.igst;
      doc
        .text(item.name, 50, y, { width: 170 })
        .text(item.quantity.toString(), 230, y, { width: 40, align: 'right' })
        .text(`Rs. ${item.rate.toFixed(2)}`, 280, y, { width: 60, align: 'right' })
        .text(`${taxRate}%`, 350, y, { width: 50, align: 'right' })
        .text(`Rs. ${item.amount.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
      
      y += 20;
    });

    doc.moveTo(50, y + 5).lineTo(550, y + 5).stroke('#e5e7eb');
    y += 15;

    // --- Summary Section ---
    const summaryX = 350;
    doc
      .fillColor(secondaryColor)
      .text('Subtotal:', summaryX, y, { width: 100 })
      .text(`Rs. ${invoice.subtotal.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
    y += 15;

    doc
      .text('Tax (GST):', summaryX, y, { width: 100 })
      .text(`Rs. ${invoice.taxTotal.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
    y += 15;

    if (invoice.discount > 0) {
      doc
        .text('Discount:', summaryX, y, { width: 100 })
        .text(`- Rs. ${invoice.discount.toFixed(2)}`, 450, y, { width: 100, align: 'right' });
      y += 15;
    }

    doc.moveTo(summaryX, y).lineTo(550, y).stroke('#e5e7eb');
    y += 5;

    doc
      .fillColor(primaryColor)
      .fontSize(12)
      .text('Total Due:', summaryX, y, { width: 100, bold: true })
      .text(`Rs. ${invoice.total.toFixed(2)}`, 450, y, { width: 100, align: 'right', bold: true });

    // --- Footer ---
    doc
      .fillColor(secondaryColor)
      .fontSize(8)
      .text('Thank you for your business!', 50, 700, { align: 'center' })
      .text('Generated dynamically via Business AI Assistant for Enterprises.', 50, 715, { align: 'center' });

    doc.end();
  }
}

module.exports = PDFService;
