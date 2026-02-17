const axios = require('axios');
const AgriStackLandRecord = require('../models/AgriStackLandRecord');
const AgriStackSoilHealth = require('../models/AgriStackSoilHealth');
const AgriStackCropRegistry = require('../models/AgriStackCropRegistry');
const AgriStackConsent = require('../models/AgriStackConsent');

class AgriStackService {
  constructor() {
    this.baseURL = process.env.AGRI_STACK_BASE_URL || 'https://api.agristack.gov.in/v1';
    this.apiKey = process.env.AGRI_STACK_API_KEY || '';
    this.authToken = process.env.AGRI_STACK_AUTH_TOKEN || '';
  }

  /**
   * Verify farmer identity with Aadhar
   */
  async verifyFarmerIdentity(farmerId, aadhaarNumber) {
    try {
      // In production, this would call actual Aadhar verification API
      // For now, implement mock verification
      
      if (!farmerId || !aadhaarNumber) {
        return {
          success: false,
          message: 'Farmer ID and Aadhar number are required'
        };
      }

      // Mock Aadhar verification - validate format
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(aadhaarNumber)) {
        return {
          success: false,
          message: 'Invalid Aadhar number format'
        };
      }

      // Simulate API call to Aadhar verification service
      // const response = await axios.post(
      //   `${this.baseURL}/verify-aadhaar`,
      //   { farmer_id: farmerId, aadhaar: aadhaarNumber },
      //   { headers: this.getHeaders() }
      // );

      // Mock successful verification
      return {
        success: true,
        verified: true,
        farmerId: farmerId,
        aadhaarNumber: aadhaarNumber,
        verificationDate: new Date(),
        message: 'Farmer identity verified successfully'
      };

    } catch (error) {
      console.error('Error verifying farmer identity:', error.message);
      return {
        success: false,
        message: 'Failed to verify farmer identity: ' + error.message
      };
    }
  }

  /**
   * Fetch land records from Agri Stack API
   */
  async fetchLandRecords(farmerId, aadhaarNumber) {
    try {
      // Verify farmer identity first
      const verification = await this.verifyFarmerIdentity(farmerId, aadhaarNumber);
      if (!verification.success) {
        return {
          success: false,
          message: 'Farmer identity verification failed',
          records: []
        };
      }

      // Make API call to fetch land records
      // const response = await axios.get(
      //   `${this.baseURL}/land-record/search`,
      //   {
      //     params: { farmer_id: farmerId, aadhaar: aadhaarNumber },
      //     headers: this.getHeaders()
      //   }
      // );

      // Mock land records data
      const mockLandRecords = [
        {
          farmerId: farmerId,
          surveyNumber: `SN-${farmerId}-001`,
          area: 2.5,
          state: 'Maharashtra',
          district: 'Nashik',
          village: 'Pimpalgaon',
          ownershipType: 'owned',
          ownershipPercentage: 100,
          landUse: 'agricultural',
          irrigationSource: 'well',
          electricityAvailable: true,
          roadAccess: true,
          mortgageValue: 0,
          documentVerified: true,
          verificationDate: new Date(),
          geoCoordinates: {
            latitude: 20.0059,
            longitude: 73.7689
          },
          marketValue: 1250000,
          landQuality: 'good'
        }
      ];

      // Save land records locally
      const savedRecords = [];
      let totalArea = 0;

      for (const record of mockLandRecords) {
        const saved = await this.saveLandRecordLocally(record);
        if (saved) {
          savedRecords.push(saved);
          totalArea += record.area;
        }
      }

      return {
        success: true,
        records: savedRecords,
        totalArea: totalArea,
        totalRecords: savedRecords.length,
        verificationStatus: 'verified',
        message: 'Land records fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching land records:', error.message);
      return {
        success: false,
        message: 'Failed to fetch land records: ' + error.message,
        records: []
      };
    }
  }

  /**
   * Save land record to local MongoDB
   */
  async saveLandRecordLocally(landData) {
    try {
      const existingRecord = await AgriStackLandRecord.findOne({
        farmerId: landData.farmerId,
        surveyNumber: landData.surveyNumber
      });

      if (existingRecord) {
        // Update existing record
        Object.assign(existingRecord, landData);
        return await existingRecord.save();
      } else {
        // Create new record
        const newRecord = new AgriStackLandRecord(landData);
        return await newRecord.save();
      }
    } catch (error) {
      console.error('Error saving land record:', error.message);
      return null;
    }
  }

  /**
   * Fetch soil health cards from Agri Stack
   */
  async fetchSoilHealthCards(landId) {
    try {
      // Verify land exists
      const landRecord = await AgriStackLandRecord.findById(landId);
      if (!landRecord) {
        return {
          success: false,
          message: 'Land record not found'
        };
      }

      // Mock soil health data
      const mockSoilData = {
        farmerId: landRecord.farmerId,
        landId: landId,
        testDate: new Date(),
        labName: 'State Agricultural Laboratory',
        testResults: {
          pH: 6.8,
          nitrogen: 280,
          phosphorus: 45,
          potassium: 320,
          organicCarbon: 1.8,
          micronutrients: {
            zinc: 1.2,
            boron: 0.8,
            manganese: 12,
            copper: 2.5,
            iron: 8.0,
            sulphur: 15
          },
          soilTexture: 'loamy',
          waterHoldingCapacity: 65,
          electricalConductivity: 0.4
        },
        recommendations: [
          {
            nutrient: 'Nitrogen',
            recommendation: 'Apply urea at 50 kg/acre',
            dosage: '50 kg/acre',
            timing: 'Before sowing',
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
          },
          {
            nutrient: 'Phosphorus',
            recommendation: 'Apply DAP fertilizer',
            dosage: '30 kg/acre',
            timing: 'At sowing time',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          }
        ],
        validUpto: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        certificateNumber: `SHC-${landRecord.farmerId}-${Date.now()}`,
        issueAuthority: 'Department of Agriculture'
      };

      // Calculate soil health score
      const healthScore = this.calculateSoilHealthScore(mockSoilData.testResults);
      mockSoilData.soilHealthScore = healthScore;

      // Save to database
      const savedSoilHealth = await this.saveSoilHealthLocally(mockSoilData);

      return {
        success: true,
        soilData: savedSoilHealth,
        healthScore: healthScore,
        healthRating: this.getSoilHealthRating(healthScore),
        recommendations: mockSoilData.recommendations,
        validUpto: mockSoilData.validUpto,
        message: 'Soil health data fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching soil health data:', error.message);
      return {
        success: false,
        message: 'Failed to fetch soil health data: ' + error.message
      };
    }
  }

  /**
   * Save soil health card to local MongoDB
   */
  async saveSoilHealthLocally(soilData) {
    try {
      const newSoilHealth = new AgriStackSoilHealth(soilData);
      return await newSoilHealth.save();
    } catch (error) {
      console.error('Error saving soil health data:', error.message);
      return null;
    }
  }

  /**
   * Calculate soil health score (0-100)
   */
  calculateSoilHealthScore(testResults) {
    let score = 0;

    // pH score (20 points) - ideal range 6-7
    const pHIdeal = 6.5;
    const pHDiff = Math.abs(testResults.pH - pHIdeal);
    const pHScore = Math.max(0, 20 - (pHDiff * 5));
    score += pHScore;

    // Nitrogen score (20 points) - 250-300 mg/kg is good
    const nitrogenScore = Math.min(20, (testResults.nitrogen / 300) * 20);
    score += nitrogenScore;

    // Phosphorus score (20 points) - 40-50 mg/kg is good
    const phosphorusScore = Math.min(20, (testResults.phosphorus / 50) * 20);
    score += phosphorusScore;

    // Potassium score (20 points) - 250-350 mg/kg is good
    const potassiumScore = Math.min(20, (testResults.potassium / 350) * 20);
    score += potassiumScore;

    // Organic carbon score (15 points) - above 1.5% is good
    const organicCarbonScore = Math.min(15, (testResults.organicCarbon / 2) * 15);
    score += organicCarbonScore;

    // Micronutrients presence (5 points)
    const microScore = testResults.micronutrients ? 5 : 0;
    score += microScore;

    return Math.round(score);
  }

  /**
   * Get soil health rating from score
   */
  getSoilHealthRating(score) {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 50) return 'Average';
    if (score >= 35) return 'Poor';
    return 'Very Poor';
  }

  /**
   * Fetch crop registry from Agri Stack
   */
  async fetchCropRegistry(farmerId, season, year) {
    try {
      // Mock crop registry data
      const mockCropData = [
        {
          farmerId: farmerId,
          cropName: 'Wheat',
          cropCode: 'WH-001',
          season: season || 'rabi',
          year: year || new Date().getFullYear(),
          areaUnderCrop: 1.5,
          sowingDate: new Date(year || new Date().getFullYear(), 10, 15),
          expectedHarvestDate: new Date((year || new Date().getFullYear()) + 1, 3, 15),
          previousYieldPerHectare: 3200,
          expectedYieldPerHectare: 3500,
          varietyUsed: 'HD-2967',
          seedQuality: 'certified',
          irrigationSchedule: 'Every 15 days',
          irrigationMethod: 'canal',
          insuranceCover: true,
          insuranceScheme: 'PMFBY',
          insurancePolicyNumber: 'PMFBY-2024-001',
          insuranceAmount: 75000,
          estimatedProduction: 52.5,
          estimatedIncome: 120000,
          costOfCultivation: 45000,
          status: 'growing'
        }
      ];

      // Save to database
      const savedCrops = [];
      for (const cropData of mockCropData) {
        const saved = await this.saveCropRegistryLocally(cropData);
        if (saved) savedCrops.push(saved);
      }

      // Calculate crop metrics
      const metrics = this.calculateCropMetrics(savedCrops);
      
      // Identify crop risks
      const riskFactors = this.identifyCropRisks(savedCrops);

      return {
        success: true,
        crops: savedCrops,
        totalCrops: savedCrops.length,
        metrics: metrics,
        riskFactors: riskFactors,
        message: 'Crop registry fetched successfully'
      };

    } catch (error) {
      console.error('Error fetching crop registry:', error.message);
      return {
        success: false,
        message: 'Failed to fetch crop registry: ' + error.message,
        crops: []
      };
    }
  }

  /**
   * Save crop registry to local MongoDB
   */
  async saveCropRegistryLocally(cropData) {
    try {
      const newCropRegistry = new AgriStackCropRegistry(cropData);
      return await newCropRegistry.save();
    } catch (error) {
      console.error('Error saving crop registry:', error.message);
      return null;
    }
  }

  /**
   * Calculate crop metrics
   */
  calculateCropMetrics(crops) {
    if (!crops || crops.length === 0) {
      return {
        totalArea: 0,
        averageYield: 0,
        totalEstimatedProduction: 0,
        totalEstimatedIncome: 0,
        cropDiversity: 0
      };
    }

    const totalArea = crops.reduce((sum, crop) => sum + crop.areaUnderCrop, 0);
    const averageYield = crops.reduce((sum, crop) => sum + (crop.expectedYieldPerHectare || 0), 0) / crops.length;
    const totalEstimatedProduction = crops.reduce((sum, crop) => sum + (crop.estimatedProduction || 0), 0);
    const totalEstimatedIncome = crops.reduce((sum, crop) => sum + (crop.estimatedIncome || 0), 0);
    
    // Crop diversity - number of unique crops
    const uniqueCrops = new Set(crops.map(c => c.cropName));
    const cropDiversity = uniqueCrops.size;

    return {
      totalArea,
      averageYield: Math.round(averageYield),
      totalEstimatedProduction: Math.round(totalEstimatedProduction),
      totalEstimatedIncome: Math.round(totalEstimatedIncome),
      cropDiversity,
      uniqueCrops: Array.from(uniqueCrops)
    };
  }

  /**
   * Identify crop risks
   */
  identifyCropRisks(crops) {
    const risks = [];

    for (const crop of crops) {
      // Check insurance
      if (!crop.insuranceCover) {
        risks.push({
          cropName: crop.cropName,
          riskType: 'financial',
          severity: 'high',
          message: `${crop.cropName} is not insured`,
          mitigation: 'Consider enrolling in PMFBY crop insurance scheme'
        });
      }

      // Check yield trend
      if (crop.previousYieldPerHectare && crop.expectedYieldPerHectare) {
        const yieldChange = ((crop.expectedYieldPerHectare - crop.previousYieldPerHectare) / crop.previousYieldPerHectare) * 100;
        if (yieldChange < -10) {
          risks.push({
            cropName: crop.cropName,
            riskType: 'productivity',
            severity: 'medium',
            message: `Declining yield trend for ${crop.cropName}`,
            mitigation: 'Consider soil testing and better fertilizer management'
          });
        }
      }

      // Check irrigation
      if (crop.irrigationSource === 'rainwater' || crop.irrigationSource === 'none') {
        risks.push({
          cropName: crop.cropName,
          riskType: 'weather',
          severity: 'medium',
          message: `${crop.cropName} depends on rainfall`,
          mitigation: 'Install drip irrigation or dig bore well'
        });
      }
    }

    // Check monoculture risk
    const uniqueCrops = new Set(crops.map(c => c.cropName));
    if (uniqueCrops.size === 1 && crops.length > 0) {
      risks.push({
        riskType: 'market',
        severity: 'medium',
        message: 'Monoculture farming - market risk',
        mitigation: 'Diversify crops to reduce market volatility risk'
      });
    }

    return risks;
  }

  /**
   * Check farmer consent
   */
  async checkFarmerConsent(farmerId, dataType, entityId) {
    try {
      const consent = await AgriStackConsent.findOne({
        farmerId: farmerId,
        $or: [
          { consentType: dataType },
          { consentType: 'all' }
        ],
        isActive: true,
        'grantedTo.consentExpiryDate': { $gt: new Date() }
      });

      if (!consent) {
        return {
          hasConsent: false,
          message: 'No active consent found for this data type'
        };
      }

      // Check if specific entity has access
      const entityGrant = consent.grantedTo.find(g => g.entityId === entityId);
      
      if (entityId && !entityGrant) {
        return {
          hasConsent: false,
          message: 'Entity does not have consent to access this data'
        };
      }

      return {
        hasConsent: true,
        consentId: consent.consentId,
        grantedTo: consent.grantedTo,
        expiryDate: entityGrant ? entityGrant.consentExpiryDate : null,
        dataAccess: entityGrant ? entityGrant.dataAccess : [],
        message: 'Active consent found'
      };

    } catch (error) {
      console.error('Error checking consent:', error.message);
      return {
        hasConsent: false,
        message: 'Error checking consent: ' + error.message
      };
    }
  }

  /**
   * Request farmer consent
   */
  async requestFarmerConsent(farmerId, dataTypes, entityDetails, purpose) {
    try {
      const consentId = `CONSENT-${farmerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const consentData = {
        farmerId: farmerId,
        consentType: dataTypes.length === 1 ? dataTypes[0] : 'all',
        consentId: consentId,
        grantedTo: [{
          entityName: entityDetails.name,
          entityType: entityDetails.type,
          entityId: entityDetails.id,
          consentGrantedDate: new Date(),
          consentExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
          dataAccess: ['view', 'analyze', 'credit_scoring'],
          purpose: purpose
        }],
        isActive: false, // Will be activated after farmer signs
        digitalSignature: {
          verified: false
        }
      };

      const newConsent = new AgriStackConsent(consentData);
      const savedConsent = await newConsent.save();

      // In production, send SMS/Email to farmer with consent link
      // await this.sendConsentNotification(farmerId, consentId);

      return {
        success: true,
        consentId: consentId,
        status: 'pending',
        message: 'Consent request created successfully. Awaiting farmer signature.',
        consentLink: `/consent/sign/${consentId}`
      };

    } catch (error) {
      console.error('Error requesting consent:', error.message);
      return {
        success: false,
        message: 'Failed to create consent request: ' + error.message
      };
    }
  }

  /**
   * Get API headers for Agri Stack requests
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      'Authorization': `Bearer ${this.authToken}`
    };
  }
}

module.exports = new AgriStackService();
