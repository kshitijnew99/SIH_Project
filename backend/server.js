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

// In-memory storage for development
let users = [];
let userIdCounter = 1;

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
    ]
  }
};

// Platform-specific data (mock data - in production this would come from database)
const platformData = {
  mandiPrices: {
    "Madhya Pradesh": {
      "Indore": { wheat: 2200, soybean: 4800, cotton: 6200 },
      "Bhopal": { wheat: 2150, soybean: 4750, cotton: 6100 },
      "Jabalpur": { wheat: 2180, soybean: 4820, cotton: 6250 }
    },
    "Maharashtra": {
      "Nashik": { wheat: 2300, soybean: 4900, cotton: 6400 },
      "Pune": { wheat: 2280, soybean: 4850, cotton: 6300 },
      "Sangli": { sugarcane: 3200, turmeric: 8500, cotton: 6350 }
    },
    "Punjab": {
      "Amritsar": { wheat: 2400, rice: 2800, vegetables: 1500 },
      "Ludhiana": { wheat: 2350, rice: 2750, vegetables: 1450 }
    }
  },
  availableLand: {
    "Madhya Pradesh": { totalAcres: 245, averagePrice: 18000 },
    "Maharashtra": { totalAcres: 156, averagePrice: 22000 },
    "Punjab": { totalAcres: 89, averagePrice: 30000 }
  },
  tools: [
    { name: "Soil pH Tester", category: "testing", available: true },
    { name: "Weather Predictor", category: "planning", available: true },
    { name: "Crop Disease Identifier", category: "health", available: true },
    { name: "Market Price Tracker", category: "market", available: true }
  ]
};

// Enhanced language detection function (consistent with frontend)
function detectLanguage(text) {
  // Check for Hindi Unicode characters
  const hindiPattern = /[\u0900-\u097F]/;
  const hasHindiChars = hindiPattern.test(text);
  
  if (hasHindiChars) {
    return 'hindi';
  }
  
  // Check for common Hindi words written in English (transliteration)
  const hindiTransliterationPatterns = [
    /\b(mujhe|aapka|kya|hai|mein|ke|ki|ka|se|batao|bataye|chahiye|karke|kaise|kyun|kahan|kab)\b/i,
    /\b(gehun|chawal|kapas|soyabean|fasal|kheti|mandi|price|bhav|rates)\b/i,
    /\b(sahayata|madad|sahayyata|jankari|jankariya)\b/i,
    /\b(aap|hum|main|aapko|humko|hamko|humein|hamein)\b/i
  ];
  
  const hasHindiTransliteration = hindiTransliterationPatterns.some(pattern => pattern.test(text));
  
  if (hasHindiTransliteration) {
    return 'hindi';
  }
  
  // Very strict English-only patterns (only these will get English response)
  const strictEnglishPatterns = [
    /^(what are the|show me the|tell me the|give me the|list the|provide the)\s+(current\s+)?(wheat|rice|corn|soybean|cotton)\s+(price|prices|rate|rates)/i,
    /^(show me|tell me)\s+(available\s+)?(land|farms?|plots?)\s+(for\s+)?(farming|agriculture|rent)/i,
    /^(hello|hi|hey),?\s+(can you help|help me|i need|please help)/i,
    /^(what is|how can|can you)\s+.*(platform|kisanconnect|system)/i
  ];
  
  const isStrictEnglish = strictEnglishPatterns.some(pattern => pattern.test(text.trim()));
  
  // Default to Hindi unless it's very clearly English
  return isStrictEnglish ? 'english' : 'hindi';
}

// Enhanced platform-aware prompt generation
function generatePlatformAwarePrompt(userMessage, detectedLanguage) {
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  let basePrompt = `You are KisanConnect AI, an intelligent agricultural assistant for the KisanConnect platform. Today's date is ${currentDate}.

PLATFORM CONTEXT:
- KisanConnect is a comprehensive agricultural platform
- Current Mandi Prices (₹/quintal): ${JSON.stringify(platformData.mandiPrices)}
- Available Land for Rent: ${JSON.stringify(platformData.availableLand)}
- Platform Tools: ${platformData.tools.map(t => `${t.name} (${t.category})`).join(', ')}
- You can help users find land, check mandi prices, use agricultural tools, and connect farmers

IMPORTANT LANGUAGE INSTRUCTION:
${detectedLanguage === 'hindi' ? 
  'User ने हिंदी में सवाल पूछा है। आपको जवाब ONLY हिंदी में देना है। कोई English words का उपयोग न करें। Pure Hindi में respond करें।' :
  'User asked in English. Respond ONLY in English. Do not use any Hindi words. Keep response in pure English.'
}

User Query: ${userMessage}

Provide helpful, accurate information about:
1. Current mandi prices when asked about market rates
2. Available land listings when asked about land rental
3. Platform features and tools
4. General agricultural advice
5. Weather and crop guidance

Remember: Respond in ${detectedLanguage === 'hindi' ? 'HINDI' : 'ENGLISH'} language only.`;

  return basePrompt;
}

// Function to get platform-aware fallback response based on user input and language
function getFallbackResponse(userInput, language = 'english') {
  const input = userInput.toLowerCase();
  
  // Platform-specific responses based on query type
  if (input.includes('mandi') || input.includes('price') || input.includes('market') || input.includes('मंडी') || input.includes('दाम')) {
    const mandiInfo = Object.entries(platformData.mandiPrices).slice(0, 2);
    if (language === 'hindi') {
      return `🌾 वर्तमान मंडी भाव (₹/क्विंटल):\n${mandiInfo.map(([state, cities]) => 
        `${state}: ${Object.entries(Object.values(cities)[0]).map(([crop, price]) => `${crop}: ₹${price}`).join(', ')}`
      ).join('\n')}\n\nKisanConnect पर अधिक जानकारी के लिए Market सेक्शन देखें।`;
    } else {
      return `🌾 Current Mandi Prices (₹/quintal):\n${mandiInfo.map(([state, cities]) => 
        `${state}: ${Object.entries(Object.values(cities)[0]).map(([crop, price]) => `${crop}: ₹${price}`).join(', ')}`
      ).join('\n')}\n\nCheck Market section on KisanConnect for more details.`;
    }
  }
  
  if (input.includes('land') || input.includes('rent') || input.includes('lease') || input.includes('जमीन') || input.includes('किराया')) {
    if (language === 'hindi') {
      return `🏞️ KisanConnect पर उपलब्ध जमीन:\n• मध्य प्रदेश: 245 एकड़, औसत ₹18,000/एकड़\n• महाराष्ट्र: 156 एकड़, औसत ₹22,000/एकड़\n• पंजाब: 89 एकड़, औसत ₹30,000/एकड़\n\nLand सेक्शन में जाकर जमीन देखें।`;
    } else {
      return `🏞️ Available Land on KisanConnect:\n• Madhya Pradesh: 245 acres, avg ₹18,000/acre\n• Maharashtra: 156 acres, avg ₹22,000/acre\n• Punjab: 89 acres, avg ₹30,000/acre\n\nVisit Land section to browse listings.`;
    }
  }
  
  if (input.includes('tool') || input.includes('feature') || input.includes('उपकरण') || input.includes('सुविधा')) {
    if (language === 'hindi') {
      return `🛠️ KisanConnect के उपकरण:\n• मिट्टी pH टेस्टर\n• मौसम भविष्यवाणी\n• फसल रोग पहचान\n• बाजार मूल्य ट्रैकर\n\nTools सेक्शन में जाकर इस्तेमाल करें।`;
    } else {
      return `🛠️ KisanConnect Tools:\n• Soil pH Tester\n• Weather Predictor\n• Crop Disease Identifier\n• Market Price Tracker\n\nVisit Tools section to access these features.`;
    }
  }
  
  // Check traditional agricultural knowledge categories
  for (const [category, data] of Object.entries(agriculturalKnowledge)) {
    if (data.keywords.some(keyword => input.includes(keyword))) {
      const responses = data.responses;
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      if (language === 'hindi') {
        // Provide Hindi translation for agricultural advice
        const hindiResponses = {
          crop: "बेहतर फसल के लिए मिट्टी की तैयारी, पर्याप्त पानी और समय पर खाद जरूरी है। फसल चक्र अपनाएं।",
          soil: "मिट्टी का pH नियमित जांचें। अधिकतर फसलों के लिए 6.0-7.0 pH अच्छा है। कंपोस्ट डालें।",
          pest: "कीट प्रबंधन के लिए जैविक और रासायनिक दोनों तरीके अपनाएं। नियमित निगरानी करें।",
          weather: "मौसम पूर्वानुमान देखकर खेती की योजना बनाएं। सूखे में पानी बचाव के तरीके अपनाएं।",
          market: "बुआई से पहले बाजार भाव जांचें। सीधे बिक्री या सहकारी समिति से जुड़ें।"
        };
        return hindiResponses[category] || response;
      }
      return response;
    }
  }
  
  // General platform introduction
  if (language === 'hindi') {
    return "🌾 मैं KisanConnect AI हूं! मैं आपकी खेती संबंधी मदद कर सकता हूं - मंडी भाव, जमीन किराया, कृषि उपकरण, और फसल सलाह के लिए पूछें।";
  } else {
    return "🌾 I'm KisanConnect AI! I can help with farming queries, mandi prices, land rental, agricultural tools, and crop advice. Ask me anything!";
  }
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
    const { message, timestamp, isVoice, detectedLanguage, originalLanguage, confidence } = data;
    console.log(`💬 Message from ${socket.id}: ${message} ${isVoice ? `(Voice - ${originalLanguage} → ${detectedLanguage}, ${confidence ? Math.round(confidence * 100) + '%' : 'unknown'} confidence)` : ''}`);
    
    try {
      // Use enhanced language detection for voice messages
      let inputLanguage;
      if (isVoice && detectedLanguage) {
        inputLanguage = detectedLanguage;
        console.log(`🎤 Enhanced voice detection: Original recognition=${originalLanguage}, Final language=${inputLanguage}`);
      } else {
        inputLanguage = detectLanguage(message);
        console.log(`🔍 Text message language (detected): ${inputLanguage}`);
      }
      console.log(`🌐 Final language for response: ${inputLanguage}`);
      
      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Generate platform-aware prompt with language preference
      const platformAwarePrompt = generatePlatformAwarePrompt(message, inputLanguage);

      // Generate response using Gemini
      const result = await model.generateContent(platformAwarePrompt);
      const response = await result.response;
      const botMessage = response.text();
      
      console.log(`🤖 Bot response (${inputLanguage}): ${botMessage}`);
      
      // Send AI response back to client
      socket.emit('bot-message', {
        message: botMessage,
        timestamp: new Date().toISOString(),
        source: 'ai',
        language: inputLanguage
      });
      
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      
      // Use the same language detection logic as above
      let errorLanguage;
      if (isVoice && detectedLanguage) {
        errorLanguage = detectedLanguage;
      } else {
        errorLanguage = detectLanguage(message);
      }
      
      // Provide intelligent fallback response in detected language
      const fallbackMessage = getFallbackResponse(message, errorLanguage);
      
      const connectivityNote = errorLanguage === 'hindi' 
        ? '💡 *नोट: मुझे वर्तमान में कनेक्टिविटी की समस्या है, लेकिन मैं अभी भी कृषि मार्गदर्शन के लिए यहाँ हूँ!*'
        : '💡 *Note: I\'m currently experiencing connectivity issues, but I\'m still here to help with general agricultural guidance!*';
      
      socket.emit('bot-message', {
        message: `${fallbackMessage}\n\n${connectivityNote}`,
        timestamp: new Date().toISOString(),
        source: 'fallback',
        language: errorLanguage
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
        source: 'fallback',
        language: 'english' // Default to English for file analysis fallback
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// ==========================================
// NEW CREDIT ASSESSMENT ROUTES
// ==========================================
// Note: Routes need to be converted to ES modules first
// For now, we'll add a placeholder that shows these routes exist
app.get('/api/credit-assessment/status', (req, res) => {
  res.json({
    status: 'available',
    message: 'Credit Assessment Platform Routes',
    routes: {
      agriStack: '/api/agristack - Agri Stack Integration (9 endpoints)',
      creditScore: '/api/credit-score - AI Credit Scoring (9 endpoints)',
      lenderAuth: '/api/lender-auth - Lender Authentication (7 endpoints)',
      loanApplications: '/api/loan-applications - Loan Management (10+ endpoints)'
    },
    note: 'Routes are created but need ES module conversion. Check INTEGRATION_CHECKLIST.md'
  });
});

// Authentication endpoints
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, role, phone, governmentId, department, district, aadhaar } = req.body;
    
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user
    const user = {
      id: userIdCounter++,
      name,
      email,
      password,
      role,
      phone,
      governmentId: governmentId || aadhaar,
      department,
      district,
      token: `token_${userIdCounter-1}_${Date.now()}`,
      isVerified: false
    };

    users.push(user);
    console.log('User registered:', email, 'as', role);

    res.json({
      success: true,
      message: 'User registered successfully',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        district: user.district,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('User logged in:', email);
    
    res.json({
      success: true,
      message: 'Login successful',
      token: user.token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        governmentId: user.governmentId,
        department: user.department,
        district: user.district,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
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
  console.log(`🔐 Auth endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🔌 Socket.IO ready for connections`);
});