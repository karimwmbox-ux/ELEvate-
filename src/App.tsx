import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Compass, 
  FileText, 
  Droplet, 
  Layers, 
  Calendar, 
  BookOpen, 
  Sliders, 
  Wind, 
  Award, 
  MessageSquare, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  Flame, 
  PenTool, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Image as ImageIcon,
  Users,
  Quote
} from "lucide-react";
import { CampaignPost, Ingredient, BrandBookData, BrandAmbassador } from "./types";
import { CAMPAIGN_POSTS, RAW_INGREDIENTS, STAGES, BRANDING_MOODS, INITIAL_AMBASSADORS } from "./data";

export default function App() {
  // Campaign Posts state
  const [posts, setPosts] = useState<CampaignPost[]>(CAMPAIGN_POSTS);
  const [selectedPost, setSelectedPost] = useState<CampaignPost>(CAMPAIGN_POSTS[0]);
  const [activeStageFilter, setActiveStageFilter] = useState<string>("All");
  
  // Custom edit state for captions
  const [editableCaption, setEditableCaption] = useState<string>(CAMPAIGN_POSTS[0].caption);
  const [isEditingCaption, setIsEditingCaption] = useState<boolean>(false);
  
  // Copy indicators
  const [promptCopied, setPromptCopied] = useState<boolean>(false);
  const [captionCopied, setCaptionCopied] = useState<boolean>(false);
  
  // AI Variation State
  const [selectedVariationStyle, setSelectedVariationStyle] = useState<string>("mysterious");
  const [isGeneratingVariation, setIsGeneratingVariation] = useState<boolean>(false);
  const [variationFeedback, setVariationFeedback] = useState<string | null>(null);

  // Perfumer Assistant Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([
    { 
      role: "assistant", 
      content: "Bonjour cher créateur. Je suis Jean-Claude, Maître Parfumeur et directeur de création pour ELEVATE à Grasse. Comment puis-je orienter la signature olfactive de votre campagne aujourd'hui ?" 
    }
  ]);
  const [currentInput, setCurrentInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Ingredient Alchemist Lab State
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>(RAW_INGREDIENTS[0]);
  const [smellLevel, setSmellLevel] = useState<number>(30);
  const [isSmellActive, setIsSmellActive] = useState<boolean>(false);

  // Brandbook State
  const [selectedBrandVibe, setSelectedBrandVibe] = useState<string>("mysterious");
  const [brandBook, setBrandBook] = useState<BrandBookData | null>(null);
  const [isGeneratingBrandBook, setIsGeneratingBrandBook] = useState<boolean>(false);
  const [brandBookOpen, setBrandBookOpen] = useState<boolean>(false);

  // Brand DNA & Competitor Positioning States
  const [productName, setProductName] = useState<string>("ELEVATE");
  const [productDescription, setProductDescription] = useState<string>("Parfum de niche alpine mêlant fraîcheur extrême et profondeur boisée brute d'altitude.");
  const [competitorName, setCompetitorName] = useState<string>("Solfège de Bleu");
  const [competitorWeakness, setCompetitorWeakness] = useState<string>("Fragrance de masse ultra-synthetique, sillage linéaire chimique, manque de profondeur minérale brute.");
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(true);

  // Brand Ambassadors State
  const [ambassadors, setAmbassadors] = useState<BrandAmbassador[]>(INITIAL_AMBASSADORS);
  const [selectedAmbForGen, setSelectedAmbForGen] = useState<string>("amb-1");
  const [isGeneratingAmbPost, setIsGeneratingAmbPost] = useState<boolean>(false);

  const handleGenerateAmbassadorRepost = async (ambId: string) => {
    const targetAmbObj = ambassadors.find(a => a.id === ambId);
    if (!targetAmbObj) return;

    setIsGeneratingAmbPost(true);
    try {
      const response = await fetch("/api/generate-ambassador-repost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencerName: targetAmbObj.name,
          influencerHandle: targetAmbObj.handle,
          influencerRole: targetAmbObj.role,
          productName,
          productDescription,
          competitorName,
          competitorWeakness,
          postTitle: selectedPost.title,
          postCaption: selectedPost.caption
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur serveur lors de la simulation du repost.");
      }

      const data = await response.json();
      
      // Update specific ambassador's comment in the state list
      setAmbassadors(prev => prev.map(amb => {
        if (amb.id === ambId) {
          return {
            ...amb,
            repostComment: data.repostComment || amb.repostComment,
            visualVibeRating: data.visualVibeRating || amb.visualVibeRating,
            signatureComplement: data.signatureComplement || amb.signatureComplement
          };
        }
        return amb;
      }));

    } catch (error: any) {
      console.error("Ambassador generation error:", error);
    } finally {
      setIsGeneratingAmbPost(false);
    }
  };

  // Keep state in sync with selected post selection
  useEffect(() => {
    setEditableCaption(selectedPost.caption);
    setVariationFeedback(null);
    setIsEditingCaption(false);
  }, [selectedPost]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleCopyCaption = (text: string) => {
    navigator.clipboard.writeText(text);
    setCaptionCopied(true);
    setTimeout(() => setCaptionCopied(false), 2000);
  };

  // 1. Call express backend server to generate luxury variation
  const handleGenerateVariation = async () => {
    setIsGeneratingVariation(true);
    setVariationFeedback(null);
    try {
      const selectedVibeObj = BRANDING_MOODS.find(v => v.id === selectedVariationStyle);
      const styleLabel = selectedVibeObj ? `${selectedVibeObj.label} (${selectedVibeObj.description})` : selectedVariationStyle;

      const response = await fetch("/api/create-branding-variation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variationStyle: styleLabel,
          postIndex: selectedPost.id - 1,
          currentPrompt: selectedPost.prompt,
          currentCaption: selectedPost.caption,
          productName,
          productDescription,
          competitorName,
          competitorWeakness
        }),
      });

      if (!response.ok) {
        throw new Error("L'API n'a pas pu générer la variation de luxe.");
      }

      const data = await response.json();
      
      // Update our local state for this post
      const updatedPosts = posts.map(p => {
        if (p.id === selectedPost.id) {
          return {
            ...p,
            caption: data.revisedCaption || p.caption,
            prompt: data.revisedPrompt || p.prompt,
          };
        }
        return p;
      });

      setPosts(updatedPosts);
      setSelectedPost({
        ...selectedPost,
        caption: data.revisedCaption || selectedPost.caption,
        prompt: data.revisedPrompt || selectedPost.prompt,
      });
      setEditableCaption(data.revisedCaption || selectedPost.caption);
      setVariationFeedback(data.creativeReasoning || "Variation appliquée avec succès d'un point de vue de positionnement de niche.");
    } catch (err: any) {
      console.error(err);
      setVariationFeedback(`Note de l'atelier : ${err.message || "Veuillez configurer la clé API Gemini Secrète pour débloquer ces variations créatives de haut niveau."}`);
    } finally {
      setIsGeneratingVariation(false);
    }
  };

  // 2. Chat with the virtual Master Perfumer
  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentInput.trim() || isChatLoading) return;

    const userMsg = { role: "user", content: currentInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setCurrentInput("");
    setIsChatLoading(true);

    try {
      const chatHistory = [...chatMessages, userMsg];
      const response = await fetch("/api/perfumer-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: chatHistory,
          productName,
          productDescription,
          competitorName,
          competitorWeakness
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de l'Atelier de Grasse.");
      }

      const data = await response.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setChatMessages(prev => [
        ...prev, 
        { 
          role: "assistant", 
          content: "Mes excuses, la communication avec notre atelier à Grasse a été interrompue. Assurez-vous d'avoir configuré votre clé API GEMINI_API_KEY dans le panneau de Secrets." 
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // 3. Generate cohesive digital monograph brandbook
  const handleGenerateBrandBook = async () => {
    setIsGeneratingBrandBook(true);
    setBrandBookOpen(true);
    try {
      const selectedVibeObj = BRANDING_MOODS.find(v => v.id === selectedBrandVibe);
      const vibeLabel = selectedVibeObj ? selectedVibeObj.label : selectedBrandVibe;

      const response = await fetch("/api/generate-brandbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          vibe: vibeLabel,
          productName,
          productDescription,
          competitorName,
          competitorWeakness
        }),
      });

      if (!response.ok) {
        throw new Error("Impossible de générer le cahier de tendances.");
      }

      const data = await response.json();
      setBrandBook(data);
    } catch (err: any) {
      console.error(err);
      setBrandBook({
        manifesto: "Dans l'immensité silencieuse des sommets, là où l'air pur frôle le granit, ELEVATE s'attribue le droit à la grandeur. Un pacte sensoriel scellé par l'exigence absolue.",
        targetAudience: "Leaders contemporains, esthètes urbains recherchant une distinction olfactive tranchante, imperméables aux modes éphémères du marché généraliste.",
        signatureScentPyramid: {
          topNotes: "Bergamote de Calabre givrée, Embruns des plateaux suisses, Air pur des cimes",
          heartNotes: "Grain de café robusta torréfié à Grasse, Rameau de Cèdre de l'Atlas, Accord granite mouillé",
          baseNotes: "Larmes d'Ambre gris fossilisé, Mousse de Chêne centenaire, Marbre noir frotté"
        },
        launchEventConcept: "Un vernissage privé confidentiel sur un héliport suspendu face au Mont-Blanc à Chamonix, réservé à 15 collectionneurs d'art majeurs."
      });
    } finally {
      setIsGeneratingBrandBook(false);
    }
  };

  // Helper filter posts
  const filteredPosts = posts.filter(post => {
    if (activeStageFilter === "All") return true;
    return post.stage === activeStageFilter;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-[#E0E0E0] font-sans selection:bg-[#C5A059]/30 selection:text-white relative overflow-x-hidden">
      
      {/* Background Subtle Luxury Light Glow (Immersive Theme Style) */}
      <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden h-full w-full">
        <div className="absolute -top-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-[#C5A059] blur-[150px]" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-[#403010] blur-[150px]" />
      </div>

      {/* TOP LUXURY BAR (Immersive UI Style) */}
      <nav className="h-16 flex items-center justify-between px-6 sm:px-8 border-b border-white/10 relative z-30 bg-black/40 backdrop-blur-md sticky top-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="text-xl sm:text-2xl font-light tracking-[0.4em] text-white">ELEVATE</span>
          <span className="h-4 w-[1px] bg-white/20"></span>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-semibold">Brand Launch Director</span>
        </div>
        <div className="hidden lg:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
          <span className="text-white border-b border-[#C5A059] pb-1 cursor-default">Campaign Flow</span>
          <span className="text-white/40 hover:text-white cursor-pointer transition">Narrative Logic</span>
          <span className="text-white/40 hover:text-white cursor-pointer transition">Visual Assets</span>
        </div>
        <button 
          onClick={() => {
            setSelectedBrandVibe("mysterious");
            handleGenerateBrandBook();
          }}
          className="px-4 sm:px-5 py-2 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-[#C5A059]/10"
        >
          Publish Strategy
        </button>
      </nav>

      {/* CORE FRAMEWORK & GRID STRATEGY INSTRUCTION */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 relative z-20">
        <div className="mb-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-4 font-mono font-medium">
              ESTRATEGIA DIGITAL DE ALTA GAMA
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light tracking-wide mb-4 text-white italic">
              Prédire le Désir, Raconter l&apos;Absolu
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-2xl mx-auto">
              Pour le lancement de la marque de parfum de niche <strong className="text-[#C5A059] font-normal">{productName}</strong>, vos 15 premiers posts ne vendent rien. Ils installent une autorité de plusieurs millions d&apos;euros en bâtissant une narration obsessionnelle.
            </p>
          </motion.div>
        </div>

        {/* DOSSIER DE POSITIONNEMENT CONCURRENTIEL ET PRODUIT - CLIENT INPUT PANEL */}
        <div className="mb-10 border border-white/10 bg-black/40 backdrop-blur-sm rounded-sm overflow-hidden relative">
          <div className="bg-gradient-to-r from-stone-900 via-black to-stone-900 border-b border-white/10 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#C5A059]" />
              <div className="text-left">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block font-semibold">COORDINATES DE NICHE / ARSENAL CRÉATIF</span>
                <h3 className="text-base font-serif italic text-white tracking-wide">ADN du Produit & Vision Optionnelle Face au Concurrent</h3>
              </div>
            </div>
            <button
              onClick={() => setIsDossierOpen(!isDossierOpen)}
              className="px-4 py-1.5 border border-white/15 bg-white/5 rounded-sm text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-white hover:border-[#C5A059] transition cursor-pointer font-mono font-bold"
            >
              {isDossierOpen ? "[ Masquer l'Analyse ]" : "[ Déplier l'Analyse ]"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {isDossierOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 bg-gradient-to-b from-stone-950/10 to-transparent">
                  
                  {/* LEFT: OUR BRAND PRODUCT INFO */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs uppercase font-serif tracking-widest text-[#C5A059] italic font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-[#C5A059]" /> Votre Signature Olfactive
                      </span>
                      <span className="text-[9px] font-mono text-white/35">PRODUIT MAISON</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono font-bold font-sans">Nom du Produit</label>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g. ELEVATE"
                          className="w-full text-xs bg-black border border-white/10 rounded-sm p-2.5 outline-none focus:border-[#C5A059] text-white focus:ring-1 focus:ring-[#C5A059]/25 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono font-bold font-sans">Identité Olfactive & Description</label>
                        <textarea
                          rows={2}
                          value={productDescription}
                          onChange={(e) => setProductDescription(e.target.value)}
                          placeholder="Décrivez les attributs d'exception..."
                          className="w-full text-xs bg-black border border-white/10 rounded-sm p-2.5 outline-none focus:border-[#C5A059] text-white focus:ring-1 focus:ring-[#C5A059]/25 font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: TARGET COMPETITOR PRODUCT INFO */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-xs uppercase font-serif tracking-widest text-stone-400 italic font-semibold flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-stone-500" /> Analyse du Concurrent
                      </span>
                      <span className="text-[9px] font-mono text-white/35">CIBLE DE MARQUE</span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono font-bold font-sans">Nom du Produit Concurrent</label>
                        <input
                          type="text"
                          value={competitorName}
                          onChange={(e) => setCompetitorName(e.target.value)}
                          placeholder="e.g. Solfège de Bleu"
                          className="w-full text-xs bg-black border border-white/10 rounded-sm p-2.5 outline-none focus:border-stone-500 text-white focus:ring-1 focus:ring-stone-500/25 font-sans"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1 font-mono font-bold font-sans">Vulnérabilité Sensorielle & Faiblesse à Cibler</label>
                        <textarea
                          rows={2}
                          value={competitorWeakness}
                          onChange={(e) => setCompetitorWeakness(e.target.value)}
                          placeholder="Saisissez sa faiblesse (sillage chimique, générique...)"
                          className="w-full text-xs bg-black border border-white/10 rounded-sm p-2.5 outline-none focus:border-[#C5A059]/50 text-white focus:ring-1 focus:ring-[#C5A059]/25 font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* NARRATIVE SEQUENCE CHRONOLOGY STEPS STATE PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {STAGES.map((stg, idx) => {
            const isFilterActive = activeStageFilter === stg.name;
            return (
              <div 
                key={idx}
                onClick={() => setActiveStageFilter(isFilterActive ? "All" : stg.name)}
                className={`p-5 border cursor-pointer transition flex flex-col justify-between rounded-sm relative ${
                  isFilterActive 
                    ? "border-[#C5A059] bg-black/40 ring-1 ring-[#C5A059]/20" 
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
                }`}
                id={`stage-card-${idx}`}
              >
                {isFilterActive && (
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#C5A059]" />
                )}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-mono tracking-widest uppercase text-white/50 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                      Phase {idx + 1} • {stg.days}
                    </span>
                    {isFilterActive && <span className="text-[10px] tracking-widest uppercase text-[#C5A059]">Filtre Actif</span>}
                  </div>
                  <h3 className="text-base font-serif tracking-wider text-white mb-2 font-medium italic">
                    {stg.name}
                  </h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-light">{stg.description}</p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-white/5 flex justify-between items-center text-[10px] text-white/40">
                  <span>Séquence de 5 Jours</span>
                  <ChevronRight className="w-3 h-3 text-[#C5A059]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* MAIN WORKING AREA: LOOKBOOK GRID LEFT AND CONTROLLER RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LOOKBOOK IMAGES - 7 Columns */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[11px] uppercase tracking-[0.25em] font-serif font-semibold text-white">
                  Grille Harmonique ({filteredPosts.length} posts)
                </span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <button 
                  onClick={() => setActiveStageFilter("All")}
                  className={`px-3 py-1 rounded-sm transition border cursor-pointer uppercase tracking-widest text-[9px] font-mono ${activeStageFilter === "All" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]" : "bg-transparent border-white/10 text-white/40 hover:text-white"}`}
                >
                  Tous
                </button>
                <button 
                  onClick={() => setActiveStageFilter("Univers & Storytelling")}
                  className={`px-3 py-1 rounded-sm transition border cursor-pointer uppercase tracking-widest text-[9px] font-mono ${activeStageFilter === "Univers & Storytelling" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]" : "bg-transparent border-white/10 text-white/40 hover:text-white"}`}
                >
                  01 - Story
                </button>
                <button 
                  onClick={() => setActiveStageFilter("Produit & Différenciation")}
                  className={`px-3 py-1 rounded-sm transition border cursor-pointer uppercase tracking-widest text-[9px] font-mono ${activeStageFilter === "Produit & Différenciation" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]" : "bg-transparent border-white/10 text-white/40 hover:text-white"}`}
                >
                  02 - Prod
                </button>
                <button 
                  onClick={() => setActiveStageFilter("Désir & Positionnement Premium")}
                  className={`px-3 py-1 rounded-sm transition border cursor-pointer uppercase tracking-widest text-[9px] font-mono ${activeStageFilter === "Désir & Positionnement Premium" ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059]" : "bg-transparent border-white/10 text-white/40 hover:text-white"}`}
                >
                  03 - Désir
                </button>
              </div>
            </div>

            {/* INSTAGRAM PORTRAIT FEED LOOKBOOK GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredPosts.map((post) => {
                  const isSelected = selectedPost.id === post.id;
                  const phaseBorderColor = 
                    post.stage === "Univers & Storytelling" 
                      ? "border-[#C5A059]/30" 
                      : post.stage === "Produit & Différenciation" 
                        ? "border-[#C5A059]/40" 
                        : "border-[#C5A059]/55";

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`relative aspect-[4/5] rounded-sm overflow-hidden border cursor-pointer group transition-all duration-500 bg-stone-900 ${
                        isSelected 
                          ? "border-[#C5A059] ring-2 ring-[#C5A059]/20 scale-[1.01] shadow-2xl shadow-[#C5A059]/10" 
                          : "border-white/10 hover:border-white/30"
                      }`}
                      id={`post-grid-item-${post.id}`}
                    >
                      {/* Image lookbook with standard referrer tags */}
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Day banner badge */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-sm bg-[#050505]/95 backdrop-blur border border-white/15 text-[9px] tracking-widest font-mono text-white shadow-md">
                        POST {post.id}
                      </div>

                      {/* Accent gold color dot based on the active post phase */}
                      <div className="absolute top-2 right-2">
                        <span className={`w-2 h-2 rounded-full block ${isSelected ? "bg-[#C5A059]" : "bg-[#C5A059]/40"}`} />
                      </div>

                      {/* Elegant Overlay Bottom Text mimicking luxury brand visual */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3 pt-12 flex flex-col justify-end">
                        <span className="text-[8px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block mb-0.5">ELEVATE NARRATION</span>
                        <h4 className="text-[12px] font-serif font-light text-white tracking-wide truncate mb-1 italic">{post.title}</h4>
                        <p className="text-[10px] text-white/50 font-light truncate leading-none italic font-serif">
                          &ldquo;{post.caption.split("\n")[0]}&rdquo;
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Campaign 15 Posts Timeline Progress Section (Immersive UI Style) */}
            <div className="border border-white/10 p-6 rounded bg-black/30 backdrop-blur-sm mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Séquence Chronologique • Calendrier Editorial</span>
                <span className="text-[10px] uppercase tracking-widest text-[#C5A059]">Post Actif : {selectedPost.id} / 15</span>
              </div>
              <div className="flex gap-2">
                {posts.map((post) => {
                  const isActive = post.id === selectedPost.id;
                  const isPast = post.id < selectedPost.id;
                  return (
                    <div 
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`flex-1 h-1.5 transition-all cursor-pointer rounded-sm ${
                        isActive 
                          ? "bg-[#C5A059] shadow-lg shadow-[#C5A059]/50 scale-y-125" 
                          : isPast 
                            ? "bg-[#C5A059]/40 hover:bg-[#C5A059]/60" 
                            : "bg-white/10 hover:bg-white/20"
                      }`}
                      title={`Jour ${post.day} : ${post.title}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between mt-2.5 text-[8px] uppercase tracking-[0.25em] text-white/30 font-mono">
                <span>Phase I : Récit Univers</span>
                <span>Phase II : Différenciation</span>
                <span>Phase III : Désir de Marque</span>
              </div>
            </div>

          </div>

          {/* CREATIVE CONTROL CENTER - 5 Columns */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* ACTIVE POST DETAIL CONTROLLERS WITH THEME */}
            <div className="border border-white/10 p-6 rounded-sm bg-white/5 backdrop-blur-md relative">
              
              {/* Border Gold Corner accents */}
              <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-[#C5A059]" />
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#C5A059]" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#C5A059]" />
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-[#C5A059]" />

              <div className="flex items-center justify-between mb-4 border-b border-white/15 pb-3">
                <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-[0.2em] font-semibold">
                  SÉLECTION CONTRÔLE • POST {selectedPost.id}
                </span>
                <span className="text-[9px] px-2.5 py-0.5 rounded-sm bg-black border border-white/10 text-white/50 tracking-widest uppercase">
                  {selectedPost.stage.split(" ")[0]}
                </span>
              </div>

              <h3 className="text-2xl font-serif tracking-wide text-white mb-2 italic">
                {selectedPost.title}
              </h3>
              
              <div className="bg-white/2.5 p-3 rounded-sm border border-white/5 mb-4">
                <p className="text-[11px] text-white/70 leading-relaxed font-light">
                  <span className="text-[#C5A059] uppercase font-mono text-[9px] font-semibold tracking-wider block mb-0.5">Focus Artistique :</span>
                  {selectedPost.stageNotes}
                </p>
              </div>

              {/* POST FRENCH COPYWRITING TEXT */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] uppercase font-semibold tracking-widest text-[#C5A059] flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5" />
                    Texte Éditorial (Instagram / French)
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditingCaption(!isEditingCaption)}
                      className="text-[10px] text-[#C5A059] hover:underline cursor-pointer tracking-widest uppercase text-[9px]"
                    >
                      {isEditingCaption ? "Valider" : "Modifier"}
                    </button>
                    <button 
                      onClick={() => handleCopyCaption(editableCaption)}
                      className="text-[10px] text-white/55 hover:text-white cursor-pointer flex items-center gap-1 uppercase text-[9px]"
                    >
                      {captionCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copier
                    </button>
                  </div>
                </div>

                {isEditingCaption ? (
                  <textarea
                    value={editableCaption}
                    onChange={(e) => {
                      setEditableCaption(e.target.value);
                      const updatedPosts = posts.map(p => {
                        if (p.id === selectedPost.id) {
                          return { ...p, caption: e.target.value };
                        }
                        return p;
                      });
                      setPosts(updatedPosts);
                    }}
                    rows={4}
                    className="w-full text-xs bg-black border border-white/15 rounded-sm p-3 outline-none focus:border-[#C5A059] text-white focus:ring-1 focus:ring-[#C5A059]/20 font-serif"
                    id="caption-text-area"
                  />
                ) : (
                  <div className="bg-black/40 border border-white/10 rounded-sm p-4 font-serif font-light text-[13px] leading-relaxed italic text-[#C5A059] whitespace-pre-line relative text-center">
                    &ldquo;{selectedPost.caption}&rdquo;
                  </div>
                )}
              </div>

              {/* PROMPT ADVISORY NOTE */}
              <div className="mb-5 bg-[#C5A059]/5 text-[#C5A059] border border-[#C5A059]/10 p-3 rounded-sm text-[11px] leading-relaxed italic">
                <span className="font-semibold block not-italic uppercase tracking-widest text-[9px] mb-1">Cadrage Stratégique :</span>
                {selectedPost.copyNote}
              </div>

              {/* INTEGRATION PROMPT (MIDJOURNEY) */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[9px] uppercase font-semibold tracking-widest text-white/50 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Prompt Midjourney / Dall-E Spec (English)
                  </span>
                  <button 
                    onClick={() => handleCopyPrompt(selectedPost.prompt)}
                    className="text-[10px] text-white/55 hover:text-white cursor-pointer flex items-center gap-1 uppercase text-[9px]"
                  >
                    {promptCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copier
                  </button>
                </div>
                <div className="bg-black border border-white/10 rounded-sm p-3 text-[11px] font-mono leading-relaxed text-white/75 break-words">
                  {selectedPost.prompt}
                </div>
              </div>

              {/* GEMINI AI DEVIATION PANEL */}
              <div className="border-t border-white/10 pt-5 mt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#C5A059] animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white">
                    Générer une Déclinaison de Niche (IA)
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-white/50 mb-3 font-light">
                  Raffinez instantanément l&apos;esthétique d&apos;écriture ou de prompt visuel via Gemini selon l&apos;ADN recherché :
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  {BRANDING_MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedVariationStyle(mood.id)}
                      className={`px-1 py-1.5 rounded-sm text-[9px] tracking-widest uppercase border cursor-pointer text-center transition-all ${
                        selectedVariationStyle === mood.id 
                          ? "bg-[#C5A059]/25 border-[#C5A059] text-[#C5A059] font-semibold" 
                          : "bg-transparent border-white/10 text-white/40 hover:text-white/80"
                      }`}
                    >
                      {mood.label.split(" ")[0]}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerateVariation}
                  disabled={isGeneratingVariation}
                  className={`w-full py-2.5 bg-gradient-to-r from-[#C5A059] via-[#E2C799] to-[#C5A059] text-black font-semibold rounded-sm text-[10px] tracking-widest uppercase transition-all duration-300 shadow-xl shadow-[#C5A059]/10 cursor-pointer flex items-center justify-center gap-2 hover:brightness-110 ${isGeneratingVariation ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {isGeneratingVariation ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Consultation à Grasse...
                    </>
                  ) : (
                    <>
                      <Sliders className="w-3.5 h-3.5" />
                      Raffiner l&apos;Aura du Post
                    </>
                  )}
                </button>

                {/* Variation Output Feedback */}
                {variationFeedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-3.5 bg-black border border-[#C5A059]/20 rounded-sm text-[11px] text-white/80 leading-relaxed font-light"
                  >
                    <span className="font-semibold block mb-1 text-[#C5A059] uppercase tracking-wider text-[9px]">Analyse du Conseil Artistique :</span>
                    {variationFeedback}
                  </motion.div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* BRAND AMBASSADORS SECTION */}
        <section className="mt-16 border border-white/10 bg-gradient-to-b from-stone-950 via-black to-stone-950 rounded-sm p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-10 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <span className="px-2.5 py-0.5 bg-white/5 border border-[#C5A059]/20 rounded text-[9px] font-mono tracking-widest uppercase text-[#C5A059] font-semibold">
                PREUVE SOCIALE • AMBASSADEURS DE NICHE
              </span>
              <h3 className="text-3xl font-serif text-white mt-3 mb-2 italic">
                Résonance & Reposts Élite
              </h3>
              <p className="text-xs sm:text-xs text-white/60 font-light leading-relaxed max-w-xl">
                Simulez des publications de commissaires d&apos;art et d&apos;influenceurs de haute couture. Leurs critiques créent une autorité incontestable en contrastant votre fragrance avec les faiblesses du concurrent.
              </p>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-3 rounded-sm flex items-center gap-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C5A059]"></span>
              </span>
              <div className="text-left">
                <span className="text-[8px] font-mono tracking-widest text-[#C5A059] block uppercase font-bold">POST CIBLÉ POUR SIMULATION</span>
                <span className="text-xs text-white font-serif italic">Post #{selectedPost.id} — {selectedPost.title}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* AMBASSADORS SIMULATOR SELECTOR PANEL - 5 Columns */}
            <div className="lg:col-span-5 flex flex-col gap-4 justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-mono tracking-widest uppercase text-white/40 block border-b border-white/5 pb-2">Sélectionnez un Arbitre du Bon Goût :</span>
                {ambassadors.map((amb) => {
                  const isSelected = selectedAmbForGen === amb.id;
                  return (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbForGen(amb.id)}
                      className={`p-3.5 border rounded-sm cursor-pointer transition-all flex items-center justify-between ${
                        isSelected 
                          ? "border-[#C5A059] bg-[#C5A059]/5 text-white" 
                          : "border-white/5 bg-black/40 text-white/60 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/15 relative bg-white/5">
                          <img 
                            src={amb.avatarUrl} 
                            alt={amb.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-serif italic font-medium">{amb.name}</span>
                            <span className="text-[9px] font-mono text-[#C5A059]">✓</span>
                          </div>
                          <span className="text-[9px] font-mono text-white/40 block mt-0.5">{amb.role}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-mono text-white/30 block">Audience</span>
                        <span className="text-[10px] font-bold text-[#C5A059] font-sans">{amb.followersCount}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* SIMULATION GENERATOR ACTION */}
              <div className="bg-black/80 border border-white/5 p-4 rounded-sm mt-3">
                <span className="text-[9px] font-mono tracking-widest uppercase text-[#C5A059] block mb-2 font-bold">
                  SIMULATION DE REPOST VIA GEMINI
                </span>
                <p className="text-[10px] text-white/50 leading-relaxed font-light mb-3">
                  Générez un avis personnalisé de cet ambassadeur focalisé sur le post actif, détruisant subtilement le sillage industriel de <strong className="text-white/85 font-normal">{competitorName}</strong> au profit de <strong className="text-[#C5A059] font-normal">{productName}</strong>.
                </p>
                
                <button
                  onClick={() => handleGenerateAmbassadorRepost(selectedAmbForGen)}
                  disabled={isGeneratingAmbPost}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-[#C5A059]/30 rounded-sm text-[#C5A059] hover:text-white hover:border-[#C5A059] text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isGeneratingAmbPost ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Génération artistique...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Simuler un Repost Personnalisé
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* INSTAGRAM REPOST CARD SIMULATED PREVIEW - 7 Columns */}
            <div className="lg:col-span-7 flex flex-col justify-between bg-black/60 border border-[#C5A059]/25 rounded-sm p-6 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full blur-[60px] pointer-events-none" />
              
              {/* Card Header resembling premium social screen */}
              <div>
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[9px] font-mono tracking-widest text-[#E2C799] uppercase block font-semibold">
                      REPOST D&apos;AUTORITÉ DU LUXE
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#C5A059] font-semibold border border-[#C5A059]/25 px-2 py-0.5 rounded-sm uppercase tracking-wider bg-[#C5A059]/5">
                    Instagram Feed Simulé
                  </span>
                </div>

                {/* Active curator block display */}
                {(() => {
                  const activeCurator = ambassadors.find(a => a.id === selectedAmbForGen) || ambassadors[0];
                  return (
                    <div className="space-y-6">
                      
                      {/* Personal curated quote */}
                      <div className="relative pl-7 border-l-2 border-[#C5A059] italic text-white/90 text-sm font-serif font-light leading-relaxed">
                        <Quote className="w-4 h-4 text-[#C5A059]/40 absolute -left-0.5 -top-2 block transform scale-x-[-1]" />
                        <p>{activeCurator.repostComment}</p>
                      </div>

                      {/* Ambassador Card Signature widget */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 border-t border-white/5">
                        <div className="p-3 bg-white/2.5 border border-white/5 rounded-sm flex flex-col justify-between">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-white/40 block mb-1">
                            AURA & NOTE SENSORIELLE
                          </span>
                          <span className="text-[11px] font-serif text-[#C5A059] font-medium italic">
                            {activeCurator.visualVibeRating}
                          </span>
                        </div>

                        <div className="p-3 bg-[#C5A059]/5 border border-[#C5A059]/20 rounded-sm flex flex-col justify-between">
                          <span className="text-[8px] font-mono uppercase tracking-widest text-[#C5A059] block mb-1">
                            VERDICT DE COMPARAISON
                          </span>
                          <span className="text-[11px] text-white/75 tracking-wide font-light">
                            {activeCurator.signatureComplement}
                          </span>
                        </div>
                      </div>

                      {/* Bottom author signature identifier */}
                      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C5A059]/30 p-0.5">
                          <div className="w-full h-full rounded-full overflow-hidden">
                            <img 
                              src={activeCurator.avatarUrl} 
                              alt={activeCurator.name} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-serif text-white tracking-wide">{activeCurator.name}</h4>
                            <span className="text-[9px] font-mono text-[#C5A059]">✓ Badge d&apos;Élite</span>
                          </div>
                          <p className="text-[10px] font-mono text-white/50">{activeCurator.handle} • {activeCurator.role}</p>
                        </div>
                      </div>

                    </div>
                  );
                })()}
              </div>

              {/* Helper disclaimer */}
              <div className="text-[9px] font-mono tracking-widest text-white/20 uppercase mt-6 text-center">
                Ce repost renforce l&apos;exclusivité de la campagne et détruit l&apos;attraction routinière du concurrent.
              </div>

            </div>

          </div>
        </section>

        {/* ALCHEMIST LAB & CORE INGREDIENTS DESIGN ACCENTS */}
        <section className="mt-16 bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-sm p-6 sm:p-8 relative">
          <div className="absolute top-0 right-1/3 w-72 h-72 bg-[#C5A059]/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="mb-8 max-w-2xl">
            <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono tracking-widest uppercase text-[#C5A059] font-medium">
              L’ALCHIMIE DES NOTES OLFACTIVES
            </span>
            <h3 className="text-3xl font-serif text-white mt-3 mb-2 italic">
              L&apos;Atelier de Sélection Brute
            </h3>
            <p className="text-xs sm:text-sm text-white/60 font-light leading-relaxed">
              Un grand parfum de niche repose sur des matières de caractère cultivées sans compromis industriel. Cliquez sur chaque matière noble d&apos;ELEVATE pour voir son rôle sensoriel et marketing.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Ingredients Left list - 5 Columns */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {RAW_INGREDIENTS.map((ing, idx) => {
                const isSelected = selectedIngredient.name === ing.name;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedIngredient(ing)}
                    className={`p-3.5 border rounded-sm cursor-pointer transition flex items-center justify-between ${
                      isSelected 
                        ? "border-[#C5A059] bg-[#C5A059]/10 text-[#C5A059] scale-[1.01]" 
                        : "border-white/10 bg-black/40 hover:border-white/20 text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-sm overflow-hidden relative border border-white/10 bg-black">
                        <img 
                          src={ing.imageUrl} 
                          alt={ing.name} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium font-serif tracking-wide italic">{ing.frenchName}</h4>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-[9px] font-mono tracking-wider uppercase opacity-60">
                            Note de {ing.noteType}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <CheckCircle className="w-4 h-4 text-[#C5A059]" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-white/20" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Ingredient display details - 7 Columns */}
            <div className="lg:col-span-7 bg-black/40 border border-white/10 p-6 rounded-sm relative min-h-[300px] flex flex-col justify-between">
              
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-[#C5A059] font-bold block mb-1">
                    ANALYSE MATIÈRE • NOTE DE {selectedIngredient.noteType.toUpperCase()}
                  </span>
                  <h4 className="text-2xl font-serif text-white tracking-wide italic">{selectedIngredient.frenchName}</h4>
                  <p className="text-[10px] font-mono text-white/40 tracking-wider uppercase mt-0.5">{selectedIngredient.name}</p>
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-sm text-[10px] text-white/55 font-medium">
                  Source : {selectedIngredient.source.split(",")[0]}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h5 className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium mb-1.5">
                    Description Olfactive & Structure
                  </h5>
                  <p className="text-xs sm:text-[13px] text-white/80 font-light leading-relaxed">
                    {selectedIngredient.description}
                  </p>
                </div>

                <div>
                  <h5 className="text-[9px] uppercase tracking-widest text-white/50 font-medium mb-1.5">
                    Positionnement Psychologique & Aura de Vente
                  </h5>
                  <p className="text-xs sm:text-[13px] text-white/80 font-light leading-relaxed">
                    {selectedIngredient.brandingRole}
                  </p>
                </div>
              </div>

              {/* Interactive Scent diffuser simulation widget */}
              <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Wind className="w-4 h-4 text-[#C5A059] animate-pulse" />
                  <div className="flex-1 sm:w-44">
                    <div className="flex justify-between text-[9px] text-white/40 mb-1">
                      <span>Nébuliseur d&apos;Atelier</span>
                      <span>{smellLevel}% d&apos;arômes</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={smellLevel}
                      onChange={(e) => setSmellLevel(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsSmellActive(true);
                    setTimeout(() => setIsSmellActive(false), 3000);
                  }}
                  className={`px-4 py-2 border rounded-sm text-[9px] tracking-widest uppercase cursor-pointer transition-all ${
                    isSmellActive 
                      ? "bg-[#C5A059]/20 border-[#C5A059] text-[#C5A059] animate-pulse" 
                      : "border-white/15 text-white/60 hover:text-white hover:border-[#C5A059]/55 hover:bg-white/5"
                  }`}
                >
                  {isSmellActive ? "Diffusion olfactive active" : "Vaporiser en Studio"}
                </button>
              </div>

            </div>

          </div>
        </section>

        {/* LUXURY CONSULTING CHAT WITH THE PERFUMER */}
        <section className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Chat details explanations */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono tracking-widest uppercase text-[#C5A059] font-medium w-max mb-3">
              MESSAGERIE DE GRASSE
            </span>
            <h3 className="text-3xl font-serif text-white tracking-wide mb-3 italic">
              Le Conseil Privé du Maître Parfumeur
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed font-light mb-6">
              Posez directement vos questions sur le choix des notes, la mise en scène du flaconnage ou l&apos;écriture de la légende à notre compositeur d&apos;arômes attitré, <strong className="text-white">Jean-Claude</strong>.
            </p>

            <div className="space-y-2.5">
              <div 
                onClick={() => setCurrentInput("Comment structurer mon feed entre le jour 5 et le jour 6 pour ne pas perdre l'audience ?")}
                className="p-3 bg-white/2.5 border border-white/10 rounded-sm hover:border-[#C5A059]/50 cursor-pointer text-xs text-white/70 transition flex items-center justify-between"
              >
                <span>« Comment lier narrativement la phase 1 et 2 ? »</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
              <div 
                onClick={() => setCurrentInput("Quelle est la meilleure note olfactive pour exprimer un sentiment contemporain de luxe froid ?")}
                className="p-3 bg-white/2.5 border border-white/10 rounded-sm hover:border-[#C5A059]/50 cursor-pointer text-xs text-white/70 transition flex items-center justify-between"
              >
                <span>« Comment évoquer le luxe froid en parfum ? »</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </div>
            </div>
          </div>

          {/* Majestic Elegant chat console container */}
          <div className="lg:col-span-7 border border-white/10 bg-black/40 backdrop-blur-sm rounded-sm flex flex-col justify-between h-[450px] relative">
            
            <div className="border-b border-white/10 px-4 py-3 bg-white/2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-mono font-bold">Consultation Privée • Salon Grasse</span>
              </div>
              <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">En Direct</span>
            </div>

            {/* Chat Messages Frame */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-[12px] leading-relaxed custom-scrollbar">
              {chatMessages.map((msg, index) => {
                const isPerfumer = msg.role === "assistant";
                return (
                  <div
                    key={index}
                    className={`flex ${isPerfumer ? "justify-start" : "justify-end"}`}
                  >
                    <div 
                      className={`max-w-[85%] rounded-sm p-3.5 font-serif ${
                        isPerfumer 
                          ? "bg-black/80 text-white/90 border border-white/10 italic font-light" 
                          : "bg-[#C5A059]/10 text-white border border-[#C5A059]/20"
                      }`}
                    >
                      <span className="text-[8px] uppercase tracking-widest font-mono text-white/40 block mb-1">
                        {isPerfumer ? "Maitre Nez • Jean-Claude" : "Comité Artistique • Vous"}
                      </span>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/50 text-white/50 p-3 italic rounded-sm border border-white/10 text-xs flex items-center gap-2 font-serif font-light">
                    <RefreshCw className="w-3 h-3 animate-spin text-[#C5A059]" />
                    Jean-Claude rédige une note créative...
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Message input space form */}
            <form onSubmit={handleSendChatMessage} className="border-t border-white/10 p-3 bg-white/2.5 flex gap-2">
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                placeholder="Rédigez votre question ou idée artistique au Maître..."
                className="flex-1 bg-black border border-white/10 rounded-sm px-3 py-2 text-xs outline-none focus:border-[#C5A059] text-white"
              />
              <button
                type="submit"
                disabled={isChatLoading || !currentInput.trim()}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[#C5A059] hover:text-white text-[10px] font-mono uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer
              </button>
            </form>

          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h4 className="font-serif tracking-[0.4em] text-sm uppercase text-[#C5A059] mb-3">ELEVATE</h4>
          <p className="text-[10px] text-white/30 tracking-[0.25em] uppercase font-mono">
            © 2026 ELEVATE PARFUMS DE NICHE • HAUTE VISION CRÉATIVE ARISTOCRATIQUE
          </p>
        </div>
      </footer>

      {/* BRANDBOOK INTERACTIVE DRAWER POPUP */}
      <AnimatePresence>
        {brandBookOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border border-[#C5A059]/40 rounded-sm overflow-hidden relative shadow-2xl shadow-[#C5A059]/5 max-h-[85vh] flex flex-col"
            >
              <div className="h-0.5 bg-gradient-to-r from-[#C5A059] via-[#E2C799] to-[#C5A059]" />
              
              <button 
                onClick={() => setBrandBookOpen(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white text-xs font-mono tracking-widest cursor-pointer uppercase"
              >
                [ FERMER ]
              </button>

              <div className="p-6 overflow-y-auto">
                <div className="text-center mb-6">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A059] uppercase block mb-1">
                    DOCUMENT PRINCIPAL • CLASSIFIÉ
                  </span>
                  <h3 className="text-3xl font-serif text-white tracking-[0.1em] uppercase italic">
                    Livre de Marque ELEVATE
                  </h3>
                  <p className="text-[9px] font-mono tracking-widest text-white/35 uppercase mt-1">
                    Cahier de tendances et direction artistique de niche
                  </p>
                </div>

                {isGeneratingBrandBook ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-4">
                    <RefreshCw className="w-7 h-7 text-[#C5A059] animate-spin" />
                    <span className="text-xs font-serif italic text-white/50">
                      Formulation intellectuelle du manifeste olfactif...
                    </span>
                  </div>
                ) : brandBook ? (
                  <div className="space-y-6">
                    
                    {/* Manifesto styled parchment element */}
                    <div className="bg-black border-l-2 border-[#C5A059] border-y border-r border-[#C5A059]/10 p-5 rounded-r-sm italic font-serif font-light text-[13px] leading-relaxed text-[#C5A059]/90 text-center relative">
                      <span className="text-2xl text-[#C5A059]/20 absolute top-1 left-2 font-serif">&ldquo;</span>
                      <p className="px-4 py-1">{brandBook.manifesto}</p>
                      <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/35 block text-right mt-3">— MANIFESTE D&apos;EXCELLENCE ELEVATE</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-black/40 p-4 border border-white/5 rounded-sm">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] block mb-1">
                          Consommateurs Cibles & Profil
                        </span>
                        <p className="text-xs text-white/70 font-light leading-relaxed">{brandBook.targetAudience}</p>
                      </div>

                      <div className="bg-black/40 p-4 border border-white/5 rounded-sm">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-[#C5A059] block mb-1">
                          Lancement Privé Exclusif
                        </span>
                        <p className="text-xs text-white/70 font-light leading-relaxed">{brandBook.launchEventConcept}</p>
                      </div>
                    </div>

                    <div className="bg-black/60 border border-white/10 p-5 rounded-sm">
                      <h4 className="text-[10px] font-mono tracking-widest uppercase text-[#C5A059] text-center mb-4">
                        Pyramide Scent-Olfactive Signature d&apos;ELEVATE
                      </h4>
                      
                      <div className="space-y-3.5 font-serif">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50 tracking-wider">Notes de Tête (Air, Bergamote)</span>
                          <span className="text-xs text-white text-right italic">{brandBook.signatureScentPyramid.topNotes}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50 tracking-wider">Notes de Cœur (Bois de Cèdre, Espresso)</span>
                          <span className="text-xs text-white text-right italic">{brandBook.signatureScentPyramid.heartNotes}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-white/50 tracking-wider">Notes de Fond (Ambre Noir, Mousse)</span>
                          <span className="text-[#C5A059] text-xs text-right italic font-medium">{brandBook.signatureScentPyramid.baseNotes}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center pt-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          const docText = `ELEVATE BRANDBOOK MANIFESTO:\n"${brandBook.manifesto}"\n\nTARGET:\n${brandBook.targetAudience}\n\nSCENT PYRAMID:\nTête: ${brandBook.signatureScentPyramid.topNotes}\nCoeur: ${brandBook.signatureScentPyramid.heartNotes}\nFond: ${brandBook.signatureScentPyramid.baseNotes}\n\nLAUNCH CONCEPT:\n${brandBook.launchEventConcept}`;
                          handleCopyCaption(docText);
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm text-[#C5A059] hover:text-white text-[9px] font-mono uppercase tracking-[0.2em] cursor-pointer inline-flex items-center gap-1.5 transition-all"
                      >
                        <Copy className="w-3 h-3" />
                        Copier la Synthèse
                      </button>
                    </div>

                  </div>
                ) : null}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
