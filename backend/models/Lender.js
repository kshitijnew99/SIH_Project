const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const lenderSchema = new mongoose.Schema({
  // Basic Information
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true
  },
  lenderType: {
    type: String,
    required: [true, 'Lender type is required'],
    enum: ['bank', 'nbfc', 'microfinance', 'cooperative', 'fintech', 'government'],
    default: 'bank'
  },
  registrationNumber: {
    type: String,
    required: [true, 'Registration number is required'],
    unique: true,
    trim: true
  },
  
  // Contact Information
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  alternatePhone: {
    type: String,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  
  // Address
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^\d{6}$/, 'Please provide a valid pincode']
    }
  },
  
  // Authentication
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false // Don't return password by default
  },
  
  // Authorization & Verification
  role: {
    type: String,
    default: 'lender',
    enum: ['lender']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under_review', 'verified', 'rejected'],
    default: 'pending'
  },
  verificationDocuments: [{
    documentType: {
      type: String,
      enum: ['rbi_license', 'nbfc_certificate', 'registration_certificate', 'pan_card', 'gst_certificate', 'other']
    },
    documentNumber: String,
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Business Details
  businessDetails: {
    establishedYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear()
    },
    portfolioSize: {
      type: Number,
      default: 0,
      min: 0
    },
    activeLoans: {
      type: Number,
      default: 0,
      min: 0
    },
    totalDisbursed: {
      type: Number,
      default: 0,
      min: 0
    },
    npaPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    specialization: [{
      type: String,
      enum: ['agriculture', 'livestock', 'equipment', 'land_purchase', 'working_capital', 'crop_loan', 'allied_activities']
    }],
    serviceStates: [String], // States where they operate
    minimumLoanAmount: {
      type: Number,
      default: 10000
    },
    maximumLoanAmount: {
      type: Number,
      default: 10000000
    },
    interestRateRange: {
      min: { type: Number, default: 7 },
      max: { type: Number, default: 18 }
    }
  },
  
  // Point of Contact
  pointOfContact: {
    name: {
      type: String,
      required: [true, 'Contact person name is required']
    },
    designation: String,
    email: {
      type: String,
      required: [true, 'Contact person email is required']
    },
    phone: {
      type: String,
      required: [true, 'Contact person phone is required']
    }
  },
  
  // Platform Activity
  stats: {
    loansReviewed: {
      type: Number,
      default: 0
    },
    loansApproved: {
      type: Number,
      default: 0
    },
    loansRejected: {
      type: Number,
      default: 0
    },
    loansDisbursed: {
      type: Number,
      default: 0
    },
    averageProcessingTime: {
      type: Number, // in hours
      default: 0
    },
    totalAmountDisbursed: {
      type: Number,
      default: 0
    }
  },
  
  // Settings & Preferences
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: true
    },
    autoScreening: {
      type: Boolean,
      default: false
    },
    minimumCreditScore: {
      type: Number,
      default: 300,
      min: 300,
      max: 900
    },
    preferredCropTypes: [String],
    preferredLandSizes: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 }
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isSuspended: {
    type: Boolean,
    default: false
  },
  suspensionReason: String,
  suspendedAt: Date,
  
  // Timestamps
  lastLogin: Date,
  passwordChangedAt: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date

}, {
  timestamps: true
});

// Index for faster queries
lenderSchema.index({ email: 1 });
lenderSchema.index({ registrationNumber: 1 });
lenderSchema.index({ lenderType: 1, isActive: 1 });
lenderSchema.index({ 'businessDetails.specialization': 1 });
lenderSchema.index({ verificationStatus: 1 });

// Hash password before saving
lenderSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
lenderSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update last login
lenderSchema.methods.updateLastLogin = async function() {
  this.lastLogin = Date.now();
  await this.save({ validateBeforeSave: false });
};

// Update statistics
lenderSchema.methods.updateStats = async function(action, amount = 0) {
  switch(action) {
    case 'review':
      this.stats.loansReviewed += 1;
      break;
    case 'approve':
      this.stats.loansApproved += 1;
      break;
    case 'reject':
      this.stats.loansRejected += 1;
      break;
    case 'disburse':
      this.stats.loansDisbursed += 1;
      this.stats.totalAmountDisbursed += amount;
      this.businessDetails.totalDisbursed += amount;
      break;
  }
  
  // Recalculate average processing time
  if (this.stats.loansApproved > 0 || this.stats.loansRejected > 0) {
    // This would be calculated from actual loan processing times
    // For now, it's a placeholder
  }
  
  await this.save({ validateBeforeSave: false });
};

// Check if lender can process loan amount
lenderSchema.methods.canProcessLoan = function(amount) {
  return amount >= this.businessDetails.minimumLoanAmount && 
         amount <= this.businessDetails.maximumLoanAmount;
};

// Check if lender operates in state
lenderSchema.methods.operatesInState = function(state) {
  return this.businessDetails.serviceStates.length === 0 || 
         this.businessDetails.serviceStates.includes(state);
};

// Get approval rate
lenderSchema.methods.getApprovalRate = function() {
  const total = this.stats.loansApproved + this.stats.loansRejected;
  if (total === 0) return 0;
  return ((this.stats.loansApproved / total) * 100).toFixed(2);
};

// Virtual for full business name
lenderSchema.virtual('fullName').get(function() {
  return this.organizationName;
});

// Virtual for verification percentage
lenderSchema.virtual('verificationProgress').get(function() {
  const requiredDocs = ['rbi_license', 'registration_certificate', 'pan_card'];
  const uploadedDocs = this.verificationDocuments.map(doc => doc.documentType);
  const completed = requiredDocs.filter(doc => uploadedDocs.includes(doc)).length;
  return Math.round((completed / requiredDocs.length) * 100);
});

module.exports = mongoose.model('Lender', lenderSchema);
