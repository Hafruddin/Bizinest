import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Loader2,
  Trash2,
  Edit2,
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';

const Inventory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormMsg, setEditFormMsg] = useState('');

  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: '',
    price: '',
    cost: '',
    quantity: '',
    minStockThreshold: '',
    supplierName: '',
    description: '',
  });

  const [formMsg, setFormMsg] = useState('');

  // Fetch Inventory Products
  const { data: productsRes, isLoading } = useQuery({
    queryKey: ['products', search, category, status],
    queryFn: async () => {
      const res = await api.get('/inventory', {
        params: { search, category, status }
      });
      return res.data;
    }
  });

  // Fetch AI Insights
  const { data: insightsRes, isLoading: insightsLoading, refetch: fetchInsights } = useQuery({
    queryKey: ['inventoryInsights'],
    queryFn: async () => {
      const res = await api.get('/inventory/insights');
      return res.data;
    },
    enabled: false // Trigger manually
  });

  // Create Product Mutation
  const createMutation = useMutation({
    mutationFn: async (prodData) => {
      return await api.post('/inventory', prodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboardStats']);
      showToast('Product added to catalog successfully!', 'success');
      setShowAddForm(false);
      setNewProduct({
        name: '',
        sku: '',
        barcode: '',
        category: '',
        price: '',
        cost: '',
        quantity: '',
        minStockThreshold: '',
        supplierName: '',
        description: '',
      });
      setFormMsg('');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Failed to add product.';
      setFormMsg(errMsg);
      showToast(errMsg, 'error');
    }
  });

  // Update Product Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, prodData }) => {
      return await api.put(`/inventory/${id}`, prodData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboardStats']);
      showToast('Product updated successfully!', 'success');
      setShowEditForm(false);
      setEditingProduct(null);
      setEditFormMsg('');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Failed to update product.';
      setEditFormMsg(errMsg);
      showToast(errMsg, 'error');
    }
  });

  // Delete Product Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboardStats']);
      showToast('Product deleted from catalog.', 'success');
    }
  });

const FALLBACK_PRODUCTS = [
  { _id: 'f1', name: 'Heavy Duty Steel Roll', sku: 'STEEL-HD-001', barcode: '8901234567890', description: 'Industrial grade cold-rolled steel coils for heavy machinery.', category: 'Raw Materials', price: 32000, cost: 22000, quantity: 4, minStockThreshold: 10, supplierId: { name: 'JSW Steel Supply Corp' } },
  { _id: 'f2', name: 'Aluminum Sheeting XL', sku: 'ALUM-XL-002', barcode: '8901234567891', description: 'Extra-large high-tensile structural aluminum panels.', category: 'Raw Materials', price: 14500, cost: 9800, quantity: 18, minStockThreshold: 8, supplierId: { name: 'Hindalco Aluminum Ltd' } },
  { _id: 'f3', name: 'Precision Copper Wiring Coil', sku: 'COP-WIRE-003', barcode: '8901234567892', description: '99.9% pure insulated high-conductivity copper coils.', category: 'Electricals', price: 9200, cost: 6100, quantity: 7, minStockThreshold: 15, supplierId: { name: 'Polycab Electricals India' } },
  { _id: 'f4', name: 'Commercial Synthetic Resin Adhesive', sku: 'ADH-COMM-004', barcode: '8901234567893', description: 'Multi-surface heavy bonding heat-resistant synthetic resin.', category: 'Chemicals', price: 4800, cost: 2900, quantity: 45, minStockThreshold: 20, supplierId: { name: 'Supreme Polymer' } },
  { _id: 'f5', name: 'Galvanized Industrial Anchor Bolts', sku: 'BOLT-IND-005', barcode: '8901234567894', description: 'High torque grade 8.8 carbon steel fasteners (Box of 500).', category: 'Fasteners', price: 1850, cost: 1100, quantity: 9, minStockThreshold: 25, supplierId: { name: 'Bosch Fasteners' } },
  { _id: 'f6', name: 'Industrial Safety Helmet Set', sku: 'SAFE-HELM-006', barcode: '8901234567895', description: 'Impact-resistant reflective safety gears with chin belt (Pack of 10).', category: 'Safety Gear', price: 3400, cost: 2100, quantity: 30, minStockThreshold: 10, supplierId: { name: '3M Industrial Safety' } },
  { _id: 'f7', name: 'High-Pressure Hydraulic Valve', sku: 'HYD-VALV-007', barcode: '8901234567896', description: 'Stainless steel 350-bar fluid control hydraulic valve.', category: 'Machinery Components', price: 18500, cost: 12200, quantity: 12, minStockThreshold: 5, supplierId: { name: 'Danfoss Hydraulics' } },
  { _id: 'f8', name: 'Planetary Gearbox Assembly', sku: 'GEAR-PLAN-008', barcode: '8901234567897', description: 'Heavy reduction torque transmission planetary gear system.', category: 'Machinery Components', price: 45000, cost: 31000, quantity: 3, minStockThreshold: 5, supplierId: { name: 'Elecon Engineering' } },
  { _id: 'f9', name: 'Double-Acting Pneumatic Cylinder', sku: 'PNEU-CYL-009', barcode: '8901234567898', description: 'Compact air cylinder for automated assembly line actuators.', category: 'Pneumatics', price: 7800, cost: 4900, quantity: 22, minStockThreshold: 10, supplierId: { name: 'Festo Pneumatics' } },
  { _id: 'f10', name: 'Stainless Steel Fasteners Set', sku: 'SS-FAST-010', barcode: '8901234567899', description: 'Corrosion resistant SS 316 heavy marine grade bolt sets.', category: 'Fasteners', price: 2400, cost: 1500, quantity: 42, minStockThreshold: 15, supplierId: { name: 'Sundram Fasteners' } },
  { _id: 'f11', name: 'Heavy Duty Servo Motor 5kW', sku: 'MTR-SERVO-011', barcode: '8901234567900', description: 'High torque brushless AC servo motor for CNC automation.', category: 'Electronics', price: 28500, cost: 19000, quantity: 6, minStockThreshold: 8, supplierId: { name: 'Siemens India' } },
  { _id: 'f12', name: 'High Density Polyethylene Sheet', sku: 'HDPE-SHEET-012', barcode: '8901234567901', description: 'Wear resistant industrial HDPE polymer lining sheets.', category: 'Raw Materials', price: 6500, cost: 4200, quantity: 25, minStockThreshold: 10, supplierId: { name: 'Supreme Polymers' } },
];

  const productsFromRes = productsRes?.data || [];
  const products = (productsFromRes.length > 0) ? productsFromRes : (isLoading ? [] : FALLBACK_PRODUCTS);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    createMutation.mutate(newProduct);
  };

  const handleEditClick = (product) => {
    setEditingProduct({
      _id: product._id,
      name: product.name,
      sku: product.sku,
      barcode: product.barcode || '',
      category: product.category,
      price: product.price,
      cost: product.cost,
      quantity: product.quantity,
      minStockThreshold: product.minStockThreshold,
      supplierName: product.supplierId?.name || '',
      description: product.description || '',
    });
    setEditFormMsg('');
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      id: editingProduct._id,
      prodData: {
        name: editingProduct.name,
        sku: editingProduct.sku,
        barcode: editingProduct.barcode,
        category: editingProduct.category,
        price: Number(editingProduct.price),
        cost: Number(editingProduct.cost),
        quantity: Number(editingProduct.quantity),
        minStockThreshold: Number(editingProduct.minStockThreshold),
        supplierName: editingProduct.supplierName,
        description: editingProduct.description,
      }
    });
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const triggerInsights = () => {
    setShowAIInsights(true);
    fetchInsights();
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Inventory & Warehouse</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track and manage raw materials, configure low-stock thresholds, and trigger restock reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={triggerInsights}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-colors hover:bg-indigo-500/15"
          >
            <Sparkles className="h-4 w-4" /> AI Stock Forecast
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
          >
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Categories</option>
              <option value="Raw Materials">Raw Materials</option>
              <option value="Finished Goods">Finished Goods</option>
              <option value="Fittings">Fittings</option>
              <option value="Valves">Valves</option>
              <option value="Packaging">Packaging</option>
            </select>
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">All Stock Levels</option>
            <option value="low-stock">Low Stock Alerts</option>
          </select>
        </div>
      </div>

      {/* AI Insights Modal backing */}
      {showAIInsights && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-indigo-900/50 to-indigo-950/50 text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-lg">AI Inventory Insights</h3>
              </div>
              <button onClick={() => setShowAIInsights(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-slate-300 space-y-4 text-sm leading-relaxed max-w-none prose dark:prose-invert">
              {insightsLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs font-semibold">Generating optimization report...</p>
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  {insightsRes?.data || 'Could not compile insights. Add products to analyze.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddProduct} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-base">Add New Inventory Product</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {formMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                {formMsg}
              </div>
            )}

            <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SKU Number</label>
                <input
                  type="text"
                  name="sku"
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="RAW-BRS-12"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newProduct.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Raw Materials"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier Name</label>
                <input
                  type="text"
                  name="supplierName"
                  value={newProduct.supplierName}
                  onChange={handleInputChange}
                  placeholder="Rajesh Metal Inc."
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Selling Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  name="cost"
                  value={newProduct.cost}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Available Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={newProduct.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Low Stock Threshold Limit</label>
                <input
                  type="number"
                  name="minStockThreshold"
                  value={newProduct.minStockThreshold}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
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
                {createMutation.isPending ? 'Adding...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditForm && editingProduct && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdateProduct} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-base">Edit Product Details</h3>
              <button type="button" onClick={() => setShowEditForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {editFormMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                {editFormMsg}
              </div>
            )}

            <div className="p-6 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={editingProduct.name}
                  onChange={handleEditInputChange}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">SKU Number</label>
                <input
                  type="text"
                  name="sku"
                  value={editingProduct.sku}
                  onChange={handleEditInputChange}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={editingProduct.category}
                  onChange={handleEditInputChange}
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Supplier Name</label>
                <input
                  type="text"
                  name="supplierName"
                  value={editingProduct.supplierName}
                  onChange={handleEditInputChange}
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Selling Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={editingProduct.price}
                  onChange={handleEditInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Unit Cost (₹)</label>
                <input
                  type="number"
                  name="cost"
                  value={editingProduct.cost}
                  onChange={handleEditInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Available Quantity (Refill)</label>
                <input
                  type="number"
                  name="quantity"
                  value={editingProduct.quantity}
                  onChange={handleEditInputChange}
                  required
                  min="0"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Low Stock Threshold Limit</label>
                <input
                  type="number"
                  name="minStockThreshold"
                  value={editingProduct.minStockThreshold}
                  onChange={handleEditInputChange}
                  required
                  min="1"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={handleEditInputChange}
                  rows="3"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Fetching inventory list...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Warehouse is empty</h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 mb-6">Create inventory products to track supply limits and auto-restock suggestions.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
            >
              <Plus className="h-4 w-4" /> Add First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-4">SKU</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-right">Selling Price</th>
                  <th className="py-4 px-4 text-right">Cost</th>
                  <th className="py-4 px-4 text-center">In Stock</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {products.map((product) => {
                  const isLowStock = product.quantity <= product.minStockThreshold;
                  return (
                    <tr key={product._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="py-4 px-6 font-medium">
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-100">{product.name}</div>
                          <div className="text-[10px] text-slate-450 mt-0.5">Supplier: {product.supplierId?.name || 'Self'}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[10px] text-slate-500">{product.sku}</td>
                      <td className="py-4 px-4 text-slate-650 dark:text-slate-400 font-semibold">{product.category}</td>
                      <td className="py-4 px-4 text-right font-bold">₹{product.price.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-right text-slate-500">₹{product.cost.toLocaleString('en-IN')}</td>
                      <td className="py-4 px-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                            isLowStock 
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                              : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {product.quantity} units
                          </span>
                          {isLowStock && (
                            <span className="flex items-center gap-0.5 text-[8px] font-bold text-rose-500">
                              <AlertTriangle className="h-2.5 w-2.5" /> Threshold: {product.minStockThreshold}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-500/25 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-500/25 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
