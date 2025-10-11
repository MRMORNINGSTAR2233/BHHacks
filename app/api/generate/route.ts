import { NextRequest, NextResponse } from 'next/server';
import { validateRequest } from '@/lib/utils/validation';
import { analyzeSentiment } from '@/lib/utils/sentiment';
import { buildMasterPrompt } from '@/lib/utils/prompt';
import { generateNarrative } from '@/lib/services/gemini';
import { augmentImagePrompt, generateImage } from '@/lib/services/stability';
import { generateVideoAsync } from '@/lib/services/replicate';
import { assembleResponse } from '@/lib/utils/response';
import type { ErrorResponse } from '@/lib/types/api';

export const runtime = 'nodejs';
export const maxDuration = 60;

// CORS headers for frontend integration (if needed)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json<ErrorResponse>(
        { error: validation.error || 'Invalid request' },
        { status: 400 }
      );
    }

    const { storyProfile, storyHistory, userReaction, flags } = validation.data!;

    // Sentiment analysis (if user reaction provided)
    let emotionalScore: number | undefined;
    if (userReaction && userReaction.trim() !== '') {
      emotionalScore = analyzeSentiment(userReaction);
      console.log('[Hauntographer API] Sentiment analysis:', {
        timestamp: new Date().toISOString(),
        score: emotionalScore,
      });
    }

    // Get story profile (from request or use first entry's profile)
    const profile = storyProfile || {
      fears: 'unknown',
      genre: 'Psychological',
    };

    // Build master prompt
    const masterPrompt = buildMasterPrompt(profile, storyHistory, emotionalScore);

    // Generate narrative with LLM
    let llmResponse;
    try {
      llmResponse = await generateNarrative(masterPrompt);
    } catch (error) {
      console.error('[Hauntographer API] LLM generation failed:', error);
      
      if (error instanceof Error && error.message.includes('non-JSON')) {
        return NextResponse.json<ErrorResponse>(
          { error: 'The narrative has become corrupted. Please refresh and start a new story.' },
          { status: 500 }
        );
      }
      
      return NextResponse.json<ErrorResponse>(
        { error: 'The spirits are not responding. Please try again later.' },
        { status: 502 }
      );
    }

    // Augment image prompt
    const augmentedPrompt = augmentImagePrompt(llmResponse.image_prompt, profile.genre);

    // Generate image (blocking)
    let imageUrl: string;
    try {
      imageUrl = await generateImage(augmentedPrompt);
    } catch (error) {
      console.error('[Hauntographer API] Image generation failed:', error);
      return NextResponse.json<ErrorResponse>(
        { error: 'The spirits are not responding. Please try again later.' },
        { status: 502 }
      );
    }

    // Generate video (async, optional)
    let videoId: string | null = null;
    if (flags?.generateVideo) {
      videoId = await generateVideoAsync(augmentedPrompt);
    }

    // Assemble final response
    const response = assembleResponse(llmResponse, imageUrl, videoId, storyHistory);

    console.log('[Hauntographer API] Request completed successfully:', {
      timestamp: new Date().toISOString(),
      historyLength: response.updatedHistory.length,
      hasVideo: videoId !== null,
    });

    return NextResponse.json(response, { status: 200, headers: corsHeaders });
  } catch (error) {
    console.error('[Hauntographer API] Unexpected error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    return NextResponse.json<ErrorResponse>(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
