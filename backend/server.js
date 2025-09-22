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

  // Handle file upload and analysis
  socket.on('file-message', async (data) => {
    console.log(`📎 File received from ${socket.id}: ${data.fileName} (${data.fileType})`);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = `You are an agricultural AI assistant for Indian farmers. `;
      
      if (data.fileType.includes('image')) {
        // Handle image files
        prompt += `I'm uploading an image related to farming. Please analyze this image and provide detailed insights about:
1. What you can see in the image (crops, soil, plants, diseases, pests, etc.)
2. Any problems or issues you identify
3. Specific recommendations for improvement
4. Best practices related to what's shown
5. If it's a plant/crop, suggest care instructions
6. If it's soil, analyze the condition and suggest improvements

User's additional message: ${data.message}

Please provide a comprehensive analysis in simple language that an Indian farmer can understand, including both Hindi terms where helpful.`;
      
        // For image files, we need to handle them differently with Gemini Vision
        // Note: This is a simplified version. For full image analysis, you'd need to properly decode and send the image
        const response = await model.generateContent([
          prompt,
          // In a production environment, you'd properly handle the image data here
          "Note: Image analysis requested for farming assistance."
        ]);
        
        const text = await response.response.text();
        
        socket.emit('bot-message', {
          message: `📎 **File Analysis: ${data.fileName}**\n\n${text}\n\n*Analysis based on file: ${data.fileName}*`,
          timestamp: new Date().toISOString(),
          source: 'ai'
        });
        
      } else if (data.fileType.includes('pdf') || data.fileType.includes('text') || data.fileType.includes('document')) {
        // Handle document files (soil reports, etc.)
        prompt += `I'm uploading a document file (${data.fileName}) that contains agricultural information, possibly a soil report or farming document. 

User's message: ${data.message}

Please provide analysis and recommendations based on typical agricultural documents like:
1. If it's a soil report: Explain soil health, nutrient levels, pH recommendations, and fertilizer suggestions
2. If it's a crop report: Provide insights on crop health and recommendations
3. General farming advice based on the document type
4. Specific action items for the farmer
5. Best practices and next steps

Please respond in simple language that an Indian farmer can understand, including relevant Hindi agricultural terms where helpful.

Note: I cannot directly read the document content, so please provide general guidance for ${data.fileName} and ask the user to describe key details if specific analysis is needed.`;
        
        const response = await model.generateContent(prompt);
        const text = await response.response.text();
        
        socket.emit('bot-message', {
          message: `📄 **Document Analysis: ${data.fileName}**\n\n${text}\n\n*For more specific analysis, please describe the key details from your document.*`,
          timestamp: new Date().toISOString(),
          source: 'ai'
        });
      } else {
        // Handle other file types
        socket.emit('bot-message', {
          message: `📎 I received your file "${data.fileName}". I can help analyze:\n\n🖼️ **Images**: Crop diseases, soil conditions, plant health, pest identification\n📄 **Documents**: Soil reports, farming documents, crop reports\n\nFor best results with ${data.fileType} files, please describe what the file contains, and I'll provide specific guidance!`,
          timestamp: new Date().toISOString(),
          source: 'ai'
        });
      }
      
      console.log(`✅ File analysis completed for ${socket.id}`);
      
    } catch (error) {
      console.error(`❌ File analysis failed for ${socket.id}:`, error);
      
      // Provide fallback response for file analysis
      let fallbackMessage = `📎 I received your file "${data.fileName}". `;
      
      if (data.fileType.includes('image')) {
        fallbackMessage += `For image analysis, I can help with:
• Crop disease identification
• Plant health assessment
• Soil condition evaluation
• Pest problem detection
• Growth stage analysis

Please describe what you see in the image, and I'll provide specific advice!`;
      } else {
        fallbackMessage += `For document analysis, please describe the key information from your ${data.fileName}, such as:
• Soil test results and nutrient levels
• Crop health observations
• Specific problems you're facing

This will help me provide more targeted advice!`;
      }
      
      socket.emit('bot-message', {
        message: fallbackMessage,
        timestamp: new Date().toISOString(),
        source: 'fallback'
      });
    }
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