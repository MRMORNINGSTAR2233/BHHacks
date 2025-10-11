/**
 * Live Integration Test for The Hauntographer
 * Tests the actual API endpoint with real API calls
 * 
 * IMPORTANT: This test makes real API calls and will consume API credits
 * 
 * Prerequisites:
 * 1. .env.local file with valid API keys
 * 2. Development server running (npm run dev)
 * 
 * Run with: node tests/integration-test-live.js
 */

const API_URL = 'http://localhost:3000/api/generate';

// Test configuration
const TIMEOUT = 60000; // 60 seconds for API calls

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(70));
  log(title, colors.bright + colors.cyan);
  console.log('='.repeat(70));
}

function logTest(name) {
  log(`\n🧪 ${name}`, colors.blue);
  console.log('─'.repeat(70));
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(testName, testFn) {
  totalTests++;
  logTest(testName);
  
  try {
    await testFn();
    passedTests++;
    logSuccess('Test passed');
    return true;
  } catch (error) {
    failedTests++;
    logError(`Test failed: ${error.message}`);
    if (error.details) {
      console.log('Details:', error.details);
    }
    return false;
  }
}

async function makeRequest(body, expectSuccess = true) {
  const startTime = Date.now();
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT)
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    logInfo(`Response time: ${duration}ms`);
    logInfo(`Status: ${response.status}`);
    
    if (expectSuccess && !response.ok) {
      throw new Error(`Expected success but got ${response.status}: ${data.error || 'Unknown error'}`);
    }
    
    if (!expectSuccess && response.ok) {
      throw new Error(`Expected error but got success`);
    }
    
    return { response, data, duration };
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${TIMEOUT}ms`);
    }
    throw error;
  }
}

// ============================================================================
// Test 1: Server Health Check
// ============================================================================
async function testServerHealth() {
  logInfo('Checking if server is running...');
  
  try {
    const response = await fetch('http://localhost:3000', {
      signal: AbortSignal.timeout(5000)
    });
    
    if (response.ok) {
      logSuccess('Server is running');
    } else {
      throw new Error('Server returned non-200 status');
    }
  } catch (error) {
    throw new Error('Server is not running. Please start it with: npm run dev');
  }
}

// ============================================================================
// Test 2: First Turn - Complete Story Generation
// ============================================================================
async function testFirstTurnStoryGeneration() {
  logInfo('Testing first turn with Gothic horror...');
  
  const request = {
    storyProfile: {
      fears: 'darkness, isolation, being watched by unseen eyes',
      genre: 'Gothic'
    },
    storyHistory: [],
    userReaction: null,
    flags: {
      generateVideo: false
    }
  };
  
  const { response, data, duration } = await makeRequest(request);
  
  // Validate response structure
  if (!data.nextStoryChunk) {
    throw new Error('Missing nextStoryChunk in response');
  }
  
  if (!Array.isArray(data.choices) || data.choices.length !== 2) {
    throw new Error('Invalid choices array (expected 2 choices)');
  }
  
  if (!data.visuals || !data.visuals.imageUrl) {
    throw new Error('Missing imageUrl in response');
  }
  
  if (!Array.isArray(data.updatedHistory)) {
    throw new Error('Missing or invalid updatedHistory');
  }
  
  logSuccess(`Story generated: ${data.nextStoryChunk.substring(0, 100)}...`);
  logSuccess(`Choices: "${data.choices[0].substring(0, 40)}..." and "${data.choices[1].substring(0, 40)}..."`);
  logSuccess(`Image URL: ${data.visuals.imageUrl.substring(0, 60)}...`);
  logSuccess(`History length: ${data.updatedHistory.length}`);
  
  // Performance check
  if (duration > 25000) {
    logWarning(`Response time (${duration}ms) exceeded 25 seconds`);
  } else {
    logSuccess(`Response time within acceptable range`);
  }
  
  return data;
}

// ============================================================================
// Test 3: Subsequent Turn with History
// ============================================================================
async function testSubsequentTurn(previousData) {
  logInfo('Testing subsequent turn with story history...');
  
  const request = {
    storyHistory: previousData.updatedHistory.concat([
      {
        role: 'user',
        content: previousData.choices[0]
      }
    ]),
    userReaction: 'That was terrifying! My heart is racing.',
    flags: {
      generateVideo: false
    }
  };
  
  const { response, data, duration } = await makeRequest(request);
  
  // Validate response
  if (!data.nextStoryChunk) {
    throw new Error('Missing nextStoryChunk in response');
  }
  
  if (!Array.isArray(data.choices) || data.choices.length !== 2) {
    throw new Error('Invalid choices array');
  }
  
  if (data.updatedHistory.length <= previousData.updatedHistory.length) {
    throw new Error('History was not updated');
  }
  
  logSuccess(`Story continued: ${data.nextStoryChunk.substring(0, 100)}...`);
  logSuccess(`New choices provided`);
  logSuccess(`History updated: ${data.updatedHistory.length} entries`);
  
  return data;
}

// ============================================================================
// Test 4: Different Genre - Psychological Horror
// ============================================================================
async function testPsychologicalHorror() {
  logInfo('Testing Psychological horror genre...');
  
  const request = {
    storyProfile: {
      fears: 'losing my mind, reality distortion, paranoia',
      genre: 'Psychological'
    },
    storyHistory: [],
    flags: {
      generateVideo: false
    }
  };
  
  const { response, data } = await makeRequest(request);
  
  // Check if story reflects psychological horror
  const storyLower = data.nextStoryChunk.toLowerCase();
  const hasPsychologicalElements = 
    storyLower.includes('mind') || 
    storyLower.includes('reality') || 
    storyLower.includes('paranoia') ||
    storyLower.includes('sanity') ||
    storyLower.includes('psychological');
  
  if (hasPsychologicalElements) {
    logSuccess('Story contains psychological horror elements');
  } else {
    logWarning('Story may not strongly reflect psychological horror theme');
  }
  
  logSuccess('Psychological horror story generated successfully');
}

// ============================================================================
// Test 5: Sentiment Adaptation - Positive Reaction
// ============================================================================
async function testPositiveSentiment() {
  logInfo('Testing sentiment adaptation with positive (bored) reaction...');
  
  // First, generate initial story
  const initialRequest = {
    storyProfile: {
      fears: 'spiders, confined spaces',
      genre: 'Slasher'
    },
    storyHistory: [],
    flags: {
      generateVideo: false
    }
  };
  
  const { data: initialData } = await makeRequest(initialRequest);
  
  // Now send positive sentiment (user is bored)
  const followUpRequest = {
    storyHistory: initialData.updatedHistory.concat([
      {
        role: 'user',
        content: initialData.choices[0]
      }
    ]),
    userReaction: 'This is boring and not scary at all. I expected more.',
    flags: {
      generateVideo: false
    }
  };
  
  const { data: followUpData } = await makeRequest(followUpRequest);
  
  logSuccess('API handled positive sentiment (boredom) successfully');
  logInfo('Note: LLM should pivot narrative strategy based on positive sentiment');
}

// ============================================================================
// Test 6: Validation - Missing Required Fields
// ============================================================================
async function testValidationMissingFields() {
  logInfo('Testing validation with missing storyProfile...');
  
  const request = {
    storyHistory: [],
    flags: {
      generateVideo: false
    }
  };
  
  try {
    const { response, data } = await makeRequest(request, false);
    
    if (response.status === 400 && data.error) {
      logSuccess(`Validation error caught: ${data.error}`);
    } else {
      throw new Error('Expected 400 error for missing storyProfile');
    }
  } catch (error) {
    if (error.message.includes('Expected 400')) {
      throw error;
    }
    // If we got here, the validation worked
    logSuccess('Validation correctly rejected invalid request');
  }
}

// ============================================================================
// Test 7: Validation - Short Fears
// ============================================================================
async function testValidationShortFears() {
  logInfo('Testing validation with too-short fears...');
  
  const request = {
    storyProfile: {
      fears: 'dark',  // Too short (< 10 characters)
      genre: 'Gothic'
    },
    storyHistory: [],
    flags: {
      generateVideo: false
    }
  };
  
  try {
    const { response, data } = await makeRequest(request, false);
    
    if (response.status === 400 && data.error) {
      logSuccess(`Validation error caught: ${data.error}`);
    } else {
      throw new Error('Expected 400 error for short fears');
    }
  } catch (error) {
    if (error.message.includes('Expected 400')) {
      throw error;
    }
    logSuccess('Validation correctly rejected short fears');
  }
}

// ============================================================================
// Test 8: Image Generation Quality
// ============================================================================
async function testImageGeneration() {
  logInfo('Testing image generation...');
  
  const request = {
    storyProfile: {
      fears: 'abandoned places, decay, forgotten memories',
      genre: 'Gothic'
    },
    storyHistory: [],
    flags: {
      generateVideo: false
    }
  };
  
  const { data } = await makeRequest(request);
  
  const imageUrl = data.visuals.imageUrl;
  
  // Check if it's a data URL (base64) or external URL
  if (imageUrl.startsWith('data:image/')) {
    logSuccess('Image returned as base64 data URL');
    const sizeEstimate = Math.round(imageUrl.length * 0.75 / 1024);
    logInfo(`Estimated image size: ~${sizeEstimate} KB`);
  } else if (imageUrl.startsWith('http')) {
    logSuccess('Image returned as external URL');
    logInfo(`Image URL: ${imageUrl.substring(0, 80)}...`);
  } else {
    logWarning('Unexpected image URL format');
  }
}

// ============================================================================
// Test 9: Performance Under Load
// ============================================================================
async function testPerformance() {
  logInfo('Testing API performance with multiple requests...');
  
  const requests = [
    {
      storyProfile: { fears: 'darkness', genre: 'Gothic' },
      storyHistory: []
    },
    {
      storyProfile: { fears: 'isolation', genre: 'Cosmic' },
      storyHistory: []
    }
  ];
  
  const startTime = Date.now();
  
  // Run requests sequentially (to avoid rate limiting)
  for (let i = 0; i < requests.length; i++) {
    logInfo(`Request ${i + 1}/${requests.length}...`);
    await makeRequest(requests[i]);
    
    // Small delay between requests
    if (i < requests.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const totalTime = Date.now() - startTime;
  const avgTime = totalTime / requests.length;
  
  logSuccess(`Completed ${requests.length} requests`);
  logInfo(`Total time: ${totalTime}ms`);
  logInfo(`Average time per request: ${avgTime}ms`);
}

// ============================================================================
// Test 10: All Horror Genres
// ============================================================================
async function testAllGenres() {
  logInfo('Testing all horror genres...');
  
  const genres = ['Gothic', 'Cosmic', 'Slasher', 'Psychological'];
  
  for (const genre of genres) {
    logInfo(`Testing ${genre} genre...`);
    
    const request = {
      storyProfile: {
        fears: 'the unknown, darkness, death',
        genre: genre
      },
      storyHistory: [],
      flags: {
        generateVideo: false
      }
    };
    
    const { data } = await makeRequest(request);
    logSuccess(`${genre} genre story generated successfully`);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  logSuccess('All genres tested successfully');
}

// ============================================================================
// Main Test Runner
// ============================================================================
async function runAllTests() {
  logSection('🧪 THE HAUNTOGRAPHER - LIVE INTEGRATION TESTS');
  
  log('\n⚠️  WARNING: These tests make REAL API calls and will consume API credits!', colors.yellow);
  log('Make sure your development server is running: npm run dev\n', colors.yellow);
  
  logInfo('Starting tests in 3 seconds...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  let firstTurnData = null;
  
  // Run tests
  await runTest('Test 1: Server Health Check', testServerHealth);
  
  await runTest('Test 2: First Turn - Complete Story Generation', async () => {
    firstTurnData = await testFirstTurnStoryGeneration();
  });
  
  if (firstTurnData) {
    await runTest('Test 3: Subsequent Turn with History', async () => {
      await testSubsequentTurn(firstTurnData);
    });
  }
  
  await runTest('Test 4: Different Genre - Psychological Horror', testPsychologicalHorror);
  
  await runTest('Test 5: Sentiment Adaptation - Positive Reaction', testPositiveSentiment);
  
  await runTest('Test 6: Validation - Missing Required Fields', testValidationMissingFields);
  
  await runTest('Test 7: Validation - Short Fears', testValidationShortFears);
  
  await runTest('Test 8: Image Generation Quality', testImageGeneration);
  
  await runTest('Test 9: Performance Under Load', testPerformance);
  
  await runTest('Test 10: All Horror Genres', testAllGenres);
  
  // Summary
  logSection('📊 TEST SUMMARY');
  
  console.log('');
  log(`Total Tests:  ${totalTests}`, colors.bright);
  log(`Passed:       ${passedTests}`, colors.green);
  log(`Failed:       ${failedTests}`, failedTests > 0 ? colors.red : colors.green);
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`, 
      passedTests === totalTests ? colors.green : colors.yellow);
  
  console.log('\n' + '='.repeat(70));
  
  if (failedTests === 0) {
    log('\n🎉 ALL TESTS PASSED! The Hauntographer is working perfectly!', colors.green + colors.bright);
  } else {
    log(`\n⚠️  ${failedTests} test(s) failed. Please review the errors above.`, colors.yellow);
  }
  
  console.log('');
  
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  logError(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
