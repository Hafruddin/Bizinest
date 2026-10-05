const mongoose = require('mongoose');
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const AIService = require('../services/aiService');
const demoStore = require('../utils/demoStore');

/**
 * Get all inventory products with filtering, search, sorting and pagination.
 */
const getProducts = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user?.businessId?._id || req.user?.businessId || '6a9fa2b3a290f13a38ef94bb';
    const { search, category, status, page = 1, limit = 10, sort = 'name' } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { businessId: targetBusinessId };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
        ];
      }
      if (category) query.category = category;
      if (status === 'low-stock') {
        query.$expr = { $lte: ['$quantity', '$minStockThreshold'] };
      }

      const skipIndex = (page - 1) * limit;
      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .populate('supplierId')
        .sort(sort)
        .limit(Number(limit))
        .skip(skipIndex);

      return res.status(200).json({
        status: 'success',
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
        data: products,
      });
    }

    // In-memory fallback
    let list = [...demoStore.products];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s));
    }
    if (category) {
      list = list.filter(p => p.category === category);
    }
    if (status === 'low-stock') {
      list = list.filter(p => p.quantity <= p.minStockThreshold);
    }

    return res.status(200).json({
      status: 'success',
      total: list.length,
      pages: 1,
      currentPage: 1,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add a new product to inventory.
 */
const createProduct = async (req, res, next) => {
  try {
    const targetBusinessId = req.businessId || req.user?.businessId?._id || req.user?.businessId || '6a9fa2b3a290f13a38ef94bb';
    const { name, sku, barcode, description, category, price, cost, quantity, minStockThreshold, supplierName } = req.query.name ? req.query : req.body;

    if (mongoose.connection.readyState === 1) {
      let supplierId = null;
      if (supplierName) {
        let supplier = await Supplier.findOne({ businessId: targetBusinessId, name: supplierName });
        if (!supplier) {
          supplier = new Supplier({ businessId: targetBusinessId, name: supplierName });
          await supplier.save();
        }
        supplierId = supplier._id;
      }

      const newProduct = new Product({
        businessId: targetBusinessId,
        name,
        sku,
        barcode,
        description,
        category,
        price,
        cost,
        quantity,
        minStockThreshold,
        supplierId,
      });

      await newProduct.save();

      return res.status(201).json({
        status: 'success',
        message: 'Product added successfully',
        data: newProduct,
      });
    }

    // In-memory create
    const newProduct = {
      _id: `prod_${Date.now()}`,
      id: `prod_${Date.now()}`,
      businessId: targetBusinessId,
      name,
      sku: sku || `SKU-${Date.now()}`,
      barcode: barcode || `${Date.now()}`,
      description,
      category: category || 'General',
      price: Number(price || 0),
      cost: Number(cost || 0),
      quantity: Number(quantity || 0),
      minStockThreshold: Number(minStockThreshold || 10),
      supplierId: supplierName ? { name: supplierName } : null,
    };
    demoStore.products.unshift(newProduct);

    return res.status(201).json({
      status: 'success',
      message: 'Product added successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing product.
 */
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findOneAndUpdate(
        { _id: id },
        updates,
        { new: true, runValidators: true }
      ).populate('supplierId');

      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Product updated successfully',
        data: product,
      });
    }

    const index = demoStore.products.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({ status: 'error', message: 'Product not found' });
    }

    demoStore.products[index] = { ...demoStore.products[index], ...updates };

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully',
      data: demoStore.products[index],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product.
 */
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1) {
      const product = await Product.findOneAndDelete({ _id: id });
      if (!product) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
      return res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
    }

    const index = demoStore.products.findIndex(p => p._id === id || p.id === id);
    if (index !== -1) {
      demoStore.products.splice(index, 1);
    }
    return res.status(200).json({ status: 'success', message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch low stock alerts and restock targets.
 */
const getLowStock = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const targetBusinessId = req.businessId || req.user?.businessId?._id || req.user?.businessId || '6a9fa2b3a290f13a38ef94bb';
      const lowStockProducts = await Product.find({
        businessId: targetBusinessId,
        $expr: { $lte: ['$quantity', '$minStockThreshold'] },
      }).populate('supplierId');

      return res.status(200).json({
        status: 'success',
        count: lowStockProducts.length,
        data: lowStockProducts,
      });
    }

    const lowStockProducts = demoStore.products.filter(p => p.quantity <= p.minStockThreshold);
    return res.status(200).json({
      status: 'success',
      count: lowStockProducts.length,
      data: lowStockProducts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate AI restock suggestions and inventory analysis.
 */
const getInventoryInsights = async (req, res, next) => {
  try {
    const products = mongoose.connection.readyState === 1 
      ? await Product.find({ businessId: req.businessId }).populate('supplierId')
      : demoStore.products;

    if (products.length === 0) {
      return res.status(200).json({
        status: 'success',
        data: 'No products registered yet. Add inventory products to generate AI recommendations.',
      });
    }

    const productSummary = products.map(p => ({
      name: p.name,
      sku: p.sku,
      category: p.category,
      quantity: p.quantity,
      minStockThreshold: p.minStockThreshold,
      price: p.price,
      supplier: p.supplierId?.name || 'JSW / Hindalco / Polycab',
    }));

    const prompt = `
You are the **Enterprise AI Inventory Advisor**. Review current inventory details:
${JSON.stringify(productSummary, null, 2)}

Provide:
1. Low Stock Alerts: Identify items that are critically low.
2. Auto-Restock Suggestions: For each low stock item, calculate a recommended reorder quantity based on standard stock buffer levels.
3. Supplier Summary: Summarize which suppliers need to be contacted for reordering.
4. General optimization tips.

Format your response in beautiful, clear markdown, using lists or tables where appropriate.
`;

    const insights = await AIService.generateText(prompt);

    return res.status(200).json({
      status: 'success',
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStock,
  getInventoryInsights,
};
