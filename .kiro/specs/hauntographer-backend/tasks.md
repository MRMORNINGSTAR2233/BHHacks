# Implementation Plan

- [x] 1. Set up project dependencies and type definitions
  - Install required npm packages: @google/generative-ai, sentiment, and type definitions
  - Create comprehensive TypeScript interfaces for all request/response types in a shared types file
  - Set up environment variable type definitions and validation
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Implement request validation module
  - Create validation utility functions for request structure
  - Implement first-turn validation (storyProfile.fears and genre required)
  - Implement subsequent-turn validation (storyHistory array validation)
  - Add JSON parsing error handling
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ]* 2.1 Write unit tests for validation module
  - Test valid first-turn and subsequent-turn requests
  - Test missing required fields and invalid data types
  - Test edge cases (empty strings, null values)
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 3. Implement sentiment analysis module
  - Create sentiment analysis function using the sentiment npm package
  - Extract and return comparative score from sentiment analysis
  - Handle empty or null userReaction inputs
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 3.1 Write unit tests for sentiment analysis
  - Test positive, negative, and neutral sentiment detection
  - Test empty strings and edge cases
  - _Requirements: 3.1, 3.4_

- [x] 4. Implement master prompt construction module
  - Create prompt template with all required placeholders
  - Implement function to inject fears, genre, and storyHistory into template
  - Add sentiment score integration with adaptive instructions
  - Format storyHistory array as readable context string
  - Include JSON response format specification in prompt
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ]* 4.1 Write unit tests for prompt construction
  - Test prompt generation with all fields populated
  - Test with optional fields missing
  - Verify history formatting and sentiment integration
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 5. Implement Google Gemini LLM service
  - Set up Gemini API client with API key from environment
  - Create function to send master prompt to Gemini with JSON response mode
  - Implement JSON parsing and validation of LLM response
  - Add error handling for API failures
  - Implement single retry logic for malformed responses
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 5.1 Write integration tests for LLM service
  - Mock Gemini API responses for successful generation
  - Test malformed response handling and retry logic
  - Test API failure scenarios
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 6. Implement image generation service
  - Create prompt augmentation function with cinematic keywords and genre styling
  - Set up Stability AI API client with API key from environment
  - Implement blocking image generation function
  - Extract and return imageUrl from Stability AI response
  - Add error handling for API failures
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ]* 6.1 Write integration tests for image service
  - Mock Stability AI responses
  - Test prompt augmentation logic
  - Test API failure handling
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 7. Implement optional video generation service
  - Set up Replicate API client with API key from environment
  - Create async video generation function that checks generateVideo flag
  - Implement non-blocking API call to Replicate
  - Extract and return prediction ID as videoId
  - Implement graceful degradation (return null on failure)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 7.1 Write integration tests for video service
  - Mock Replicate API responses
  - Test async execution and videoId extraction
  - Test graceful failure scenarios
  - _Requirements: 7.1, 7.3, 7.4, 7.5_

- [x] 8. Implement response assembly module
  - Create function to append new story_chunk to storyHistory with role "model"
  - Implement response object construction with all required fields
  - Combine LLM response, imageUrl, videoId, and updatedHistory
  - _Requirements: 8.1, 8.2, 8.3_

- [ ]* 8.1 Write unit tests for response assembly
  - Test history update logic
  - Test response structure with all fields
  - Test with optional fields missing
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 9. Implement main API route handler
  - Create Next.js API route at app/api/generate/route.ts
  - Implement POST handler that orchestrates all modules sequentially
  - Wire validation → sentiment analysis → prompt construction → LLM → image → video → response assembly
  - Add comprehensive error handling with appropriate HTTP status codes
  - Implement logging for all errors with timestamps and context
  - Return 400 for validation errors, 502 for API failures, 500 for malformed LLM responses
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 9.1 Write end-to-end tests for API route
  - Test complete first-turn flow with storyProfile
  - Test subsequent-turn flow with storyHistory
  - Test with userReaction and sentiment adaptation
  - Test with generateVideo flag enabled
  - Test all error scenarios (validation, API failures)
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 10. Add environment configuration and validation
  - Create .env.example file with all required API keys
  - Implement startup validation to check for required environment variables
  - Add helpful error messages for missing API keys
  - Document environment setup in README or deployment guide
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [x] 11. Implement error response utilities
  - Create standardized error response functions for each error type
  - Implement user-friendly error messages ("The spirits are not responding", etc.)
  - Add error logging utility with structured logging format
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 12. Add input sanitization and security measures
  - Implement story history size limits to prevent DoS attacks
  - Add input sanitization for user-provided strings
  - Validate JSON structure strictly before processing
  - Ensure API keys are never logged or exposed
  - _Requirements: 10.4_

- [x] 13. Configure Next.js API route settings
  - Set runtime to nodejs (not edge) for full npm package support
  - Configure maxDuration for longer API processing time
  - Add CORS headers if needed for frontend integration
  - _Requirements: 1.1, 1.2_

- [ ]* 14. Create integration documentation
  - Document the complete API contract with request/response examples
  - Add code examples for frontend integration
  - Document error codes and their meanings
  - Create troubleshooting guide for common issues
  - _Requirements: 1.1, 1.2, 1.3, 1.4_
