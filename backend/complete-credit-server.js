// KisanConnect Enhanced Server with Credit Assessment Features
// Add this to your backend/server.js or create a new complete-server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisanconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==========================================
// EXISTING ROUTES (Keep your current routes)
// ==========================================
const authRoutes = require('./routes/auth');
const landRoutes = require('./routes/lands');

app.use('/api/auth', authRoutes);
app.use('/api/lands', landRoutes);

// ==========================================
// NEW CREDIT ASSESSMENT ROUTES
// ==========================================

// Agri Stack Integration
const agriStackRoutes = require('./routes/agriStack');
app.use('/api/agristack', agriStackRoutes);

// AI Credit Scoring
const creditScoreRoutes = require('./routes/creditScore');
app.use('/api/credit-score', creditScoreRoutes);

// Lender Authentication & Profile
const lenderAuthRoutes = require('./routes/lenderAuth');
app.use('/api/lender-auth', lenderAuthRoutes);

// Loan Application Management
const loanApplicationRoutes = require('./routes/loanApplications');
app.use('/api/loan-applications', loanApplicationRoutes);

// ==========================================
// HEALTH CHECK & INFO ENDPOINTS
// ==========================================

app.get('/', (req, res) => {
  res.json({
    message: 'KisanConnect API - Agricultural Credit Assessment Platform',
    version: '2.0.0',
    features: [
      'Agri Stack Integration',
      'AI Credit Scoring',
      'Lender Dashboard',
      'Loan Management',
      'Risk Analytics'
    ],
    endpoints: {
      agriStack: '/api/agristack',
      creditScore: '/api/credit-score',
      lenderAuth: '/api/lender-auth',
      loanApplications: '/api/loan-applications'
    },
    status: 'Active',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.path
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ==========================================
// SERVER START
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀 KisanConnect Server Started Successfully!');
  console.log('='.repeat(60));
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60));
  console.log('📋 Available Routes:');
  console.log('   - /api/auth              (User Authentication)');
  console.log('   - /api/lands             (Land Management)');
  console.log('   - /api/agristack         (Agri Stack Integration) 🆕');
  console.log('   - /api/credit-score      (AI Credit Scoring) 🆕');
  console.log('   - /api/lender-auth       (Lender Platform) 🆕');
  console.log('   - /api/loan-applications (Loan Management) 🆕');
  console.log('='.repeat(60));
  console.log('✨ New Features Active:');
  console.log('   ✅ Agri Stack API Integration');
  console.log('   ✅ AI-Powered Credit Scoring');
  console.log('   ✅ Lender Dashboard & Portal');
  console.log('   ✅ Loan Application Workflow');
  console.log('   ✅ Risk Assessment Engine');
  console.log('='.repeat(60));
});

// ==========================================
// GRACEFUL SHUTDOWN
// ==========================================

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
