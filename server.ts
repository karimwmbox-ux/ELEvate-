import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY secret is not set. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. API: Custom caption and image prompt variations mapping the user's creative choices
app.post("/api/create-branding-variation", async (req, res) => {
  try {
    const { 
      variationStyle, 
      postIndex, 
      currentPrompt, 
      currentCaption,
      productName = "ELEVATE",
      productDescription = "Parfum de niche alpine mêlant fraîcheur extrême et profondeur boisée brute d'altitude.",
      competitorName = "Solfège de Bleu",
      competitorWeakness = "Fragrance industrielle de masse, sillage chimique uniforme, manque de caractère minéral."
    } = req.body;
    const ai = getGeminiClient();
    
    const systemPrompt = `You are a legendary creative director for an elite luxury niche perfume house (such as Tom Ford Private Blend, Creed, or Frédéric Malle). 
Your task is to refine or rewrite an Instagram campaign post for our elite fragrance: "${productName}".
The product DNA or description we strive for is: "${productDescription}".
We need to position our product sharply against its main competitor: "${competitorName}". The competitor's weakness or signature flaw is: "${competitorWeakness}".
Highlight our product's bespoke alpine, rare, or natural ingredients and position it as the ultimate artistic alternative that overcomes the competitor's commercial, generic downfalls.
We want to modify the copywriting and visual generation prompt according to the user's selected style option: "${variationStyle}".

Keep the core theme of the post (Post #${postIndex + 1}) intact, but elevated.
Respond in JSON format matching the schema:
{
  "revisedCaption": "Three lines or short poetic text in French. Use rich vocabulary, luxurious, impactful. It should speak to the soul of an aristocrat of taste, rejecting the generic elements associated with ${competitorName}.",
  "revisedPrompt": "Refined Midjourney image prompt in English. Extremely detailed, cinematic lighting, 8k, photorealistic, premium, professional advertising format, capturing the aura of ${productName}.",
  "creativeReasoning": "1-2 sentences in French explaining the change from a brand authority perspective, detailing how we specifically out-rival ${competitorName}."
}`;

    const promptText = `Post number: ${postIndex + 1}
Current visual prompt: "${currentPrompt}"
Current caption text: "${currentCaption}"

Please output a stunning, elite alternative following the style: "${variationStyle}".
Elevate the luxury, make it impact the reader deeply, and create a strong brand universe for "${productName}" over "${competitorName}".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini variation error:", error);
    res.status(500).json({ error: error.message || "Failed to generate variation." });
  }
});

// 2. API: Simulated luxury perfume mentor Chat (Master Perfumer Jean-Claude)
app.post("/api/perfumer-feedback", async (req, res) => {
  try {
    const { 
      messages,
      productName = "ELEVATE",
      productDescription = "Parfum de niche alpine mêlant fraîcheur extrême et profondeur boisée brute d'altitude.",
      competitorName = "Solfège de Bleu",
      competitorWeakness = "Fragrance industrielle de masse, sillage chimique uniforme, manque de caractère minéral."
    } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are "Jean-Claude", an legendary Master Perfumer and Senior Creative Director based in Grasse, France. 
You are speaking as an exquisite, highly professional, polite, and deeply passionate luxury consultant. 
You are mentoring a brand designer on their launch strategy for their elite niche fragrance "${productName}".
Description of ${productName}: "${productDescription}".
They are actively competing in the market with: "${competitorName}". 
We know that ${competitorName}'s core weakness or vulnerability is: "${competitorWeakness}".

Your mentoring must explicitly guide how their composition or their campaign narratives should position ${productName} as a highly superior, authentic alternative. Teach them how to exploit the weaknesses of the generic competitor.
Respond elegantly in French. Your sentences should feel poetic, wise, full of authority, and sophisticated.
Provide creative, specific feedback on scent compositions, visual photography guidelines, packaging designs, or launch timing.
Keep your response professional and inspiring. Limit your response to 2-3 short, dense, and beautifully styled paragraphs. Avoid listing system details or AI terminology. Maintain an aristocratic and inspiring tone.`;

    // Map message list to Gemini chat format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Perfumer feedback error:", error);
    res.status(500).json({ error: error.message || "Failed to get master perfumer feedback." });
  }
});

// 3. API: Custom Brandbook developer
app.post("/api/generate-brandbook", async (req, res) => {
  try {
    const { 
      vibe,
      productName = "ELEVATE",
      productDescription = "Parfum de niche alpine mêlant fraîcheur extrême et profondeur boisée brute d'altitude.",
      competitorName = "Solfège de Bleu",
      competitorWeakness = "Fragrance industrielle de masse, sillage chimique uniforme, manque de caractère minéral." 
    } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are an elite brand strategist for high-end niche perfume lines.
Create a majestic, premium written brand monograph for "${productName}" in French, focusing on the creative direction: "${vibe}".
${productName} is described as: "${productDescription}".
We need to establish high-end differentiation compared to "${competitorName}", which suffers from: "${competitorWeakness}".
The monograph should make our product feel like a rare masterpiece and can contain subtle aesthetic contrasts emphasizing our authentic soul over competitor commercial standardizations.

Respond in JSON format matching the schema:
{
  "manifesto": "A powerful 4-5 sentence poetic brand manifesto centered around ${productName}.",
  "targetAudience": "Description of the target high-profile client of this specific choice who values the soul of ${productName} over ${competitorName}.",
  "signatureScentPyramid": {
    "topNotes": "Scent notes like alpine crisp frost, wild bergamot, morning mist, custom tailored for ${productName}",
    "heartNotes": "Notes like roasted dark espresso, cracked wild cardamom, cedarwood needles, damp gray moss",
    "baseNotes": "Notes like black amber absolute, cured leather, intense deep patchouli, cashmere musk"
  },
  "launchEventConcept": "Description of an ultra-exclusive launch event in Geneva, Paris, or New York, emphasizing superiority over mainstream rivals like ${competitorName}."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate a premium brand monograph for ${productName} themed around the creative vibe "${vibe}", contrasting our authentic soul with candidate competitor ${competitorName}.`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Brandbook error:", error);
    res.status(505).json({ error: error.message || "Failed to generate brand monograph." });
  }
});

// 4. API: Ambassador luxury review critique generator
app.post("/api/generate-ambassador-repost", async (req, res) => {
  try {
    const {
      influencerName,
      influencerHandle,
      influencerRole,
      productName = "ELEVATE",
      productDescription = "Parfum de niche alpine mêlant fraîcheur extrême et profondeur boisée brute d'altitude.",
      competitorName = "Solfège de Bleu",
      competitorWeakness = "Fragrance industrielle de masse, sillage chimique uniforme, manque de caractère minéral.",
      postTitle = "Révélation de la marque",
      postCaption = "Certaines fragrances se portent.\nD’autres vous définissent."
    } = req.body;
    
    const ai = getGeminiClient();

    const systemPrompt = `You are a luxury branding specialist writing as the glamorous and deeply critical brand ambassador: "${influencerName}" (${influencerHandle}), who is a "${influencerRole}".
Your tone must be highly sophisticated, elitist, artistic, and entirely authentic to French high-fashion or luxury art curation.
You are posting or reposting a critique on Instagram / Threads reviewing "${productName}" (described as: "${productDescription}").
Specifically praise "${productName}" for overcoming the commercialized, chemical flat shortcomings of its mainstream rival "${competitorName}" (which suffers from: "${competitorWeakness}").
Focus on aesthetics, the touch of the glass, the raw majesty of the ingredients, and why it is the new holy grail for the global elite.
Keep the text in elegant French, using appropriate haute-couture vocabulary. Do NOT sound like an affiliate marketer. Sound like an independent tastemaker who is almost impossible to please but fell in love with this scent.

Respond with a JSON structure matching the schema:
{
  "repostComment": "A powerful 2-3 sentence critique or quote in French, suitable for an Instagram repost description or review statement. Include selective luxury tags.",
  "visualVibeRating": "e.g. '10/10 - Chef-d’oeuvre architectural'",
  "signatureComplement": "A luxurious and personal verdict phrase (e.g. 'L’audace de la cime l’emporte enfin sur la chimie de boulevard.')"
}`;

    const promptText = `Generate an elite influencer critique for:
Influencer Name: ${influencerName} (${influencerHandle})
Role: ${influencerRole}
Our Product: ${productName}
Mainstream Competitor: ${competitorName}
Campaign Post Topic: ${postTitle}
Campaign Post Caption: "${postCaption}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: promptText,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text?.trim() || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Ambassador generator error:", error);
    res.status(500).json({ error: error.message || "Failed to generate luxury repost comment." });
  }
});

// Serve assets / build in dev/prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
