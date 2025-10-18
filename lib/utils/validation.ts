import type { GenerateRequest, ValidationResult } from '@/lib/types/api';

// Security constants
const MAX_HISTORY_LENGTH = 100; // Prevent DoS with excessive history
const MAX_STRING_LENGTH = 10000; // Prevent DoS with extremely long strings
const MAX_FEAR_LENGTH = 500;
const MAX_GENRE_LENGTH = 100;

/**
 * Sanitizes a string by trimming and limiting length
 */
function sanitizeString(str: string, maxLength: number): string {
  return str.trim().substring(0, maxLength);
}

export function validateRequest(body: unknown): ValidationResult {
  // Check if body exists and is an object
  if (!body || typeof body !== 'object') {
    return {
      valid: false,
      error: 'Request body must be a valid JSON object',
    };
  }

  const request = body as Partial<GenerateRequest>;

  // Validate storyHistory exists and is an array
  if (!Array.isArray(request.storyHistory)) {
    return {
      valid: false,
      error: 'storyHistory must be an array',
    };
  }

  // Prevent DoS with excessive history length
  if (request.storyHistory.length > MAX_HISTORY_LENGTH) {
    return {
      valid: false,
      error: `storyHistory exceeds maximum length of ${MAX_HISTORY_LENGTH} entries`,
    };
  }

  // First turn validation - requires storyProfile
  if (request.storyHistory.length === 0) {
    if (!request.storyProfile) {
      return {
        valid: false,
        error: 'Initial request requires storyProfile with fears and genre',
      };
    }

    if (!request.storyProfile.fears || request.storyProfile.fears.trim() === '') {
      return {
        valid: false,
        error: 'Initial request requires storyProfile.fears to be a non-empty string',
      };
    }

    if (request.storyProfile.fears.length > MAX_FEAR_LENGTH) {
      return {
        valid: false,
        error: `storyProfile.fears exceeds maximum length of ${MAX_FEAR_LENGTH} characters`,
      };
    }

    if (!request.storyProfile.genre || request.storyProfile.genre.trim() === '') {
      return {
        valid: false,
        error: 'Initial request requires storyProfile.genre to be a non-empty string',
      };
    }

    if (request.storyProfile.genre.length > MAX_GENRE_LENGTH) {
      return {
        valid: false,
        error: `storyProfile.genre exceeds maximum length of ${MAX_GENRE_LENGTH} characters`,
      };
    }

    // Sanitize profile strings
    request.storyProfile.fears = sanitizeString(request.storyProfile.fears, MAX_FEAR_LENGTH);
    request.storyProfile.genre = sanitizeString(request.storyProfile.genre, MAX_GENRE_LENGTH);
  }

  // Validate storyHistory entries
  for (let i = 0; i < request.storyHistory.length; i++) {
    const entry = request.storyHistory[i];
    
    if (!entry || typeof entry !== 'object') {
      return {
        valid: false,
        error: `storyHistory[${i}] must be an object`,
      };
    }

    if (entry.role !== 'user' && entry.role !== 'model') {
      return {
        valid: false,
        error: `storyHistory[${i}].role must be either 'user' or 'model'`,
      };
    }

    if (typeof entry.content !== 'string') {
      return {
        valid: false,
        error: `storyHistory[${i}].content must be a string`,
      };
    }

    if (entry.content.length > MAX_STRING_LENGTH) {
      return {
        valid: false,
        error: `storyHistory[${i}].content exceeds maximum length of ${MAX_STRING_LENGTH} characters`,
      };
    }

    // Sanitize content
    entry.content = sanitizeString(entry.content, MAX_STRING_LENGTH);
  }

  // Validate userReaction if present
  if (request.userReaction !== undefined && request.userReaction !== null) {
    if (typeof request.userReaction !== 'string') {
      return {
        valid: false,
        error: 'userReaction must be a string or null',
      };
    }

    if (request.userReaction.length > MAX_STRING_LENGTH) {
      return {
        valid: false,
        error: `userReaction exceeds maximum length of ${MAX_STRING_LENGTH} characters`,
      };
    }

    // Sanitize user reaction
    request.userReaction = sanitizeString(request.userReaction, MAX_STRING_LENGTH);
  }



  // All validation passed
  return {
    valid: true,
    data: request as GenerateRequest,
  };
}
