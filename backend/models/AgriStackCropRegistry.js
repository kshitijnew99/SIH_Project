const mongoose = require('mongoose');

const AgriStackCropRegistrySchema = new mongoose.Schema({
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
  cropName: {
    type: String,
    required: true,
    trim: true,
    comment: 'Name of the crop (e.g., Wheat, Rice, Cotton)'
  },
  cropCode: {
    type: String,
    trim: true,
    comment: 'Government crop code'
  },
  season: {
    type: String,
    enum: ['kharif', 'rabi', 'summer', 'zaid'],
    required: true,
    comment: 'Cropping season'
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100,
    comment: 'Crop year'
  },
  areaUnderCrop: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Area under this crop in hectares'
  },
  sowingDate: {
    type: Date,
    required: true,
    comment: 'Date of sowing'
  },
  expectedHarvestDate: {
    type: Date,
    required: true,
    comment: 'Expected harvest date'
  },
  actualHarvestDate: {
    type: Date,
    comment: 'Actual harvest date (filled after harvest)'
  },
  previousYieldPerHectare: {
    type: Number,
    min: 0,
    comment: 'Previous year yield in kg per hectare'
  },
  expectedYieldPerHectare: {
    type: Number,
    min: 0,
    comment: 'Expected yield in kg per hectare'
  },
  actualYieldPerHectare: {
    type: Number,
    min: 0,
    comment: 'Actual yield achieved in kg per hectare'
  },
  varietyUsed: {
    type: String,
    trim: true,
    comment: 'Crop variety name'
  },
  seedQuality: {
    type: String,
    enum: ['certified', 'uncertified', 'farmer-saved', 'hybrid'],
    default: 'farmer-saved'
  },
  irrigationSchedule: {
    type: String,
    comment: 'Irrigation schedule description'
  },
  irrigationMethod: {
    type: String,
    enum: ['flood', 'drip', 'sprinkler', 'furrow', 'none'],
    default: 'flood'
  },
  pesticideUsed: [{
    name: String,
    quantity: Number,
    unit: String,
    applicationDate: Date
  }],
  fertilizerUsed: [{
    name: String,
    quantity: Number,
    unit: String,
    applicationDate: Date
  }],
  insuranceCover: {
    type: Boolean,
    default: false,
    comment: 'Whether crop is insured'
  },
  insuranceScheme: {
    type: String,
    trim: true,
    comment: 'Name of insurance scheme (e.g., PMFBY)'
  },
  insurancePolicyNumber: {
    type: String,
    trim: true,
    comment: 'Insurance policy number'
  },
  insuranceAmount: {
    type: Number,
    min: 0,
    comment: 'Sum insured in rupees'
  },
  estimatedProduction: {
    type: Number,
    min: 0,
    comment: 'Total expected production in quintals'
  },
  actualProduction: {
    type: Number,
    min: 0,
    comment: 'Actual production achieved in quintals'
  },
  estimatedIncome: {
    type: Number,
    min: 0,
    comment: 'Expected income from this crop in rupees'
  },
  actualIncome: {
    type: Number,
    min: 0,
    comment: 'Actual income received in rupees'
  },
  costOfCultivation: {
    type: Number,
    min: 0,
    comment: 'Total cost of cultivation in rupees'
  },
  status: {
    type: String,
    enum: ['planned', 'sown', 'growing', 'ready_to_harvest', 'harvested', 'failed'],
    default: 'planned'
  },
  failureReason: {
    type: String,
    comment: 'Reason for crop failure if status is failed'
  },
  weatherConditions: {
    rainfall: {
      type: Number,
      comment: 'Total rainfall during crop cycle in mm'
    },
    temperature: {
      average: Number,
      min: Number,
      max: Number
    },
    adverseEvents: [{
      type: String,
      date: Date,
      description: String
    }]
  }
}, {
  timestamps: true,
  collection: 'agristack_cropregistry'
});

// Indexes
AgriStackCropRegistrySchema.index({ farmerId: 1, season: 1, year: -1 });
AgriStackCropRegistrySchema.index({ landId: 1 });
AgriStackCropRegistrySchema.index({ cropName: 1, status: 1 });
AgriStackCropRegistrySchema.index({ sowingDate: 1, expectedHarvestDate: 1 });

// Virtual for calculating crop cycle duration
AgriStackCropRegistrySchema.virtual('cropCycleDays').get(function() {
  if (this.actualHarvestDate && this.sowingDate) {
    return Math.ceil((this.actualHarvestDate - this.sowingDate) / (1000 * 60 * 60 * 24));
  } else if (this.expectedHarvestDate && this.sowingDate) {
    return Math.ceil((this.expectedHarvestDate - this.sowingDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Method to calculate profit margin
AgriStackCropRegistrySchema.methods.calculateProfitMargin = function() {
  if (this.actualIncome && this.costOfCultivation) {
    return ((this.actualIncome - this.costOfCultivation) / this.costOfCultivation) * 100;
  } else if (this.estimatedIncome && this.costOfCultivation) {
    return ((this.estimatedIncome - this.costOfCultivation) / this.costOfCultivation) * 100;
  }
  return 0;
};

// Method to calculate yield efficiency
AgriStackCropRegistrySchema.methods.calculateYieldEfficiency = function() {
  if (this.actualYieldPerHectare && this.expectedYieldPerHectare) {
    return (this.actualYieldPerHectare / this.expectedYieldPerHectare) * 100;
  }
  return null;
};

// Method to check if crop is at risk
AgriStackCropRegistrySchema.methods.isAtRisk = function() {
  const risks = [];
  
  if (!this.insuranceCover) {
    risks.push({ type: 'financial', message: 'Crop not insured' });
  }
  
  if (this.status === 'growing') {
    const today = new Date();
    const daysTillHarvest = Math.ceil((this.expectedHarvestDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysTillHarvest < 30) {
      risks.push({ type: 'harvest', message: 'Harvest approaching - monitor closely' });
    }
  }
  
  if (this.weatherConditions && this.weatherConditions.adverseEvents && 
      this.weatherConditions.adverseEvents.length > 0) {
    risks.push({ type: 'weather', message: 'Adverse weather events recorded' });
  }
  
  return { isRisk: risks.length > 0, risks };
};

const AgriStackCropRegistry = mongoose.model('AgriStackCropRegistry', AgriStackCropRegistrySchema);

module.exports = AgriStackCropRegistry;
