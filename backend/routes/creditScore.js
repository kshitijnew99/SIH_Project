const express = require('express');
const router = express.Router();
const creditScoringService = require('../services/creditScoringService');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/credit-score/calculate/:farmerId
 * @desc    Calculate comprehensive credit score for a farmer
 * @access  Private (Lender/Admin)
 * @returns {Object} Complete credit score with breakdown
 */
router.post('/calculate/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check if user has permission (must be lender, admin, or the farmer themselves)
    if (req.user.role !== 'lender' && req.user.role !== 'admin' && req.user.id !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this credit score'
      });
    }

    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);

    res.status(200).json({
      success: true,
      data: creditScoreResult,
      message: 'Credit score calculated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Credit score calculation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating credit score',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/explanation/:farmerId
 * @desc    Get detailed explanation of credit score factors
 * @access  Private (Lender/Admin/Farmer)
 * @returns {Object} Detailed explanation with improvement suggestions
 */
router.get('/explanation/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check authorization
    if (req.user.role !== 'lender' && req.user.role !== 'admin' && req.user.id !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this explanation'
      });
    }

    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);
    const explanation = await creditScoringService.generateCreditScoreExplanation(creditScoreResult);

    res.status(200).json({
      success: true,
      data: {
        ...explanation,
        score: creditScoreResult.score,
        rating: creditScoreResult.rating
      },
      message: 'Credit score explanation generated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Credit explanation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating credit explanation',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/asset-value/:farmerId
 * @desc    Get detailed asset value assessment
 * @access  Private (Lender/Admin/Farmer)
 * @returns {Object} Asset breakdown with collateral eligibility
 */
router.get('/asset-value/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check authorization
    if (req.user.role !== 'lender' && req.user.role !== 'admin' && req.user.id !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view asset information'
      });
    }

    const assetAssessment = await creditScoringService.assessAssetValue(farmerId);

    res.status(200).json({
      success: true,
      data: assetAssessment,
      message: 'Asset value assessed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Asset assessment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error assessing asset value',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/payment-history/:farmerId
 * @desc    Get payment history analysis
 * @access  Private (Lender/Admin)
 * @returns {Object} Payment patterns and reliability score
 */
router.get('/payment-history/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Only lenders and admins can view payment history
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders and admins can view payment history'
      });
    }

    const paymentAnalysis = await creditScoringService.assessPaymentHistory(farmerId);

    res.status(200).json({
      success: true,
      data: paymentAnalysis,
      message: 'Payment history analyzed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing payment history',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/yield-analysis/:farmerId
 * @desc    Get yield history and trend analysis
 * @access  Private (Lender/Admin/Farmer)
 * @returns {Object} Yield trends and productivity metrics
 */
router.get('/yield-analysis/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Check authorization
    if (req.user.role !== 'lender' && req.user.role !== 'admin' && req.user.id !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view yield analysis'
      });
    }

    const yieldAnalysis = await creditScoringService.analyzeYieldHistory(farmerId);

    res.status(200).json({
      success: true,
      data: yieldAnalysis,
      message: 'Yield analysis completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Yield analysis error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error analyzing yield history',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/risk-assessment/:farmerId
 * @desc    Get comprehensive risk assessment
 * @access  Private (Lender/Admin)
 * @returns {Object} Risk factors and mitigation strategies
 */
router.get('/risk-assessment/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Only lenders and admins can view risk assessment
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders and admins can view risk assessment'
      });
    }

    const riskFactors = await creditScoringService.identifyRiskFactors(farmerId);

    res.status(200).json({
      success: true,
      data: riskFactors,
      message: 'Risk assessment completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Risk assessment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error performing risk assessment',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/default-prediction/:farmerId
 * @desc    Predict default probability using ML model
 * @access  Private (Lender/Admin)
 * @returns {Object} Default risk prediction with confidence
 */
router.get('/default-prediction/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Only lenders and admins can view default prediction
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders and admins can view default prediction'
      });
    }

    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);
    const defaultPrediction = await creditScoringService.predictDefaultRisk(creditScoreResult);

    res.status(200).json({
      success: true,
      data: defaultPrediction,
      message: 'Default risk predicted successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Default prediction error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error predicting default risk',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/credit-score/improve-score
 * @desc    Get personalized recommendations to improve credit score
 * @access  Private (Farmer/Lender/Admin)
 * @returns {Object} Actionable improvement suggestions
 */
router.post('/improve-score', protect, async (req, res) => {
  try {
    const farmerId = req.body.farmerId || req.user.id;
    
    // Check authorization
    if (req.user.role !== 'lender' && req.user.role !== 'admin' && req.user.id !== farmerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view improvement suggestions'
      });
    }

    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);
    const explanation = await creditScoringService.generateCreditScoreExplanation(creditScoreResult);

    // Generate improvement recommendations based on weak areas
    const improvements = [];
    
    if (creditScoreResult.breakdown.assetValue < 150) {
      improvements.push({
        category: 'Asset Value',
        priority: 'HIGH',
        suggestions: [
          'Consider registering all owned land parcels with Agri Stack',
          'Verify land ownership documentation to increase collateral value',
          'Improve soil health through regular testing and amendments',
          'Invest in permanent assets like irrigation systems or farm structures'
        ],
        potentialImpact: '+50-100 points'
      });
    }

    if (creditScoreResult.breakdown.yieldConsistency < 120) {
      improvements.push({
        category: 'Yield Consistency',
        priority: 'MEDIUM',
        suggestions: [
          'Adopt modern farming techniques to increase productivity',
          'Diversify crop selection to reduce seasonal risks',
          'Register all harvest data with crop registry for better tracking',
          'Participate in agricultural training programs'
        ],
        potentialImpact: '+40-80 points'
      });
    }

    if (creditScoreResult.breakdown.paymentHistory < 120) {
      improvements.push({
        category: 'Payment History',
        priority: 'HIGH',
        suggestions: [
          'Ensure timely payment of existing loans and credit obligations',
          'Set up automatic payment reminders',
          'Build a track record of consistent payments',
          'Clear any outstanding dues or defaults'
        ],
        potentialImpact: '+60-120 points'
      });
    }

    if (creditScoreResult.breakdown.governmentSchemes < 90) {
      improvements.push({
        category: 'Government Schemes',
        priority: 'LOW',
        suggestions: [
          'Explore and enroll in government agricultural schemes',
          'Apply for PM-KISAN and other direct benefit schemes',
          'Participate in crop insurance programs',
          'Utilize subsidy programs for inputs and equipment'
        ],
        potentialImpact: '+30-60 points'
      });
    }

    if (creditScoreResult.breakdown.marketPerformance < 90) {
      improvements.push({
        category: 'Market Performance',
        priority: 'MEDIUM',
        suggestions: [
          'Sell crops through formal market channels (mandis, FPOs)',
          'Maintain records of all market transactions',
          'Explore better price realization through direct marketing',
          'Build relationships with reliable buyers'
        ],
        potentialImpact: '+40-70 points'
      });
    }

    if (creditScoreResult.riskFactors.length > 0) {
      improvements.push({
        category: 'Risk Mitigation',
        priority: 'HIGH',
        suggestions: creditScoreResult.riskFactors.map(risk => risk.mitigation),
        potentialImpact: '+20-50 points'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        currentScore: creditScoreResult.score,
        currentRating: creditScoreResult.rating,
        improvementPlan: improvements,
        estimatedMaxScore: Math.min(900, creditScoreResult.score + improvements.reduce((sum, imp) => {
          const avgImpact = parseInt(imp.potentialImpact.match(/\d+/g)[0]);
          return sum + avgImpact;
        }, 0)),
        timeframe: '6-12 months with consistent effort',
        keyTakeaways: explanation.keyTakeaways
      },
      message: 'Improvement plan generated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Improvement plan error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error generating improvement plan',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   GET /api/credit-score/credit-limit/:farmerId
 * @desc    Calculate recommended credit limit
 * @access  Private (Lender/Admin)
 * @returns {Object} Credit limit recommendations with LTV ratios
 */
router.get('/credit-limit/:farmerId', protect, async (req, res) => {
  try {
    const { farmerId } = req.params;
    
    // Only lenders and admins can view credit limits
    if (req.user.role !== 'lender' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only lenders and admins can view credit limits'
      });
    }

    const creditScoreResult = await creditScoringService.calculateCreditScore(farmerId);
    const creditLimit = await creditScoringService.calculateCreditLimit(creditScoreResult);

    res.status(200).json({
      success: true,
      data: creditLimit,
      message: 'Credit limit calculated successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Credit limit calculation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error calculating credit limit',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
