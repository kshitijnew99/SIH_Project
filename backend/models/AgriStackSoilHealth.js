const mongoose = require('mongoose');

const AgriStackSoilHealthSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  landId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgriStackLandRecord',
    required: true
  },
  testDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  labName: {
    type: String,
    required: true,
    trim: true,
    comment: 'Name of soil testing laboratory'
  },
  testResults: {
    pH: {
      type: Number,
      required: true,
      min: 0,
      max: 14,
      comment: 'Soil pH value (0-14)'
    },
    nitrogen: {
      type: Number,
      required: true,
      min: 0,
      comment: 'Nitrogen content in mg/kg'
    },
    phosphorus: {
      type: Number,
      required: true,
      min: 0,
      comment: 'Phosphorus content in mg/kg'
    },
    potassium: {
      type: Number,
      required: true,
      min: 0,
      comment: 'Potassium content in mg/kg'
    },
    organicCarbon: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      comment: 'Organic carbon percentage'
    },
    micronutrients: {
      zinc: {
        type: Number,
        min: 0,
        comment: 'Zinc content in mg/kg'
      },
      boron: {
        type: Number,
        min: 0,
        comment: 'Boron content in mg/kg'
      },
      manganese: {
        type: Number,
        min: 0,
        comment: 'Manganese content in mg/kg'
      },
      copper: {
        type: Number,
        min: 0,
        comment: 'Copper content in mg/kg'
      },
      iron: {
        type: Number,
        min: 0,
        comment: 'Iron content in mg/kg'
      },
      sulphur: {
        type: Number,
        min: 0,
        comment: 'Sulphur content in mg/kg'
      }
    },
    soilTexture: {
      type: String,
      enum: ['sandy', 'clay', 'loamy', 'silty', 'sandy-loam', 'clay-loam'],
      required: true
    },
    waterHoldingCapacity: {
      type: Number,
      min: 0,
      max: 100,
      comment: 'Water holding capacity percentage'
    },
    electricalConductivity: {
      type: Number,
      min: 0,
      comment: 'EC value in dS/m (salinity indicator)'
    }
  },
  recommendations: [{
    nutrient: {
      type: String,
      required: true,
      comment: 'Nutrient name (e.g., Nitrogen, Phosphorus)'
    },
    recommendation: {
      type: String,
      required: true,
      comment: 'Detailed recommendation text'
    },
    dosage: {
      type: String,
      comment: 'Recommended dosage'
    },
    timing: {
      type: String,
      comment: 'When to apply'
    },
    dueDate: {
      type: Date,
      comment: 'When action is due'
    }
  }],
  soilHealthScore: {
    type: Number,
    min: 0,
    max: 100,
    comment: 'Calculated soil health score (0-100)'
  },
  validUpto: {
    type: Date,
    required: true,
    comment: 'Validity of soil test results'
  },
  certificateNumber: {
    type: String,
    trim: true,
    comment: 'Soil health card certificate number'
  },
  issueAuthority: {
    type: String,
    trim: true,
    comment: 'Government authority that issued the card'
  }
}, {
  timestamps: true,
  collection: 'agristack_soilhealth'
});

// Indexes
AgriStackSoilHealthSchema.index({ farmerId: 1, landId: 1 });
AgriStackSoilHealthSchema.index({ testDate: -1 });
AgriStackSoilHealthSchema.index({ validUpto: 1 });

// Method to check if soil test is still valid
AgriStackSoilHealthSchema.methods.isValid = function() {
  return this.validUpto > new Date();
};

// Method to calculate overall soil health score
AgriStackSoilHealthSchema.methods.calculateHealthScore = function() {
  let score = 0;
  const results = this.testResults;
  
  // pH score (20 points) - ideal range 6-7
  const pHIdeal = 6.5;
  const pHScore = Math.max(0, 20 - Math.abs(results.pH - pHIdeal) * 5);
  score += pHScore;
  
  // Nitrogen score (20 points) - higher is better
  const nitrogenScore = Math.min(20, (results.nitrogen / 300) * 20);
  score += nitrogenScore;
  
  // Phosphorus score (20 points)
  const phosphorusScore = Math.min(20, (results.phosphorus / 50) * 20);
  score += phosphorusScore;
  
  // Potassium score (20 points)
  const potassiumScore = Math.min(20, (results.potassium / 300) * 20);
  score += potassiumScore;
  
  // Organic carbon score (15 points) - above 2% is good
  const organicCarbonScore = Math.min(15, (results.organicCarbon / 2) * 15);
  score += organicCarbonScore;
  
  // Micronutrients score (5 points)
  const microScore = 5; // Simplified - presence of micronutrient data
  score += microScore;
  
  return Math.round(score);
};

// Method to get soil health rating
AgriStackSoilHealthSchema.methods.getHealthRating = function() {
  const score = this.soilHealthScore || this.calculateHealthScore();
  
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Average';
  if (score >= 35) return 'Poor';
  return 'Very Poor';
};

const AgriStackSoilHealth = mongoose.model('AgriStackSoilHealth', AgriStackSoilHealthSchema);

module.exports = AgriStackSoilHealth;
