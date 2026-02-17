const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const User = require('../models/User');
const Lender = require('../models/Lender');
const creditScoringService = require('../services/creditScoringService');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/loan-applications/create
 * @desc    Create a new loan application
 * @access  Private (Farmer)
 */
router.post('/create', protect, async (req, res) => {
  try {
    const farmerId = req.user.id;
    const farmer = await User.findById(farmerId);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    // Calculate credit score
    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);

    // Create loan application
    const loanApplication = await LoanApplication.create({
      farmerId,
      farmerName: farmer.name,
      farmerEmail: farmer.email,
      farmerPhone: farmer.phone,
      ...req.body,
      creditScore: {
        score: creditScoreResult.score,
        rating: creditScoreResult.rating,
        assessmentDate: Date.now(),
        breakdown: creditScoreResult.breakdown
      },
      riskAssessment: {
        riskLevel: creditScoreResult.riskLevel,
        riskFactors: creditScoreResult.riskFactors
      }
    });

    // Calculate collateral value
    loanApplication.calculateCollateralValue();
    await loanApplication.save();

    res.status(201).json({
      success: true,
      data: loanApplication,
      message: 'Loan application created successfully'
    });

  } catch (error) {
    console.error('Create loan application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating loan application',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/loan-applications/farmer/:farmerId
 * @desc    Get all loan applications for a farmer
 * @access  Private (Farmer/Admin)
 */
router.get('/farmer/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;

    // Check authorization
    if (req.user.id !== farmerId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await LoanApplication.find({ farmerId })
      .populate('lenderId', 'organizationName lenderType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get farmer applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching applications',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/loan-applications/lender/pending
 * @desc    Get all pending loan applications for review
 * @access  Private (Lender)
 */
router.get('/lender/pending', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders can access this endpoint'
      });
    }

    const lender = await Lender.findById(req.user.id);
    const { minScore, maxScore, minAmount, maxAmount, purpose, state } = req.query;

    // Build query
    let query = {
      status: { $in: ['submitted', 'under_review'] },
      loanAmount: {
        $gte: lender.businessDetails.minimumLoanAmount,
        $lte: lender.businessDetails.maximumLoanAmount
      }
    };

    if (lender.settings.minimumCreditScore) {
      query['creditScore.score'] = { $gte: lender.settings.minimumCreditScore };
    }

    if (minScore) query['creditScore.score'].$gte = parseInt(minScore);
    if (maxScore) query['creditScore.score'].$lte = parseInt(maxScore);
    if (minAmount) query.loanAmount.$gte = parseInt(minAmount);
    if (maxAmount) query.loanAmount.$lte = parseInt(maxAmount);
    if (purpose) query.loanPurpose = purpose;

    const applications = await LoanApplication.find(query)
      .populate('farmerId', 'name email phone state district')
      .sort({ 'creditScore.score': -1, submittedAt: 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get pending applications error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching pending applications',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/loan-applications/lender/portfolio
 * @desc    Get lender's loan portfolio
 * @access  Private (Lender)
 */
router.get('/lender/portfolio', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders can access this endpoint'
      });
    }

    const lenderId = req.user.id;
    const { status } = req.query;

    let query = { lenderId };
    if (status) query.status = status;

    const applications = await LoanApplication.find(query)
      .populate('farmerId', 'name email phone state district')
      .sort({ updatedAt: -1 });

    // Calculate portfolio statistics
    const stats = {
      totalApplications: applications.length,
      approved: applications.filter(app => app.status === 'approved').length,
      rejected: applications.filter(app => app.status === 'rejected').length,
      disbursed: applications.filter(app => app.status === 'disbursed').length,
      totalDisbursedAmount: applications
        .filter(app => app.status === 'disbursed')
        .reduce((sum, app) => sum + (app.disbursement?.disbursedAmount || 0), 0),
      averageLoanAmount: applications.length > 0
        ? applications.reduce((sum, app) => sum + app.loanAmount, 0) / applications.length
        : 0,
      averageCreditScore: applications.length > 0
        ? applications.reduce((sum, app) => sum + (app.creditScore?.score || 0), 0) / applications.length
        : 0
    };

    res.status(200).json({
      success: true,
      stats,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching portfolio',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/loan-applications/:id
 * @desc    Get a single loan application
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id)
      .populate('farmerId', 'name email phone state district')
      .populate('lenderId', 'organizationName lenderType email phone');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    // Check authorization
    const isAuthorized = 
      req.user.id === application.farmerId.toString() ||
      req.user.id === application.lenderId?.toString() ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching application',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   PUT /api/loan-applications/:id/submit
 * @desc    Submit a loan application
 * @access  Private (Farmer)
 */
router.put('/:id/submit', protect, async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    if (application.farmerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit this application'
      });
    }

    if (application.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: 'Only draft applications can be submitted'
      });
    }

    await application.updateStatus('submitted', 'Application submitted by farmer', req.user.id, 'User');

    res.status(200).json({
      success: true,
      data: application,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   PUT /api/loan-applications/:id/review
 * @desc    Lender reviews and approves/rejects application
 * @access  Private (Lender)
 */
router.put('/:id/review', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders can review applications'
      });
    }

    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    const { decision, reviewNotes, approvedAmount, approvedTenure, offeredInterestRate, rejectionReason } = req.body;

    if (!['approved', 'rejected'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: 'Decision must be either approved or rejected'
      });
    }

    // Update lender info
    application.lenderId = req.user.id;
    const lender = await Lender.findById(req.user.id);
    application.lenderName = lender.organizationName;

    // Update review details
    application.lenderReview = {
      reviewedBy: req.user.id,
      reviewedAt: Date.now(),
      reviewNotes,
      approvedAmount: decision === 'approved' ? approvedAmount : null,
      approvedTenure: decision === 'approved' ? approvedTenure : null,
      offeredInterestRate: decision === 'approved' ? offeredInterestRate : null,
      rejectionReason: decision === 'rejected' ? rejectionReason : null
    };

    await application.updateStatus(
      decision,
      decision === 'approved' ? 'Application approved by lender' : rejectionReason,
      req.user.id,
      'Lender'
    );

    // Update lender stats
    await lender.updateStats(decision === 'approved' ? 'approve' : 'reject');

    res.status(200).json({
      success: true,
      data: application,
      message: `Application ${decision} successfully`
    });

  } catch (error) {
    console.error('Review application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error reviewing application',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   PUT /api/loan-applications/:id/disburse
 * @desc    Disburse loan amount
 * @access  Private (Lender)
 */
router.put('/:id/disburse', protect, async (req, res) => {
  try {
    if (req.user.role !== 'lender') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders can disburse loans'
      });
    }

    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    if (application.lenderId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to disburse this loan'
      });
    }

    if (application.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Only approved applications can be disbursed'
      });
    }

    const { disbursedAmount, disbursementMethod, bankDetails, transactionId, disbursementProof } = req.body;

    application.disbursement = {
      disbursedAmount,
      disbursedDate: Date.now(),
      disbursementMethod,
      bankDetails,
      transactionId,
      disbursementProof
    };

    await application.updateStatus('disbursed', 'Loan amount disbursed', req.user.id, 'Lender');

    // Update lender stats
    const lender = await Lender.findById(req.user.id);
    await lender.updateStats('disburse', disbursedAmount);

    res.status(200).json({
      success: true,
      data: application,
      message: 'Loan disbursed successfully'
    });

  } catch (error) {
    console.error('Disburse loan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error disbursing loan',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/loan-applications/:id/message
 * @desc    Add a message to application
 * @access  Private
 */
router.post('/:id/message', protect, async (req, res) => {
  try {
    const application = await LoanApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }

    const { message, attachments } = req.body;
    const fromModel = req.user.role === 'lender' ? 'Lender' : 'User';

    await application.addMessage(req.user.id, fromModel, message, attachments);

    res.status(200).json({
      success: true,
      data: application.messages,
      message: 'Message added successfully'
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding message',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
