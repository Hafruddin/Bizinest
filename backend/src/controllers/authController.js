const User = require('../models/User');
const Business = require('../models/Business');
const { clerkClient } = require('../middlewares/auth');
const { seedBusinessDemoData } = require('../utils/seeder');

/**
 * Synchronize authenticated Clerk user with MongoDB User & Business models.
 * If user does not exist, create a new User and a default Business.
 */
const syncUser = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    // Fetch user details from Clerk to populate email/names
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (err) {
      console.error('Error fetching user from Clerk:', err);
      // Fallback/Mock mode support for local testing/development
      clerkUser = {
        emailAddresses: [{ emailAddress: `user_${userId}@example.com` }],
        firstName: '',
        lastName: '',
      };
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    let firstName = clerkUser.firstName || '';
    let lastName = clerkUser.lastName || '';

    // If no first name is found, automatically extract it from the email/gmail address prefix
    if (!firstName && email) {
      const namePart = email.split('@')[0];
      const cleanName = namePart.replace(/[._-]/g, ' ');
      const words = cleanName.split(' ');
      firstName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    if (!firstName) {
      firstName = 'Enterprise';
    }

    // Check if user already exists in DB
    let user = await User.findOne({ 
      $or: [{ clerkId: userId }, { clerkId: `mock_clerk_${userId}` }, { clerkId: 'user_123' }, { clerkId: 'mock_clerk_user_123' }]
    }).populate('businessId');

    // Find the main seeded business or create Apex Dynamics Manufacturing Enterprises
    let apexBusiness = await Business.findOne({ name: 'Apex Dynamics Manufacturing Enterprises' }) || await Business.findOne({});
    if (!apexBusiness) {
      apexBusiness = new Business({
        name: 'Apex Dynamics Manufacturing Enterprises',
        gstin: '33AAAAA1234A1Z5',
        address: {
          street: 'Plot 45, Guindy Industrial Estate',
          city: 'Chennai',
          state: 'Tamil Nadu',
          zip: '600032',
          country: 'India',
        },
        industry: 'Industrial Equipment & Manufacturing',
        currency: 'INR',
      });
      await apexBusiness.save();
      await seedBusinessDemoData(apexBusiness._id, true);
    }

    if (!user) {
      try {
        user = new User({
          clerkId: userId,
          email: email || 'admin@apexdynamics.in',
          firstName: firstName || 'Rajesh',
          lastName: lastName || 'Kumar',
          role: 'Business Owner',
          businessId: apexBusiness._id,
        });
        await user.save();
      } catch (saveErr) {
        if (saveErr.code === 11000 || saveErr.message.includes('E11000')) {
          user = await User.findOne({ clerkId: userId }).populate('businessId');
        } else {
          throw saveErr;
        }
      }
    }

    // Ensure the user's business is set to apexBusiness if empty
    if (user) {
      const Product = require('../models/Product');
      let pCount = await Product.countDocuments({ businessId: user.businessId?._id || user.businessId });
      if (pCount === 0) {
        user.businessId = apexBusiness._id;
        await user.save();
        pCount = await Product.countDocuments({ businessId: apexBusiness._id });
        if (pCount === 0) {
          await seedBusinessDemoData(apexBusiness._id, true);
        }
      }
      user = await User.findById(user._id).populate('businessId');
    }



    return res.status(200).json({
      status: 'success',
      message: 'User synchronized successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch the profile of the current authenticated user along with business settings.
 */
const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not synchronized yet.',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update user and business details.
 */
const updateProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        status: 'error',
        message: 'User profile not found.',
      });
    }

    const { firstName, lastName, businessName, gstin, address, industry } = req.body;

    // Update User details
    if (firstName !== undefined) req.user.firstName = firstName;
    if (lastName !== undefined) req.user.lastName = lastName;
    await req.user.save();

    // Update Business details
    if (req.user.businessId) {
      const business = await Business.findById(req.user.businessId);
      if (business) {
        if (businessName !== undefined) business.name = businessName;
        if (gstin !== undefined) business.gstin = gstin;
        if (industry !== undefined) business.industry = industry;
        if (address !== undefined) {
          business.address = {
            ...business.address,
            ...address,
          };
        }
        await business.save();
      }
    }

    // Fetch fresh user profile
    const updatedUser = await User.findById(req.user._id).populate('businessId');

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  syncUser,
  getProfile,
  updateProfile,
};
