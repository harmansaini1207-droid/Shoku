import { EmailAnalysis } from '../types';
import { SAMPLE_EMAILS } from '../data/seed';
import { cosineSimilarity, embedText } from './hashingEmbedder';

interface CorpusItem {
  id: string;
  trigger: string;
  analysis: EmailAnalysis;
}

const CORPUS_KNOWLEDGE: CorpusItem[] = [
  {
    id: 'soft-no',
    trigger: SAMPLE_EMAILS[0].text,
    analysis: {
      original: SAMPLE_EMAILS[0].text,
      literalTranslation: 'We have carefully considered this in-house in a positive manner. However, due to workshop capacity and language considerations, we deeply regret that it is premature at this stage and we would like to pass on this occasion.',
      literalTranslationJa: '社内にて前向きに検討を重ねましたが、諸般の事情により現段階では時期尚早であり、今回は見送らせていただきます。',
      trueIntent: 'This is a definitive refusal ("Soft No"). Japanese business politeness mandates saying "we considered it positively" (前向きに検討) before saying no, to preserve both parties\' social dignity and face (メンツ).',
      trueIntentJa: 'これは決定的な拒絶（ソフト・ノー）です。相手の面子を保つため「前向きに検討」という枕詞を置いていますが、現時点での受け入れ意思はゼロです。',
      tatemae: 'We spent significant executive effort reviewing your valuable proposal with great interest and warm favor.',
      tatemaeJa: '建前: 貴社のご提案を高く評価し、熱心に前向きな社内協議を重ねました。',
      honne: 'We have serious unspoken anxiety about cultural friction, workshop safety liabilities, and the immense overhead of mentoring non-Japanese speakers.',
      honneJa: '本音: 言葉の壁による現場の混乱や事故リスク、文化摩擦に対応する工数が大きすぎて引き受けられない。',
      decision: 'no',
      riskLevel: 'high',
      politenessNotes: [
        'Notice "前向きに検討" (considering positively) combined with "見送らせて" (pass on this occasion)—this is the classic Japanese business indirect refusal.',
        'Do not push back aggressively or demand reasons; doing so is considered culturally insensitive and will burn the relationship permanently.',
        'Acknowledge their decision with deep gratitude, leave the door open, and propose a lightweight digital or pilot trial for next year.'
      ],
      politenessNotesJa: [
        '「前向きに検討」と「見送らせて」の組み合わせは、日本型ビジネスにおける典型的な遠回しの断り文句です。',
        '理由を問い詰めたり再考を強要すると失礼に当たり、今後の関係が永久に絶たれます。',
        '一旦決定を受け入れ、丁寧な御礼を述べつつ、将来的な情報提供や小規模な情報交換の余地を残すのが最善です。'
      ],
      suggestedReply: `株式会社〇〇
ご担当者様

平素は格別のご高配を賜り厚く御礼申し上げます。
また、ご多忙の折、当方の提案を慎重にご検討いただき誠にありがとうございました。

今回はご意向に沿えず誠に残念ではございますが、貴工房の安全基準および受入体制を最優先とされるご判断を深く尊重いたします。

今後とも伝統工芸の振興に資する情報提供や、より受入負担の少ないデジタルアーカイブ等の支援が可能な折には、改めてご相談させていただけますと幸いです。

末筆ではございますが、貴工房の益々のご発展と皆様のご健勝を心よりお祈り申し上げます。`,
      suggestedReplyExplanation: 'Expresses humble gratitude, respects their autonomy without argument, and leaves an amicable opening for future contact.',
      producedBy: 'SHOKU Grounded Keigo Corpus Engine v1.0'
    }
  },
  {
    id: 'nemawashi-needed',
    trigger: SAMPLE_EMAILS[1].text,
    analysis: {
      original: SAMPLE_EMAILS[1].text,
      literalTranslation: 'We find this very forward-looking. However, prior informal consultation (Nemawashi) with the board and master artisans has not yet been sufficiently carried out. Please prepare a 1-page summary.',
      literalTranslationJa: '非常に先進的な取り組みですが、理事会や各工房の親方衆への事前の根回しが不足しています。まずは1枚ものの概要資料をご用意ください。',
      trueIntent: 'The project is viable, but Japanese consensus governance requires you to arm the internal champion with materials so they can lobby behind closed doors before official voting.',
      trueIntentJa: '企画自体は魅力的だが、事前の合意形成（根回し）を飛ばして公式審議に持ち込むと親方衆の反発を買うため、内々に根回しするための簡潔な武器が欲しい。',
      tatemae: 'We want to proceed with full prudence and care for all involved heritage stakeholders.',
      tatemaeJa: '建前: 関係各位の意向を尊重し、慎重かつ万全の手続きを踏みたい。',
      honne: 'Do not corner the senior masters into a formal meeting where they feel pressured. I need a clear 1-pager to persuade the influential elders over green tea first.',
      honneJa: '本音: 会議で急に諮ると否決される。有力な長老親方に事前にお茶を飲みながら説明するためのペラ1枚が必要。',
      decision: 'maybe',
      riskLevel: 'medium',
      politenessNotes: [
        'Crucial concept: "根回し" (Nemawashi / root-binding). In Japan, major decisions are never decided in the meeting room; they are decided beforehand in informal 1-on-1s.',
        'The sender is actually your internal ally attempting to protect the proposal from elder veto.',
        'Keep the requested 1-page summary visual, jargon-free, and respectful of artisan moral rights.'
      ],
      politenessNotesJa: [
        '「根回し」の要請は、相手方の担当者があなたの味方となり、内部の反対派や長老を事前に説得しようとしてくれているサインです。',
        '公式な場でのプレゼンを急がず、相手が内部で説明しやすいA4・1枚の簡潔なサマリーを迅速に提供してください。'
      ],
      suggestedReply: `伝統工芸連盟 専務理事様

平素は大変お世話になっております。
早速資料をご確認いただき、また極めて示唆に富むご助言を賜り、心より御礼申し上げます。

親方衆および理事各位のお気持ちや現場のご懸念に十分配慮すべき点、誠にその通りと深く感銘を受けております。
ご指示いただきました通り、要点をA4・1枚に集約した「非公式事前説明用サマリー（論点整理版）」を週内に作成し、お送り申し上げます。

専務様のご負担とならぬよう、親方衆への個別ご相談の進め方についても随時ご意見をいただけますと幸甚に存じます。
今後とも何卒ご指導のほどよろしくお願い申し上げます。`,
      suggestedReplyExplanation: 'Validates the importance of their consensus process and promises a targeted 1-page summary within days.',
      producedBy: 'SHOKU Grounded Keigo Corpus Engine v1.0'
    }
  }
];

export function analyzeEmail(emailText: string): EmailAnalysis {
  if (!emailText || emailText.trim().length === 0) {
    return {
      original: '',
      literalTranslation: 'No email content provided.',
      literalTranslationJa: 'メール本文が入力されていません。',
      trueIntent: 'Please paste a Japanese email to begin analysis.',
      trueIntentJa: '解析対象の日本語ビジネスメールを入力してください。',
      honne: 'N/A',
      honneJa: '該当なし',
      tatemae: 'N/A',
      tatemaeJa: '該当なし',
      decision: 'unclear',
      riskLevel: 'low',
      politenessNotes: ['Awaiting input text.'],
      politenessNotesJa: ['入力待ちです。'],
      suggestedReply: '',
      producedBy: 'SHOKU Culture Engine'
    };
  }

  const queryVector = embedText(emailText);

  // 1. Try vector similarity match against grounded corpus
  let bestItem: CorpusItem | null = null;
  let highestSim = -1;

  for (const item of CORPUS_KNOWLEDGE) {
    const itemVector = embedText(item.trigger);
    const sim = cosineSimilarity(queryVector, itemVector);
    if (sim > highestSim) {
      highestSim = sim;
      bestItem = item;
    }
  }

  // If similarity is solid (>= 0.70), return corpus analysis
  if (bestItem && highestSim >= 0.70) {
    return {
      ...bestItem.analysis,
      original: emailText
    };
  }

  // 2. Deterministic Heuristic Engine
  const text = emailText;
  const isDecline = /見送|難し|いたしかね|遠慮|お応えできず|時期尚早|今回は/u.test(text);
  const isDeferral = /前向き|社内|検討|持ち帰|追って|慎重に/u.test(text);
  const isCommitment = /ぜひ|進めさせて|合意|喜んで|賛同|内定/u.test(text);
  const hasSeniorMention = /部長|課長|上司|役員|親方|理事|組合長/u.test(text);
  const hasMeetingRequest = /打ち合わせ|お越し|面談|ご来社|お話し合い/u.test(text);

  let decision: 'no' | 'maybe' | 'yes' | 'unclear' = 'unclear';
  let riskLevel: 'low' | 'medium' | 'high' = 'medium';
  let trueIntent = '';
  let trueIntentJa = '';
  let tatemae = '';
  let tatemaeJa = '';
  let honne = '';
  let honneJa = '';

  if (isDecline) {
    decision = 'no';
    riskLevel = 'high';
    trueIntent = 'Polite refusal ("Soft No"). Japanese business etiquette rarely says a direct "no", softening the blow with apologies while the answer is firm.';
    trueIntentJa = '遠回しの辞退（ソフト・ノー）です。「難しい」「見送りたい」は実質的な最終回答であり、強引な再アプローチは禁物です。';
    tatemae = 'We considered your earnest proposal thoroughly, but internal constraints prevent us at this time.';
    tatemaeJa = '建前: 誠意をもって検討いたしましたが、諸般の事情により現段階ではお応えできません。';
    honne = 'We have unspoken anxieties about safety risks and cross-cultural communication overhead in the workshop.';
    honneJa = '本音: 工房現場での安全管理や異文化・言語の違いによる指導コストを引き受ける余裕がない。';
  } else if (isCommitment) {
    decision = 'yes';
    riskLevel = 'low';
    trueIntent = 'Explicit affirmation. The counterpart is motivated to proceed to operational execution and formal drafting.';
    trueIntentJa = '前向きな合意・推進の意向です。現場レベルで合意が形成されており、具体的な実務フェーズへ移行可能です。';
    tatemae = 'We are thrilled with the initiative and look forward to mutual prosperity.';
    tatemaeJa = '建前: ぜひ前向きに推進したく、詳細な打ち合わせを心待ちにしております。';
    honne = 'We genuinely need talented, dedicated successors to keep this craft from dying out.';
    honneJa = '本音: 後継者がおらず本当に困っており、意欲ある若手が来てくれるなら歓迎したい。';
  } else if (isDeferral) {
    decision = 'maybe';
    riskLevel = 'medium';
    trueIntent = 'Holding pattern. "Considering positively" without a concrete date usually signals internal skepticism or hesitation among key elders.';
    trueIntentJa = '保留・見極め段階。「前向きに検討」とあっても具体的日程がない場合、慎重論が優勢なケースが多いです。';
    tatemae = 'We are reviewing the matter with genuine interest inside the organization.';
    tatemaeJa = '建前: 社内にて前向きに共有・協議しております。';
    honne = 'The idea is interesting, but we are waiting to see who will take responsibility if something goes wrong.';
    honneJa = '本音: 興味はあるが、失敗した際の責任問題を警戒しており様子見している。';
  } else {
    decision = 'unclear';
    riskLevel = 'medium';
    trueIntent = 'Informational exchange; no definitive commitment or decline signaled yet.';
    trueIntentJa = '情報交換・現況確認の段階です。確定的な意向表明には至っていません。';
    tatemae = 'We acknowledge receipt and review of your correspondence.';
    tatemaeJa = '建前: ご連絡を確認いたしました。';
    honne = 'Awaiting further concrete documentation or specific procedural proposals.';
    honneJa = '本音: 具体的な条件や次の手順が提示されるのを待っている状態。';
  }

  const politenessNotes: string[] = [];
  const politenessNotesJa: string[] = [];

  if (hasSeniorMention) {
    politenessNotes.push('Mentions senior leadership/elders: Nemawashi (prior consensus) is required before pushing for contracts.');
    politenessNotesJa.push('組織幹部・長老職人の存在に言及: 正式提案の前に、キーマンへの事前相談（根回し）が成否を分けます。');
  }
  if (hasMeetingRequest) {
    politenessNotes.push('In-person consultation requested: Prepare a concise 1-page Japanese brief and 2 flexible options.');
    politenessNotesJa.push('面談・打合せの打診あり: 長大な資料は避け、A4・1枚の簡潔な論点整理と複数の選択肢を準備してください。');
  }
  politenessNotes.push('Tone calibration: Always begin with seasonal Keigo greetings and end with well-wishes for their house/enterprise.');
  politenessNotesJa.push('文面トーン: 季節の挨拶や相手方の発展を祈念する結びの定型句を欠かさないことが信頼の前提となります。');

  const suggestedReply = `ご担当者様

平素は格別のお引き立てを賜り、厚く御礼申し上げます。
ご多用のところ丁寧なご連絡を賜り、誠にありがとうございました。

いただきましたご意向を真摯に受け止め、貴工房の皆様にとって最もご負担のない形での協業を模索してまいりたく存じます。

ご示唆いただきました点につきまして、追加の補足資料が必要でございましたら、いつでも迅速にご用意申し上げます。
末筆ではございますが、皆様の益々のご清祥を心よりお祈り申し上げます。`;

  return {
    original: emailText,
    literalTranslation: 'Thank you for your thoughtful communication. We have received your message regarding ongoing considerations.',
    literalTranslationJa: 'ご連絡をいただき深謝申し上げます。ご検討の状況について承知いたしました。',
    trueIntent,
    trueIntentJa,
    tatemae,
    tatemaeJa,
    honne,
    honneJa,
    decision,
    riskLevel,
    politenessNotes,
    politenessNotesJa,
    suggestedReply,
    suggestedReplyExplanation: 'Maintains extreme deference, expresses heartfelt appreciation, and avoids any defensive friction.',
    producedBy: 'SHOKU Heuristic Keigo Engine v1.0 (Deterministic Offline)'
  };
}
