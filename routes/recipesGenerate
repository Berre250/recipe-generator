const express = require("express");
const router = express.Router();
const { GoogleGenAI } = require("@google/genai");

router.post("/generate", async (req, res) => {
  try {
    const { ingredients, people, maxCookTime, notes } = req.body;

    if (
      !ingredients ||
      !Array.isArray(ingredients) ||
      ingredients.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Ingrédients manquants" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `
Tu es un chef.
Crée une recette claire en français avec:
- Ingrédients disponibles: ${ingredients.join(", ")}
- Pour: ${people || 2} personnes
- Temps max: ${maxCookTime || 30} minutes
- Notes: ${notes || "aucune"}

Format attendu:
Titre:
Temps:
Ingrédients:
Étapes (numérotées):
Conseils:
`.trim();

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result?.text || "Impossible de générer la recette.";

    return res.json({ success: true, recipeText: text });
  } catch (err) {
    console.error("GEMINI ERROR:", err);
    return res.status(500).json({ success: false, message: "Erreur Gemini" });
  }
});

module.exports = router;
