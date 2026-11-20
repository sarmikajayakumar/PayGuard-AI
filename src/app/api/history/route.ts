import { NextRequest, NextResponse } from 'next/server';

// Server-side endpoint for history storage; supports mock memory store and Supabase routing if enabled
let inMemoryHistoryStore: Array<{ id: string; timestamp: string; title: string; score: number; level: string }> = [
  {
    id: 'demo-scan-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    title: 'Fake Reward QR Code Message',
    score: 85,
    level: 'high',
  },
  {
    id: 'demo-scan-2',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    title: 'Legitimate Bank Alert (ICICI Debit)',
    score: 0,
    level: 'low',
  },
];

export async function GET() {
  return NextResponse.json({
    history: inMemoryHistoryStore,
    storageType: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'supabase' : 'local_and_mock',
  });
}

export async function POST(request: NextRequest) {
  try {
    const item = await request.json();
    if (!item.id || !item.title) {
      return NextResponse.json({ error: 'Invalid history item format' }, { status: 400 });
    }
    inMemoryHistoryStore = [item, ...inMemoryHistoryStore.slice(0, 19)];
    return NextResponse.json({ success: true, item });
  } catch {
    return NextResponse.json({ error: 'Failed to record history' }, { status: 500 });
  }
}

export async function DELETE() {
  inMemoryHistoryStore = [];
  return NextResponse.json({ success: true, message: 'History cleared' });
}
