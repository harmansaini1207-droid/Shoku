import { CraftManual, Master, Technique } from '../types';
import { TECHNIQUE_LIBRARY } from '../data/techniques';

export function generateCraftManual(master: Master): CraftManual {
  const techniques: Technique[] = [];
  const tools: string[] = [];

  // 1. Gather or synthesize techniques
  for (const techKey of master.techniques) {
    if (TECHNIQUE_LIBRARY[techKey]) {
      techniques.push(TECHNIQUE_LIBRARY[techKey]);
    } else {
      // Dynamic fallback for custom or unlisted techniques
      const readableName = techKey
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      techniques.push({
        id: techKey,
        name: readableName,
        nameJa: `${master.craft} 中核技法`,
        steps: [
          `Prepare raw materials and inspect physical consistency according to traditional ${master.region} standards.`,
          `Calibrate shop environment (humidity, light, and ambient temperature) for optimal material response.`,
          `Execute foundational shaping and forming with calibrated hand tools, monitoring resistance continuously.`,
          `Perform primary finishing pass, checking alignment against master benchmark templates.`,
          `Final curing or settling phase under controlled cooling or drying conditions.`
        ],
        tacitCues: [
          'Tactile resistance: Feel the feedback through the hand tools; uniform tension indicates optimal material density.',
          'Acoustic resonance: Listen for clean, high-frequency harmonics when contacting the workpiece, avoiding dull thuds.',
          'Visual judgment: Observe subtle color temperature and surface sheen changes under indirect workshop lighting.'
        ],
        commonMistakes: [
          'Rushing the initial material preparation, leading to internal stresses and latent structural failure.',
          'Applying excessive hand pressure instead of relying on tool balance and bodily momentum.',
          'Ignoring subtle atmospheric humidity shifts during key transformation phases.'
        ],
        qualityCheck: 'Zero visible or microscopic surface inclusions, verified by tactile fingertip sweep and light reflection indexing.'
      });
    }
  }

  // 2. Derive tools based on category
  switch (master.category) {
    case 'metalwork':
      tools.push(
        'Pine charcoal hearth forge',
        'Hand-forged anvils & swage blocks',
        'High-carbon spring steel hammers (kanazuchi)',
        'Graduated natural water quench troughs',
        'Kyoto natural water whetstones (3000 to 8000 grit)'
      );
      break;
    case 'paper':
      tools.push(
        'Bamboo suketa papermaking mould & deckle screen',
        'Tororo-aoi root mucilage filtration press',
        'Cedar pulp suspension vat (kibune)',
        'Stainless steam-heated drying boards',
        'Hydraulic lever press'
      );
      break;
    case 'textiles':
      tools.push(
        'Subterranean ceramic fermentation vats',
        'Natural hardwood ash lye boiling cauldrons',
        'Hand-turned wooden binding spindles (kasa-shibori)',
        'Cotton bast binding threads',
        'Cedar stirring paddles'
      );
      break;
    case 'ceramics':
      tools.push(
        'Anagama semi-subterranean single-chamber wood kiln',
        'Seasoned split red pine firewood (moisture < 12%)',
        'Manual kick wheel with counterweighted wooden flywheel',
        'Bamboo trimming loops & boxwood ribs',
        'Seer cones for visual draft temperature assessment'
      );
      break;
    case 'woodwork':
      tools.push(
        'Hand-forged Japanese smoothing planes (kanna)',
        'White paper steel hand chisels (oire-nomi)',
        'Bamboo marking gauge (kebiki)',
        'Single-edge pull saws (dozuki & ryoba)',
        'Natural fermented rice starch adhesive'
      );
      break;
    default:
      tools.push(
        'Master-calibrated hand tools',
        'Traditional raw material batches',
        'Climate-monitored curing chamber',
        'Precision optical inspection loupes'
      );
  }

  const overview = `This structured manual formalizes the tacit, sensory-driven master method of ${master.name} (${master.nameJa}), representing ${master.yearsExperience} years of dedicated practice in ${master.craft} within ${master.region}. It captures the unwritten tactile cues, acoustic markers, and micro-decisions necessary to train apprentice talent without loss of heritage fidelity.`;
  const overviewJa = `本マニュアルは、${master.regionJa}にて${master.yearsExperience}年にわたり${master.craftJa || master.craft}の技を極めた${master.nameJa}（${master.name}）の身体知（暗黙知）を体系化した公式技術伝承書です。言語化が極めて困難であった音・感触・温度の見極めをカリキュラム化し、次世代技術者への確実な知財継承を実現します。`;

  const heritageNotes = `Originated in ${master.region}, this lineage carries profound cultural and economic heritage. The absence of a formal successor risks the total extinction of regional supply chains and multi-generational manufacturing ecosystems. By codifying these techniques into licensed, teachable modules, we preserve both the moral rights of the master and the living continuity of the craft.`;
  const heritageNotesJa = `${master.regionJa}に根差す本技法は、数百年の歴史を有する地域の無形文化遺産です。現在、後継者不在により技術断絶の瀬戸際に立たされています。本プラットフォームでの知財マニュアル化により、師匠の著作者人格権を厳格に保護しつつ、持続可能なライセンス型継承パイプラインを確立します。`;

  return {
    id: `manual-${master.id}-${Date.now()}`,
    masterId: master.id,
    craft: master.craft,
    generatedAt: new Date().toISOString(),
    overview,
    overviewJa,
    tools,
    techniques,
    heritageNotes,
    heritageNotesJa,
    producedBy: 'SHOKU Tacit Manual Synthesizer v1.0 (Open-Source Deterministic Engine)'
  };
}
