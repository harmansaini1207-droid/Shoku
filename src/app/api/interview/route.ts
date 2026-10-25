import { NextRequest, NextResponse } from 'next/server';
import {
  answerInterviewTurn,
  finalizeInterviewSession,
  getSession,
  startInterviewSession
} from '@/lib/engines/interviewEngine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
  }

  const session = getSession(sessionId);
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json({ session });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'start') {
      const { masterName, craft, category, region } = body;
      const result = startInterviewSession(
        masterName || 'Master Artisan',
        craft || 'Traditional Forged Blades',
        category || 'metalwork',
        region || 'Kyoto'
      );
      return NextResponse.json({
        sessionId: result.session.sessionId,
        session: result.session,
        nextMessage: result.nextMessage,
        progressPercent: result.session.progressPercent
      });
    }

    if (action === 'answer') {
      const { sessionId, answerText } = body;
      if (!sessionId || typeof answerText !== 'string') {
        return NextResponse.json({ error: 'sessionId and answerText required' }, { status: 400 });
      }
      const result = answerInterviewTurn(sessionId, answerText);
      return NextResponse.json({
        session: result.session,
        nextMessage: result.nextMessage,
        isDone: result.isDone,
        progressPercent: result.session.progressPercent
      });
    }

    if (action === 'finalize') {
      const { sessionId } = body;
      if (!sessionId) {
        return NextResponse.json({ error: 'sessionId required' }, { status: 400 });
      }
      const { master, manual } = finalizeInterviewSession(sessionId);
      return NextResponse.json({
        master,
        manual,
        success: true
      });
    }

    return NextResponse.json({ error: 'Unknown interview action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Interview error' }, { status: 500 });
  }
}
