import { NextRequest, NextResponse } from 'next/server';
import { analyzeMessageRisk } from '@/lib/riskEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, source = 'scanner' } = body;

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Please provide a valid text string to analyze.' },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: 'Input text exceeds the 5,000-character safety limit.' },
        { status: 400 }
      );
    }

    // Perform deterministic analysis
    const result = analyzeMessageRisk(text, source);

    // If Gemini API key exists, optionally enrich explanation without overwriting deterministic score
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (apiKey && result.level !== 'low') {
      try {
        const aiPrompt = `In 2 short sentences, explain why this message sent to an Indian UPI user is risky, without repeating the raw text: "${text.slice(0, 300)}"`;
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: aiPrompt }] }],
              generationConfig: { maxOutputTokens: 100 },
            }),
          }
        );
        if (res.ok) {
          const aiData = await res.json();
          result.aiExplanation = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        }
      } catch (aiErr) {
        // Fallback silently if AI enhancement fails; preserve deterministic results
        console.warn('AI explanation enrichment skipped:', aiErr);
      }
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/analyze-message:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while analyzing the message. Please try again.' },
      { status: 500 }
    );
  }
}
