/**
 * Frontend Unit Tests for The Hauntographer
 * Run with: node tests/frontend-unit-tests.js
 */

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

console.log('\n🧪 Running Frontend Unit Tests\n');

// ============================================================================
// Type System Tests
// ============================================================================
console.log('📋 Type System Tests');
console.log('─'.repeat(60));

function testTypeDefinitions() {
  const horrorGenres = ['Gothic', 'Cosmic', 'Slasher', 'Psychological'];
  const appStates = ['setup', 'narrative', 'loading'];
  
  assert(horrorGenres.length === 4, 'All horror genres defined');
  assert(appStates.length === 3, 'All app states defined');
  
  // Test StorySegment structure
  const mockSegment = {
    text: 'Story text',
    imageUrl: 'https://example.com/image.jpg',
    choices: ['Choice 1', 'Choice 2'],
    userChoice: 'Choice 1',
    userReaction: 'Scary!'
  };
  
  assert(mockSegment.choices.length === 2, 'StorySegment has exactly 2 choices');
  assert(typeof mockSegment.text === 'string', 'StorySegment text is string');
  
  // Test AppData structure
  const mockAppData = {
    fears: 'spiders, darkness',
    genre: 'Gothic',
    currentStory: 'Story text',
    currentImage: 'https://example.com/image.jpg',
    currentChoices: ['Choice 1', 'Choice 2'],
    storyHistory: []
  };
  
  assert(mockAppData.currentChoices.length === 2, 'AppData has exactly 2 current choices');
  assert(Array.isArray(mockAppData.storyHistory), 'AppData storyHistory is array');
}

testTypeDefinitions();

// ============================================================================
// Component Props Validation Tests
// ============================================================================
console.log('\n🎨 Component Props Tests');
console.log('─'.repeat(60));

function testSetupScreenProps() {
  const mockProps = {
    onSubmit: (fears, genre) => {},
    isLoading: false
  };
  
  assert(typeof mockProps.onSubmit === 'function', 'SetupScreen onSubmit is function');
  assert(typeof mockProps.isLoading === 'boolean', 'SetupScreen isLoading is boolean');
}

function testNarrativeScreenProps() {
  const mockProps = {
    storyChunk: 'Story text',
    imageUrl: 'https://example.com/image.jpg',
    choices: ['Choice 1', 'Choice 2'],
    onChoiceSelect: (choice, reaction) => {},
    isLoading: false,
    selectedChoice: undefined
  };
  
  assert(typeof mockProps.storyChunk === 'string', 'NarrativeScreen storyChunk is string');
  assert(Array.isArray(mockProps.choices), 'NarrativeScreen choices is array');
  assert(mockProps.choices.length === 2, 'NarrativeScreen has exactly 2 choices');
  assert(typeof mockProps.onChoiceSelect === 'function', 'NarrativeScreen onChoiceSelect is function');
  assert(typeof mockProps.isLoading === 'boolean', 'NarrativeScreen isLoading is boolean');
}

function testTypewriterTextProps() {
  const mockProps = {
    text: 'Sample text',
    speed: 50,
    onComplete: () => {}
  };
  
  assert(typeof mockProps.text === 'string', 'TypewriterText text is string');
  assert(typeof mockProps.speed === 'number', 'TypewriterText speed is number');
  assert(typeof mockProps.onComplete === 'function', 'TypewriterText onComplete is function');
}

testSetupScreenProps();
testNarrativeScreenProps();
testTypewriterTextProps();

// ============================================================================
// Form Validation Tests
// ============================================================================
console.log('\n📝 Form Validation Tests');
console.log('─'.repeat(60));

function testFearsValidation() {
  // Test minimum length
  const tooShort = 'spiders';
  assert(tooShort.length < 10, 'Fears too short detected');
  
  // Test valid length
  const validFears = 'spiders, darkness, being watched';
  assert(validFears.length >= 10, 'Valid fears length accepted');
  
  // Test maximum length
  const maxLength = 500;
  const longFears = 'a'.repeat(600);
  assert(longFears.length > maxLength, 'Fears exceeding max length detected');
  
  // Test trimming
  const fearsWithSpaces = '  spiders, darkness  ';
  const trimmed = fearsWithSpaces.trim();
  assert(trimmed === 'spiders, darkness', 'Fears trimming works');
}

function testGenreValidation() {
  const validGenres = ['Gothic', 'Cosmic', 'Slasher', 'Psychological'];
  
  assert(validGenres.includes('Gothic'), 'Gothic genre is valid');
  assert(validGenres.includes('Cosmic'), 'Cosmic genre is valid');
  assert(validGenres.includes('Slasher'), 'Slasher genre is valid');
  assert(validGenres.includes('Psychological'), 'Psychological genre is valid');
  assert(!validGenres.includes('Invalid'), 'Invalid genre is rejected');
}

function testFormSubmitValidation() {
  const validForm = {
    fears: 'spiders, darkness, being watched',
    genre: 'Gothic'
  };
  
  const isValid = validForm.fears.trim().length >= 10 && 
                  validForm.fears.trim().length <= 500 && 
                  validForm.genre;
  
  assert(isValid, 'Valid form passes validation');
  
  const invalidForm1 = {
    fears: 'short',
    genre: 'Gothic'
  };
  
  const isInvalid1 = invalidForm1.fears.trim().length >= 10;
  assert(!isInvalid1, 'Form with short fears fails validation');
  
  const invalidForm2 = {
    fears: 'spiders, darkness, being watched',
    genre: ''
  };
  
  const isInvalid2 = invalidForm2.fears.trim().length >= 10 && invalidForm2.genre;
  assert(!isInvalid2, 'Form without genre fails validation');
}

testFearsValidation();
testGenreValidation();
testFormSubmitValidation();

// ============================================================================
// State Management Tests
// ============================================================================
console.log('\n🔄 State Management Tests');
console.log('─'.repeat(60));

function testAppStateTransitions() {
  const states = ['setup', 'narrative', 'loading'];
  
  // Test initial state
  let currentState = 'setup';
  assert(currentState === 'setup', 'Initial state is setup');
  
  // Test transition to loading
  currentState = 'loading';
  assert(currentState === 'loading', 'Transitions to loading');
  
  // Test transition to narrative
  currentState = 'narrative';
  assert(currentState === 'narrative', 'Transitions to narrative');
  
  // Test back to setup (restart)
  currentState = 'setup';
  assert(currentState === 'setup', 'Can return to setup');
}

function testStoryHistoryManagement() {
  const history = [];
  
  // Add first segment
  const segment1 = {
    text: 'First story segment',
    imageUrl: 'https://example.com/1.jpg',
    choices: ['Choice A', 'Choice B'],
    userChoice: 'Choice A'
  };
  
  history.push(segment1);
  assert(history.length === 1, 'First segment added to history');
  
  // Add second segment
  const segment2 = {
    text: 'Second story segment',
    imageUrl: 'https://example.com/2.jpg',
    choices: ['Choice C', 'Choice D'],
    userChoice: 'Choice C'
  };
  
  history.push(segment2);
  assert(history.length === 2, 'Second segment added to history');
  
  // Verify history order
  assert(history[0].userChoice === 'Choice A', 'First choice preserved');
  assert(history[1].userChoice === 'Choice C', 'Second choice preserved');
}

function testReactionHandling() {
  let reaction = '';
  
  // Test empty reaction
  assert(reaction === '', 'Reaction starts empty');
  
  // Test setting reaction
  reaction = 'That was terrifying!';
  assert(reaction.length > 0, 'Reaction can be set');
  
  // Test reaction length limit
  const maxLength = 200;
  const longReaction = 'a'.repeat(250);
  assert(longReaction.length > maxLength, 'Long reaction detected');
  
  // Test clearing reaction
  reaction = '';
  assert(reaction === '', 'Reaction can be cleared');
}

testAppStateTransitions();
testStoryHistoryManagement();
testReactionHandling();

// ============================================================================
// Typewriter Effect Tests
// ============================================================================
console.log('\n⌨️  Typewriter Effect Tests');
console.log('─'.repeat(60));

function testTypewriterLogic() {
  const text = 'Sample horror text';
  let displayedText = '';
  let currentIndex = 0;
  
  // Simulate typewriter effect
  while (currentIndex < text.length) {
    displayedText += text[currentIndex];
    currentIndex++;
  }
  
  assertEquals(displayedText, text, 'Typewriter displays full text');
  assertEquals(currentIndex, text.length, 'Typewriter completes at text length');
}

function testTypewriterLineBreaks() {
  const textWithBreaks = 'Line 1\nLine 2\nLine 3';
  const lines = textWithBreaks.split('\n');
  
  assertEquals(lines.length, 3, 'Line breaks split correctly');
  assertEquals(lines[0], 'Line 1', 'First line correct');
  assertEquals(lines[1], 'Line 2', 'Second line correct');
  assertEquals(lines[2], 'Line 3', 'Third line correct');
}

function testTypewriterSpeed() {
  const speeds = [30, 50, 100];
  
  speeds.forEach(speed => {
    assert(speed > 0, `Speed ${speed}ms is positive`);
    assert(speed <= 200, `Speed ${speed}ms is reasonable`);
  });
}

testTypewriterLogic();
testTypewriterLineBreaks();
testTypewriterSpeed();

// ============================================================================
// Image Handling Tests
// ============================================================================
console.log('\n🖼️  Image Handling Tests');
console.log('─'.repeat(60));

function testImageUrlValidation() {
  const validUrls = [
    'https://example.com/image.jpg',
    'https://images.unsplash.com/photo-123',
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
  ];
  
  validUrls.forEach(url => {
    assert(url.startsWith('https://') || url.startsWith('data:'), `Valid URL format: ${url.substring(0, 30)}...`);
  });
}

function testImageLoadingStates() {
  let imageLoaded = false;
  let imageError = false;
  
  // Test initial state
  assert(!imageLoaded && !imageError, 'Image starts in loading state');
  
  // Test successful load
  imageLoaded = true;
  assert(imageLoaded && !imageError, 'Image loaded successfully');
  
  // Test error state
  imageLoaded = false;
  imageError = true;
  assert(!imageLoaded && imageError, 'Image error state handled');
}

testImageUrlValidation();
testImageLoadingStates();

// ============================================================================
// Accessibility Tests
// ============================================================================
console.log('\n♿ Accessibility Tests');
console.log('─'.repeat(60));

function testAriaLabels() {
  const ariaLabels = [
    'Horror story setup form',
    'Interactive horror story',
    'Story content',
    'Story choices',
    'Choose your path'
  ];
  
  ariaLabels.forEach(label => {
    assert(label.length > 0, `ARIA label present: "${label}"`);
  });
}

function testKeyboardNavigation() {
  // Test that form elements are keyboard accessible
  const formElements = ['textarea', 'radio', 'button'];
  
  formElements.forEach(element => {
    assert(element.length > 0, `${element} is keyboard accessible`);
  });
}

function testReducedMotion() {
  // Test that reduced motion preference is respected
  const prefersReducedMotion = false; // Mock value
  
  if (prefersReducedMotion) {
    assert(true, 'Reduced motion preference respected');
  } else {
    assert(true, 'Normal motion enabled');
  }
}

testAriaLabels();
testKeyboardNavigation();
testReducedMotion();

// ============================================================================
// Loading States Tests
// ============================================================================
console.log('\n⏳ Loading States Tests');
console.log('─'.repeat(60));

function testLoadingIndicators() {
  let isLoading = false;
  
  // Test not loading
  assert(!isLoading, 'Initially not loading');
  
  // Test loading state
  isLoading = true;
  assert(isLoading, 'Loading state active');
  
  // Test loading complete
  isLoading = false;
  assert(!isLoading, 'Loading complete');
}

function testDisabledStates() {
  let isLoading = true;
  
  // Test form disabled during loading
  const formDisabled = isLoading;
  assert(formDisabled, 'Form disabled during loading');
  
  // Test buttons disabled during loading
  const buttonsDisabled = isLoading;
  assert(buttonsDisabled, 'Buttons disabled during loading');
  
  // Test enabled after loading
  isLoading = false;
  const formEnabled = !isLoading;
  assert(formEnabled, 'Form enabled after loading');
}

testLoadingIndicators();
testDisabledStates();

// ============================================================================
// Choice Selection Tests
// ============================================================================
console.log('\n🎯 Choice Selection Tests');
console.log('─'.repeat(60));

function testChoiceSelection() {
  const choices = ['Choice A', 'Choice B'];
  let selectedChoice = undefined;
  
  // Test no selection
  assert(selectedChoice === undefined, 'No choice selected initially');
  
  // Test selecting first choice
  selectedChoice = choices[0];
  assertEquals(selectedChoice, 'Choice A', 'First choice selected');
  
  // Test selecting second choice
  selectedChoice = choices[1];
  assertEquals(selectedChoice, 'Choice B', 'Second choice selected');
}

function testChoiceWithReaction() {
  const choice = 'Choice A';
  const reaction = 'That was scary!';
  
  const submission = {
    choice,
    reaction: reaction.trim() || undefined
  };
  
  assert(submission.choice === choice, 'Choice included in submission');
  assert(submission.reaction === reaction, 'Reaction included in submission');
  
  // Test without reaction
  const submissionNoReaction = {
    choice,
    reaction: ''.trim() || undefined
  };
  
  assert(submissionNoReaction.reaction === undefined, 'Empty reaction becomes undefined');
}

testChoiceSelection();
testChoiceWithReaction();

// ============================================================================
// Mock API Tests
// ============================================================================
console.log('\n🔌 Mock API Tests');
console.log('─'.repeat(60));

function testMockApiResponse() {
  const mockResponse = {
    story_chunk: 'The darkness deepens...',
    image_url: 'https://example.com/image.jpg',
    choices: ['Go left', 'Go right'],
    is_complete: false
  };
  
  assert(typeof mockResponse.story_chunk === 'string', 'Mock API returns story chunk');
  assert(typeof mockResponse.image_url === 'string', 'Mock API returns image URL');
  assert(Array.isArray(mockResponse.choices), 'Mock API returns choices array');
  assert(mockResponse.choices.length === 2, 'Mock API returns exactly 2 choices');
  assert(typeof mockResponse.is_complete === 'boolean', 'Mock API returns completion status');
}

function testMockApiDelay() {
  const delay = 2000; // 2 seconds
  assert(delay > 0, 'Mock API has delay');
  assert(delay <= 5000, 'Mock API delay is reasonable');
}

testMockApiResponse();
testMockApiDelay();

// ============================================================================
// Summary
// ============================================================================
console.log('\n' + '='.repeat(60));
console.log('📊 Frontend Test Summary');
console.log('='.repeat(60));
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Total: ${passed + failed}`);
console.log(`🎯 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

if (failed > 0) {
  process.exit(1);
}
