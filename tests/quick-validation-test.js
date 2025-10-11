/**
 * Quick Validation Test
 * Validates that API keys are set and modules can be loaded
 * Run with: node tests/quick-validation-test.js
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Quick Validation Test\n');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passed++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failed++;
  }
}

// Test 1: Environment variables
console.log('\n📋 Environment Variables:');
console.log('─'.repeat(60));

const googleKey = process.env.GOOGLE_API_KEY;
const stabilityKey = process.env.STABILITY_API_KEY;
const replicateKey = process.env.REPLICATE_API_KEY;

test('Google API Key', !!googleKey, googleKey ? `Set (${googleKey.substring(0, 20)}...)` : 'Not set');
test('Stability AI Key', !!stabilityKey, stabilityKey ? `Set (${stabilityKey.substring(0, 20)}...)` : 'Not set');
test('Replicate API Key', !!replicateKey, replicateKey ? `Set (${replicateKey.substring(0, 20)}...)` : 'Not set');

// Test 2: Module imports
console.log('\n📦 Module Imports:');
console.log('─'.repeat(60));

try {
  require('@google/generative-ai');
  test('Google Generative AI SDK', true, 'Module loaded successfully');
} catch (error) {
  test('Google Generative AI SDK', false, `Error: ${error.message}`);
}

try {
  require('sentiment');
  test('Sentiment Package', true, 'Module loaded successfully');
} catch (error) {
  test('Sentiment Package', false, `Error: ${error.message}`);
}

try {
  require('replicate');
  test('Replicate Package', true, 'Module loaded successfully');
} catch (error) {
  test('Replicate Package', false, `Error: ${error.message}`);
}

// Test 3: File structure
console.log('\n📁 File Structure:');
console.log('─'.repeat(60));

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'lib/types/api.ts',
  'lib/utils/validation.ts',
  'lib/utils/sentiment.ts',
  'lib/utils/prompt.ts',
  'lib/services/gemini.ts',
  'lib/services/stability.ts',
  'lib/services/replicate.ts',
  'app/api/generate/route.ts',
  'app/page.tsx',
  'app/components/setup-screen.tsx',
  'app/components/narrative-screen.tsx'
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  test(file, exists);
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 Summary:');
console.log('─'.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

if (failed === 0) {
  console.log('\n✅ All validation checks passed!');
  console.log('\n📝 Next steps:');
  console.log('   1. Start the dev server: npm run dev');
  console.log('   2. Run integration tests: node tests/integration-test-live.js');
  console.log('   3. Open http://localhost:3000 in your browser\n');
} else {
  console.log('\n⚠️  Some validation checks failed. Please review the errors above.\n');
  process.exit(1);
}
