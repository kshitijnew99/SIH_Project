const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Lender = require('../models/Lender');
const { protect } = require('../middleware/auth');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, userType: 'lender' }, process.env.JWT_SECRET || 'kisanconnect_secret_key_2024', {
    expiresIn: '30d'
  });
};

/**
 * @route   POST /api/lender-auth/register
 * @desc    Register a new lender organization
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const {
      organizationName,
      lenderType,
      registrationNumber,
      email,
      phone,
      address,
      password,
      pointOfContact,
      businessDetails
    } = req.body;

    // Check if lender already exists
    const lenderExists = await Lender.findOne({ 
      $or: [{ email }, { registrationNumber }] 
    });

    if (lenderExists) {
      return res.status(400).json({
        success: false,
        message: 'Lender with this email or registration number already exists'
      });
    }

    // Create lender
    const lender = await Lender.create({
      organizationName,
      lenderType,
      registrationNumber,
      email,
      phone,
      address,
      password,
      pointOfContact,
      businessDetails: businessDetails || {}
    });

    if (lender) {
      res.status(201).json({
        success: true,
        data: {
          id: lender._id,
          organizationName: lender.organizationName,
          lenderType: lender.lenderType,
          email: lender.email,
          phone: lender.phone,
          verificationStatus: lender.verificationStatus,
          token: generateToken(lender._id)
        },
        message: 'Lender registered successfully. Verification pending.'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid lender data'
      });
    }

  } catch (error) {
    console.error('Lender registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering lender',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/lender-auth/login
 * @desc    Authenticate lender & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for lender (include password for comparison)
    const lender = await Lender.findOne({ email }).select('+password');

    if (!lender) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if lender is active
    if (!lender.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Check if lender is suspended
    if (lender.isSuspended) {
      return res.status(401).json({
        success: false,
        message: `Account is suspended. Reason: ${lender.suspensionReason}`
      });
    }

    // Check password
    const isPasswordMatch = await lender.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await lender.updateLastLogin();

    res.status(200).json({
      success: true,
      data: {
        id: lender._id,
        organizationName: lender.organizationName,
        lenderType: lender.lenderType,
        email: lender.email,
        phone: lender.phone,
        verificationStatus: lender.verificationStatus,
        isVerified: lender.isVerified,
        businessDetails: lender.businessDetails,
        stats: lender.stats,
        token: generateToken(lender._id)
      },
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Lender login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/lender-auth/profile
 * @desc    Get current lender profile
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
  try {
    const lender = await Lender.findById(req.user.id);

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: 'Lender not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lender
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   PUT /api/lender-auth/profile
 * @desc    Update lender profile
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
  try {
    const lender = await Lender.findById(req.user.id);

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: 'Lender not found'
      });
    }

    // Fields that can be updated
    const allowedUpdates = [
      'phone', 'alternatePhone', 'address', 'pointOfContact',
      'businessDetails', 'settings'
    ];

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (typeof req.body[key] === 'object' && !Array.isArray(req.body[key])) {
          lender[key] = { ...lender[key].toObject(), ...req.body[key] };
        } else {
          lender[key] = req.body[key];
        }
      }
    });

    await lender.save();

    res.status(200).json({
      success: true,
      data: lender,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/lender-auth/upload-document
 * @desc    Upload verification document
 * @access  Private
 */
router.post('/upload-document', protect, async (req, res) => {
  try {
    const { documentType, documentNumber, documentUrl } = req.body;

    if (!documentType || !documentNumber || !documentUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all document details'
      });
    }

    const lender = await Lender.findById(req.user.id);

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: 'Lender not found'
      });
    }

    // Check if document type already exists
    const existingDocIndex = lender.verificationDocuments.findIndex(
      doc => doc.documentType === documentType
    );

    if (existingDocIndex !== -1) {
      // Update existing document
      lender.verificationDocuments[existingDocIndex] = {
        documentType,
        documentNumber,
        documentUrl,
        uploadedAt: Date.now()
      };
    } else {
      // Add new document
      lender.verificationDocuments.push({
        documentType,
        documentNumber,
        documentUrl
      });
    }

    // Update verification status if all required documents are uploaded
    const requiredDocs = ['rbi_license', 'registration_certificate', 'pan_card'];
    const uploadedDocs = lender.verificationDocuments.map(doc => doc.documentType);
    const allDocsUploaded = requiredDocs.every(doc => uploadedDocs.includes(doc));

    if (allDocsUploaded && lender.verificationStatus === 'pending') {
      lender.verificationStatus = 'under_review';
    }

    await lender.save();

    res.status(200).json({
      success: true,
      data: {
        verificationDocuments: lender.verificationDocuments,
        verificationStatus: lender.verificationStatus,
        verificationProgress: lender.verificationProgress
      },
      message: 'Document uploaded successfully'
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error uploading document',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   PUT /api/lender-auth/change-password
 * @desc    Change lender password
 * @access  Private
 */
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const lender = await Lender.findById(req.user.id).select('+password');

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: 'Lender not found'
      });
    }

    // Check current password
    const isPasswordMatch = await lender.matchPassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    lender.password = newPassword;
    lender.passwordChangedAt = Date.now();
    await lender.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      token: generateToken(lender._id)
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error changing password',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/lender-auth/stats
 * @desc    Get lender statistics
 * @access  Private
 */
router.get('/stats', protect, async (req, res) => {
  try {
    const lender = await Lender.findById(req.user.id);

    if (!lender) {
      return res.status(404).json({
        success: false,
        message: 'Lender not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: lender.stats,
        approvalRate: lender.getApprovalRate(),
        businessDetails: lender.businessDetails,
        verificationProgress: lender.verificationProgress
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching statistics',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
