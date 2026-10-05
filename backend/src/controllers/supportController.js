const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const demoStore = require('../utils/demoStore');

const getTickets = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      try {
        const businessId = req.businessId || req.user?.businessId?._id || req.user?.businessId;
        const tickets = await Ticket.find({ businessId }).sort({ createdAt: -1 });
        if (tickets && tickets.length > 0) {
          return res.status(200).json({ status: 'success', data: tickets });
        }
      } catch (err) {
        console.warn('Support DB fetch warning, using in-memory demoStore:', err.message);
      }
    }
    return res.status(200).json({ status: 'success', data: demoStore.tickets });
  } catch (error) {
    next(error);
  }
};

const createTicket = async (req, res, next) => {
  try {
    const { title, description, customerName, customerEmail, priority = 'Medium' } = req.query.title ? req.query : req.body;

    const newTicket = {
      _id: `tkt_${Date.now()}`,
      title: title || 'General Inquiry',
      description,
      customerName: customerName || 'Enterprise Buyer',
      customerEmail: customerEmail || 'buyer@example.com',
      priority,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    if (mongoose.connection.readyState === 1) {
      try {
        const t = new Ticket(newTicket);
        await t.save();
      } catch (err) {
        console.warn('DB Ticket save warning:', err.message);
      }
    }

    demoStore.tickets.unshift(newTicket);

    return res.status(201).json({
      status: 'success',
      message: 'Ticket recorded successfully',
      data: newTicket,
    });
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, assignedTo } = req.body;

    if (mongoose.connection.readyState === 1) {
      const ticket = await Ticket.findOneAndUpdate({ _id: id }, { status, assignedTo }, { new: true });
      if (ticket) {
        return res.status(200).json({ status: 'success', message: 'Ticket updated successfully', data: ticket });
      }
    }

    const t = demoStore.tickets.find(tk => tk._id === id || tk.id === id);
    if (t) {
      if (status) t.status = status;
      if (assignedTo) t.assignedTo = assignedTo;
      return res.status(200).json({ status: 'success', message: 'Ticket updated successfully', data: t });
    }

    return res.status(404).json({ status: 'error', message: 'Ticket not found' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  createTicket,
  updateTicket,
};
