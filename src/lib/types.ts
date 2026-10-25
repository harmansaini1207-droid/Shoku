export type CraftCategory =
  | 'metalwork'
  | 'textiles'
  | 'paper'
  | 'food'
  | 'woodwork'
  | 'ceramics';

export type JapaneseLevel = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'none';

export type EngagementMode =
  | 'remote-apprentice'
  | 'ssw-relocation'
  | 'license-franchise';

export interface Master {
  id: string;
  name: string;
  nameJa: string;
  craft: string;
  craftJa?: string;
  category: CraftCategory;
  region: string;
  regionJa: string;
  age: number;
  yearsExperience: number;
  noSuccessor: boolean;
  annualRevenueJpy: number;
  enterpriseValueJpy: number;
  bio: string;
  bioJa?: string;
  techniques: string[];
  languages: string[];
  imageUrl?: string;
  craftExplanation?: string;
  audioDossierUrl?: string;
}

export interface Candidate {
  id: string;
  name: string;
  region: string;
  age: number;
  skills: string[];
  interests: string[];
  languages: string[];
  yearsExperience: number;
  japaneseLevel: JapaneseLevel;
  sswEligible: boolean;
  modes: EngagementMode[];
  bio?: string;
  avatarUrl?: string;
}

export interface Technique {
  id: string;
  name: string;
  nameJa?: string;
  steps: string[];
  tacitCues: string[];
  commonMistakes: string[];
  qualityCheck: string;
}

export interface CraftManual {
  id: string;
  masterId: string;
  craft: string;
  generatedAt: string;
  overview: string;
  overviewJa?: string;
  tools: string[];
  techniques: Technique[];
  heritageNotes: string;
  heritageNotesJa?: string;
  producedBy: string;
}

export interface MatchBreakdown {
  skill: number;
  language: number;
  visa: number;
  temperament: number;
}

export interface MatchResult {
  masterId: string;
  candidateId: string;
  candidate: Candidate;
  score: number;
  mode: EngagementMode;
  breakdown: MatchBreakdown;
  reasons: string[];
  reasonsJa?: string[];
  fitExplanation?: string;
}

export interface EmailAnalysis {
  original: string;
  literalTranslation: string;
  literalTranslationJa?: string;
  trueIntent: string;
  trueIntentJa?: string;
  honne: string;
  honneJa?: string;
  tatemae: string;
  tatemaeJa?: string;
  decision: 'no' | 'maybe' | 'yes' | 'unclear';
  riskLevel: 'low' | 'medium' | 'high';
  politenessNotes: string[];
  politenessNotesJa?: string[];
  suggestedReply: string;
  suggestedReplyExplanation?: string;
  producedBy: string;
}

export type InterviewRole = 'interviewer' | 'master';

export interface InterviewTurn {
  role: InterviewRole;
  text: string;
  facet?: string;
  timestamp?: string;
}

export interface InterviewSession {
  sessionId: string;
  masterName: string;
  craft: string;
  category: CraftCategory;
  region: string;
  turns: InterviewTurn[];
  stage:
    | 'opening'
    | 'materials'
    | 'name_techniques'
    | 'technique_probes'
    | 'heritage'
    | 'completed';
  currentTechniqueIndex: number;
  currentProbeIndex: number;
  extractedTechniques: string[];
  answers: {
    materials?: string;
    techniquesList?: string[];
    probes: Record<string, { steps?: string; cues?: string; mistakes?: string; quality?: string }>;
    heritage?: string;
  };
  isDone: boolean;
  progressPercent: number;
}

export interface DashboardStats {
  mastersAtRisk: number;
  totalMasters: number;
  craftsCaptured: number;
  candidatesReady: number;
  strongMatches: number;
  enterpriseValueAtRiskJpy: number;
  annualRevenueAtRiskJpy: number;
  flywheel: {
    mastersOnboarded: number;
    craftsCaptured: number;
    talentMatched: number;
    contentReachEstimated: string;
  };
}
