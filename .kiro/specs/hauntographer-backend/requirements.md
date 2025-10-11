# Requirements Document

## Introduction

The Hauntographer Backend is a stateless API endpoint that orchestrates personalized, interactive horror narratives. It receives the user's story state and generates the next chapter using AI models for text generation (Google Gemini) and visual content (Stability AI for images, Replicate for optional video). The system adapts to user emotions through sentiment analysis and maintains narrative coherence through conversation history.

## Requirements

### Requirement 1: Core API Endpoint

**User Story:** As a frontend developer, I want a single POST endpoint that accepts story state and returns the next narrative chapter with choices, so that I can build a stateless interactive horror experience.

#### Acceptance Criteria

1. WHEN a POST request is sent to `/api/generate` THEN the system SHALL accept a JSON body containing `storyProfile`, `storyHistory`, `userReaction`, and `flags`
2. WHEN the request is valid THEN the system SHALL return a 200 OK response with `nextStoryChunk`, `choices`, `visuals`, and `updatedHistory`
3. WHEN the endpoint processes a request THEN the system SHALL remain stateless and rely entirely on the provided `storyHistory`
4. WHEN the response is generated THEN the system SHALL return exactly two distinct choices for the user

### Requirement 2: Request Validation

**User Story:** As a backend developer, I want comprehensive input validation, so that the API handles malformed requests gracefully and provides clear error messages.

#### Acceptance Criteria

1. WHEN `storyHistory` is empty AND `storyProfile.fears` is missing or empty THEN the system SHALL return a 400 Bad Request with an error message
2. WHEN `storyHistory` is empty AND `storyProfile.genre` is missing or empty THEN the system SHALL return a 400 Bad Request with an error message
3. WHEN `storyHistory` is non-empty AND is not a valid array THEN the system SHALL return a 400 Bad Request with an error message
4. WHEN the request body cannot be parsed as JSON THEN the system SHALL return a 400 Bad Request with an error message

### Requirement 3: Sentiment Analysis and Adaptive Logic

**User Story:** As a storyteller AI, I want to analyze user emotional reactions, so that I can adapt the narrative intensity and style based on their engagement level.

#### Acceptance Criteria

1. WHEN `userReaction` is present and non-empty THEN the system SHALL process it using the sentiment npm package to derive a numerical score
2. WHEN the sentiment score is negative or zero THEN the system SHALL maintain or escalate the current horror style in the master prompt
3. WHEN the sentiment score is positive THEN the system SHALL instruct the LLM to pivot narrative strategy in the master prompt
4. WHEN `userReaction` is null or empty THEN the system SHALL proceed without sentiment analysis

### Requirement 4: Master Prompt Construction

**User Story:** As an AI orchestrator, I want to dynamically construct prompts with all contextual data, so that the LLM generates coherent, personalized horror narratives.

#### Acceptance Criteria

1. WHEN constructing the master prompt THEN the system SHALL include the user's `fears` from the story profile
2. WHEN constructing the master prompt THEN the system SHALL include the user's `genre` from the story profile
3. WHEN constructing the master prompt THEN the system SHALL include the complete `storyHistory` array as context
4. WHEN sentiment analysis is performed THEN the system SHALL include the `emotionalScore` in the prompt
5. WHEN the prompt is constructed THEN the system SHALL instruct the LLM to return a JSON object with `story_chunk`, `image_prompt`, and `choices`
6. WHEN the prompt is constructed THEN the system SHALL instruct the LLM to adapt based on emotional score

### Requirement 5: LLM Integration

**User Story:** As a backend developer, I want to integrate with Google Gemini API, so that I can generate narrative content and image prompts.

#### Acceptance Criteria

1. WHEN the master prompt is ready THEN the system SHALL send it to the Google Gemini API
2. WHEN calling the Gemini API THEN the system SHALL request a JSON response format
3. WHEN the Gemini API call fails THEN the system SHALL catch the error and proceed to error handling
4. WHEN the Gemini API returns a response THEN the system SHALL parse it as JSON
5. WHEN the parsed JSON is missing required keys (`story_chunk`, `image_prompt`, `choices`) THEN the system SHALL treat it as a malformed response

### Requirement 6: Image Generation

**User Story:** As a user, I want to see a cinematic horror image for each story chapter, so that the narrative is visually immersive.

#### Acceptance Criteria

1. WHEN the LLM returns an `image_prompt` THEN the system SHALL augment it with stylistic keywords including "cinematic horror, ultra-realistic, dramatic lighting"
2. WHEN the augmented prompt is ready THEN the system SHALL invoke the Stability AI API
3. WHEN calling Stability AI THEN the system SHALL await the response as a blocking operation
4. WHEN Stability AI returns successfully THEN the system SHALL extract the `imageUrl` from the response
5. WHEN the Stability AI call fails THEN the system SHALL proceed to error handling

### Requirement 7: Optional Video Generation

**User Story:** As a user, I want the option to generate video content for story chapters, so that I can experience an even more immersive narrative.

#### Acceptance Criteria

1. WHEN `flags.generateVideo` is true THEN the system SHALL invoke the Replicate API with the augmented image prompt
2. WHEN calling Replicate THEN the system SHALL execute the call asynchronously without blocking the response
3. WHEN Replicate returns an initial response THEN the system SHALL extract and store the `id` as `videoId`
4. WHEN `flags.generateVideo` is false or missing THEN the system SHALL set `videoId` to null in the response
5. WHEN the Replicate call fails THEN the system SHALL set `videoId` to null and continue processing

### Requirement 8: State Management and Response Assembly

**User Story:** As a frontend developer, I want to receive the complete updated story history, so that I can maintain state for the next request.

#### Acceptance Criteria

1. WHEN the LLM generates a new `story_chunk` THEN the system SHALL append it to the `storyHistory` array with role "model"
2. WHEN new `choices` are generated THEN the system SHALL include them in the response
3. WHEN the response is assembled THEN the system SHALL include `nextStoryChunk`, `choices`, `visuals`, and `updatedHistory`
4. WHEN the response is complete THEN the system SHALL return it with a 200 OK status

### Requirement 9: Error Handling

**User Story:** As a user, I want clear, user-friendly error messages when something goes wrong, so that I understand what happened and can take appropriate action.

#### Acceptance Criteria

1. WHEN any external API call fails THEN the system SHALL log the specific error for debugging
2. WHEN an LLM or visual API fails THEN the system SHALL return a 502 Bad Gateway with message "The spirits are not responding. Please try again later."
3. WHEN the LLM returns a non-JSON response THEN the system SHALL retry the call once
4. WHEN the LLM fails twice with malformed responses THEN the system SHALL return a 500 Internal Server Error with message "The narrative has become corrupted. Please refresh and start a new story."
5. WHEN validation fails THEN the system SHALL return a 400 Bad Request with a descriptive error message

### Requirement 10: Security and Configuration

**User Story:** As a security-conscious developer, I want all API keys stored securely in environment variables, so that sensitive credentials are never exposed in code.

#### Acceptance Criteria

1. WHEN the application starts THEN the system SHALL read the Google API key from `process.env.GOOGLE_API_KEY`
2. WHEN the application starts THEN the system SHALL read the Stability AI key from `process.env.STABILITY_API_KEY`
3. WHEN the application starts THEN the system SHALL read the Replicate API key from `process.env.REPLICATE_API_KEY`
4. WHEN accessing API keys THEN the system SHALL never hardcode them in source files
5. WHEN an API key is missing THEN the system SHALL fail gracefully with an appropriate error message
