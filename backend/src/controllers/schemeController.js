const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const AIService = require('../services/aiService');
const demoStore = require('../utils/demoStore');

/**
 * Fetch list of all government schemes.
 */
const getSchemes = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const schemes = await Scheme.find().sort({ name: 1 });
      if (schemes && schemes.length > 0) {
        return res.status(200).json({
          status: 'success',
          data: schemes,
        });
      }
    }

    return res.status(200).json({
      status: 'success',
      data: demoStore.schemes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * AI Eligibility Matcher checking business metrics against seeded scheme requirements.
 */
const matchSchemes = async (req, res, next) => {
  try {
    const { businessAttributes } = req.body;
    const schemesList = demoStore.schemes;

    const schemesSummary = schemesList.map(s => ({
      name: s.name,
      ministry: s.ministry,
      eligibility: s.eligibilityCriteria,
      benefits: s.benefits,
    }));

    const prompt = `
You are the **Government Scheme Advisor**.
Analyze the business details:
${JSON.stringify(businessAttributes || { industry: 'Manufacturing & Industrial Equipment', turnover: '₹1.8 Crores', employees: 18, state: 'Tamil Nadu' }, null, 2)}

Compare them against the registered government schemes in India:
${JSON.stringify(schemesSummary, null, 2)}

Provide:
1. Eligibility Report: Which schemes does this business qualify for?
2. Benefit Matrix: What financial or structural assistance will they get?
3. Action Plan: Clear step-by-step guidance on how they can apply, and which exact documents they need to gather.

Format your response in beautiful, encouraging, professional markdown with lists or table comparisons.
`;

    const recommendation = await AIService.generateText(prompt);

    return res.status(200).json({
      status: 'success',
      data: recommendation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchemes,
  matchSchemes,
};
