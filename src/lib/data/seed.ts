import { Master, Candidate } from '../types';

export const SEED_MASTERS: Master[] = [
  {
    id: 'm-sakai-keisuke',
    name: 'Keisuke Sakai',
    nameJa: '堺 圭介',
    craft: 'Sakai Forged Cutlery & Bladesmithing (堺打刃物)',
    craftJa: '堺打刃物（伝統鍛造刃物）',
    category: 'metalwork',
    region: 'Sakai, Osaka',
    regionJa: '大阪府堺市',
    age: 74,
    yearsExperience: 52,
    noSuccessor: true,
    annualRevenueJpy: 48000000,
    enterpriseValueJpy: 180000000,
    bio: 'Fourth-generation traditional bladesmith specializing in single-bevel Yanagiba and Deba knives forged from Shirogami steel with soft iron backing.',
    bioJa: '白紙鋼と軟鉄を用いた片刃和包丁（柳刃・出刃）の伝統鍛造を極めた四代目鍛冶職人。現在弟子がおらず、50年以上の暗黙知消失の危機に瀕している。',
    techniques: [
      'forge-welding-hizukuri',
      'water-quenching-yakiire'
    ],
    languages: ['Japanese']
  },
  {
    id: 'm-mino-chiyo',
    name: 'Chiyo Mino',
    nameJa: '美濃 千代',
    craft: 'Hon-Minoshi Authentic Washi Papermaking (美濃和紙)',
    craftJa: '本美濃紙（手漉き和紙）',
    category: 'paper',
    region: 'Mino, Gifu',
    regionJa: '岐阜県美濃市',
    age: 78,
    yearsExperience: 56,
    noSuccessor: true,
    annualRevenueJpy: 22000000,
    enterpriseValueJpy: 95000000,
    bio: 'National Living Heritage paper artisan preserving the exact mucilage slurry formulation and bamboo screen wave technique for UNESCO-inscribed Hon-Minoshi.',
    bioJa: 'ユネスコ無形文化遺産「本美濃紙」の伝統流し漉きと粘剤調合を継承する最高峰の和紙職人。気候や湿度に応じた微妙な手の感覚が伝承されず後継者不在。',
    techniques: [
      'slurry-nagashizuki'
    ],
    languages: ['Japanese']
  },
  {
    id: 'm-arimatsu-hiroshi',
    name: 'Hiroshi Arimatsu',
    nameJa: '有松 寛',
    craft: 'Arimatsu-Narumi Shibori Tie-Dyeing & Indigo (有松絞り)',
    craftJa: '有松・鳴海絞り・天然藍染',
    category: 'textiles',
    region: 'Nagoya, Aichi',
    regionJa: '愛知県名古屋市緑区有松',
    age: 71,
    yearsExperience: 48,
    noSuccessor: true,
    annualRevenueJpy: 35000000,
    enterpriseValueJpy: 140000000,
    bio: 'Specialist in natural indigo vat fermentation and micro-spider tie resist techniques that require judging microbial bacteria state by sheen and scent alone.',
    bioJa: '有松絞りの難関技法「蜘蛛絞り」と天然発酵建ての藍染めを担う長老。液面の泡（藍の華）の光沢と匂いで状態を見抜く勘所は未だ文書化されていない。',
    techniques: [
      'indigo-vat-fermentation'
    ],
    languages: ['Japanese']
  },
  {
    id: 'm-bizen-kenji',
    name: 'Kenji Bizen',
    nameJa: '備前 健二',
    craft: 'Bizen Ware Unfired Anagama Stoneware (備前焼)',
    craftJa: '備前焼（無釉登り窯・穴窯）',
    category: 'ceramics',
    region: 'Bizen, Okayama',
    regionJa: '岡山県備前市伊部',
    age: 69,
    yearsExperience: 44,
    noSuccessor: true,
    annualRevenueJpy: 28000000,
    enterpriseValueJpy: 110000000,
    bio: 'Renowned for 14-day continuous pine wood firing without glazes, producing natural scarlet markings and vitrified ash patterns through draft micro-tuning.',
    bioJa: '釉薬を一切使わず、14日間の赤松連続焼成による灰被りと火襷（ひだすき）を生み出す備前焼の名匠。薪のくべ方や窯の吸気音による温度管理を極める。',
    techniques: [
      'anagama-flame-painting'
    ],
    languages: ['Japanese']
  },
  {
    id: 'm-edo-takashi',
    name: 'Takashi Edo',
    nameJa: '江戸 隆',
    craft: 'Edo Kiriko Hand-Cut Crystal Glass (江戸切子)',
    craftJa: '伝統工芸 江戸切子',
    category: 'metalwork',
    region: 'Koto-ku, Tokyo',
    regionJa: '東京都江東区',
    age: 76,
    yearsExperience: 50,
    noSuccessor: true,
    annualRevenueJpy: 42000000,
    enterpriseValueJpy: 160000000,
    bio: 'Master of high-refraction nanako and fish-egg geometric diamond cutting on double-cased overlay crystal with zero optical distortion.',
    bioJa: '色被せクリスタルガラスに極小の魚子紋様をフリーハンドで削り込む江戸切子工芸士。削り機の振動と音のピッチから削り深さを0.05mm単位で見極める。',
    techniques: [
      'diamond-wheel-cutting'
    ],
    languages: ['Japanese']
  },
  {
    id: 'm-kyoto-nobuo',
    name: 'Nobuo Kyoto',
    nameJa: '京都 信男',
    craft: 'Kyoto Sashimono Traditional Joinery (京指物)',
    craftJa: '京指物（伝統木工芸・隠し組手）',
    category: 'woodwork',
    region: 'Kyoto, Kyoto',
    regionJa: '京都府京都市',
    age: 73,
    yearsExperience: 51,
    noSuccessor: true,
    annualRevenueJpy: 31000000,
    enterpriseValueJpy: 125000000,
    bio: 'Creator of heirloom tea ceremony furniture assembled purely with concealed sliding dovetails and micron-planed mulberry wood, with zero nails or screws.',
    bioJa: '釘を一本も使わずに数百年狂わない茶道具・家具を生み出す京指物の巨匠。鉋刃の研ぎ角と木目の呼吸を読む技を体得しているが後継者が途絶えている。',
    techniques: [
      'blind-sashimono-joinery'
    ],
    languages: ['Japanese']
  }
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'c-aarav-sharma',
    name: 'Aarav Sharma',
    region: 'Pune, Maharashtra',
    age: 26,
    skills: [
      'forge welding',
      'heat treatment',
      'steel tempering',
      'edge geometry',
      'metallurgy',
      'high-carbon steel',
      'precision grinding'
    ],
    interests: [
      'traditional Japanese blades',
      'grain boundary thermodynamics',
      'artisan blacksmithing',
      'tool steel research'
    ],
    languages: ['English', 'Hindi', 'Japanese (JLPT N3)'],
    yearsExperience: 4.5,
    japaneseLevel: 'N3',
    sswEligible: true,
    modes: ['ssw-relocation', 'remote-apprentice'],
    bio: 'Metallurgical engineering graduate with 4 years running custom forge operations in Pune. Passionate about carbon migration in laminated steel and single-bevel cutlery geometry.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'c-priya-sundaram',
    name: 'Priya Sundaram',
    region: 'Ahmedabad, Gujarat',
    age: 27,
    skills: [
      'indigo fermentation',
      'vat chemistry',
      'resist binding',
      'textile tension',
      'natural fiber scouring',
      'shibori folding',
      'organic dye reduction'
    ],
    interests: [
      'sustainable botanical dyeing',
      'living microbial dye vats',
      'Arimatsu heritage textile licensing',
      'zero-effluent fashion'
    ],
    languages: ['English', 'Tamil', 'Hindi', 'Japanese (JLPT N4)'],
    yearsExperience: 5.0,
    japaneseLevel: 'N4',
    sswEligible: true,
    modes: ['ssw-relocation', 'license-franchise'],
    bio: 'Textile chemistry specialist trained in Gujarat heritage tie-resist techniques. Actively runs an artisanal botanical indigo studio and studies aerobic microbial fermentation dynamics.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'c-rohan-verma',
    name: 'Rohan Verma',
    region: 'Bengaluru / Khurja',
    age: 29,
    skills: [
      'anagama wood firing',
      'clay shrinkage',
      'natural ash glaze',
      'thermal shock resistance',
      'kiln atmosphere control',
      'stoneware throwing',
      'flue draft engineering'
    ],
    interests: [
      'wood-fired kiln thermodynamics',
      'unglazed Japanese pottery',
      'Bizen ash crystallization',
      'high-temperature ceramics'
    ],
    languages: ['English', 'Hindi', 'Japanese (JLPT N2)'],
    yearsExperience: 6.0,
    japaneseLevel: 'N2',
    sswEligible: true,
    modes: ['remote-apprentice', 'ssw-relocation'],
    bio: 'Materials science engineer and second-generation ceramicist. High fluency in Japanese (N2) with hands-on multi-day wood kiln stoking experience.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'c-ananya-deshmukh',
    name: 'Ananya Deshmukh',
    region: 'Jaipur, Rajasthan',
    age: 25,
    skills: [
      'kozo fiber preparation',
      'slurry consistency',
      'mucilage timing',
      'sheet formation',
      'hydraulic pressing',
      'botanical cellulose',
      'mesh deckle balance'
    ],
    interests: [
      'archival paper preservation',
      'Washi conservation science',
      'Mino papermaking technique transfer',
      'luxury stationery licensing'
    ],
    languages: ['English', 'Marathi', 'Hindi', 'Japanese (JLPT N3)'],
    yearsExperience: 3.5,
    japaneseLevel: 'N3',
    sswEligible: true,
    modes: ['license-franchise', 'remote-apprentice'],
    bio: 'Heritage paper artisan from Jaipur with an academic background in cellulose chemistry. Aims to establish a licensed Mino washi conservation workshop in India.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'c-vikram-patel',
    name: 'Vikram Patel',
    region: 'Firozabad / Mumbai',
    age: 28,
    skills: [
      'wheel cutting',
      'diamond wheel polish',
      'geometric indexing',
      'refraction inspection',
      'glass annealing',
      'micron surface tolerance',
      'freehand lathe work'
    ],
    interests: [
      'precision crystal engraving',
      'Edo Kiriko geometric geometry',
      'optical glass cutting',
      'ultra-fine craftsmanship'
    ],
    languages: ['English', 'Gujarati', 'Hindi', 'Japanese (JLPT N4)'],
    yearsExperience: 5.5,
    japaneseLevel: 'N4',
    sswEligible: true,
    modes: ['ssw-relocation'],
    bio: 'Master glass cutter from Firozabad glassware tradition with specialized training in high-index crystal wheel carving and optical distortion elimination.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'c-devendra-joshi',
    name: 'Devendra Joshi',
    region: 'Mysore, Karnataka',
    age: 30,
    skills: [
      'blind mortise and tenon',
      'hand plane tuning',
      'wood grain orientation',
      'chisel sharpening',
      'friction fit assembly',
      'seasoning analysis',
      'zero-hardware cabinetry'
    ],
    interests: [
      'Kyoto Sashimono joinery',
      'natural lacquer finishing',
      'sacred architecture timberwork',
      'heirloom furniture preservation'
    ],
    languages: ['English', 'Kannada', 'Hindi', 'Japanese (JLPT N5)'],
    yearsExperience: 7.0,
    japaneseLevel: 'N5',
    sswEligible: false,
    modes: ['remote-apprentice', 'license-franchise'],
    bio: 'Senior traditional woodworker with 7 years crafting complex structural timber joinery. Experienced in hand-sharpened Japanese kanna planes and fine timber tolerances.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
  }
];

export const SAMPLE_EMAILS = [
  {
    id: 'soft-no',
    label: 'Polite Deferral (Soft No)',
    labelJa: '前向き検討（実質的な見送り）',
    sender: 'Sakai Craft Association (堺刃物振興会 事務局長)',
    subject: 'インド人技術者受け入れの件について (Regarding Indian Artisan Apprentice Intake)',
    text: `いつも大変お世話になっております。
先日は有意義なご提案をいただき、誠にありがとうございました。

いただきましたインド若手技術者受け入れおよび技術ライセンスの件につきましては、当組合および各工房親方衆にて前向きに社内検討を重ねてまいりました。

しかしながら、現下の工房の受入体制や工房内の安全管理基準、ならびに言葉の壁等の諸般の事情を鑑みますと、誠に遺憾ながら現段階での受け入れは時期尚早であり、誠に心苦しい限りですが、今回は見送らせていただきたく存じます。

せっかくのご厚意にお応えできず誠に恐縮ではございますが、何卒ご理解のほどよろしくお願い申し上げます。
末筆ではございますが、貴社の今後のご発展を心よりお祈り申し上げます。`
  },
  {
    id: 'nemawashi-needed',
    label: 'Consensus Building Needed (Nemawashi)',
    labelJa: '根回し・合意形成中（部長・親方衆への相談要）',
    sender: 'Kyoto Traditional Craft Federation (京都伝統工芸連盟 専務理事)',
    subject: '海外技術移転プロジェクトに関するご相談について',
    text: `平素は格別のご高配を賜り厚く御礼申し上げます。
ご送付いただきました資料を拝見いたしました。

本件につきましては、非常に先進的な取り組みであると受け止めておりますが、当連盟の理事会および各産地の重鎮（親方衆）への事前のご相談（根回し）がまだ十分に行き届いていない状況にございます。

特に伝統工芸の無形知財の取り扱いにつきましては、組合幹部や顧問弁護士との慎重な擦り合わせを要します。
つきましては、まずは非公式にて1枚ものの概要資料をご用意いただき、専務および関係役員への個別ヒアリングを進めさせていただけますと幸甚に存じます。

お手数をおかけいたしますが、よろしくお願い申し上げます。`
  },
  {
    id: 'meeting-renegotiate',
    label: 'Meeting & Option Revision (Maybe)',
    labelJa: '条件調整・選択肢提示要請（条件付き協議）',
    sender: 'Mino Washi Artisans Cooperative (美濃和紙協同組合 理事)',
    subject: '技術継承マニュアル化およびライセンス提携の件',
    text: `お世話になっております。美濃和紙の山田でございます。
先日は丁寧なご説明をいただき、感謝申し上げます。

職人側の懸念として、「長年の勘所が第三者に流出することへの不安」が依然として強く残っております。
もし可能であれば、全工程を一挙に開示するのではなく、初期段階では基礎的な原料調合に限定したフェーズ分け案や、親方への定期的な監修料支払いの仕組み等、別のご提案オプションをいただけないでしょうか。

来週木曜日の午後、当組合事務所にお越しいただき、親方を交えて直接お話し合いの場を持たせていただければと存じます。
ご検討のほど、よろしくお願いいたします。`
  },
  {
    id: 'strong-yes',
    label: 'Definitive Agreement (Yes)',
    labelJa: '前向きな合意・推進（正式協議への移行）',
    sender: 'Aichi Shibori Heritage Guild (有松鳴海絞り保存会 会長)',
    subject: '有松絞り技術継承プロジェクト正式合意に向けて',
    text: `いつも温かいご支援をいただき、心より感謝申し上げます。
昨日開催いたしました臨時総会におきまして、貴社よりご提案の「インド若手デザイナーとの技術継承提携」について正式に審議を行いました。

結果として、後継者不在の危機にある工房から「このまま技が途絶えるよりは、志ある若者に託したい」との強い賛同が得られ、ぜひ本件を具体的に進めさせていただきたく存じます。

来月より、まずはパイロット工房として2軒の親方へのインタビューおよびデジタル記録を開始したく存じます。
詳細な契約書案およびスケジュールにつきまして、近日中に打ち合わせを設定いただけますでしょうか。
引き続きどうぞよろしくお願い申し上げます。`
  }
];
