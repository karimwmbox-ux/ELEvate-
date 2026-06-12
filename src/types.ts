export interface CampaignPost {
  id: number;
  day: number;
  title: string;
  stage: "Univers & Storytelling" | "Produit & Différenciation" | "Désir & Positionnement Premium";
  stageNotes: string;
  prompt: string;
  caption: string;
  imageUrl: string;
  copyNote: string;
}

export interface Ingredient {
  name: string;
  frenchName: string;
  noteType: "Tête" | "Cœur" | "Fond";
  description: string;
  source: string;
  brandingRole: string;
  imageUrl: string;
}

export interface BrandBookData {
  manifesto: string;
  targetAudience: string;
  signatureScentPyramid: {
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
  };
  launchEventConcept: string;
}

export interface BrandAmbassador {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatarUrl: string;
  repostComment: string;
  visualVibeRating: string;
  signatureComplement: string;
  followersCount: string;
}
