const mongoose = require('mongoose');

const SchemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ministry: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eligibilityCriteria: {
      type: [String],
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    applicationProcedure: {
      type: String,
      required: true,
    },
    officialLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Scheme', SchemeSchema);
