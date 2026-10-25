import { CraftCategory, CraftManual, InterviewSession, Master, Technique } from '../types';
import { masterRepository } from '../repository/masterRepository';
import { manualRepository } from '../repository/manualRepository';

// In-memory sessions store
const sessions = new Map<string, InterviewSession>();

export const PROBES_PER_TECHNIQUE = ['steps', 'cues', 'mistakes', 'quality'] as const;

export function startInterviewSession(
  masterName: string,
  craft: string,
  category: CraftCategory,
  region: string
): { session: InterviewSession; nextMessage: string } {
  const sessionId = `live-${Math.random().toString(16).slice(2, 10)}`;

  const session: InterviewSession = {
    sessionId,
    masterName: masterName || 'Master Craftsman',
    craft: craft || 'Traditional Japanese Craft',
    category: category || 'metalwork',
    region: region || 'Japan',
    turns: [],
    stage: 'opening',
    currentTechniqueIndex: 0,
    currentProbeIndex: 0,
    extractedTechniques: [],
    answers: {
      probes: {}
    },
    isDone: false,
    progressPercent: 10
  };

  const openingQuestion = `Welcome, Master ${session.masterName}. It is an honor to preserve your life's work in ${session.craft} from ${session.region}. To begin, please describe the raw materials, tools, or special workshop conditions essential to your craft.`;

  session.turns.push({
    role: 'interviewer',
    text: openingQuestion,
    facet: 'materials',
    timestamp: new Date().toISOString()
  });

  sessions.set(sessionId, session);

  return { session, nextMessage: openingQuestion };
}

export function answerInterviewTurn(
  sessionId: string,
  answerText: string
): { session: InterviewSession; nextMessage: string; isDone: boolean } {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Interview session not found or expired.');
  }

  // Record master's answer
  session.turns.push({
    role: 'master',
    text: answerText,
    timestamp: new Date().toISOString()
  });

  let nextMessage = '';
  let nextFacet = '';

  if (session.stage === 'opening') {
    session.answers.materials = answerText;
    session.stage = 'name_techniques';
    session.progressPercent = 25;

    nextFacet = 'techniques_list';
    nextMessage = `Thank you, Master ${session.masterName}. Understanding your materials lays the foundation. Now, please name 2 or 3 core techniques that define your mastery and that an apprentice must learn.`;
  } else if (session.stage === 'name_techniques') {
    // Extract technique names from user's answer
    const rawItems = answerText
      .split(/[,、\n;•\d.]/g)
      .map(s => s.trim())
      .filter(s => s.length > 2);

    const techniques = rawItems.length > 0 ? rawItems.slice(0, 3) : ['Primary Forming', 'Heat Calibration', 'Surface Finishing'];
    session.extractedTechniques = techniques;
    session.stage = 'technique_probes';
    session.currentTechniqueIndex = 0;
    session.currentProbeIndex = 0;
    session.progressPercent = 40;

    const firstTech = techniques[0];
    session.answers.probes[firstTech] = {};

    nextFacet = `${firstTech}_steps`;
    nextMessage = `Noted: ${techniques.join(', ')}. Let us examine "${firstTech}". What are the exact ordered physical steps you perform from start to finish?`;
  } else if (session.stage === 'technique_probes') {
    const currentTech = session.extractedTechniques[session.currentTechniqueIndex] || 'Core Technique';
    if (!session.answers.probes[currentTech]) {
      session.answers.probes[currentTech] = {};
    }

    const currentProbe = PROBES_PER_TECHNIQUE[session.currentProbeIndex];

    // Save answer for this probe
    if (currentProbe === 'steps') {
      session.answers.probes[currentTech].steps = answerText;
    } else if (currentProbe === 'cues') {
      session.answers.probes[currentTech].cues = answerText;
    } else if (currentProbe === 'mistakes') {
      session.answers.probes[currentTech].mistakes = answerText;
    } else if (currentProbe === 'quality') {
      session.answers.probes[currentTech].quality = answerText;
    }

    // Advance probe or technique
    if (session.currentProbeIndex < PROBES_PER_TECHNIQUE.length - 1) {
      session.currentProbeIndex++;
      const nextProbeType = PROBES_PER_TECHNIQUE[session.currentProbeIndex];
      const techProgressBase = 40 + (session.currentTechniqueIndex * 20);
      session.progressPercent = Math.min(85, techProgressBase + (session.currentProbeIndex * 5));

      if (nextProbeType === 'cues') {
        nextFacet = `${currentTech}_cues`;
        nextMessage = `Understood. Now for the tacit feel: When executing "${currentTech}", what do you notice through your hands, ears, or eyes that a beginner would completely miss?`;
      } else if (nextProbeType === 'mistakes') {
        nextFacet = `${currentTech}_mistakes`;
        nextMessage = `Invaluable insight. What is the single most common mistake an apprentice makes during "${currentTech}", and how does it happen?`;
      } else if (nextProbeType === 'quality') {
        nextFacet = `${currentTech}_quality`;
        nextMessage = `How do you assess when "${currentTech}" is done to true perfection? What is your personal benchmark test?`;
      }
    } else {
      // Completed all probes for this technique, move to next or heritage
      if (session.currentTechniqueIndex < session.extractedTechniques.length - 1) {
        session.currentTechniqueIndex++;
        session.currentProbeIndex = 0;
        const nextTech = session.extractedTechniques[session.currentTechniqueIndex];
        session.answers.probes[nextTech] = {};
        session.progressPercent = 75;

        nextFacet = `${nextTech}_steps`;
        nextMessage = `Masterfully explained. Now let us turn to your next core technique: "${nextTech}". What are the ordered steps for this phase?`;
      } else {
        // Move to final heritage probe
        session.stage = 'heritage';
        session.progressPercent = 90;
        nextFacet = 'heritage_philosophy';
        nextMessage = `Your technical manual is taking shape. To conclude: What is the most important cultural or spiritual principle that the next generation of apprentices must carry in their heart?`;
      }
    }
  } else if (session.stage === 'heritage') {
    session.answers.heritage = answerText;
    session.stage = 'completed';
    session.progressPercent = 100;
    session.isDone = true;

    nextFacet = 'conclusion';
    nextMessage = `Thank you, Master ${session.masterName}. Your tacit knowledge has been captured. We are now synthesizing your official Craft Manual and registering you as an active master on the platform.`;
  } else {
    session.isDone = true;
    session.progressPercent = 100;
    nextMessage = `Your interview is already complete. You may view your manual or explore talent matches.`;
  }

  session.turns.push({
    role: 'interviewer',
    text: nextMessage,
    facet: nextFacet,
    timestamp: new Date().toISOString()
  });

  return { session, nextMessage, isDone: session.isDone };
}

export function finalizeInterviewSession(sessionId: string): {
  master: Master;
  manual: CraftManual;
} {
  const session = sessions.get(sessionId);
  if (!session) {
    throw new Error('Interview session not found.');
  }

  const masterId = `m-live-${sessionId}`;

  // 1. Build Technique Objects
  const techniques: Technique[] = [];
  const techNames = session.extractedTechniques.length > 0
    ? session.extractedTechniques
    : ['Hand Forming and Tempering'];

  for (const name of techNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const data = session.answers.probes[name] || {};

    techniques.push({
      id: slug || `tech-${Math.random().toString(16).slice(2, 6)}`,
      name: name,
      nameJa: `${name}（実演暗黙知）`,
      steps: data.steps ? [data.steps] : [
        'Inspect raw material balance and ambient shop humidity.',
        'Apply disciplined bodily leverage rather than wrist force.',
        'Execute uniform strokes across the working surface.'
      ],
      tacitCues: data.cues ? [data.cues] : [
        'Feel the subtle vibrational change in the tool handle when resistance stabilizes.',
        'Listen for the clean harmonic pitch shift signaling optimal density.'
      ],
      commonMistakes: data.mistakes ? [data.mistakes] : [
        'Rushing the foundational step, causing internal stress and micro-fractures.'
      ],
      qualityCheck: data.quality || 'Fingertip surface inspection and uniform optical sheen test.'
    });
  }

  // 2. Synthesize Master Profile
  const master: Master = {
    id: masterId,
    name: session.masterName,
    nameJa: `${session.masterName} 親方`,
    craft: session.craft,
    craftJa: `${session.craft}（生体知財抽出）`,
    category: session.category,
    region: session.region,
    regionJa: session.region,
    age: 68,
    yearsExperience: 42,
    noSuccessor: true,
    annualRevenueJpy: 36000000,
    enterpriseValueJpy: 130000000,
    bio: `Live-interviewed master artisan with over 40 years devoted to ${session.craft} in ${session.region}. Seeking dedicated successor to preserve tacit bodily heritage.`,
    bioJa: `${session.region}にて40年以上の研鑽を積んだ${session.craft}の現代名工。ライブインタビューにより暗黙知を抽出・登録。後継者急募。`,
    techniques: techniques.map(t => t.id),
    languages: ['Japanese', 'English']
  };

  // 3. Synthesize Craft Manual
  const manual: CraftManual = {
    id: `manual-${masterId}`,
    masterId: master.id,
    craft: master.craft,
    generatedAt: new Date().toISOString(),
    overview: `Official heritage craft manual compiled directly from the live spoken tacit interview with Master ${master.name}. Captures hands-on cues and criteria for ${master.craft} in ${master.region}.`,
    overviewJa: `${master.nameJa}へのライブ・インタビューより直接抽出・構成された公式技術伝承マニュアル。感覚的判断や失敗回避の勘所を完全言語化。`,
    tools: [
      session.answers.materials || 'Master grade workshop hand tools',
      'Traditional raw materials & natural binders',
      'Micro-climate calibration indicators',
      'High-precision inspection benchmark gauges'
    ],
    techniques,
    heritageNotes: session.answers.heritage || `Preserving ${master.craft} as a living, revenue-generating lineage. Knowledge held in trust for bilateral Indo-Japanese craft apprenticeships.`,
    heritageNotesJa: session.answers.heritage || `日印技術継承パイプラインにおいて師匠の著作者人格権を保護し、技の永続的継承を保証する。`,
    producedBy: 'SHOKU Live Interview Tacit Synthesizer v1.0 (Offline-First)'
  };

  // 4. Register master and manual in repositories
  masterRepository.saveMaster(master);
  manualRepository.saveManual(manual);

  session.isDone = true;

  return { master, manual };
}

export function getSession(sessionId: string): InterviewSession | undefined {
  return sessions.get(sessionId);
}
