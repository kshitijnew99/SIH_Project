import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { io, Socket } from 'socket.io-client';
import { 
  MessageCircle, 
  X, 
  Send, 
  Minimize2, 
  Bot,
  User,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant for KisanConnect. I can help you with agriculture questions, price comparisons, tool availability, and general queries. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [genAI, setGenAI] = useState<GoogleGenerativeAI | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize Gemini AI
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    console.log('Environment check:');
    console.log('- API key exists:', !!apiKey);
    console.log('- API key length:', apiKey ? apiKey.length : 0);
    console.log('- API key starts with AIza:', apiKey ? apiKey.startsWith('AIza') : false);
    
    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE' && apiKey.length > 10) {
      try {
        console.log('Attempting to initialize Gemini AI...');
        const ai = new GoogleGenerativeAI(apiKey);
        setGenAI(ai);
        console.log('✅ Gemini AI initialized successfully');
        
        // Test the connection
        setTimeout(async () => {
          try {
            const model = ai.getGenerativeModel({ model: "gemini-pro" });
            console.log('✅ Model created successfully');
          } catch (testError) {
            console.error('❌ Model creation failed:', testError);
          }
        }, 1000);
        
      } catch (error) {
        console.error('❌ Failed to initialize Gemini AI:', error);
        setGenAI(null);
      }
    } else {
      console.log('❌ No valid Gemini API key found');
      console.log('Expected format: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
      setGenAI(null);
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    try {
      if (!genAI) {
        // Enhanced fallback responses when API key is not available
        const fallbackResponses = [
          "I'm in demo mode right now. For farming questions, I recommend: 1) Consult local agricultural experts, 2) Check government agricultural websites, 3) Contact nearby Krishi Vigyan Kendras for guidance.",
          "KisanConnect helps you lease land, share equipment, and connect with other farmers. Would you like to know more about our platform features?",
          "For crop advice: Consider soil type, climate, water availability, and market demand. Local agricultural officers can provide region-specific guidance.",
          "Equipment sharing on KisanConnect reduces costs and increases efficiency. Browse our tools section to see what's available in your area."
        ];
        
        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        setTimeout(() => {
          const fallbackResponse: Message = {
            id: (Date.now() + 1).toString(),
            content: randomResponse,
            role: 'assistant',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, fallbackResponse]);
          setIsLoading(false);
        }, 1500);
        return;
      }

      // Try alternative API call method to avoid CORS issues
      try {
        console.log('🚀 Attempting Gemini API call...');
        
        // Use direct REST API call instead of SDK (sometimes works better with CORS)
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
        
        const requestBody = {
          contents: [{
            parts: [{
              text: `You are KisanConnect AI, a helpful assistant for an agricultural platform in India. 

Platform features:
- Land leasing between farmers and landowners
- Agricultural equipment sharing
- Market price information
- Farming advice and best practices

User question: "${currentInput}"

Provide a helpful, concise response (2-3 sentences). Be practical and specific for Indian agriculture. If it's not agriculture-related, still be helpful but try to relate to farming when possible.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        };

        console.log('Making REST API call to:', url);
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', response.status, errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('✅ API Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
          const text = data.candidates[0].content.parts[0].text;
          
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: text.trim(),
            role: 'assistant',
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);
        } else {
          throw new Error('Invalid response format from API');
        }

      } catch (apiError) {
        console.error('❌ Direct API call failed, trying SDK method...', apiError);
        
        // Fallback to SDK method
        const model = genAI.getGenerativeModel({ 
          model: "gemini-pro",
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        });

        const contextPrompt = `You are KisanConnect AI, a helpful assistant for an agricultural platform in India. 

Platform features:
- Land leasing between farmers and landowners
- Agricultural equipment sharing
- Market price information
- Farming advice and best practices

User question: "${currentInput}"

Provide a helpful, concise response (2-3 sentences). Be practical and specific for Indian agriculture.`;

        const result = await model.generateContent(contextPrompt);
        const response = await result.response;
        const text = response.text();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: text.trim(),
          role: 'assistant',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
      }
      
    } catch (error) {
      console.error('❌ All API methods failed:', error);
      
      let errorMessage = "I'm having trouble connecting right now. ";
      
      if (error instanceof Error) {
        if (error.message.includes('API key') || error.message.includes('401')) {
          errorMessage += "API key issue. Please verify your Gemini API key is valid and has proper permissions.";
        } else if (error.message.includes('quota') || error.message.includes('429')) {
          errorMessage += "API quota exceeded. Please check your Gemini API usage limits.";
        } else if (error.message.includes('CORS') || error.message.includes('fetch')) {
          errorMessage += "Network/CORS issue. This is common in development. The API might be blocked by browser security policies.";
        } else if (error.message.includes('403')) {
          errorMessage += "API access forbidden. Please check if your API key has the necessary permissions.";
        } else {
          errorMessage += "Let me provide some helpful information instead!";
        }
      }
      
      // Provide intelligent fallback based on user input
      const fallbackResponse = getFallbackResponse(currentInput);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: fallbackResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Smart fallback responses based on user input
  const getFallbackResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('crop') || lowerInput.includes('farming') || lowerInput.includes('agriculture')) {
      return "For crop-related queries, I recommend consulting local agricultural extension officers or visiting nearby Krishi Vigyan Kendras. They can provide region-specific advice based on your soil, climate, and market conditions.";
    }
    
    if (lowerInput.includes('price') || lowerInput.includes('market')) {
      return "For current market prices, check government portals like eNAM (National Agriculture Market) or contact your local Agricultural Produce Market Committee (APMC). KisanConnect also provides market insights through our platform.";
    }
    
    if (lowerInput.includes('land') || lowerInput.includes('lease') || lowerInput.includes('rent')) {
      return "KisanConnect helps you find land for leasing! Browse our 'Find Land' section to see available plots in your area. You can filter by size, location, and rental terms to find the perfect match.";
    }
    
    if (lowerInput.includes('equipment') || lowerInput.includes('tools') || lowerInput.includes('tractor')) {
      return "Check out our 'Rent Tools' section for agricultural equipment sharing. You can find tractors, harvesters, and other farming tools available for rent in your area, reducing your farming costs significantly.";
    }
    
    return "While I'm having connectivity issues, I can still help you navigate KisanConnect! Try exploring our platform features: Land Leasing, Equipment Sharing, Market Prices, and farming community support.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hello! I'm your AI assistant for KisanConnect. How can I help you today?",
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };

  const testConnection = async () => {
    if (!genAI) {
      console.log('❌ No Gemini AI instance available');
      toast({
        title: "No API Key",
        description: "Gemini API key not configured",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🧪 Testing Gemini API connection...');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const requestBody = {
        contents: [{
          parts: [{
            text: "Hello, please respond with just 'API working correctly'"
          }]
        }]
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const text = data.candidates[0].content.parts[0].text;
        console.log('✅ API Test Response:', text);
        
        toast({
          title: "API Test Successful! 🎉",
          description: `Response: ${text}`,
        });
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('❌ API Test Failed:', error);
      
      let errorMsg = "Connection failed";
      if (error instanceof Error) {
        if (error.message.includes('403')) {
          errorMsg = "API key lacks permissions";
        } else if (error.message.includes('401')) {
          errorMsg = "Invalid API key";
        } else if (error.message.includes('429')) {
          errorMsg = "Quota exceeded";
        } else {
          errorMsg = error.message;
        }
      }
      
      toast({
        title: "API Test Failed ❌",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={toggleChat}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
            size="icon"
          >
            <MessageCircle className="h-8 w-8 text-white" />
          </Button>
        </div>
      )}

      {/* Expanded Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] animate-in slide-in-from-bottom-5 duration-300">
          <Card className="h-full shadow-2xl border-2 border-green-200 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="bg-green-600 text-white rounded-t-lg p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <CardTitle className="text-base">KisanConnect AI</CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  {genAI && (
                    <Button
                      onClick={testConnection}
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-green-700 h-7 w-7"
                      title="Test API Connection"
                    >
                      🧪
                    </Button>
                  )}
                  <Button
                    onClick={clearChat}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-green-700 h-7 w-7"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={toggleChat}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-green-700 h-7 w-7"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Chat Messages */}
            <CardContent className="p-0 flex flex-col flex-1 min-h-0">
              <ScrollArea className="flex-1 p-3">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`flex items-start space-x-2 max-w-[85%] ${
                          message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.role === 'user'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-3 w-3 text-white" />
                          ) : (
                            <Bot className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <div
                          className={`px-2 py-1 rounded-lg text-xs ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                          <p className="text-xs mt-1 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                          <Bot className="h-3 w-3 text-white" />
                        </div>
                        <div className="bg-gray-100 px-2 py-1 rounded-lg">
                          <div className="flex items-center space-x-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span className="text-xs text-gray-600">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-3 border-t border-gray-200 flex-shrink-0">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 px-3"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* API Status Indicator */}
                <div className="mt-1 text-center">
                  {genAI ? (
                    <p className="text-xs text-green-600">✅ AI Active</p>
                  ) : (
                    <p className="text-xs text-yellow-600">⚠️ Demo Mode</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;