const mongoose = require('mongoose');

const AgriStackLandRecordSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    index: true,
    trim: true,
    comment: 'Unique farmer ID linked to Aadhar'
  },
  surveyNumber: {
    type: String,
    required: true,
    trim: true,
    comment: 'Government survey number for land parcel'
  },
  area: {
    type: Number,
    required: true,
    min: 0,
    comment: 'Land area in hectares'
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  village: {
    type: String,
    required: true,
    trim: true
  },
  ownershipType: {
    type: String,
    enum: ['owned', 'leased', 'mortgage', 'disputed'],
    required: true,
    comment: 'Type of land ownership'
  },
  ownershipPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 100,
    comment: 'Percentage of ownership (0-100)'
  },
  landUse: {
    type: String,
    enum: ['agricultural', 'residential', 'commercial'],
    default: 'agricultural'
  },
  irrigationSource: {
    type: String,
    enum: ['well', 'canal', 'river', 'rainwater', 'none'],
    default: 'none'
  },
  electricityAvailable: {
    type: Boolean,
    default: false
  },
  roadAccess: {
    type: Boolean,
    default: false
  },
  mortgageValue: {
    type: Number,
    min: 0,
    default: 0,
    comment: 'Outstanding mortgage value if mortgaged'
  },
  lastTransactionDate: {
    type: Date,
    comment: 'Date of last land transaction/transfer'
  },
  documentVerified: {
    type: Boolean,
    default: false,
    comment: 'Whether land documents are verified by government'
  },
  verificationDate: {
    type: Date,
    comment: 'Date of last verification'
  },
  geoCoordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  marketValue: {
    type: Number,
    min: 0,
    comment: 'Estimated market value in rupees'
  },
  landQuality: {
    type: String,
    enum: ['excellent', 'good', 'average', 'poor'],
    default: 'average'
  }
}, {
  timestamps: true,
  collection: 'agristack_landrecords'
});

// Compound index for efficient queries
AgriStackLandRecordSchema.index({ farmerId: 1, surveyNumber: 1 }, { unique: true });
AgriStackLandRecordSchema.index({ state: 1, district: 1, village: 1 });

// Virtual for calculating net asset value
AgriStackLandRecordSchema.virtual('netAssetValue').get(function() {
  return (this.marketValue || 0) - this.mortgageValue;
});

// Method to check if land is eligible as collateral
AgriStackLandRecordSchema.methods.isEligibleAsCollateral = function() {
  return this.documentVerified && 
         this.ownershipType === 'owned' && 
         this.ownershipPercentage >= 50 &&
         !this.disputed;
};

const AgriStackLandRecord = mongoose.model('AgriStackLandRecord', AgriStackLandRecordSchema);

module.exports = AgriStackLandRecord;
