# Hauntographer API Documentation

## Overview

The Hauntographer Backend API is a stateless endpoint that generates personalized, interactive horror narratives using AI. It orchestrates multiple AI services to create story content, images, and optional video.

## Endpoint

### POST `/api/generate`

Generates the next chapter of a horror story with choices and visuals.

## Request Format

```json
{
  "storyProfile": {
    "fears": "string",
    "genre": "string"
  },
  "storyHistory": [
    {
      "role": "user" | "model",
      "content": "string"
    }
  ],
  "userReaction": "string | null",
  "flags": {
    "generateVideo": boolean
  }
}
```

### Request Fields

- **storyProfile** (required for first turn only)
  - `fears`: User's specific fears (e.g., "spiders, claustrophobia, being watched")
  - `genre`: Horror subgenre (e.g., "Gothic", "Cosmic", "Slasher", "Psychological")

- **storyHistory** (required, array)
  - Complete conversation history
  - Each entry has `role` ("user" or "model") and `content` (text)
  - Empty array for first turn

- **userReaction** (optional)
  - User's emotional feedback about the last story chunk
  - Used for sentiment analysis to adapt narrative

- **flags** (optional)
  - `generateVideo`: Set to `true` to initiate video generation (async)

## Response Format

```json
{
  "nextStoryChunk": "string",
  "choices": ["string", "string"],
  "visuals": {
    "imageUrl": "string",
    "videoId": "string | null"
  },
  "updatedHistory": [
    {
      "role": "user" | "model",
      "content": "string"
    }
  ]
}
```

### Response Fields

- **nextStoryChunk**: The newly generated story text (1-2 paragraphs)
- **choices**: Exactly two choices for the user to make next
- **visuals**:
  - `imageUrl`: Direct URL or data URL of the generated image
  - `videoId`: Replicate prediction ID for polling, or null
- **updatedHistory**: Complete history including the new story chunk

## Error Responses

### 400 Bad Request
```json
{
  "error": "Descriptive validation error message"
}
```

Returned when:
- Request body is invalid JSON
- Required fields are missing
- Data types are incorrect
- String lengths exceed limits

### 500 Internal Server Error
```json
{
  "error": "The narrative has become corrupted. Please refresh and start a new story."
}
```

Returned when:
- LLM returns malformed responses after retry

### 502 Bad Gateway
```json
{
  "error": "The spirits are not responding. Please try again later."
}
```

Returned when:
- External API calls fail (Gemini, Stability AI)

## Example Usage

### First Turn (Starting a Story)

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storyProfile: {
      fears: "darkness, isolation, being followed",
      genre: "Psychological"
    },
    storyHistory: [],
    userReaction: null,
    flags: {
      generateVideo: false
    }
  })
});

const data = await response.json();
// data.nextStoryChunk - Display this text
// data.choices - Show as buttons
// data.visuals.imageUrl - Display the image
// data.updatedHistory - Store for next request
```

### Subsequent Turn (User Made a Choice)

```javascript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    storyHistory: [
      ...previousHistory,
      {
        role: 'user',
        content: 'I chose to investigate the noise'
      }
    ],
    userReaction: "That was terrifying!",
    flags: {
      generateVideo: false
    }
  })
});
```

## Environment Setup

Create a `.env.local` file with the following variables:

```bash
GOOGLE_API_KEY=your_google_gemini_api_key
STABILITY_API_KEY=your_stability_ai_api_key
REPLICATE_API_KEY=your_replicate_api_key
NODE_ENV=development
```

### Getting API Keys

1. **Google Gemini**: https://makersuite.google.com/app/apikey
2. **Stability AI**: https://platform.stability.ai/account/keys
3. **Replicate**: https://replicate.com/account/api-tokens

## Security Considerations

- **Rate Limiting**: Consider implementing rate limiting in production
- **Input Validation**: All inputs are validated and sanitized
- **History Limits**: Maximum 100 history entries to prevent DoS
- **String Limits**: Maximum lengths enforced on all text fields
- **API Keys**: Never exposed in responses or logs

## Performance

- **Average Response Time**: 15-20 seconds
  - LLM generation: 2-5 seconds
  - Image generation: 5-15 seconds
  - Video initiation: < 1 second (async)
- **Max Duration**: 60 seconds (Vercel limit)
- **Runtime**: Node.js (not Edge)

## Adaptive Storytelling

The API uses sentiment analysis on `userReaction` to adapt the narrative:

- **Negative/Neutral Score** (≤ 0): User is engaged/frightened
  - Maintains or escalates current horror style
  
- **Positive Score** (> 0): User is amused/bored
  - Pivots narrative strategy
  - Introduces different scares
  - Builds atmospheric dread

## Video Generation

When `flags.generateVideo` is `true`:
- Video generation is initiated asynchronously
- Returns a `videoId` (Replicate prediction ID)
- Frontend can poll Replicate API for completion
- Gracefully degrades to `null` on failure

## Troubleshooting

### "The spirits are not responding"
- Check API keys are correctly set
- Verify internet connectivity
- Check API service status (Gemini, Stability AI)

### "The narrative has become corrupted"
- LLM returned invalid JSON twice
- Try refreshing and starting a new story
- Check if prompt is too complex

### Slow Response Times
- Image generation can take 10-15 seconds
- Consider showing loading states
- Video generation is async (doesn't block response)

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

### Testing the API

```bash
# Using curl
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "storyProfile": {
      "fears": "spiders",
      "genre": "Gothic"
    },
    "storyHistory": []
  }'
```

## Architecture

The API follows a modular architecture:

1. **Validation** → Validates and sanitizes input
2. **Sentiment Analysis** → Analyzes user emotion (if provided)
3. **Prompt Construction** → Builds dynamic LLM prompt
4. **LLM Generation** → Generates story and image prompt
5. **Image Generation** → Creates cinematic horror image
6. **Video Generation** → Optionally initiates video (async)
7. **Response Assembly** → Combines all outputs

## Support

For issues or questions:
- Check environment variables are set correctly
- Review error messages for specific guidance
- Ensure API keys have sufficient credits
- Check API service status pages
