// Simple server test
import express from 'express';
import cors from 'cors';

console.log('🧪 Testing server dependencies...');

try {
  const app = express();
  console.log('✅ Express loaded successfully');
  
  app.use(cors({
    origin: ['http://localhost:8086', 'http://localhost:5173'],
    credentials: true
  }));
  console.log('✅ CORS configured successfully');
  
  app.use(express.json());
  console.log('✅ JSON middleware loaded successfully');
  
  app.get('/test', (req, res) => {
    res.json({ success: true, message: 'Server test successful' });
  });
  
  const PORT = 5001;
  const server = app.listen(PORT, () => {
    console.log(`✅ Test server running on port ${PORT}`);
    console.log('🔗 Test URL: http://localhost:5001/test');
    
    // Test the endpoint
    setTimeout(async () => {
      try {
        const response = await fetch('http://localhost:5001/test');
        const data = await response.json();
        console.log('✅ Self-test successful:', data);
      } catch (error) {
        console.error('❌ Self-test failed:', error.message);
      } finally {
        server.close();
        console.log('🔄 Test server closed');
      }
    }, 1000);
  });
  
} catch (error) {
  console.error('❌ Server test failed:', error);
  console.error('Error details:', error.message);
  process.exit(1);
}