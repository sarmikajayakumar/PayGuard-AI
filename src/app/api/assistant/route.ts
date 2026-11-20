import { NextRequest, NextResponse } from 'next/server';
import { generateCyberSafetyResponse } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, language = 'en', conversationHistory = [] } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt exceeds the 2,000-character safety limit.' },
        { status: 400 }
      );
    }

    const lang: 'en' | 'ta' = language === 'ta' ? 'ta' : 'en';

    const result = await generateCyberSafetyResponse(
      prompt.trim(),
      lang,
      Array.isArray(conversationHistory) ? conversationHistory : []
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/assistant:', error);
    return NextResponse.json(
      { error: 'Failed to process AI assistant request.' },
      { status: 500 }
    );
  }
}
