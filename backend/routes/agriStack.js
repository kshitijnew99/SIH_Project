const express = require('express');
const router = express.Router();
const agriStackService = require('../services/agriStackService');
const { authMiddleware } = require('../middleware/auth');

/**
 * POST /api/agristack/verify-farmer
 * Verify farmer identity using Aadhar
 */
router.post('/verify-farmer', async (req, res) => {
  try {
    const { farmerId, aadhaarNumber } = req.body;

    if (!farmerId || !aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and Aadhar number are required'
      });
    }

    const result = await agriStackService.verifyFarmerIdentity(farmerId, aadhaarNumber);
    
    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in verify-farmer route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /api/agristack/land-records/:farmerId
 * Fetch land records for a farmer
 * Requires JWT authentication
 */
router.get('/land-records/:farmerId', authMiddleware(['farmer', 'admin', 'lender']), async (req, res) => {
  try {
    const { farmerId } = req.params;
    const aadhaarNumber = req.user.aadhaar || req.query.aadhaarNumber;

    if (!aadhaarNumber) {
      return res.status(400).json({
        success: false,
        message: 'Aadhar number is required'
      });
    }

    // Check if lender, verify consent
    if (req.user.role === 'lender') {
      const consentCheck = await agriStackService.checkFarmerConsent(
        farmerId,
        'land_data',
        req.user.id
      );

      if (!consentCheck.hasConsent) {
        return res.status(403).json({
          success: false,
          message: 'Consent required to access land data',
          consentRequired: true
        });
      }
    }

    const result = await agriStackService.fetchLandRecords(farmerId, aadhaarNumber);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in land-records route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /api/agristack/soil-health/:landId
 * Fetch soil health card for a land parcel
 * Requires JWT authentication
 */
router.get('/soil-health/:landId', authMiddleware(['farmer', 'admin', 'lender']), async (req, res) => {
  try {
    const { landId } = req.params;

    if (!landId) {
      return res.status(400).json({
        success: false,
        message: 'Land ID is required'
      });
    }

    const result = await agriStackService.fetchSoilHealthCards(landId);
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in soil-health route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /api/agristack/crop-registry/:farmerId
 * Fetch crop registry for a farmer
 * Optional query params: season, year
 */
router.get('/crop-registry/:farmerId', authMiddleware(['farmer', 'admin', 'lender']), async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { season, year } = req.query;

    const result = await agriStackService.fetchCropRegistry(
      farmerId,
      season,
      year ? parseInt(year) : new Date().getFullYear()
    );
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in crop-registry route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * POST /api/agristack/check-consent
 * Check if farmer has given consent for data access
 */
router.post('/check-consent', authMiddleware(['lender', 'admin', 'bank']), async (req, res) => {
  try {
    const { farmerId, dataType, entityId } = req.body;

    if (!farmerId || !dataType) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID and data type are required'
      });
    }

    const result = await agriStackService.checkFarmerConsent(
      farmerId,
      dataType,
      entityId || req.user.id
    );
    
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in check-consent route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * POST /api/agristack/request-consent
 * Request consent from farmer to access their data
 */
router.post('/request-consent', authMiddleware(['lender', 'bank', 'fintech']), async (req, res) => {
  try {
    const { farmerId, dataTypes, purpose } = req.body;

    if (!farmerId || !dataTypes || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Farmer ID, data types, and purpose are required'
      });
    }

    const entityDetails = {
      id: req.user.id,
      name: req.user.name || req.user.lenderName,
      type: req.user.role
    };

    const result = await agriStackService.requestFarmerConsent(
      farmerId,
      dataTypes,
      entityDetails,
      purpose
    );
    
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error('Error in request-consent route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * GET /api/agristack/consent-status/:consentId
 * Check status of a consent request
 */
router.get('/consent-status/:consentId', authMiddleware(['farmer', 'lender', 'admin']), async (req, res) => {
  try {
    const { consentId } = req.params;

    const AgriStackConsent = require('../models/AgriStackConsent');
    const consent = await AgriStackConsent.findOne({ consentId: consentId });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'Consent not found'
      });
    }

    // Check if consent has expired
    const hasExpired = consent.grantedTo.some(
      grant => grant.consentExpiryDate < new Date()
    );

    let status = 'pending';
    if (consent.isActive && consent.digitalSignature.verified) {
      status = 'signed';
    } else if (hasExpired) {
      status = 'expired';
    } else if (consent.revokedOn) {
      status = 'rejected';
    }

    return res.status(200).json({
      success: true,
      consentId: consent.consentId,
      status: status,
      isActive: consent.isActive,
      farmerId: consent.farmerId,
      grantedTo: consent.grantedTo,
      createdAt: consent.createdAt
    });
  } catch (error) {
    console.error('Error in consent-status route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * POST /api/agristack/sign-consent/:consentId
 * Farmer signs a consent request
 */
router.post('/sign-consent/:consentId', authMiddleware(['farmer']), async (req, res) => {
  try {
    const { consentId } = req.params;
    const { signatureMethod } = req.body;

    const AgriStackConsent = require('../models/AgriStackConsent');
    const consent = await AgriStackConsent.findOne({ consentId: consentId });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'Consent not found'
      });
    }

    // Verify farmer owns this consent
    if (consent.farmerId !== req.user.id && consent.farmerId !== req.user.farmerId) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to sign this consent'
      });
    }

    // Update consent with signature
    consent.isActive = true;
    consent.digitalSignature = {
      farmerId: req.user.id,
      timestamp: new Date(),
      method: signatureMethod || 'manual',
      verified: true
    };

    await consent.save();

    return res.status(200).json({
      success: true,
      message: 'Consent signed successfully',
      consentId: consent.consentId,
      status: 'active'
    });
  } catch (error) {
    console.error('Error in sign-consent route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

/**
 * POST /api/agristack/revoke-consent/:consentId
 * Farmer revokes a previously given consent
 */
router.post('/revoke-consent/:consentId', authMiddleware(['farmer', 'admin']), async (req, res) => {
  try {
    const { consentId } = req.params;
    const { reason } = req.body;

    const AgriStackConsent = require('../models/AgriStackConsent');
    const consent = await AgriStackConsent.findOne({ consentId: consentId });

    if (!consent) {
      return res.status(404).json({
        success: false,
        message: 'Consent not found'
      });
    }

    await consent.revokeConsent(req.user.role, reason || 'Revoked by farmer');

    return res.status(200).json({
      success: true,
      message: 'Consent revoked successfully',
      consentId: consent.consentId,
      revokedOn: consent.revokedOn
    });
  } catch (error) {
    console.error('Error in revoke-consent route:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

module.exports = router;
