import app from './enhanced-server.js';

// This file exists solely to start the server
// The enhanced-server.js exports the app but doesn't start it
console.log('🚀 Starting KisanConnect Backend Server...');

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', (error) => {
  if (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
  
  console.log(`🌱 KisanConnect Backend Server`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`📊 Started at: ${new Date().toISOString()}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});