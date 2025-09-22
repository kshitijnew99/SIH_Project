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
  Loader2,
  Settings,
  Wifi,
  WifiOff,
  Paperclip,
  Mic,
  MicOff,
  Upload,
  FileText
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  source?: 'ai' | 'fallback';
  fileInfo?: {
    name: string;
    size: number;
    type: string;
  };
  isVoice?: boolean;
}

const FloatingChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "🌾 Hello! I'm your KisanConnect AI assistant. I can help you with:\n\n📝 Text queries (Hindi/English)\n🎤 Voice messages (बोलकर पूछें)\n📸 Image analysis (crop diseases, soil)\n📄 Document analysis (soil reports)\n\nHow can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Initialize Socket.IO connection
  useEffect(() => {
    const SERVER_URL = 'http://localhost:3001';
    console.log('🔌 Connecting to Socket.IO server:', SERVER_URL);
    
    const newSocket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
      timeout: 5000,
      forceNew: true
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('✅ Connected to server:', newSocket.id);
      setIsConnected(true);
      // Removed toast notification to keep UI clean
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from server:', reason);
      setIsConnected(false);
      if (reason === 'io server disconnect') {
        // Server initiated disconnect, try to reconnect
        newSocket.connect();
      }
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      // Removed toast notification to keep UI clean
    });

    newSocket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔄 Attempting to reconnect...', attemptNumber);
    });

    newSocket.on('reconnect_failed', () => {
      console.log('❌ Failed to reconnect');
      setIsConnected(false);
      // Removed toast notification to prevent error popup
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
      // Removed toast notification to prevent error popup
    });

    // Message event handlers
    newSocket.on('bot-message', (data) => {
      console.log('🤖 Received bot message:', data);
      const botMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(data.timestamp),
        source: data.source
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    });

    newSocket.on('connection-test-result', (data) => {
      console.log('🧪 Connection test result:', data);
      if (data.success) {
        toast({
          title: "API Test Successful! ✅",
          description: data.message,
        });
      } else {
        toast({
          title: "API Test Failed ❌", 
          description: data.message,
          variant: "destructive"
        });
      }
    });

    newSocket.on('user-typing', (data) => {
      console.log('👤 User typing:', data);
      // Handle typing indicator from other users if needed
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket');
      newSocket.disconnect();
    };
  }, [toast]);

  // Initialize voice recognition
  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setIsVoiceSupported(!!SpeechRecognition);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const maximizeChat = () => {
    setIsMinimized(false);
  };

  const sendMessage = async () => {
    // If there's a selected file, send file message instead
    if (selectedFile) {
      await sendFileMessage();
      return;
    }

    if (!inputMessage.trim() || !socket || !isConnected) {
      if (!isConnected) {
        toast({
          title: "Not Connected",
          description: "Please wait for connection to be established",
          variant: "destructive"
        });
      }
      return;
    }

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

    // Send message to server via Socket.IO
    socket.emit('chat-message', {
      message: currentInput,
      timestamp: new Date().toISOString()
    });
  };

  const testConnection = () => {
    if (!socket || !isConnected) {
      toast({
        title: "Not Connected",
        description: "Socket connection not established",
        variant: "destructive"
      });
      return;
    }

    console.log('🧪 Testing API connection via Socket.IO');
    socket.emit('test-connection');
    
    toast({
      title: "Testing Connection...",
      description: "Please wait for the result",
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Typing indicator (optional)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
    
    // Emit typing indicator (throttled)
    if (socket && isConnected) {
      socket.emit('typing', { isTyping: e.target.value.length > 0 });
    }
  };

  // Voice recording functions
  const startVoiceRecording = async () => {
    if (!isVoiceSupported) {
      toast({
        title: "Voice Not Supported",
        description: "Speech recognition is not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'hi-IN,en-IN,en-US'; // Support Hindi, Indian English, and US English
      
      recognition.onstart = () => {
        setIsRecording(true);
        toast({
          title: "🎤 Recording Started",
          description: "Speak now... (Hindi/English supported)",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
        
        toast({
          title: "🎤 Speech Recognized",
          description: `"${transcript}"`,
        });
        
        // Optionally auto-send voice messages
        setTimeout(() => {
          if (transcript.trim()) {
            const voiceMessage: Message = {
              id: Date.now().toString(),
              content: transcript.trim(),
              role: 'user',
              timestamp: new Date(),
              isVoice: true
            };

            setMessages(prev => [...prev, voiceMessage]);
            setInputMessage('');
            setIsLoading(true);

            // Send message to server via Socket.IO
            if (socket && isConnected) {
              socket.emit('chat-message', {
                message: transcript.trim(),
                isVoice: true,
                timestamp: new Date().toISOString()
              });
            }
          }
        }, 500);
      };

      recognition.onerror = (event: any) => {
        setIsRecording(false);
        toast({
          title: "Speech Recognition Error",
          description: `Error: ${event.error}`,
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Voice Recognition Failed",
        description: "Could not start voice recognition",
        variant: "destructive"
      });
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
  };

  // File handling functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg', 'image/png', 'image/jpg',
        'application/pdf',
        'text/plain', 'text/csv',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File Type Not Supported",
          description: "Please upload images, PDF, text, or document files",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setInputMessage(`📎 ${file.name} selected`);
      
      toast({
        title: "File Selected",
        description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });
    }
  };

  const sendFileMessage = async () => {
    if (!selectedFile || !socket || !isConnected) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileData = e.target?.result as string;
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content: `📎 Shared file: ${selectedFile.name}`,
        role: 'user',
        timestamp: new Date(),
        fileInfo: {
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type
        }
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      // Send file data to server via Socket.IO
      socket.emit('file-message', {
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        fileData: fileData,
        message: inputMessage || `Please analyze this ${selectedFile.type.includes('image') ? 'image' : 'document'} and provide insights for farming.`,
        timestamp: new Date().toISOString()
      });

      setSelectedFile(null);
      setInputMessage('');
    };

    reader.readAsDataURL(selectedFile);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const formatMessageContent = (content: string) => {
    // Split by newlines and render each part
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          size="lg"
          className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300"
          style={{ animation: 'none' }}
        >
          <MessageCircle className="h-8 w-8 text-white" />
        </Button>
        {!isConnected && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <WifiOff className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-[336px] bg-white shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-[460px]'
      }`}>
        <CardHeader className="p-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-sm font-medium">KisanConnect AI</CardTitle>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-300' : 'bg-red-300'}`} />
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={testConnection}
                className="text-white hover:bg-green-800 p-1 h-8 w-8"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={isMinimized ? maximizeChat : minimizeChat}
                className="text-white hover:bg-green-800 p-1 h-8 w-8"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-green-800 p-1 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-96">
            {/* Connection Status */}
            {!isConnected && (
              <div className="bg-red-50 border-b border-red-200 p-2 text-center">
                <p className="text-red-600 text-xs flex items-center justify-center">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected - Start backend server on port 3001
                </p>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                        message.role === 'user'
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.role === 'assistant' && (
                          <Bot className="h-4 w-4 mt-0.5 text-green-600" />
                        )}
                        {message.role === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-white" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed">
                            {formatMessageContent(message.content)}
                          </p>
                          
                          {/* File attachment indicator */}
                          {message.fileInfo && (
                            <div className={`mt-2 p-2 rounded border ${
                              message.role === 'user' 
                                ? 'bg-green-500 border-green-400' 
                                : 'bg-gray-50 border-gray-200'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <FileText className={`h-3 w-3 ${
                                  message.role === 'user' ? 'text-green-100' : 'text-gray-600'
                                }`} />
                                <span className={`text-xs ${
                                  message.role === 'user' ? 'text-green-100' : 'text-gray-600'
                                }`}>
                                  {message.fileInfo.name} ({(message.fileInfo.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                            </div>
                          )}
                          
                          {/* Voice message indicator */}
                          {message.isVoice && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Mic className={`h-3 w-3 ${
                                message.role === 'user' ? 'text-green-200' : 'text-gray-500'
                              }`} />
                              <span className={`text-xs ${
                                message.role === 'user' ? 'text-green-200' : 'text-gray-500'
                              }`}>
                                Voice message
                              </span>
                            </div>
                          )}
                          
                          {message.source === 'fallback' && (
                            <p className="text-xs opacity-75 mt-1 italic">
                              *Offline response
                            </p>
                          )}
                          <p className={`text-xs mt-1 ${
                            message.role === 'user' ? 'text-green-200' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-green-600" />
                        <div className="flex space-x-1">
                          <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t bg-gray-50 p-3">
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,application/pdf,.txt,.csv,.doc,.docx"
                className="hidden"
              />
              
              {/* File selection indicator */}
              {selectedFile && (
                <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-700">
                      {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedFile(null);
                      setInputMessage('');
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              
              <div className="flex space-x-2">
                {/* File upload button */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={triggerFileUpload}
                  disabled={!isConnected || isLoading}
                  className="px-2"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                {/* Voice input button */}
                {isVoiceSupported && (
                  <Button
                    size="sm"
                    variant={isRecording ? "destructive" : "outline"}
                    onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                    disabled={!isConnected || isLoading}
                    className="px-2"
                  >
                    {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                
                <Input
                  value={inputMessage}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={isConnected ? (selectedFile ? "Add message (optional)..." : "Ask me about farming...") : "Connecting..."}
                  disabled={!isConnected || isLoading}
                  className="flex-1 border-gray-200 focus:ring-green-500 focus:border-green-500"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!isConnected || isLoading || (!inputMessage.trim() && !selectedFile)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Status indicators */}
              <div className="flex justify-between items-center mt-1">
                <div>
                  {isConnected && (
                    <p className="text-xs text-green-600 flex items-center">
                      <Wifi className="h-3 w-3 mr-1" />
                      Connected to AI assistant
                    </p>
                  )}
                  {isRecording && (
                    <p className="text-xs text-red-600 flex items-center animate-pulse">
                      <Mic className="h-3 w-3 mr-1" />
                      Recording... (Hindi/English supported)
                    </p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500">
                  {isVoiceSupported && "🎤"} 📎 PDF/Images supported
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FloatingChatbot;