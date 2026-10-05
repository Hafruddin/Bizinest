import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Download,
  CheckCircle,
  Loader2,
  Trash2,
  X,
  FileText,
  Trash
} from 'lucide-react';

const Invoices = () => {
  const queryClient = useQueryClient();
  const { userProfile, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  const [formMsg, setFormMsg] = useState('');

  // Fetch Invoices
  const { data: invoicesRes, isLoading } = useQuery({
    queryKey: ['invoices', search, status],
    queryFn: async () => {
      const res = await api.get('/invoices', {
        params: { search, status }
      });
      return res.data;
    }
  });

  // Fetch Inventory Products for dropdown selection
  const { data: productsRes } = useQuery({
    queryKey: ['products-all'],
    queryFn: async () => {
      const res = await api.get('/inventory', { params: { limit: 100 } });
      return res.data;
    }
  });

  const products = Array.isArray(productsRes) ? productsRes : (productsRes?.data || []);
  const invoices = Array.isArray(invoicesRes) ? invoicesRes : (invoicesRes?.data || []);

  // Create Invoice Mutation
  const createMutation = useMutation({
    mutationFn: async (invoiceData) => {
      return await api.post('/invoices', invoiceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboardStats']);
      showToast('Invoice generated successfully!', 'success');
      setShowAddForm(false);
      // Reset states
      setInvoiceNumber('');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCustomerAddress('');
      setDueDate('');
      setInvoiceItems([]);
      setDiscount(0);
      setFormMsg('');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Failed to create invoice.';
      setFormMsg(errMsg);
      showToast(errMsg, 'error');
    }
  });

  // Update Status Mutation (Mark as Paid)
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.put(`/invoices/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['invoices']);
      queryClient.invalidateQueries(['dashboardStats']);
      showToast('Invoice marked as Paid!', 'success');
    }
  });

  const handleAddItem = (productId) => {
    const selectedProd = products.find(p => p._id === productId);
    if (!selectedProd) return;

    // Check duplicate
    if (invoiceItems.some(i => i.productId === productId)) return;

    setInvoiceItems(prev => [
      ...prev,
      {
        productId: selectedProd._id,
        name: selectedProd.name,
        quantity: 1,
        rate: selectedProd.price,
        gstPercent: 18,
      }
    ]);
  };

  const handleItemQtyChange = (index, value) => {
    setInvoiceItems(prev => {
      const updated = [...prev];
      updated[index].quantity = Math.max(1, Number(value));
      return updated;
    });
  };

  const handleRemoveItem = (index) => {
    setInvoiceItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    if (invoiceItems.length === 0) {
      setFormMsg('Please add at least one product to the invoice.');
      return;
    }
    createMutation.mutate({
      invoiceNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      dueDate,
      items: invoiceItems,
      discount,
    });
  };

  const handleMarkAsPaid = (id) => {
    statusMutation.mutate({ id, status: 'Paid' });
  };

  const handleDownloadPDF = async (id, invoiceNumber) => {
    try {
      showToast('Generating PDF Bill...', 'info');
      const res = await api.get(`/invoices/${id}/pdf`, {
        responseType: 'blob',
      });
      
      const file = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`);
      document.body.appendChild(link);
      
      link.click();
      link.remove();
      URL.revokeObjectURL(fileURL);
      showToast('PDF Invoice downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to download invoice PDF:', err);
      showToast('Failed to download invoice PDF.', 'error');
    }
  };

  const handleDownloadCSV = (invoice) => {
    try {
      const headers = ['Invoice Number', 'Client Name', 'Client Email', 'Issue Date', 'Item Name', 'Quantity', 'Rate', 'GST %', 'Total Amount'];
      const rows = invoice.items.map(item => [
        invoice.invoiceNumber,
        invoice.customerId?.name || 'Guest',
        invoice.customerId?.email || 'N/A',
        new Date(invoice.issueDate).toLocaleDateString(),
        item.name,
        item.quantity,
        item.rate,
        18,
        item.amount
      ]);

      // Append summary row
      rows.push([
        'SUBTOTAL',
        invoice.subtotal,
        'TAX TOTAL',
        invoice.taxTotal,
        'DISCOUNT',
        invoice.discount,
        'GRAND TOTAL',
        '',
        invoice.total
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Invoice-${invoice.invoiceNumber}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      showToast('Invoice exported to CSV/Excel!', 'success');
    } catch (err) {
      console.error('Failed to export CSV:', err);
      showToast('Failed to export CSV/Excel.', 'error');
    }
  };

  // Compute live subtotal & total
  const computedSubtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const computedTax = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.rate * (item.gstPercent / 100)), 0);
  const computedGrandTotal = computedSubtotal + computedTax - Number(discount);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Billing & Invoices</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate professional GST invoices, calculate taxes, download PDFs, and record client transactions.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors w-fit"
        >
          <Plus className="h-4 w-4" /> Create Invoice
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Sent">Sent</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Add Invoice Drawer Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateInvoice} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-base">Generate GST Tax Invoice</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                {formMsg}
              </div>
            )}

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[60vh] overflow-y-auto">
              {/* Left Form: Customer Details */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Billing Info</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Invoice Code</label>
                    <input
                      type="text"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      required
                      placeholder="INV-0001"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="Rajesh Kumar"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                      placeholder="rajesh@gmail.com"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      placeholder="+91 9876543210"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Billing Address (Includes State)</label>
                    <input
                      type="text"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      required
                      placeholder="12, Residency Rd, Bangalore, Karnataka"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Right Form: Item selections */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Select Products</h4>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Search & Add Product</label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Choose item to add...</option>
                    {products.map(p => (
                      <option key={p._id} value={p._id} disabled={p.quantity <= 0}>
                        {p.name} (Qty: {p.quantity}) - ₹{p.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected items overview */}
                <div className="space-y-3 pt-2">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invoice Items</span>
                  {invoiceItems.length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic">No products added. Add items from dropdown above.</p>
                  ) : (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {invoiceItems.map((item, index) => (
                        <div key={item.productId} className="flex justify-between items-center gap-2 p-2 border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl text-[11px]">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate">{item.name}</p>
                            <p className="text-[9px] text-slate-400">₹{item.rate.toLocaleString('en-IN')} x {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) => handleItemQtyChange(index, e.target.value)}
                              className="w-10 text-center rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-0.5 text-[10px]"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(index)}
                              className="text-slate-450 hover:text-rose-500"
                            >
                              <Trash className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Discount parameter */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Discount Coupon (₹)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Calculation Summary box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{computedSubtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated GST (18%):</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">₹{computedTax.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-rose-500">
                      <span>Discount:</span>
                      <span>- ₹{Number(discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                    <span>Grand Total:</span>
                    <span>₹{computedGrandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Filing...' : 'File Invoice'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Invoice Listing */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Fetching invoice statement...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20">
            <FileSpreadsheet className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Invoices Filed</h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 mb-6">Create invoice records to adjust warehouse counts and track tax margins.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
            >
              <Plus className="h-4 w-4" /> Generate Invoice
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Invoice Number</th>
                  <th className="py-4 px-4">Client Detail</th>
                  <th className="py-4 px-4">Issue Date</th>
                  <th className="py-4 px-4 text-right">Grand Total</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6 font-semibold font-mono text-slate-900 dark:text-slate-100">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-slate-850 dark:text-slate-300">{invoice.customerId?.name || 'Customer'}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">{invoice.customerId?.email}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(invoice.issueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-slate-900 dark:text-slate-100">
                      ₹{invoice.total.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : invoice.status === 'Sent'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-450'
                      }`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {invoice.status !== 'Paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(invoice._id)}
                            title="Mark as Paid"
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-450 hover:text-emerald-600 hover:border-emerald-500/25 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadPDF(invoice._id, invoice.invoiceNumber)}
                          title="Download PDF Bill"
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-500/25 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadCSV(invoice)}
                          title="Download Excel/CSV"
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-emerald-600 hover:border-emerald-500/25 transition-colors"
                        >
                          <FileSpreadsheet className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
