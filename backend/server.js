import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    "http://localhost:3000", 
    "http://localhost:5173", 
    "http://localhost:8084",
    "http://localhost:8085",
    "http://localhost:8086"
  ],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: corsOptions
});

// Agricultural knowledge base for fallback responses
const agriculturalKnowledge = {
  crops: {
    keywords: ['crop', 'seed', 'plant', 'grow', 'harvest', 'wheat', 'rice', 'corn', 'vegetable'],
    responses: [
      "For optimal crop growth, ensure proper soil preparation, adequate water supply, and timely fertilization.",
      "Consider crop rotation to maintain soil fertility and reduce pest problems.",
      "Choose crop varieties suited to your local climate and soil conditions."
    ]
  },
  soil: {
    keywords: ['soil', 'fertility', 'nutrient', 'pH', 'organic', 'compost', 'fertilizer'],
    responses: [
      "Test your soil pH regularly. Most crops prefer slightly acidic to neutral soil (6.0-7.0 pH).",
      "Add organic matter like compost to improve soil structure and fertility.",
      "Consider soil testing to determine specific nutrient requirements."
    ]
  },
  pest: {
    keywords: ['pest', 'insect', 'disease', 'bug', 'control', 'spray', 'protection'],
    responses: [
      "Implement integrated pest management (IPM) combining biological, cultural, and chemical controls.",
      "Regular monitoring helps detect pest problems early when they're easier to manage.",
      "Consider beneficial insects and organic pesticides as eco-friendly alternatives."
    ]
  },
  weather: {
    keywords: ['weather', 'rain', 'drought', 'season', 'climate', 'temperature', 'monsoon'],
    responses: [
      "Monitor weather forecasts to plan farming activities like sowing, irrigation, and harvesting.",
      "During drought, focus on water conservation techniques like mulching and drip irrigation.",
      "Prepare for seasonal changes by adjusting crop selection and farming practices."
    ]
  },
  market: {
    keywords: ['market', 'price', 'sell', 'buyer', 'profit', 'income', 'demand'],
    responses: [
      "Research market prices before planting to choose profitable crops.",
      "Consider direct selling to consumers or joining farmer cooperatives for better prices.",
      "Diversify crops to reduce market risk and ensure steady income throughout the year."
    ]
  }
};

// Function to get fallback response based on user input
function getFallbackResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Check each knowledge category
  for (const [category, data] of Object.entries(agriculturalKnowledge)) {
    if (data.keywords.some(keyword => input.includes(keyword))) {
      const responses = data.responses;
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // General farming advice if no specific category matches
  return "I'm here to help with your farming questions! Ask me about crops, soil management, pest control, weather planning, or market strategies.";
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  
  // Send welcome message
  socket.emit('bot-message', {
    message: "🌾 Hello! I'm your KisanConnect AI assistant. How can I help you with your farming needs today?",
    timestamp: new Date().toISOString()
  });

  // Handle chat messages
  socket.on('chat-message', async (data) => {
    const { message, timestamp } = data;
    console.log(`💬 Message from ${socket.id}: ${message}`);
    
    try {
      // Initialize Gemini model with the correct model name
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Enhanced prompt for agricultural context
      const agriculturalPrompt = `You are an expert agricultural advisor for Indian farmers. 
      Please provide practical, actionable advice for this farming question: "${message}"
      
      Keep your response:
      - Concise but informative (2-3 sentences)
      - Focused on practical solutions
      - Relevant to Indian farming conditions
      - Easy to understand for farmers
      
      Question: ${message}`;

      // Generate response using Gemini
      const result = await model.generateContent(agriculturalPrompt);
      const response = await result.response;
      const botMessage = response.text();
      
      console.log(`🤖 Bot response: ${botMessage}`);
      
      // Send AI response back to client
      socket.emit('bot-message', {
        message: botMessage,
        timestamp: new Date().toISOString(),
        source: 'ai'
      });
      
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Provide intelligent fallback response
      const fallbackMessage = getFallbackResponse(message);
      
      socket.emit('bot-message', {
        message: `${fallbackMessage}\n\n💡 *Note: I'm currently experiencing connectivity issues, but I'm still here to help with general agricultural guidance!*`,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }
  });

  // Handle API connection test
  socket.on('test-connection', async () => {
    console.log(`🧪 Testing API connection for ${socket.id}`);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Respond with: API connection successful");
      const response = await result.response;
      const text = response.text();
      
      socket.emit('connection-test-result', {
        success: true,
        message: text,
        timestamp: new Date().toISOString()
      });
      
      console.log(`✅ API test successful for ${socket.id}`);
      
    } catch (error) {
      console.error(`❌ API test failed for ${socket.id}:`, error);
      
      socket.emit('connection-test-result', {
        success: false,
        message: error.message || 'Connection test failed',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle user typing indicator
  socket.on('typing', (data) => {
    socket.broadcast.emit('user-typing', {
      userId: socket.id,
      isTyping: data.isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    server: 'KisanConnect Backend',
    version: '1.0.0',
    socketIO: 'active',
    geminiAPI: process.env.GEMINI_API_KEY ? 'configured' : 'missing',
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log('🚀 KisanConnect Backend Server Started!');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API status: http://localhost:${PORT}/api/status`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔌 Socket.IO ready for connections`);
});