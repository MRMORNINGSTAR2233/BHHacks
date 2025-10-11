/**
 * Manual API Testing Script
 * Run with: node tests/api-test.js
 * 
 * Make sure to:
 * 1. Set up .env.local with API keys
 * 2. Start the dev server: npm run dev
 * 3. Run this script in another terminal
 */

const API_URL = 'http://localhost:3000/api/generate';

// Test data
const testCases = [
  {
    name: 'Test 1: First Turn - Gothic Horror',
    request: {
      storyProfile: {
        fears: 'darkness, isolation, being watched',
        genre: 'Gothic'
      },
      storyHistory: [],
      userReaction: null,
      flags: {
        generateVideo: false
      }
    }
  },
  {
    name: 'Test 2: Invalid Request - Missing storyProfile',
    request: {
      storyHistory: [],
      userReaction: null
    },
    expectError: true,
    expectedStatus: 400
  },
  {
    name: 'Test 3: Invalid Request - Empty fears',
    request: {
      storyProfile: {
        fears: '',
        genre: 'Gothic'
      },
      storyHistory: []
    },
    expectError: true,
    expectedStatus: 400
  },
  {
    name: 'Test 4: Invalid Request - Invalid storyHistory',
    request: {
      storyProfile: {
        fears: 'spiders',
        genre: 'Gothic'
      },
      storyHistory: 'not an array'
    },
    expectError: true,
    expectedStatus: 400
  },
  {
    name: 'Test 5: Subsequent Turn with History',
    request: {
      storyHistory: [
        {
          role: 'model',
          content: 'You find yourself in a dark corridor...'
        },
        {
          role: 'user',
          content: 'I investigate the noise'
        }
      ],
      userReaction: 'That was scary!',
      flags: {
        generateVideo: false
      }
    }
  },
  {
    name: 'Test 6: Positive Sentiment Reaction',
    request: {
      storyHistory: [
        {
          role: 'model',
          content: 'A shadow moves in the corner...'
        },
        {
          role: 'user',
          content: 'I turn on the lights'
        }
      ],
      userReaction: 'This is boring, not scary at all',
      flags: {
        generateVideo: false
      }
    }
  }
];

async function runTest(testCase) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${testCase.name}`);
  console.log(`${'='.repeat(60)}`);
  
  try {
    const startTime = Date.now();
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testCase.request)
    });
    
    const duration = Date.now() - startTime;
    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Duration: ${duration}ms`);
    
    if (testCase.expectError) {
      if (response.status === testCase.expectedStatus) {
        console.log('✅ PASS - Got expected error');
        console.log('Error message:', data.error);
      } else {
        console.log(`❌ FAIL - Expected status ${testCase.expectedStatus}, got ${response.status}`);
      }
    } else {
      if (response.ok) {
        console.log('✅ PASS - Request successful');
        console.log('\nResponse structure:');
        console.log('- nextStoryChunk:', data.nextStoryChunk ? `${data.nextStoryChunk.substring(0, 100)}...` : 'MISSING');
        console.log('- choices:', Array.isArray(data.choices) ? `[${data.choices.length} choices]` : 'MISSING');
        console.log('- visuals.imageUrl:', data.visuals?.imageUrl ? 'Present' : 'MISSING');
        console.log('- visuals.videoId:', data.visuals?.videoId || 'null');
        console.log('- updatedHistory:', Array.isArray(data.updatedHistory) ? `[${data.updatedHistory.length} entries]` : 'MISSING');
        
        // Validate response structure
        const issues = [];
        if (!data.nextStoryChunk) issues.push('Missing nextStoryChunk');
        if (!Array.isArray(data.choices) || data.choices.length !== 2) issues.push('Invalid choices array');
        if (!data.visuals?.imageUrl) issues.push('Missing imageUrl');
        if (!Array.isArray(data.updatedHistory)) issues.push('Invalid updatedHistory');
        
        if (issues.length > 0) {
          console.log('\n⚠️  Response validation issues:');
          issues.forEach(issue => console.log(`   - ${issue}`));
        }
      } else {
        console.log('❌ FAIL - Request failed');
        console.log('Error:', data.error || 'Unknown error');
      }
    }
  } catch (error) {
    console.log('❌ FAIL - Exception thrown');
    console.log('Error:', error.message);
  }
}

async function runAllTests() {
  console.log('\n🧪 Starting Hauntographer API Tests');
  console.log(`Target: ${API_URL}`);
  console.log(`Time: ${new Date().toISOString()}`);
  
  for (const testCase of testCases) {
    await runTest(testCase);
    // Wait a bit between tests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!');
  console.log('='.repeat(60) + '\n');
}

// Run tests
runAllTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
