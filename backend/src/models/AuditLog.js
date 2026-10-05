const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['AUTH', 'INVOICE', 'INVENTORY', 'FINANCE', 'DOCUMENT', 'SYSTEM', 'AI'],
      default: 'SYSTEM',
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('AuditLog', AuditLogSchema);
