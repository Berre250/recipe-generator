// services/gemini.js
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialiser Gemini avec ta clé API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function generateRecipe(ingredients, people, maxCookTime, notes) {
  try {
    // Utiliser le modèle Gemini 2.5 Flash-Lite
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite" // Remplace par "gemini-2.5-flash-lite" quand disponible
    });

    // Construire le prompt
    const prompt = buildRecipePrompt(ingredients, people, maxCookTime, notes);

    console.log("prompt send");

    // Générer la recette
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("recipe generated");

    // Parser la réponse pour extraire le nom et la description
    const parsed = parseGeminiResponse(text);

    return parsed;

  } catch (error) {
    console.error("Erreur Gemini:", error.message);
    throw new Error("Impossible de générer la recette avec Gemini");
  }
}

/**
 * Construit le prompt pour Gemini
 */
function buildRecipePrompt(ingredients, servings, time,) {
  return `ou are a chef. Generate a clear innovative and doable recipe in English with the following constraints: 
  Selected ingredients: ${ingredients.map(i => `- ${i}`).join('\n')}
 - Maximum time: ${time} minutes 
 - Number of servings: ${servings} 
 Do not invent additional ingredients except for spices. Strictly respect the maximum time of cooking. 
Do not use emojis. 
 
 Mandatory structure: 
 NAME : Recipe name in 5 words max

 DESCRIPTION:
 1. Ingredients and price estimation.
2. Recipe steps 
3. Total time. 
All the titltes are in bold.
don't add no additionnal questions.
add a chief tips. `;
}

/**
 * Parse la réponse de Gemini pour extraire nom et description
 */
function parseGeminiResponse(text) {
  // Chercher le pattern "NOM: ..." et "DESCRIPTION: ..."
  const nomMatch = text.match(/NAME:\s*(.+?)(?:\n|$)/i);
  const descMatch = text.match(/DESCRIPTION:\s*([\s\S]+)/i);

  let name = "Recette du chef";
  let description = text;

  if (nomMatch && nomMatch[1]) {
    name = nomMatch[1].trim();
  }

  if (descMatch && descMatch[1]) {
    description = descMatch[1].trim();
  }

  return { name, description };
}

/**
 * Fonction de test pour vérifier que l'API fonctionne
 */
async function testGeminiConnection() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-gemini-exp" });
    const result = await model.generateContent("Dis bonjour en une phrase courte");
    const response = await result.response;
    console.log("Connexion Gemini OK:", response.text());
    return true;
  } catch (error) {
    console.error(" Erreur connexion Gemini:", error.message);
    return false;
  }
}

module.exports = { 
  generateRecipe,
  testGeminiConnection 
};