import { NextResponse } from 'next/server';
import type { ErrorResponse } from '@/lib/types/api';

/**
 * Error types for structured logging and response handling
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  LLM_FAILURE = 'LLM_FAILURE',
  IMAGE_FAILURE = 'IMAGE_FAILURE',
  VIDEO_FAILURE = 'VIDEO_FAILURE',
  MALFORMED_RESPONSE = 'MALFORMED_RESPONSE',
  MISSING_API_KEY = 'MISSING_API_KEY',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Structured error logging
 */
export function logError(
  errorType: ErrorType,
  error: Error | unknown,
  context?: Record<string, unknown>
): void {
  console.error('[Hauntographer API]', {
    timestamp: new Date().toISOString(),
    errorType,
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}

/**
 * Creates a 400 Bad Request response for validation errors
 */
export function validationErrorResponse(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    { error: message },
    { status: 400 }
  );
}

/**
 * Creates a 502 Bad Gateway response for external API failures
 */
export function apiFailureResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    { error: 'The spirits are not responding. Please try again later.' },
    { status: 502 }
  );
}

/**
 * Creates a 500 Internal Server Error response for malformed LLM responses
 */
export function malformedResponseError(): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    { error: 'The narrative has become corrupted. Please refresh and start a new story.' },
    { status: 500 }
  );
}

/**
 * Creates a 500 Internal Server Error response for configuration errors
 */
export function configurationErrorResponse(message?: string): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    { error: message || 'Server configuration error. Please contact support.' },
    { status: 500 }
  );
}

/**
 * Creates a generic 500 Internal Server Error response
 */
export function internalErrorResponse(): NextResponse<ErrorResponse> {
  return NextResponse.json<ErrorResponse>(
    { error: 'An unexpected error occurred. Please try again.' },
    { status: 500 }
  );
}
