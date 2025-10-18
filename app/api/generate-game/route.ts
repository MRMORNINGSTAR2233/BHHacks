import { NextRequest, NextResponse } from 'next/server';
import { generateGameCode } from '@/lib/services/game-generator';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface GameRequest {
  gameDescription: string;
  genre: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GameRequest = await request.json();
    
    const { gameDescription, genre } = body;

    if (!gameDescription || !genre) {
      return NextResponse.json(
        { error: 'Missing gameDescription or genre' },
        { status: 400 }
      );
    }

    console.log('[Game Generator] Generating game:', {
      timestamp: new Date().toISOString(),
      description: gameDescription.substring(0, 100),
      genre,
    });

    // Generate game code
    const gameCode = await generateGameCode(gameDescription, genre);

    console.log('[Game Generator] Game generated successfully:', {
      timestamp: new Date().toISOString(),
      codeLength: gameCode.length,
    });

    return NextResponse.json({
      gameCode,
      success: true,
    });
  } catch (error) {
    console.error('[Game Generator] Error:', error);
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate game',
      },
      { status: 500 }
    );
  }
}
