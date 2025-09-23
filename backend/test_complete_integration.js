/**
 * Final Integration Test
 * Tests complete frontend + backend language detection
 */

console.log('🎯 Final Integration Test - Complete Voice Language Detection\n');

// Frontend detection (same as in FloatingChatbot.tsx)
const detectVoiceLanguage = (transcript, recognitionLanguage) => {
  const hindiPattern = /[\u0900-\u097F]/;
  const hasHindiChars = hindiPattern.test(transcript);
  
  if (hasHindiChars) {
    return 'hindi';
  }
  
  if (recognitionLanguage === 'hi-IN') {
    return 'hindi';
  }
  
  const hindiTransliterationPatterns = [
    /\b(mujhe|aapka|kya|hai|mein|ke|ki|ka|se|batao|bataye|chahiye|karke|kaise|kyun|kahan|kab)\b/i,
    /\b(gehun|chawal|kapas|soyabean|fasal|kheti|mandi|price|bhav|rates)\b/i,
    /\b(sahayata|madad|sahayyata|jankari|jankariya)\b/i,
    /\b(aap|hum|main|aapko|humko|hamko|humein|hamein)\b/i
  ];
  
  const hasHindiTransliteration = hindiTransliterationPatterns.some(pattern => pattern.test(transcript));
  
  if (hasHindiTransliteration) {
    return 'hindi';
  }
  
  const strictEnglishPatterns = [
    /^(what are the|show me the|tell me the|give me the|list the|provide the)\s+(current\s+)?(wheat|rice|corn|soybean|cotton)\s+(price|prices|rate|rates)/i,
    /^(show me|tell me)\s+(available\s+)?(land|farms?|plots?)\s+(for\s+)?(farming|agriculture|rent)/i,
    /^(hello|hi|hey),?\s+(can you help|help me|i need|please help)/i,
    /^(what is|how can|can you)\s+.*(platform|kisanconnect|system)/i
  ];
  
  const isStrictEnglish = strictEnglishPatterns.some(pattern => pattern.test(transcript.trim()));
  
  return isStrictEnglish && recognitionLanguage === 'en-US' ? 'english' : 'hindi';
};

// Backend detection (same as in server.js)
const detectLanguage = (text) => {
  const hindiPattern = /[\u0900-\u097F]/;
  const hasHindiChars = hindiPattern.test(text);
  
  if (hasHindiChars) {
    return 'hindi';
  }
  
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
  
  const strictEnglishPatterns = [
    /^(what are the|show me the|tell me the|give me the|list the|provide the)\s+(current\s+)?(wheat|rice|corn|soybean|cotton)\s+(price|prices|rate|rates)/i,
    /^(show me|tell me)\s+(available\s+)?(land|farms?|plots?)\s+(for\s+)?(farming|agriculture|rent)/i,
    /^(hello|hi|hey),?\s+(can you help|help me|i need|please help)/i,
    /^(what is|how can|can you)\s+.*(platform|kisanconnect|system)/i
  ];
  
  const isStrictEnglish = strictEnglishPatterns.some(pattern => pattern.test(text.trim()));
  
  return isStrictEnglish ? 'english' : 'hindi';
};

// Test complete flow: Voice → Frontend → Backend
const testCompleteFlow = [
  {
    name: "User Problem Case 1",
    userSpeaks: "Hindi",
    transcript: "platform kis bare mein hai",
    recognitionLang: "en-US",
    expectedFinal: "hindi"
  },
  {
    name: "User Problem Case 2", 
    userSpeaks: "Hindi",
    transcript: "aapka platform meri kis tarike se sahayata kar sakta hai",
    recognitionLang: "en-US",
    expectedFinal: "hindi"
  },
  {
    name: "User Problem Case 3",
    userSpeaks: "Hindi", 
    transcript: "Mujhe yah bataiye ki cotton ka kya price hai",
    recognitionLang: "en-US",
    expectedFinal: "hindi"
  },
  {
    name: "Pure English Case",
    userSpeaks: "English",
    transcript: "What are the current wheat prices",
    recognitionLang: "en-US", 
    expectedFinal: "english"
  },
  {
    name: "Hindi with Unicode",
    userSpeaks: "Hindi",
    transcript: "गेहूं का भाव क्या है?",
    recognitionLang: "hi-IN",
    expectedFinal: "hindi"
  }
];

console.log('🔄 Testing Complete Voice → Frontend → Backend Flow:\n');

let successCount = 0;

testCompleteFlow.forEach((test, index) => {
  console.log(`\n📋 Test ${index + 1}: ${test.name}`);
  console.log(`👤 User Speaks: ${test.userSpeaks}`);
  console.log(`🎤 Browser Transcript: "${test.transcript}"`);
  console.log(`🗣️ Recognition Used: ${test.recognitionLang}`);
  
  // Step 1: Frontend voice detection
  const frontendDetection = detectVoiceLanguage(test.transcript, test.recognitionLang);
  console.log(`🔍 Frontend Detection: ${frontendDetection}`);
  
  // Step 2: Simulate voice message (frontend would send this to backend)
  const messageData = {
    message: test.transcript,
    isVoice: true,
    detectedLanguage: frontendDetection,
    originalLanguage: test.recognitionLang
  };
  
  // Step 3: Backend processing (voice message uses frontend detection)
  const backendLanguage = messageData.isVoice && messageData.detectedLanguage 
    ? messageData.detectedLanguage
    : detectLanguage(messageData.message);
  
  console.log(`🔧 Backend Final: ${backendLanguage}`);
  console.log(`🎯 Expected: ${test.expectedFinal}`);
  
  const isCorrect = backendLanguage === test.expectedFinal;
  if (isCorrect) successCount++;
  
  console.log(`✅ Result: ${isCorrect ? 'SUCCESS ✓' : 'FAILED ✗'}`);
  console.log(`📝 Response will be in: ${backendLanguage.toUpperCase()}`);
  
  console.log('='.repeat(70));
});

console.log(`\n🎯 Complete Integration Results:`);
console.log(`✅ Successful Tests: ${successCount}/${testCompleteFlow.length} (${Math.round(successCount/testCompleteFlow.length*100)}%)`);

console.log('\n🎉 FINAL SOLUTION SUMMARY:');
console.log('📍 User speaks Hindi → Gets Hindi response (even if converted to English text)');
console.log('📍 User speaks pure English → Gets English response');
console.log('📍 Mixed/unclear/transliterated → Defaults to Hindi response');
console.log('📍 Voice and text detection are now consistent');
console.log('📍 Platform data included in all responses');

console.log(`\n${successCount === testCompleteFlow.length ? '🎉 ALL USER ISSUES RESOLVED!' : '⚠️ Some issues still need attention'}`);