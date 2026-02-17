const AgriStackLandRecord = require('../models/AgriStackLandRecord');
const AgriStackSoilHealth = require('../models/AgriStackSoilHealth');
const AgriStackCropRegistry = require('../models/AgriStackCropRegistry');
const User = require('../models/User');

class CreditScoringService {
  constructor() {
    // Credit score component weights (total: 100%)
    this.weights = {
      assetValue: 0.25,        // 25%
      yieldHistory: 0.20,      // 20%
      paymentHistory: 0.20,    // 20%
      governmentSchemes: 0.15, // 15%
      marketPerformance: 0.15, // 15%
      riskPenalty: 0.10        // -10% for risks
    };

    // State-wise land rates (rupees per hectare)
    this.stateRates = {
      'Maharashtra': 500000,
      'Punjab': 800000,
      'Haryana': 750000,
      'Madhya Pradesh': 400000,
      'Uttar Pradesh': 450000,
      'Gujarat': 550000,
      'Rajasthan': 350000,
      'Karnataka': 600000,
      'Telangana': 550000,
      'Andhra Pradesh': 500000,
      'Tamil Nadu': 650000,
      'West Bengal': 400000,
      'Bihar': 300000,
      'Odisha': 350000,
      'default': 400000
    };
  }

  /**
   * Main method: Calculate comprehensive credit score for a farmer
   */
  async calculateCreditScore(farmerId) {
    try {
      console.log(`\n========== CALCULATING CREDIT SCORE FOR FARMER: ${farmerId} ==========`);
      
      // Collect all data
      const landRecords = await AgriStackLandRecord.find({ farmerId });
      const soilHealthRecords = await AgriStackSoilHealth.find({ farmerId }).sort({ testDate: -1 }).limit(1);
      const cropRecords = await AgriStackCropRegistry.find({ farmerId }).sort({ year: -1 }).limit(10);
      const farmerData = await User.findOne({ $or: [{ _id: farmerId }, { email: farmerId }] });

      if (landRecords.length === 0) {
        return {
          success: false,
          message: 'No land records found for this farmer. Cannot calculate credit score.',
          creditScore: 0
        };
      }

      // Calculate individual component scores
      const assetScore = await this.assessAssetValue(landRecords, soilHealthRecords[0]);
      const yieldScore = await this.analyzeYieldHistory(cropRecords);
      const paymentScore = await this.assessPaymentHistory(farmerId);
      const schemeScore = await this.evaluateGovernmentSchemeParticipation(farmerId, farmerData);
      const marketScore = await this.analyzeMarketPerformance(cropRecords);
      const risks = await this.identifyRiskFactors(landRecords, soilHealthRecords[0], cropRecords);

      // Calculate weighted scores
      const weightedAsset = assetScore.score * this.weights.assetValue;
      const weightedYield = yieldScore.score * this.weights.yieldHistory;
      const weightedPayment = paymentScore.score * this.weights.paymentHistory;
      const weightedScheme = schemeScore.score * this.weights.governmentSchemes;
      const weightedMarket = marketScore.score * this.weights.marketPerformance;
      const riskPenalty = risks.totalPenalty;

      // Calculate final credit score
      const rawScore = weightedAsset + weightedYield + weightedPayment + 
                       weightedScheme + weightedMarket - riskPenalty;
      
      const creditScore = Math.max(0, Math.min(100, Math.round(rawScore)));

      // Calculate credit limit
      const creditLimit = this.calculateCreditLimit(creditScore, assetScore.totalAssetValue);

      // Generate explanation
      const explanation = this.generateCreditScoreExplanation(
        creditScore,
        {
          assetValue: weightedAsset,
          yieldHistory: weightedYield,
          paymentHistory: weightedPayment,
          governmentSchemes: weightedScheme,
          marketPerformance: weightedMarket,
          riskPenalty: riskPenalty
        },
        risks.factors
      );

      console.log(`\n========== CREDIT SCORE CALCULATED: ${creditScore}/100 ==========\n`);

      return {
        success: true,
        farmerId: farmerId,
        creditScore: creditScore,
        creditLimit: creditLimit,
        componentScores: {
          assetValue: {
            score: assetScore.score,
            weighted: weightedAsset,
            details: assetScore
          },
          yieldHistory: {
            score: yieldScore.score,
            weighted: weightedYield,
            details: yieldScore
          },
          paymentHistory: {
            score: paymentScore.score,
            weighted: weightedPayment,
            details: paymentScore
          },
          governmentSchemes: {
            score: schemeScore.score,
            weighted: weightedScheme,
            details: schemeScore
          },
          marketPerformance: {
            score: marketScore.score,
            weighted: weightedMarket,
            details: marketScore
          }
        },
        riskAssessment: {
          factors: risks.factors,
          totalPenalty: riskPenalty,
          riskLevel: this.getRiskLevel(risks.totalPenalty)
        },
        explanation: explanation,
        calculatedAt: new Date()
      };

    } catch (error) {
      console.error('Error calculating credit score:', error);
      return {
        success: false,
        message: 'Failed to calculate credit score: ' + error.message,
        creditScore: 0
      };
    }
  }

  /**
   * Assess asset value from land records and soil health
   */
  async assessAssetValue(landRecords, soilHealthData) {
    let totalAssetValue = 0;
    let totalArea = 0;
    const assetBreakdown = [];

    for (const land of landRecords) {
      totalArea += land.area;

      // Get base rate for state
      const baseRate = this.stateRates[land.state] || this.stateRates['default'];
      
      // Calculate land value
      let landValue = baseRate * land.area;

      // Apply soil health multiplier
      if (soilHealthData) {
        const soilScore = soilHealthData.soilHealthScore || 50;
        let soilMultiplier = 1.0;
        
        if (soilScore >= 80) soilMultiplier = 1.3;      // Excellent soil
        else if (soilScore >= 65) soilMultiplier = 1.15; // Good soil
        else if (soilScore >= 50) soilMultiplier = 1.0;  // Average soil
        else if (soilScore >= 35) soilMultiplier = 0.85; // Poor soil
        else soilMultiplier = 0.6;                        // Very poor soil

        landValue *= soilMultiplier;
      }

      // Apply infrastructure bonuses
      if (land.electricityAvailable) landValue *= 1.05;
      if (land.roadAccess) landValue *= 1.05;
      if (land.irrigationSource !== 'none') landValue *= 1.1;

      // Subtract mortgage value
      const netValue = landValue - land.mortgageValue;
      
      totalAssetValue += netValue;

      assetBreakdown.push({
        surveyNumber: land.surveyNumber,
        area: land.area,
        grossValue: Math.round(landValue),
        mortgageValue: land.mortgageValue,
        netValue: Math.round(netValue),
        location: `${land.village}, ${land.district}, ${land.state}`
      });
    }

    // Calculate score (0-100) based on asset value
    // ₹5 lakh = 50 points, ₹10 lakh = 75 points, ₹15 lakh+ = 100 points
    let score = 0;
    if (totalAssetValue >= 1500000) score = 100;
    else if (totalAssetValue >= 1000000) score = 75 + ((totalAssetValue - 1000000) / 500000) * 25;
    else if (totalAssetValue >= 500000) score = 50 + ((totalAssetValue - 500000) / 500000) * 25;
    else score = (totalAssetValue / 500000) * 50;

    return {
      score: Math.min(100, Math.round(score)),
      totalAssetValue: Math.round(totalAssetValue),
      totalArea: totalArea,
      assetBreakdown: assetBreakdown,
      averageValuePerHectare: Math.round(totalAssetValue / totalArea)
    };
  }

  /**
   * Analyze yield history and crop diversity
   */
  async analyzeYieldHistory(cropRecords, lastNYears = 3) {
    if (!cropRecords || cropRecords.length === 0) {
      return {
        score: 30, // Default low score for no data
        message: 'No crop history available',
        yieldTrend: 'unknown',
        cropDiversity: 0
      };
    }

    let totalYield = 0;
    let yieldCount = 0;
    const yieldsByYear = {};
    const uniqueCrops = new Set();

    for (const crop of cropRecords) {
      const yieldValue = crop.actualYieldPerHectare || crop.expectedYieldPerHectare;
      
      if (yieldValue) {
        totalYield += yieldValue;
        yieldCount++;

        if (!yieldsByYear[crop.year]) {
          yieldsByYear[crop.year] = [];
        }
        yieldsByYear[crop.year].push(yieldValue);
      }

      uniqueCrops.add(crop.cropName);
    }

    const averageYield = yieldCount > 0 ? totalYield / yieldCount : 0;

    // Calculate yield trend
    const years = Object.keys(yieldsByYear).sort();
    let yieldTrend = 'stable';
    let trendScore = 50;

    if (years.length >= 2) {
      const oldYearAvg = yieldsByYear[years[0]].reduce((a, b) => a + b, 0) / yieldsByYear[years[0]].length;
      const recentYearAvg = yieldsByYear[years[years.length - 1]].reduce((a, b) => a + b, 0) / yieldsByYear[years[years.length - 1]].length;
      
      const change = ((recentYearAvg - oldYearAvg) / oldYearAvg) * 100;

      if (change > 10) {
        yieldTrend = 'improving';
        trendScore = 75;
      } else if (change < -10) {
        yieldTrend = 'declining';
        trendScore = 25;
      } else {
        yieldTrend = 'stable';
        trendScore = 50;
      }
    }

    // Calculate crop diversity score
    const cropDiversity = uniqueCrops.size;
    let diversityScore = 0;
    if (cropDiversity >= 4) diversityScore = 30;
    else if (cropDiversity === 3) diversityScore = 20;
    else if (cropDiversity === 2) diversityScore = 10;
    else diversityScore = 0;

    // Calculate base yield score
    let yieldScore = 20; // Base score
    if (averageYield > 4000) yieldScore = 50;
    else if (averageYield > 3000) yieldScore = 40;
    else if (averageYield > 2000) yieldScore = 30;

    // Final score
    const finalScore = Math.min(100, yieldScore + diversityScore + (trendScore - 50) / 2);

    return {
      score: Math.round(finalScore),
      averageYield: Math.round(averageYield),
      yieldTrend: yieldTrend,
      cropDiversity: cropDiversity,
      uniqueCrops: Array.from(uniqueCrops),
      yieldsByYear: yieldsByYear
    };
  }

  /**
   * Assess payment history (mock implementation)
   */
  async assessPaymentHistory(farmerId) {
    // In production, this would query actual payment/transaction records
    // For now, we'll provide a mock assessment
    
    // Mock data: assuming farmer has decent payment history
    const mockData = {
      totalTransactions: 24,
      onTimePayments: 22,
      latePayments: 2,
      defaults: 0,
      averageDaysLate: 5
    };

    const onTimePercentage = (mockData.onTimePayments / mockData.totalTransactions) * 100;

    let score = 0;
    if (onTimePercentage >= 95) score = 100;
    else if (onTimePercentage >= 90) score = 85;
    else if (onTimePercentage >= 80) score = 70;
    else if (onTimePercentage >= 70) score = 50;
    else score = 30;

    // Penalty for defaults
    if (mockData.defaults > 0) {
      score -= (mockData.defaults * 20);
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      onTimePercentage: Math.round(onTimePercentage),
      totalTransactions: mockData.totalTransactions,
      latePayments: mockData.latePayments,
      defaults: mockData.defaults,
      rating: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Poor'
    };
  }

  /**
   * Evaluate government scheme participation
   */
  async evaluateGovernmentSchemeParticipation(farmerId, farmerData) {
    // Mock data for government scheme participation
    const schemes = [
      { name: 'PM-KISAN', enrolled: true, active: true },
      { name: 'Soil Health Card', enrolled: true, active: true },
      { name: 'Crop Insurance (PMFBY)', enrolled: true, active: true },
      { name: 'Kisan Credit Card', enrolled: false, active: false }
    ];

    const activeSchemes = schemes.filter(s => s.active).length;
    const score = Math.min(100, activeSchemes * 25); // Each scheme = 25 points

    return {
      score: score,
      activeSchemes: activeSchemes,
      totalSchemes: schemes.length,
      schemes: schemes,
      participationRate: `${activeSchemes}/${schemes.length}`
    };
  }

  /**
   * Analyze market performance for crops grown
   */
  async analyzeMarketPerformance(cropRecords) {
    if (!cropRecords || cropRecords.length === 0) {
      return {
        score: 40,
        message: 'No crop data available for market analysis'
      };
    }

    let totalIncome = 0;
    let totalCost = 0;
    let profitableCrops = 0;

    for (const crop of cropRecords) {
      const income = crop.actualIncome || crop.estimatedIncome || 0;
      const cost = crop.costOfCultivation || 0;

      totalIncome += income;
      totalCost += cost;

      if (income > cost) profitableCrops++;
    }

    const profitMargin = totalCost > 0 ? ((totalIncome - totalCost) / totalCost) * 100 : 0;
    const profitablePercentage = (profitableCrops / cropRecords.length) * 100;

    let score = 40; // Base score

    if (profitMargin >= 50) score = 100;
    else if (profitMargin >= 30) score = 80;
    else if (profitMargin >= 20) score = 60;
    else if (profitMargin >= 10) score = 50;
    else if (profitMargin >= 0) score = 40;
    else score = 20;

    return {
      score: Math.round(score),
      profitMargin: Math.round(profitMargin),
      totalIncome: Math.round(totalIncome),
      totalCost: Math.round(totalCost),
      profitableCrops: profitableCrops,
      profitablePercentage: Math.round(profitablePercentage)
    };
  }

  /**
   * Identify risk factors
   */
  async identifyRiskFactors(landRecords, soilHealthData, cropRecords) {
    const risks = [];
    let totalPenalty = 0;

    // Geographic risks
    const droughtProneStates = ['Maharashtra', 'Rajasthan', 'Karnataka', 'Andhra Pradesh'];
    const floodProneStates = ['Bihar', 'Assam', 'West Bengal', 'Uttar Pradesh'];

    for (const land of landRecords) {
      if (droughtProneStates.includes(land.state)) {
        risks.push({
          category: 'geographic',
          type: 'drought',
          severity: 'medium',
          penalty: 3,
          message: `Land located in drought-prone region (${land.state})`,
          mitigation: 'Install drip irrigation, harvest rainwater, grow drought-resistant crops'
        });
        totalPenalty += 3;
      }

      if (floodProneStates.includes(land.state)) {
        risks.push({
          category: 'geographic',
          type: 'flood',
          severity: 'medium',
          penalty: 2,
          message: `Land located in flood-prone region (${land.state})`,
          mitigation: 'Construct drainage channels, elevate storage areas, take crop insurance'
        });
        totalPenalty += 2;
      }

      // Soil risks
      if (soilHealthData && soilHealthData.soilHealthScore < 50) {
        risks.push({
          category: 'soil',
          type: 'poor_soil_health',
          severity: 'high',
          penalty: 5,
          message: 'Poor soil health detected',
          mitigation: 'Regular soil testing, apply recommended fertilizers, practice crop rotation'
        });
        totalPenalty += 5;
      }

      // Infrastructure risks
      if (!land.irrigationSource || land.irrigationSource === 'none') {
        risks.push({
          category: 'infrastructure',
          type: 'no_irrigation',
          severity: 'high',
          penalty: 4,
          message: 'No irrigation facility available',
          mitigation: 'Dig bore well, connect to canal system, or install drip irrigation'
        });
        totalPenalty += 4;
      }
    }

    // Crop risks
    if (cropRecords && cropRecords.length > 0) {
      const insuredCrops = cropRecords.filter(c => c.insuranceCover).length;
      const insurancePercentage = (insuredCrops / cropRecords.length) * 100;

      if (insurancePercentage < 50) {
        risks.push({
          category: 'financial',
          type: 'inadequate_insurance',
          severity: 'medium',
          penalty: 3,
          message: `Only ${Math.round(insurancePercentage)}% of crops are insured`,
          mitigation: 'Enroll in PMFBY (Pradhan Mantri Fasal Bima Yojana) for all crops'
        });
        totalPenalty += 3;
      }

      // Monoculture risk
      const uniqueCrops = new Set(cropRecords.map(c => c.cropName));
      if (uniqueCrops.size === 1) {
        risks.push({
          category: 'market',
          type: 'monoculture',
          severity: 'medium',
          penalty: 3,
          message: 'Single crop dependency - high market risk',
          mitigation: 'Diversify crops to spread risk across different markets'
        });
        totalPenalty += 3;
      }
    }

    // Cap total penalty at 15
    totalPenalty = Math.min(15, totalPenalty);

    return {
      factors: risks,
      totalPenalty: totalPenalty,
      riskCount: risks.length
    };
  }

  /**
   * Calculate credit limit based on credit score and asset value
   */
  calculateCreditLimit(creditScore, assetValue) {
    let baseLimit = 0;

    // Determine base limit from credit score
    if (creditScore >= 75) {
      baseLimit = assetValue * 0.40; // 40% of asset value
    } else if (creditScore >= 60) {
      baseLimit = assetValue * 0.25; // 25% of asset value
    } else if (creditScore >= 50) {
      baseLimit = assetValue * 0.15; // 15% of asset value
    } else {
      baseLimit = 0; // Not eligible
    }

    // Seasonal multiplier (mock - would be based on actual season)
    const seasonalMultiplier = 1.0;
    const adjustedLimit = baseLimit * seasonalMultiplier;

    // Cap at reasonable maximum (₹10 lakhs for now)
    const finalLimit = Math.min(adjustedLimit, 1000000);

    return {
      eligibility: creditScore >= 50,
      maxAmount: Math.round(finalLimit),
      baseLimit: Math.round(baseLimit),
      seasonalMultiplier: seasonalMultiplier,
      assetValueUsed: assetValue,
      ltvRatio: assetValue > 0 ? Math.round((finalLimit / assetValue) * 100) : 0
    };
  }

  /**
   * Generate human-readable explanation of credit score
   */
  generateCreditScoreExplanation(creditScore, componentScores, riskFactors) {
    const positiveFactors = [];
    const negativeFactors = [];
    const recommendations = [];

    // Analyze components
    Object.entries(componentScores).forEach(([key, value]) => {
      if (key === 'riskPenalty') {
        if (value > 5) {
          negativeFactors.push(`High risk penalty of ${value} points due to ${riskFactors.length} identified risks`);
        }
      } else {
        if (value >= 15) {
          positiveFactors.push(`Strong ${this.formatComponentName(key)} (${Math.round(value)} points)`);
        } else if (value < 10) {
          negativeFactors.push(`Weak ${this.formatComponentName(key)} (${Math.round(value)} points)`);
          recommendations.push(`Improve ${this.formatComponentName(key)} to increase credit score`);
        }
      }
    });

    // Risk-based recommendations
    if (riskFactors.length > 0) {
      const topRisks = riskFactors.slice(0, 3);
      topRisks.forEach(risk => {
        if (risk.mitigation) {
          recommendations.push(risk.mitigation);
        }
      });
    }

    // Overall rating
    let rating = '';
    if (creditScore >= 75) rating = 'Excellent';
    else if (creditScore >= 60) rating = 'Good';
    else if (creditScore >= 50) rating = 'Fair';
    else if (creditScore >= 40) rating = 'Below Average';
    else rating = 'Poor';

    return {
      rating: rating,
      score: creditScore,
      summary: `Your credit score is ${creditScore}/100, which is ${rating}. This score is based on comprehensive analysis of your land assets, crop yields, payment history, and government scheme participation.`,
      positiveFactors: positiveFactors.slice(0, 3),
      negativeFactors: negativeFactors.slice(0, 3),
      recommendations: recommendations.slice(0, 5),
      disclaimer: 'This credit score is calculated based on available agricultural data and is subject to lender verification and additional due diligence.'
    };
  }

  /**
   * Predict default risk
   */
  async predictDefaultRisk(creditScore, paymentHistory, riskFactors) {
    let defaultProbability = 5; // Base 5% probability

    // Credit score factor
    if (creditScore < 50) defaultProbability += 30;
    else if (creditScore < 60) defaultProbability += 15;
    else if (creditScore >= 75) defaultProbability -= 5;

    // Payment history factor
    if (paymentHistory.onTimePercentage < 80) {
      defaultProbability += 15;
    }
    if (paymentHistory.defaults > 0) {
      defaultProbability += (paymentHistory.defaults * 10);
    }

    // Risk factors
    const highRisks = riskFactors.filter(r => r.severity === 'high').length;
    defaultProbability += (highRisks * 10);

    // Cap at 100%
    defaultProbability = Math.min(100, Math.max(0, defaultProbability));

    let riskRating = '';
    if (defaultProbability < 10) riskRating = 'Low Risk';
    else if (defaultProbability < 25) riskRating = 'Medium-Low Risk';
    else if (defaultProbability < 40) riskRating = 'Medium Risk';
    else if (defaultProbability < 60) riskRating = 'Medium-High Risk';
    else riskRating = 'High Risk';

    return {
      defaultProbability: Math.round(defaultProbability),
      riskRating: riskRating,
      recommendation: defaultProbability < 25 ? 'Suitable for lending' : 
                      defaultProbability < 40 ? 'Proceed with caution' : 
                      'Additional security/guarantees recommended'
    };
  }

  /**
   * Format component name for display
   */
  formatComponentName(key) {
    const names = {
      assetValue: 'Asset Value',
      yieldHistory: 'Yield History',
      paymentHistory: 'Payment History',
      governmentSchemes: 'Government Schemes',
      marketPerformance: 'Market Performance'
    };
    return names[key] || key;
  }

  /**
   * Get risk level from penalty
   */
  getRiskLevel(penalty) {
    if (penalty < 5) return 'Low';
    if (penalty < 10) return 'Medium';
    return 'High';
  }
}

module.exports = new CreditScoringService();
