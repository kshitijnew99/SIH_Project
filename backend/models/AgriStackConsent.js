const mongoose = require('mongoose');

const AgriStackConsentSchema = new mongoose.Schema({
  farmerId: {
    type: String,
    required: true,
    index: true,
    trim: true
  },
  consentType: {
    type: String,
    enum: ['land_data', 'soil_data', 'crop_data', 'financial_data', 'all'],
    required: true,
    comment: 'Type of data farmer is consenting to share'
  },
  grantedTo: [{
    entityName: {
      type: String,
      required: true,
      trim: true,
      comment: 'Name of entity getting consent'
    },
    entityType: {
      type: String,
      enum: ['bank', 'lender', 'government', 'fintech', 'mfi', 'insurance', 'research'],
      required: true
    },
    entityId: {
      type: String,
      trim: true,
      comment: 'Unique identifier for the entity'
    },
    consentGrantedDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    consentExpiryDate: {
      type: Date,
      required: true,
      comment: 'When this consent expires'
    },
    dataAccess: [{
      type: String,
      enum: ['view', 'analyze', 'credit_scoring', 'reporting', 'sharing'],
      comment: 'What can entity do with data'
    }],
    purpose: {
      type: String,
      required: true,
      trim: true,
      comment: 'Purpose for which data will be used'
    }
  }],
  consentDocument: {
    type: String,
    comment: 'URL to digital consent form document'
  },
  consentId: {
    type: String,
    unique: true,
    required: true,
    comment: 'Unique consent identifier'
  },
  digitalSignature: {
    farmerId: String,
    timestamp: Date,
    method: {
      type: String,
      enum: ['aadhaar-otp', 'biometric', 'digital-signature', 'manual'],
      comment: 'Method used for signing consent'
    },
    verified: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    comment: 'Whether consent is currently active'
  },
  revokedOn: {
    type: Date,
    comment: 'Date when consent was revoked'
  },
  revokedBy: {
    type: String,
    enum: ['farmer', 'system', 'admin'],
    comment: 'Who revoked the consent'
  },
  revokeReason: {
    type: String,
    comment: 'Reason for revoking consent'
  },
  accessLog: [{
    entityId: String,
    accessedAt: Date,
    dataType: String,
    purpose: String,
    ipAddress: String
  }],
  notificationPreferences: {
    emailNotification: {
      type: Boolean,
      default: true
    },
    smsNotification: {
      type: Boolean,
      default: true
    },
    notifyOnAccess: {
      type: Boolean,
      default: true,
      comment: 'Notify farmer when data is accessed'
    }
  }
}, {
  timestamps: true,
  collection: 'agristack_consent'
});

// Indexes
AgriStackConsentSchema.index({ farmerId: 1, isActive: 1 });
AgriStackConsentSchema.index({ consentId: 1 }, { unique: true });
AgriStackConsentSchema.index({ 'grantedTo.entityId': 1 });
AgriStackConsentSchema.index({ 'grantedTo.consentExpiryDate': 1 });

// Pre-save middleware to generate consentId if not exists
AgriStackConsentSchema.pre('save', function(next) {
  if (!this.consentId) {
    this.consentId = `CONSENT-${this.farmerId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Method to check if consent is valid for a specific entity
AgriStackConsentSchema.methods.isValidForEntity = function(entityId) {
  if (!this.isActive) return false;
  
  const grant = this.grantedTo.find(g => g.entityId === entityId);
  if (!grant) return false;
  
  const now = new Date();
  return grant.consentExpiryDate > now;
};

// Method to check if specific data type access is allowed
AgriStackConsentSchema.methods.hasDataAccess = function(entityId, dataType) {
  if (!this.isValidForEntity(entityId)) return false;
  
  const grant = this.grantedTo.find(g => g.entityId === entityId);
  if (!grant) return false;
  
  // If consent type is 'all', allow all data types
  if (this.consentType === 'all') return true;
  
  // Check if requested dataType matches consent type
  const dataTypeMap = {
    'land_data': ['view', 'analyze', 'credit_scoring'],
    'soil_data': ['view', 'analyze', 'credit_scoring'],
    'crop_data': ['view', 'analyze', 'credit_scoring'],
    'financial_data': ['view', 'analyze', 'credit_scoring', 'reporting']
  };
  
  return grant.dataAccess.some(access => dataTypeMap[this.consentType]?.includes(access));
};

// Method to revoke consent
AgriStackConsentSchema.methods.revokeConsent = function(revokedBy, reason) {
  this.isActive = false;
  this.revokedOn = new Date();
  this.revokedBy = revokedBy;
  this.revokeReason = reason;
  return this.save();
};

// Method to log data access
AgriStackConsentSchema.methods.logAccess = function(entityId, dataType, purpose, ipAddress) {
  this.accessLog.push({
    entityId,
    accessedAt: new Date(),
    dataType,
    purpose,
    ipAddress
  });
  return this.save();
};

// Method to extend consent expiry
AgriStackConsentSchema.methods.extendConsent = function(entityId, newExpiryDate) {
  const grant = this.grantedTo.find(g => g.entityId === entityId);
  if (grant) {
    grant.consentExpiryDate = newExpiryDate;
    return this.save();
  }
  return Promise.reject(new Error('Entity not found in granted list'));
};

// Static method to check and deactivate expired consents
AgriStackConsentSchema.statics.deactivateExpiredConsents = async function() {
  const now = new Date();
  const result = await this.updateMany(
    {
      isActive: true,
      'grantedTo.consentExpiryDate': { $lt: now }
    },
    {
      $set: { 
        isActive: false,
        revokedOn: now,
        revokedBy: 'system',
        revokeReason: 'Consent expired'
      }
    }
  );
  return result;
};

const AgriStackConsent = mongoose.model('AgriStackConsent', AgriStackConsentSchema);

module.exports = AgriStackConsent;
