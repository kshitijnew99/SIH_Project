const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  // Applicant Information
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required']
  },
  farmerName: {
    type: String,
    required: true
  },
  farmerEmail: String,
  farmerPhone: String,
  
  // Lender Information
  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lender'
  },
  lenderName: String,
  
  // Loan Details
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [1000, 'Minimum loan amount is ₹1,000'],
    max: [50000000, 'Maximum loan amount is ₹5 crore']
  },
  loanPurpose: {
    type: String,
    required: [true, 'Loan purpose is required'],
    enum: [
      'crop_cultivation',
      'equipment_purchase',
      'land_purchase',
      'irrigation_setup',
      'livestock_purchase',
      'warehouse_construction',
      'working_capital',
      'allied_activities',
      'other'
    ]
  },
  loanPurposeDetails: {
    type: String,
    maxlength: [500, 'Purpose details cannot exceed 500 characters']
  },
  loanTenure: {
    type: Number, // in months
    required: [true, 'Loan tenure is required'],
    min: [3, 'Minimum tenure is 3 months'],
    max: [240, 'Maximum tenure is 20 years']
  },
  requestedInterestRate: {
    type: Number,
    min: 0,
    max: 25
  },
  
  // Credit Assessment
  creditScore: {
    score: {
      type: Number,
      min: 300,
      max: 900
    },
    rating: {
      type: String,
      enum: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
    },
    assessmentDate: Date,
    breakdown: {
      assetValue: Number,
      yieldConsistency: Number,
      paymentHistory: Number,
      governmentSchemes: Number,
      marketPerformance: Number,
      riskAdjustment: Number
    }
  },
  riskAssessment: {
    riskLevel: {
      type: String,
      enum: ['Very Low', 'Low', 'Medium', 'High', 'Very High']
    },
    riskFactors: [{
      type: String,
      severity: String,
      description: String,
      mitigation: String
    }],
    defaultProbability: Number
  },
  
  // Collateral Information
  collateral: [{
    type: {
      type: String,
      enum: ['land', 'equipment', 'livestock', 'warehouse', 'crops', 'other']
    },
    description: String,
    estimatedValue: Number,
    landId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AgriStackLandRecord'
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  totalCollateralValue: {
    type: Number,
    default: 0
  },
  loanToValueRatio: {
    type: Number,
    default: 0
  },
  
  // Application Status
  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'documents_requested',
      'approved',
      'rejected',
      'disbursed',
      'withdrawn',
      'expired'
    ],
    default: 'draft'
  },
  statusHistory: [{
    status: String,
    comment: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'statusHistory.updatedByModel'
    },
    updatedByModel: {
      type: String,
      enum: ['User', 'Lender', 'Admin']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Documents
  documents: [{
    documentType: {
      type: String,
      enum: [
        'identity_proof',
        'address_proof',
        'land_ownership',
        'income_proof',
        'bank_statement',
        'crop_records',
        'soil_health_card',
        'insurance_policy',
        'loan_application_form',
        'other'
      ]
    },
    documentName: String,
    documentUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    verifiedAt: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Lender Review
  lenderReview: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lender'
    },
    reviewedAt: Date,
    reviewNotes: String,
    approvedAmount: Number,
    approvedTenure: Number,
    offeredInterestRate: Number,
    conditions: [String],
    rejectionReason: String
  },
  
  // Disbursement
  disbursement: {
    disbursedAmount: Number,
    disbursedDate: Date,
    disbursementMethod: {
      type: String,
      enum: ['bank_transfer', 'cheque', 'digital_wallet', 'other']
    },
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      bankName: String,
      accountHolderName: String
    },
    transactionId: String,
    disbursementProof: String
  },
  
  // Repayment
  repaymentSchedule: [{
    installmentNumber: Number,
    dueDate: Date,
    principalAmount: Number,
    interestAmount: Number,
    totalAmount: Number,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'partial'],
      default: 'pending'
    },
    paidAmount: Number,
    paidDate: Date,
    paymentMode: String,
    transactionId: String
  }],
  
  // Communication
  messages: [{
    from: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'messages.fromModel'
    },
    fromModel: {
      type: String,
      enum: ['User', 'Lender']
    },
    message: String,
    attachments: [String],
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Important Dates
  submittedAt: Date,
  reviewedAt: Date,
  approvedAt: Date,
  rejectedAt: Date,
  disbursedAt: Date,
  applicationExpiry: {
    type: Date,
    default: function() {
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from creation
    }
  },
  
  // Metadata
  applicationNumber: {
    type: String,
    unique: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  tags: [String],
  notes: String

}, {
  timestamps: true
});

// Indexes for faster queries
loanApplicationSchema.index({ farmerId: 1, status: 1 });
loanApplicationSchema.index({ lenderId: 1, status: 1 });
loanApplicationSchema.index({ applicationNumber: 1 });
loanApplicationSchema.index({ status: 1, createdAt: -1 });
loanApplicationSchema.index({ 'creditScore.score': 1 });
loanApplicationSchema.index({ submittedAt: -1 });

// Generate application number before saving
loanApplicationSchema.pre('save', async function(next) {
  if (!this.applicationNumber) {
    const prefix = 'LOAN';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.applicationNumber = `${prefix}${timestamp}${random}`;
  }
  next();
});

// Calculate LTV ratio before saving
loanApplicationSchema.pre('save', function(next) {
  if (this.totalCollateralValue > 0 && this.loanAmount > 0) {
    this.loanToValueRatio = ((this.loanAmount / this.totalCollateralValue) * 100).toFixed(2);
  }
  next();
});

// Methods

// Update status with history
loanApplicationSchema.methods.updateStatus = async function(newStatus, comment, updatedBy, updatedByModel) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    comment,
    updatedBy,
    updatedByModel,
    timestamp: Date.now()
  });
  
  // Update specific date fields
  switch(newStatus) {
    case 'submitted':
      this.submittedAt = Date.now();
      break;
    case 'approved':
      this.approvedAt = Date.now();
      break;
    case 'rejected':
      this.rejectedAt = Date.now();
      break;
    case 'disbursed':
      this.disbursedAt = Date.now();
      break;
  }
  
  await this.save();
};

// Add message
loanApplicationSchema.methods.addMessage = async function(from, fromModel, message, attachments = []) {
  this.messages.push({
    from,
    fromModel,
    message,
    attachments,
    timestamp: Date.now()
  });
  await this.save();
};

// Calculate total collateral value
loanApplicationSchema.methods.calculateCollateralValue = function() {
  this.totalCollateralValue = this.collateral.reduce((total, item) => {
    return total + (item.estimatedValue || 0);
  }, 0);
  return this.totalCollateralValue;
};

// Check if application is expired
loanApplicationSchema.methods.isExpired = function() {
  return this.applicationExpiry < Date.now() && 
         ['draft', 'submitted', 'under_review'].includes(this.status);
};

// Get application age in days
loanApplicationSchema.methods.getApplicationAge = function() {
  const ageMs = Date.now() - this.createdAt;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24));
};

// Get processing time in days
loanApplicationSchema.methods.getProcessingTime = function() {
  if (!this.submittedAt) return 0;
  const endDate = this.approvedAt || this.rejectedAt || Date.now();
  const processMs = endDate - this.submittedAt;
  return Math.floor(processMs / (1000 * 60 * 60 * 24));
};

// Virtual for loan EMI calculation
loanApplicationSchema.virtual('emi').get(function() {
  if (!this.loanAmount || !this.loanTenure || !this.requestedInterestRate) {
    return null;
  }
  
  const P = this.loanAmount;
  const r = this.requestedInterestRate / 12 / 100; // Monthly interest rate
  const n = this.loanTenure; // Number of months
  
  if (r === 0) {
    return P / n;
  }
  
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(emi);
});

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);
