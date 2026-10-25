import { Technique } from '../types';

export const TECHNIQUE_LIBRARY: Record<string, Technique> = {
  // Sakai Bladesmithing
  'forge-welding-hizukuri': {
    id: 'forge-welding-hizukuri',
    name: 'Forge Welding (鍛接 - Hizukuri)',
    nameJa: '鍛接（ひづくり）',
    steps: [
      'Layer high-carbon Shirogami (white paper steel) core onto soft jigane iron backing.',
      'Heat the stacked billet slowly in the pine charcoal forge to cherry-orange (approx. 900°C).',
      'Sprinkle powdered borax and iron oxide flux into the seam to dissolve scale.',
      'Bring forge to straw-yellow welding heat (approx. 1050°C-1100°C).',
      'Rapidly hammer from center outward with graduated anvil strikes to express flux and bond molecular layers.'
    ],
    tacitCues: [
      'Listen for the "singing weld": the steel emits a distinct, sharp metallic ring under the hammer rather than a dull thud.',
      'Judge heat by the dancing color of the flux bubbles on the steel surface, not just glowing color.',
      'Feel the bounce of the hammer handle: when fused, the iron yields with a uniform elastic resistance.'
    ],
    commonMistakes: [
      'Hitting too hard on the first strike, which expels the molten flux prematurely and causes void inclusions.',
      'Allowing damp ash or charcoal debris to blow between the mating surfaces before the seam seals.',
      'Overheating the carbon steel core, which burns away carbon and makes the edge brittle.'
    ],
    qualityCheck: 'Inspect the weld seam under 10x loupe after rough grinding; zero microscopic black oxidation lines must be visible along the sandwich boundary.'
  },
  'water-quenching-yakiire': {
    id: 'water-quenching-yakiire',
    name: 'Differential Water Quenching (焼入れ - Yaki-ire)',
    nameJa: '水焼入れ（やきいれ）',
    steps: [
      'Apply custom yakiba-tsuchi (clay, charcoal powder, and crushed grindstone slurry) thicker on the spine and thinner on the edge.',
      'Allow the clay wash to dry slowly in a draft-free room for 3 hours.',
      'Heat the blade edge uniformly in total darkness until it reaches the color of the setting autumn sun (780°C).',
      'Plunge edge-first into the cedar cooling trough with a precise rhythmic rocking motion.'
    ],
    tacitCues: [
      'Master reads temperature purely in a pitch-black booth, matching the steel glow to memory rather than pyrometers.',
      'Hear the blade "gasp": a sharp, smooth boiling hiss without erratic spluttering indicates even vapor jacket release.',
      'Feel the instant the blade curves upward due to martensitic transformation before snapping straight.'
    ],
    commonMistakes: [
      'Hesitating during the plunge: even a 0.2-second delay drops edge temperature below critical austenitizing point.',
      'Uneven clay thickness along the shinogi line, leading to catastrophic blade cracking or warping.',
      'Drafts of cold air hitting one side of the forge during heating.'
    ],
    qualityCheck: 'File test with a 65 HRC tester file skittering effortlessly off the edge without biting, while spine retains spring toughness.'
  },

  // Mino Washi Papermaking
  'slurry-nagashizuki': {
    id: 'slurry-nagashizuki',
    name: 'Discharge Papermaking (流し漉き - Nagashizuki)',
    nameJa: '流し漉き（ながしずき）',
    steps: [
      'Suspend beaten mulberry (kozo) bast fibers evenly in mountain spring water.',
      'Blend in tororo-aoi (hibiscus root mucilage) to control slurry viscosity and fiber flotation.',
      'Submerge the bamboo mesh suketa mould and scoop the initial surface wave (kakemono).',
      'Rock the mould front-to-back and side-to-side (shincho) to interlock fibers in crosshatch lattice.',
      'Toss excess slurry over the far edge (sutemono) in one continuous fluid arc.'
    ],
    tacitCues: [
      'Judge mucilage viscosity by dipping fingers and feeling the resistance as droplets drip from the thumb webbing.',
      'Feel the wave resistance against your forearms: the water must slide across the mesh like oil over silk.',
      'Listen to the slurping sound of the slurry pulling through the bamboo screen; a sharp snap signals optimal fiber settlement.'
    ],
    commonMistakes: [
      'Tilting the mould unevenly during the sutemono toss, creating a thin paper corner.',
      'Using tororo-aoi mucilage that has begun to ferment in warm weather, causing fibers to clump.',
      'Hesitating between the scoop and the rocking motion, which causes grain bias.'
    ],
    qualityCheck: 'Hold dried washi against sunlight: fiber dispersion must show zero cloud clusters, and tensile strength must exceed 40N/15mm in both axes.'
  },

  // Arimatsu Shibori Indigo
  'indigo-vat-fermentation': {
    id: 'indigo-vat-fermentation',
    name: 'Natural Indigo Vat Fermentation (藍建て - Aitate)',
    nameJa: '天然藍建て（あいたて）',
    steps: [
      'Blend composted Tokushima sukumo indigo leaves with hardwood lye (wood ash water).',
      'Maintain vat temperature at steady 28°C in subterranean ceramic vats.',
      'Feed aerobic microbes daily with sake, wheat bran (fusuma), and slaked lime.',
      'Monitor indigo foam head (ai no hana) daily until iridescent purple-bronze sheen forms.'
    ],
    tacitCues: [
      'Smell the vat each morning: a healthy vat smells sweet, earthen, and mildly alcoholic, never sour or rotten.',
      'Taste a tiny drop on the tongue: a mild alkalinity with a faint savory warmth confirms balanced pH around 10.5.',
      'Observe the sheen of the surface bubbles (ai no hana): bronze-green reflection means the dye is fully reduced.'
    ],
    commonMistakes: [
      'Adding too much lime at once, shocking the microbial bacteria into dormancy.',
      'Agitating the vat too aggressively and introducing oxygen, which re-oxidizes the reduced leuco-indigo prematurely.',
      'Allowing temperature to drop below 20°C during cold winter nights.'
    ],
    qualityCheck: 'Dip a test cotton strip for 90 seconds and expose to air: it must turn from bright yellow-green to deep sea navy in under 45 seconds of oxygenation.'
  },

  // Bizen Ceramics
  'anagama-flame-painting': {
    id: 'anagama-flame-painting',
    name: 'Anagama Wood-Firing Flame Painting (窯詰め・火入れ)',
    nameJa: '窯詰め・火入れ（穴窯）',
    steps: [
      'Stack unglazed mountain clay pots strategically to channel natural draft currents.',
      'Stoke red pine split wood continuously around the clock for 10 to 14 days.',
      'Create reducing atmosphere to deposit natural wood ash directly onto the clay shoulder.',
      'Control draft damper to reach peak temperature of 1280°C where ash melts into natural glass (sangiri).'
    ],
    tacitCues: [
      'Listen to the roar in the chimney flue: a pulsating deep rumble signals optimal draft suction.',
      'Smell the chimney smoke: sweet resinous pine smell changes to pungent glass aroma as ash fuses.',
      'Judge kiln atmosphere color through spy holes without goggles: blinding white-gold with subtle violet fringe.'
    ],
    commonMistakes: [
      'Stoking wood with moisture content above 15%, causing cold draft pockets that crack vessels.',
      'Rushing the cooling phase, which fractures the glassy ash glaze (hi-iro).',
      'Improper spacing between pots blocking the ash flight path.'
    ],
    qualityCheck: 'Vessels feature rich reddish-brown scarlet scorch marks (hidasuki) and crystallized golden-green ash drops with zero unvitrified dull spots.'
  },

  // Edo Kiriko Cut Glass
  'diamond-wheel-cutting': {
    id: 'diamond-wheel-cutting',
    name: 'Edo Kiriko Precision Wheel Cutting (割出し・荒削り)',
    nameJa: '割出し・荒削り（切子細工）',
    steps: [
      'Mark radial guide coordinates (waridashi) onto the two-layer overlay colored glass casing.',
      'Apply light water coolant to the rotating diamond grinding wheel.',
      'Hold the curved vessel freehand against the spinning wheel under gentle pressure.',
      'Cut through the 0.8mm outer red/blue color casing to expose the pure clear crystal below without gouging.'
    ],
    tacitCues: [
      'Feel the micro-vibrations traveling through your fingertips: smooth buzz means pure wheel concentricity.',
      'Listen to the grinding pitch: a high crisp hum indicates clean crystal shearing; a scratchy rattle means diamond glazing.',
      'Judge depth by the refraction of shop lights bouncing off the cut groove bevel.'
    ],
    commonMistakes: [
      'Pressing with rigid arms instead of swaying from the core, causing uneven groove depth.',
      'Inconsistent wheel coolant flow, causing thermal shock micro-fractures in the lead crystal.',
      'Over-cutting the colored skin into the clear core by more than 0.2mm.'
    ],
    qualityCheck: 'Under 50x surface profile examination, groove intersections (nanako) must meet at sharp micron-precise points with zero chipped edges.'
  },

  // Kyoto Woodwork Joinery
  'blind-sashimono-joinery': {
    id: 'blind-sashimono-joinery',
    name: 'Blind Sashimono Wood Joinery (隠し蟻組み - Kakushi Ari-gumi)',
    nameJa: '隠し蟻組み（京指物）',
    steps: [
      'Select seasoned mulberry or kiri wood with harmonized growth ring curvature.',
      'Score interlocking dovetails using a micro-thin bamboo marking knife (kebiki).',
      'Chisel mating pins with single-bevel Japanese hand chisels (oire-nomi) to 0.05mm tolerance.',
      'Assemble corners using natural rice starch glue and wooden mallets with zero nails or screws.'
    ],
    tacitCues: [
      'Listen to the hand plane (kanna) shaving: it must produce a whisper-quiet unbroken ribbon transparent as onion skin.',
      'Feel the friction fit when sliding the joint together: it should grip firmly like two magnets without requiring hammer force.',
      'Smell the fresh end-grain to verify uniform moisture seasoning.'
    ],
    commonMistakes: [
      'Working against the wood grain direction, tearing fragile fiber ends at the joint shoulder.',
      'Using steel tools that have been sharpened with rounded bevels rather than razor flat mirrors.',
      'Assembling in fluctuating room humidity without allowing timber to acclimatize.'
    ],
    qualityCheck: 'Joint seam must be imperceptible to a fingernail slide, and remain rock-solid after 50 years of seasonal expansion and contraction.'
  }
};
