import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SEED_MASTERS } from '@/lib/data/seed';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mtaduagclxirfhvjnrzo.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_CGUpc5vRZawcTL1PduTiMw_RbBDWdQr';

const supabase = createClient(supabaseUrl, supabaseKey);

// In-memory fallback in case table hasn't been created yet in SQL editor
const fallbackStore = new Map<string, any[]>();

const DEFAULT_MASTER_REPLIES: Record<string, string[]> = {
  'm-sakai-keisuke': [
    '初めまして。堺打刃物の500年の火床を預かる堺圭介です。鍛冶仕事は言葉ではなく、槌の反発と鋼の音で覚える世界です。あなたのこれまでの金工・鍛造のご経験について、差し支えなければ詳しく教えていただけますか。',
    '熱意を拝見しました。当工房の火床は朝6時からの炭起こしから始まります。言葉の不自由があっても、道具への敬意と忍耐があれば身体知は必ず伝わります。一度オンライン面談でお話ししましょう。',
  ],
  'm-mino-chiyo': [
    '美濃和紙の千代です。清流の冷たい水に素手を浸し、楮の繊維を均一に絡める作業は、最初の数年は指先の感覚を磨くことだけに費やします。この静かな修練に向き合う覚悟をお持ちでしょうか。',
  ],
  'm-arimatsu-hiroshi': [
    '有松鳴海絞りの浩です。木綿の布を数千回手作業で括る仕事は、指先の持久力と規則正しいリズムが命です。当工房の伝承プログラムに興味を持っていただき光栄です。',
  ],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const masterId = searchParams.get('masterId') || 'm-sakai-keisuke';
  const email = searchParams.get('email') || 'candidate@shoku.org';

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('master_id', masterId)
      .order('created_at', { ascending: true });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ messages: data });
    }
  } catch (err) {
    // Supabase query error (e.g. table not created yet)
  }

  // Return fallback messages if Supabase table is empty or pending SQL execution
  const key = `${masterId}-${email}`;
  if (!fallbackStore.has(key)) {
    const master = SEED_MASTERS.find((m) => m.id === masterId) || SEED_MASTERS[0];
    const initialGreeting =
      DEFAULT_MASTER_REPLIES[masterId]?.[0] ||
      `初めまして、${master.name}です。${master.craft}の工房に関心をお寄せいただき心より感謝申し上げます。どのような修行をお考えでしょうか。`;

    fallbackStore.set(key, [
      {
        id: 'msg-seed-1',
        master_id: masterId,
        sender_email: 'master',
        sender_role: 'master',
        text: initialGreeting,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        literal_translation: `Greetings. I am ${master.name}. Thank you deeply for your interest in our ${master.craft} atelier. What kind of apprenticeship or training are you considering?`,
        cultural_intent:
          'This is a welcoming yet dignified opening from a traditional living master. In Japanese artisan culture, greeting warmly while promptly inquiring about the candidate\'s specific intentions tests whether the applicant has genuine dedication or merely casual curiosity.',
      },
    ]);
  }

  return NextResponse.json({ messages: fallbackStore.get(key) || [] });
}

export async function POST(req: NextRequest) {
  try {
    const { masterId, email, text, role, updateId, literal, intent } = await req.json();

    // If updating translation cache
    if (updateId && (literal || intent)) {
      try {
        await supabase
          .from('messages')
          .update({
            literal_translation: literal,
            cultural_intent: intent,
          })
          .eq('id', updateId);
      } catch {
        // ignore
      }

      // Also update in-memory
      const key = `${masterId}-${email}`;
      const list = fallbackStore.get(key) || [];
      const item = list.find((m) => m.id === updateId);
      if (item) {
        if (literal) item.literal_translation = literal;
        if (intent) item.cultural_intent = intent;
      }
      return NextResponse.json({ success: true });
    }

    if (!text || !masterId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const newMessage = {
      master_id: masterId,
      sender_email: email || 'candidate@shoku.org',
      sender_role: role || 'candidate',
      text: text,
      created_at: new Date().toISOString(),
      literal_translation: null,
      cultural_intent: null,
    };

    let inserted = null;

    try {
      const { data, error } = await supabase.from('messages').insert([newMessage]).select();
      if (!error && data && data[0]) {
        inserted = data[0];
      }
    } catch {
      // Supabase table not created yet
    }

    if (!inserted) {
      inserted = {
        ...newMessage,
        id: `msg-${Date.now()}`,
      };
      const key = `${masterId}-${email}`;
      const list = fallbackStore.get(key) || [];
      list.push(inserted);
      fallbackStore.set(key, list);
    }

    // Auto-generate master's craft response if candidate sent message
    if (role === 'candidate') {
      const replies = DEFAULT_MASTER_REPLIES[masterId] || [
        'ご丁寧な志望動機を拝読いたしました。当工房の親方衆と共有し、前向きに日程を調整させていただきます。',
      ];
      const replyText = replies[1] || replies[0];

      setTimeout(async () => {
        const masterMsg = {
          master_id: masterId,
          sender_email: 'master',
          sender_role: 'master',
          text: replyText,
          created_at: new Date().toISOString(),
          literal_translation: null,
          cultural_intent: null,
        };
        try {
          await supabase.from('messages').insert([masterMsg]);
        } catch {
          // ignore
        }
        const key = `${masterId}-${email}`;
        const list = fallbackStore.get(key) || [];
        list.push({ ...masterMsg, id: `msg-${Date.now()}` });
      }, 1000);
    }

    return NextResponse.json({ message: inserted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send' }, { status: 500 });
  }
}
