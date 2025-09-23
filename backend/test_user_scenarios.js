/**
 * User-Specific Voice Detection Test
 * Testing the exact scenarios mentioned by the user
 */

console.log('🎤 Testing User-Specific Voice Scenarios\n');

// Updated enhanced language detection function
const detectVoiceLanguage = (transcript, recognitionLanguage) => {
  // Check for Hindi Unicode characters (direct Hindi speech)
  const hindiPattern = /[\u0900-\u097F]/;
  const hasHindiChars = hindiPattern.test(transcript);
  
  if (hasHindiChars) {
    return 'hindi'; // Direct Hindi detected
  }
  
  // If recognition used Hindi language but got English text, likely Hindi speech converted to English
  if (recognitionLanguage === 'hi-IN') {
    return 'hindi'; // Hindi speech recognition was used, so user spoke Hindi
  }
  
  // Check for common Hindi words written in English (transliteration)
  const hindiTransliterationPatterns = [
    /\b(mujhe|aapka|kya|hai|mein|ke|ki|ka|se|batao|bataye|chahiye|karke|kaise|kyun|kahan|kab)\b/i,
    /\b(gehun|chawal|kapas|soyabean|fasal|kheti|mandi|price|bhav|rates)\b/i,
    /\b(sahayata|madad|sahayyata|jankari|jankariya)\b/i,
    /\b(aap|hum|main|aapko|humko|hamko|humein|hamein)\b/i
  ];
  
  // Check for Hindi transliteration
  const hasHindiTransliteration = hindiTransliterationPatterns.some(pattern => pattern.test(transcript));
  
  if (hasHindiTransliteration) {
    return 'hindi'; // Transliterated Hindi detected
  }
  
  // Very strict English-only patterns (only these will get English response)
  const strictEnglishPatterns = [
    /^(what are the|show me the|tell me the|give me the|list the|provide the)\s+(current\s+)?(wheat|rice|corn|soybean|cotton)\s+(price|prices|rate|rates)/i,
    /^(show me|tell me)\s+(available\s+)?(land|farms?|plots?)\s+(for\s+)?(farming|agriculture|rent)/i,
    /^(hello|hi|hey),?\s+(can you help|help me|i need|please help)/i,
    /^(what is|how can|can you)\s+.*(platform|kisanconnect|system)/i
  ];
  
  // Check if it matches very strict English patterns
  const isStrictEnglish = strictEnglishPatterns.some(pattern => pattern.test(transcript.trim()));
  
  // Only respond in English for very specific, clearly English patterns
  // Default to Hindi for everything else (mixed, unclear, transliterated)
  return isStrictEnglish && recognitionLanguage === 'en-US' ? 'english' : 'hindi';
};

// User's specific problem scenarios
const userScenarios = [
  {
    name: "User speaks Hindi - gets converted to English text",
    transcript: "platform kis bare mein hai",
    recognitionLang: "en-US", // Browser detected as English
    userActualLanguage: "Hindi",
    expected: "hindi",
    problem: "User spoke Hindi but got English response"
  },
  {
    name: "User speaks Hindi - transliterated",
    transcript: "aapka platform meri kis tarike se sahayata kar sakta hai",
    recognitionLang: "en-US",
    userActualLanguage: "Hindi", 
    expected: "hindi",
    problem: "Hindi words written in English should get Hindi response"
  },
  {
    name: "User asks in Hindi about prices",
    transcript: "Mujhe yah bataiye ki Nagpur mein cotton ka kya price hai",
    recognitionLang: "en-US",
    userActualLanguage: "Hindi",
    expected: "hindi", 
    problem: "Price query in Hindi should get Hindi response"
  },
  {
    name: "User complains about language mismatch",
    transcript: "main aapse Hindi mein poochha aap iska Uttar angreji mein kyon de rahe hain",
    recognitionLang: "en-US",
    userActualLanguage: "Hindi",
    expected: "hindi",
    problem: "User asking why English response to Hindi question"
  },
  {
    name: "Pure English Query - Should get English",
    transcript: "What are the current wheat prices in Madhya Pradesh",
    recognitionLang: "en-US",
    userActualLanguage: "English",
    expected: "english",
    problem: "Should remain English for pure English"
  },
  {
    name: "Pure English Agricultural",
    transcript: "Show me available land for farming",
    recognitionLang: "en-US", 
    userActualLanguage: "English",
    expected: "english",
    problem: "Clear English should get English response"
  }
];

console.log('🧪 Testing User-Specific Voice Recognition Problems:\n');

let fixedCount = 0;
let totalIssues = userScenarios.length;

userScenarios.forEach((scenario, index) => {
  console.log(`\n📋 Scenario ${index + 1}: ${scenario.name}`);
  console.log(`🎤 Transcript: "${scenario.transcript}"`);
  console.log(`🗣️ Browser Recognition: ${scenario.recognitionLang}`);
  console.log(`👤 User Actually Spoke: ${scenario.userActualLanguage}`);
  console.log(`🎯 Should Respond In: ${scenario.expected}`);
  
  const detected = detectVoiceLanguage(scenario.transcript, scenario.recognitionLang);
  const isFixed = detected === scenario.expected;
  
  if (isFixed) fixedCount++;
  
  console.log(`🔍 Our Detection: ${detected}`);
  console.log(`✅ Status: ${isFixed ? 'FIXED ✓' : 'STILL BROKEN ✗'}`);
  console.log(`❗ Original Problem: ${scenario.problem}`);
  
  if (!isFixed) {
    console.log(`🔧 NEEDS ATTENTION: This scenario still has issues!`);
  }
  
  console.log('='.repeat(90));
});

console.log(`\n🎯 User Issue Resolution Summary:`);
console.log(`✅ Fixed Scenarios: ${fixedCount}/${totalIssues} (${Math.round(fixedCount/totalIssues*100)}%)`);

if (fixedCount === totalIssues) {
  console.log('\n🎉 ALL USER ISSUES RESOLVED!');
  console.log('✓ Hindi speech now correctly detected as Hindi');
  console.log('✓ Transliterated Hindi gets Hindi response');
  console.log('✓ Only pure English gets English response');
  console.log('✓ Mixed/unclear defaults to Hindi');
} else {
  console.log('\n⚠️ Some issues still need fixing:');
  userScenarios.forEach((scenario, index) => {
    const detected = detectVoiceLanguage(scenario.transcript, scenario.recognitionLang);
    if (detected !== scenario.expected) {
      console.log(`  ${index + 1}. ${scenario.name} - Expected: ${scenario.expected}, Got: ${detected}`);
    }
  });
}

console.log('\n🎯 New Logic Summary:');
console.log('📍 Hindi Unicode characters → Hindi response');
console.log('📍 Hindi recognition (hi-IN) used → Hindi response');  
console.log('📍 Hindi transliteration detected → Hindi response');
console.log('📍 Very specific English patterns → English response');
console.log('📍 Everything else → Hindi response (default)');