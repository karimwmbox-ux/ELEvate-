import { CampaignPost, Ingredient, BrandAmbassador } from "./types";

export const STAGES = [
  {
    name: "Univers & Storytelling",
    days: "Jours 1 à 5",
    description: "Poser les bases du mythe de la marque, présenter l'atelier de création, l'obsession du détail et le créateur d'ELEVATE.",
    textColor: "text-amber-400",
    borderColor: "border-amber-400/30",
    bgColor: "bg-amber-400/5",
  },
  {
    name: "Produit & Différenciation",
    days: "Jours 6 à 10",
    description: "Mettre en lumière la signature olfactive, les matières ultra-premières récoltées sans compromis et le flaconnage géométrique inspiré des cimes.",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-400/30",
    bgColor: "bg-emerald-400/5",
  },
  {
    name: "Désir & Positionnement Premium",
    days: "Jours 11 à 15",
    description: "Créer un désir d'appropriation irrésistible en introduisant le rituel du matin, l'unboxing somptueux et l'affirmation d'un charisme infini.",
    textColor: "text-purple-400",
    borderColor: "border-purple-400/30",
    bgColor: "bg-purple-400/5",
  }
];

export const CAMPAIGN_POSTS: CampaignPost[] = [
  {
    id: 1,
    day: 1,
    title: "Révélation de la marque",
    stage: "Univers & Storytelling",
    stageNotes: "Marquer les esprits par une entrée théâtrale. Présenter le flacon comme une œuvre de musée sur un piédestal de marbre noir.",
    prompt: "Ultra luxury perfume brand launch campaign, ELEVATE perfume bottle standing on black marble pedestal, cinematic lighting, luxury fragrance advertisement, golden reflections, premium branding, high-end fashion magazine style, Dior Sauvage and Tom Ford campaign quality, shallow depth of field, ultra realistic, 8k, sophisticated atmosphere, luxury lifestyle photography, elegant typography area for logo, vertical Instagram format 4:5",
    caption: "Certaines fragrances se portent.\nD’autres vous définissent.\nBienvenue dans l’univers ELEVATE.",
    imageUrl: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
    copyNote: "Une accroche minimaliste mais magistrale pour s'imposer immédiatement comme la référence absolue du luxe contemporain."
  },
  {
    id: 2,
    day: 2,
    title: "L'Origine du Parfum",
    stage: "Univers & Storytelling",
    stageNotes: "Ouvrir les portes de l'atelier. Introduire la sélection brute des bois et des graines précieux pour un effet artisanal et authentique.",
    prompt: "Luxury perfume ingredients arranged on artisan wooden table, cedar wood, moss, coffee beans, amber bottles, perfumer workshop, warm cinematic lighting, luxury fragrance creation process, ultra realistic, macro details, premium brand storytelling photography, Vogue magazine style",
    caption: "Chaque note raconte une histoire.",
    imageUrl: "https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=800",
    copyNote: "Une invitation au mystère et à la sophistication des matières premières qui composent l'empreinte ELEVATE."
  },
  {
    id: 3,
    day: 3,
    title: "Le Fondateur & L'Obsession",
    stage: "Univers & Storytelling",
    stageNotes: "Montrer le génie humain derrière l'excellence. Une esthétique de laboratoire d'alchimiste moderne feutré et enveloppant.",
    prompt: "Luxury perfume laboratory, master perfumer working on exclusive fragrance, elegant glass bottles, golden lighting, sophisticated environment, luxury niche perfume house, cinematic photography, ultra realistic",
    caption: "Une fragrance née d’une obsession : \ncréer l’excellence.",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
    copyNote: "Met l'accent sur les années de recherche et la perfection obsessionnelle du Maître Parfumeur."
  },
  {
    id: 4,
    day: 4,
    title: "Le Flacon & La Structure",
    stage: "Univers & Storytelling",
    stageNotes: "Focaliser sur le design du verre et le bouchon magnétique. Le flacon devient une sculpture géométrique de cristal pur.",
    prompt: "Extreme close-up luxury perfume bottle, crystal glass reflections, premium cap details, luxury product photography, black background, dramatic lighting, hyper realistic, 8k, luxury advertising",
    caption: "Le luxe réside dans les détails.",
    imageUrl: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    copyNote: "Célèbre l'ingénierie et la pureté verrière qui rappellent les falaises d'altitude d'ELEVATE."
  },
  {
    id: 5,
    day: 5,
    title: "L'Expérience & Le Magnétisme",
    stage: "Univers & Storytelling",
    stageNotes: "Clore la première phase en projetant l'aura d'un homme charismatique dans une suite présidentielle feutrée. L'habillage est sur-mesure.",
    prompt: "Elegant man wearing luxury suit applying perfume, premium lifestyle, luxury hotel suite, cinematic lighting, sophisticated atmosphere, ultra realistic fashion photography",
    caption: "Avant d’entrer dans une pièce, \nvotre présence vous précède.",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
    copyNote: "Une transition parfaite qui déporte le focus de la bouteille vers l'impact de l'homme qui la porte."
  },
  {
    id: 6,
    day: 6,
    title: "La Signature Olfactive",
    stage: "Produit & Différenciation",
    stageNotes: "Visualiser l'essence sous forme de fumée or et anthracite, évoquant la diffusion aérienne et l'impact olfactif imprenable.",
    prompt: "Luxury perfume bottle floating in dark atmosphere with golden particles, fragrance essence visualized as elegant smoke, high-end advertising campaign, cinematic lighting, ultra realistic",
    caption: "Une signature invisible.\nUn impact inoubliable.",
    imageUrl: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80&w=800",
    copyNote: "Illustre la volatilité magique du parfum et son pouvoir de mémorisation éternel."
  },
  {
    id: 7,
    day: 7,
    title: "Les Matières Premières",
    stage: "Produit & Différenciation",
    stageNotes: "Souligner le sans-compromis des matières sélectionnées à la main. Focus sur le café noble brûlé, la mousse de chêne fraîche et l'ambre liquide.",
    prompt: "Luxury fragrance ingredients composition, cedar wood, moss, bergamot, amber, coffee beans, artistic arrangement, luxury editorial photography, warm premium lighting, ultra realistic",
    caption: "Des ingrédients sélectionnés sans compromis.",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    copyNote: "Crée une barrière d'excellence contre les parfums de masse industriels en vantant l'approvisionnement rare."
  },
  {
    id: 8,
    day: 8,
    title: "Le Lifestyle Masculin",
    stage: "Produit & Différenciation",
    stageNotes: "Associer ELEVATE aux objets fétiches de l'homme d'affaires : montre chronographe d'or gris et cuir patiné sur table de marbre.",
    prompt: "Luxury lifestyle scene, perfume bottle on marble table beside luxury watch and leather notebook, penthouse atmosphere, cinematic lighting, ultra realistic, premium masculine branding",
    caption: "Pour ceux qui réfutent la médiocrité.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800",
    copyNote: "Un message fier qui s'adresse à la psychologie des leaders, plaçant le parfum comme insigne du pouvoir."
  },
  {
    id: 9,
    day: 9,
    title: "Le Rituel de l'Unboxing",
    stage: "Produit & Différenciation",
    stageNotes: "Présenter le coffret gainé de cuir noir texturé frappé à chaud du logo doré ELEVATE. Créer un désir haptique ultra-fort.",
    prompt: "Luxury perfume packaging reveal, premium box with gold foil logo, black marble background, luxury unboxing experience, elegant lighting, hyper realistic",
    caption: "Le premier contact avec l’excellence.",
    imageUrl: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=800",
    copyNote: "Met en scène la cérémonie de l'ouverture, créant l'émotion de l'acquisition d'un véritable bijou de niche."
  },
  {
    id: 10,
    day: 10,
    title: "L'Inspiration Nature & Cimes",
    stage: "Produit & Différenciation",
    stageNotes: "Reconnecter aux origines géographiques. Les brumes blanches enveloppant les forêts noires au lever du soleil sur les hauts plateaux.",
    prompt: "Mountain landscape at sunrise, misty forest, luxury fragrance branding inspired by nature, cinematic atmosphere, premium advertising campaign, ultra realistic",
    caption: "ELEVATE.\nL’essence de la montagne.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    copyNote: "Rappelle l'air pur et la puissance tranquille de la nature brute montagnarde qui insuffle de l'énergie à l'élixir."
  },
  {
    id: 11,
    day: 11,
    title: "La Fabrication Artisanale",
    stage: "Désir & Positionnement Premium",
    stageNotes: "Montrer le geste expert de coulage manuel dans une fiole de cristal, validant le label d'artisanat français d'exception.",
    prompt: "Luxury artisan perfume production process, master perfumer pouring fragrance into crystal bottle, premium workshop, warm cinematic lighting, ultra realistic",
    caption: "Fabriqué avec passion.\nPensé pour durer.",
    imageUrl: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&q=80&w=800",
    copyNote: "Rassure sur l'aspect exclusif (production limitée numérotée sous certificat) et la tenue exceptionnelle sur la peau."
  },
  {
    id: 12,
    day: 12,
    title: "Le Pouvoir du Parfum",
    stage: "Désir & Positionnement Premium",
    stageNotes: "Un plan cinématographique d'un dirigeant entrant en conférence. L'attention de l'assemblée est instantanément captée par son sillage.",
    prompt: "Luxury businessman entering a room confidently, elegant atmosphere, cinematic photography, subtle luxury perfume storytelling, high-end branding, ultra realistic",
    caption: "Les gens oublient ce que vous dites.\nIls n’oublient jamais votre odeur.",
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=800",
    copyNote: "Une citation d'impact qui réaffirme l'importance primordiale de la mémoire olfactive dans les affaires et l'affirmation de soi."
  },
  {
    id: 13,
    day: 13,
    title: "Le Sceau du Prestige (Social Proof)",
    stage: "Désir & Positionnement Premium",
    stageNotes: "Mettre en scène le flacon avec un jeu typographique moderne et une citation d'esthète, sans l'aspect vulgaire d'un avis client classique.",
    prompt: "Luxury perfume bottle with elegant quote overlay, premium black and gold aesthetic, cinematic lighting, sophisticated luxury advertising",
    caption: "« Le parfum le plus complimenté de ma collection. »",
    imageUrl: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
    copyNote: "L'avis d'expert indirect ou de collectionneur de niche pour asseoir la réputation irrésistible de la fragrance."
  },
  {
    id: 14,
    day: 14,
    title: "Le Rituel Matinal",
    stage: "Désir & Positionnement Premium",
    stageNotes: "Articuler le parfum comme le point culminant indispensable de la routine. Café ristretto, boutons de manchette et flacon de cristal.",
    prompt: "Morning luxury routine, perfume bottle, luxury watch, espresso coffee, leather accessories, sophisticated gentleman lifestyle, warm cinematic light, ultra realistic",
    caption: "Chaque matin commence par une décision : \nquelle impression allez-vous laisser aujourd’hui ?",
    imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    copyNote: "S'adresse directement au subconscient de l'auditeur en positionnant la fragrance comme une armure invisible de confiance quotidienne."
  },
  {
    id: 15,
    day: 15,
    title: "Le Grand Hero Shot Final",
    stage: "Désir & Positionnement Premium",
    stageNotes: "Le chef-d'œuvre de l'exposition globale. Éléments de glace blanche, flacon couronné de lumière dorée sur fond de roche plissée.",
    prompt: "Ultra premium perfume campaign, ELEVATE bottle on black marble surrounded by mountain mist, luxury golden lighting, luxury fashion advertising, Dior and Tom Ford quality, hyper realistic, cinematic masterpiece, award winning product photography, 8k, vertical 4:5",
    caption: "ELEVATE.\nPlus qu’un parfum. Une présence.",
    imageUrl: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&q=80&w=800",
    copyNote: "La consécration de la campagne de lancement. L'affirmation finale d'une signature légendaire."
  }
];

export const RAW_INGREDIENTS: Ingredient[] = [
  {
    name: "Cedar Wood",
    frenchName: "Bois de Cèdre de l'Atlas",
    noteType: "Cœur",
    description: "Un bois majestueux et sec apportant une structure architecturale, s'inspirant directement de la force tranquille de la forêt alpine.",
    source: "Sélection de forêts certifiées de l'Atlas, séché naturellement pendant 18 mois.",
    brandingRole: "Inculque la résilience, la droiture et l'autorité naturelle tranquille dans le message de marque.",
    imageUrl: "https://images.unsplash.com/photo-1601574901248-9c900edae601?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Mountain Oak Moss",
    frenchName: "Mousse de Chêne de Montagne",
    noteType: "Fond",
    description: "Une fraîcheur enveloppante de terre forestière humide et de roche couverte de rosée glaciaire. Apporte de l'épaisseur et du contraste.",
    source: "Récolte manuelle sur les contreforts alpestres suisses après la fonte des neiges.",
    brandingRole: "Représente le lien organique avec la nature inaccessible et l'altitude sauvage.",
    imageUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Bergamot",
    frenchName: "Bergamote de Calabre",
    noteType: "Tête",
    description: "Zeste d'agrumes vibrant, éclatant et intensément frais à l'ouverture du vaporisateur, rappelant le soleil levant frappant la glace des cimes.",
    source: "Vergers biologiques exclusifs du sud de l'Italie.",
    brandingRole: "Symbolise l'ouverture lumineuse de la marque, un premier contact éblouissant et irrésistible.",
    imageUrl: "https://images.unsplash.com/photo-1610832958506-ee5633619144?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Amber Absolute",
    frenchName: "Ambre Noir Pur",
    noteType: "Fond",
    description: "Une larme résineuse ultra-chaude, miellée et presque animale qui lie les contraires en collant durablement à la peau.",
    source: "Gomme issue de sécrétions naturelles d'arbres fossilisés de l'Est.",
    brandingRole: "Confère le sillage infini, la sensualité masculine prestigieuse et le luxe enveloppant.",
    imageUrl: "https://images.unsplash.com/photo-1543157148-f68f2109be64?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Roasted Coffee Beans",
    frenchName: "Grain d'Expresso Torréfié",
    noteType: "Cœur",
    description: "Une note addictive amère, sombre et révoltée, réveillant instantanément le caractère altier de la bergamote fraîche.",
    source: "Variétés d'altitude de caféiers d'Abyssinie, torréfiés à cœur à Grasse.",
    brandingRole: "Gage de modernité radicale et d'un charisme électrique d'homme urbain exigeant.",
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=400"
  }
];

export const BRANDING_MOODS = [
  {
    id: "mysterious",
    label: "Mystérieux & Obscur",
    description: "Concentré d'ambre noir, de fumée dorée et d'ombres profondes.",
    vibe: "Une esthétique nocturne dramatique digne de Tom Ford Noir Extreme, privilégiant les silences, le clair-obscur ultra contrasté, le mystère intime d'un sillage indécelable au premier regard."
  },
  {
    id: "alpine-wild",
    label: "Altitude Sauvage",
    description: "Force de la roche givrée, fraîcheur de l'air de montagne, mousse de chêne.",
    vibe: "Inspiré de l'immensité brute et glaciaire des cimes alpines suisses et canadiennes. Minimalisme pur, grandiosité minérale, sillage énergisant et puissant pour l'homme d'action altier."
  },
  {
    id: "royal-prestige",
    label: "Or Impérial & Cuir",
    description: "Rituels royaux, boutons de manchette d'or chaud, cuir de Russie.",
    vibe: "Une opulence dorée chaleureuse s'adressant aux cercles privés d'élite mondiale. Contrastes entre marbres noirs filés d'or satiné, flacons monolithiques et packagings enveloppés de velours d'exception."
  }
];

export const INITIAL_AMBASSADORS: BrandAmbassador[] = [
  {
    id: "amb-1",
    name: "Alexandre Vance",
    handle: "@alexandre_vance",
    role: "Directeur de Mode & Critique Luxe, Paris",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    repostComment: "Une véritable révélation olfactive. Les notes d'altitude brute bousculent enfin la platitude chimique des sillages industriels de la concurrence grand public.",
    visualVibeRating: "9.5/10 — Pureté Architecturale",
    signatureComplement: "L'audace brute de la cime écrase la chimie de boulevard.",
    followersCount: "342K"
  },
  {
    id: "amb-2",
    name: "Maximilian von Klerk",
    handle: "@max_klerk",
    role: "Conservateur d'Art & Collectionneur Privé, Zurich",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    repostComment: "Le flaconnage monolithique ressemble à un bloc de granite brut sculpté de lumière d'or. Un objet de design radical pour esthètes initiés.",
    visualVibeRating: "10/10 — Chef-d'œuvre Visuel",
    signatureComplement: "Un sillage souverain, loin du tumulte commercial de masse.",
    followersCount: "185K"
  },
  {
    id: "amb-3",
    name: "Sienna Sterling",
    handle: "@sienna.styling",
    role: "Styliste Haute-Couture & Échappées Nobles, Monaco",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
    repostComment: "Le grain de café torréfié marié à la fraîcheur glaciaire de la mousse de chêne crée une vibration extraordinaire. Émouvant et impitoyable.",
    visualVibeRating: "9.8/10 — Aura Magnétique",
    signatureComplement: "La splendeur insolente du contraste d'altitude.",
    followersCount: "420K"
  }
];
