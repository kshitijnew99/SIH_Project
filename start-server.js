#!/usr/bin/env node
import('./backend/enhanced-server.js')
  .then(() => {
    console.log('✅ Server module loaded successfully');
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  });