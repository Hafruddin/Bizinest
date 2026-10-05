const mongoose = require('mongoose');

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'General Compliance',
    },
    content: {
      type: String,
      required: true,
    },
    tags: [String],
    embedding: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
