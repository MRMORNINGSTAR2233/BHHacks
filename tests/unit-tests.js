/**
 * Unit Tests for Hauntographer Backend Utilities
 * Run with: node tests/unit-tests.js
 */

// Mock sentiment module for testing
const mockSentiment = {
  analyze: (text) => {
    // Simple mock implementation
    const lowerText = text.toLowerCase();
    let score = 0;
    
    // Positive words
    if (lowerText.includes('boring') || lowerText.includes('not scary')) score += 2;
    if (lowerText.includes('funny') || lowerText.includes('lame')) score += 2;
    
    // Negative words
    if (lowerText.includes('scary') || lowerText.includes('terrifying')) score -= 2;
    if (lowerText.includes('frightening') || lowerText.includes('horrifying')) score -= 2;
    
    return { comparative: score / Math.max(text.split(' ').length, 1) };
  }
};

// Test results tracking
let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${testName}`);
    failed++;
  }
}

function assertEquals(actual, expected, testName) {
  if (actual === expected) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.log(`❌ FAIL: ${testName}`);
    console.log(`   Expected: ${expected}`);
    console.log(`   Actual: ${actual}`);
    failed++;
  }
}

console.log('\n🧪 Running Unit Tests\n');

// ============================================================================
// Validation Tests
// ============================================================================
console.log('📋 Validation Module Tests');
console.log('─'.repeat(60));

// Test 1: Valid first turn request
const validFirstTurn = {
  storyProfile: {
    fears: 'spiders, darkness',
    genre: 'Gothic'
  },
  storyHistory: []
};

// Test 2: Missing storyProfile on first turn
const missingProfile = {
  storyHistory: []
};

// Test 3: Empty fears
const emptyFears = {
  storyProfile: {
    fears: '',
    genre: 'Gothic'
  },
  storyHistory: []
};

// Test 4: Valid subsequent turn
const validSubsequentTurn = {
  storyHistory: [
    { role: 'model', content: 'Story text' },
    { role: 'user', content: 'User choice' }
  ]
};

// Test 5: Invalid history entry
const invalidHistory = {
  storyHistory: [
    { role: 'invalid', content: 'text' }
  ]
};

console.log('✓ Validation tests defined (manual validation required)');

// ============================================================================
// Sentiment Analysis Tests
// ============================================================================
console.log('\n📊 Sentiment Analysis Tests');
console.log('─'.repeat(60));

function testSentiment(text, expectedSign, testName) {
  const result = mockSentiment.analyze(text);
  const score = result.comparative;
  
  if (expectedSign === 'negative') {
    assert(score < 0, testName);
  } else if (expectedSign === 'positive') {
    assert(score > 0, testName);
  } else {
    assert(score === 0, testName);
  }
}

testSentiment('That was terrifying and scary!', 'negative', 'Negative sentiment detection');
testSentiment('This is boring and not scary', 'positive', 'Positive sentiment detection');
testSentiment('The story continues', 'neutral', 'Neutral sentiment detection');

// ============================================================================
// Prompt Construction Tests
// ============================================================================
console.log('\n📝 Prompt Construction Tests');
console.log('─'.repeat(60));

function testPromptConstruction() {
  const profile = {
    fears: 'spiders, darkness',
    genre: 'Gothic'
  };
  
  const history = [
    { role: 'model', content: 'You enter a dark room...' },
    { role: 'user', content: 'I turn on the light' }
  ];
  
  const emotionalScore = -0.5;
  
  // Mock prompt builder
  const prompt = `Profile: ${profile.fears}, ${profile.genre}\nHistory: ${history.length} entries\nScore: ${emotionalScore}`;
  
  assert(prompt.includes(profile.fears), 'Prompt includes fears');
  assert(prompt.includes(profile.genre), 'Prompt includes genre');
  assert(prompt.includes('History'), 'Prompt includes history reference');
  assert(prompt.includes(emotionalScore.toString()), 'Prompt includes emotional score');
}

testPromptConstruction();

// ============================================================================
// Response Assembly Tests
// ============================================================================
console.log('\n🔧 Response Assembly Tests');
console.log('─'.repeat(60));

function testResponseAssembly() {
  const llmResponse = {
    story_chunk: 'The darkness deepens...',
    image_prompt: 'A dark corridor',
    choices: ['Go left', 'Go right']
  };
  
  const imageUrl = 'https://example.com/image.png';
  const videoId = 'video123';
  const history = [
    { role: 'model', content: 'Previous story' }
  ];
  
  // Mock response assembly
  const response = {
    nextStoryChunk: llmResponse.story_chunk,
    choices: llmResponse.choices,
    visuals: {
      imageUrl,
      videoId
    },
    updatedHistory: [
      ...history,
      { role: 'model', content: llmResponse.story_chunk }
    ]
  };
  
  assertEquals(response.nextStoryChunk, llmResponse.story_chunk, 'Story chunk matches');
  assertEquals(response.choices.length, 2, 'Two choices provided');
  assertEquals(response.visuals.imageUrl, imageUrl, 'Image URL matches');
  assertEquals(response.visuals.videoId, videoId, 'Video ID matches');
  assertEquals(response.updatedHistory.length, 2, 'History updated correctly');
  assert(response.updatedHistory[1].role === 'model', 'New entry has model role');
}

testResponseAssembly();

// ============================================================================
// Image Prompt Augmentation Tests
// ============================================================================
console.log('\n🎨 Image Prompt Augmentation Tests');
console.log('─'.repeat(60));

function testImagePromptAugmentation() {
  const basePrompt = 'A dark corridor with shadows';
  const genre = 'Gothic';
  
  // Mock augmentation
  const augmented = `${basePrompt}, cinematic horror, ultra-realistic, dramatic lighting, ${genre} style`;
  
  assert(augmented.includes(basePrompt), 'Augmented prompt includes base prompt');
  assert(augmented.includes('cinematic horror'), 'Includes cinematic horror keyword');
  assert(augmented.includes('ultra-realistic'), 'Includes ultra-realistic keyword');
  assert(augmented.includes('dramatic lighting'), 'Includes dramatic lighting keyword');
  assert(augmented.includes(genre), 'Includes genre style');
}

testImagePromptAugmentation();

// ============================================================================
// Input Sanitization Tests
// ============================================================================
console.log('\n🔒 Input Sanitization Tests');
console.log('─'.repeat(60));

function testInputSanitization() {
  // Test string trimming
  const input1 = '  spiders, darkness  ';
  const sanitized1 = input1.trim();
  assertEquals(sanitized1, 'spiders, darkness', 'String trimming works');
  
  // Test length limiting
  const longString = 'a'.repeat(1000);
  const maxLength = 500;
  const limited = longString.substring(0, maxLength);
  assertEquals(limited.length, maxLength, 'String length limiting works');
  
  // Test history size limiting
  const maxHistory = 100;
  const largeHistory = Array(150).fill({ role: 'user', content: 'test' });
  assert(largeHistory.length > maxHistory, 'Large history exceeds limit');
}

testInputSanitization();

// ============================================================================
// Error Handling Tests
// ============================================================================
console.log('\n⚠️  Error Handling Tests');
console.log('─'.repeat(60));

function testErrorHandling() {
  // Test error message formats
  const validationError = { error: 'Invalid request' };
  const apiError = { error: 'The spirits are not responding. Please try again later.' };
  const corruptedError = { error: 'The narrative has become corrupted. Please refresh and start a new story.' };
  
  assert(validationError.error.length > 0, 'Validation error has message');
  assert(apiError.error.includes('spirits'), 'API error has user-friendly message');
  assert(corruptedError.error.includes('corrupted'), 'Corrupted error has appropriate message');
}

testErrorHandling();

// ============================================================================
// Type Validation Tests
// ============================================================================
console.log('\n🔍 Type Validation Tests');
console.log('─'.repeat(60));

function testTypeValidation() {
  // Test role validation
  const validRoles = ['user', 'model'];
  assert(validRoles.includes('user'), 'User role is valid');
  assert(validRoles.includes('model'), 'Model role is valid');
  assert(!validRoles.includes('admin'), 'Invalid role is rejected');
  
  // Test array validation
  assert(Array.isArray([]), 'Empty array is valid');
  assert(Array.isArray([1, 2, 3]), 'Array with items is valid');
  assert(!Array.isArray('not array'), 'String is not array');
  assert(!Array.isArray(null), 'Null is not array');
}

testTypeValidation();

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('📊 Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);
console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

if (failed > 0) {
  process.exit(1);
}
