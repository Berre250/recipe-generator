document.addEventListener("DOMContentLoaded", function () {
  console.log("Page résultat chargée");

  // Attendre 1 seconde pour simuler le chargement
  setTimeout(function () {
    displayRecipe();
  }, 1000);
});

function displayRecipe() {
  // Récupérer les données du localStorage
  const recipeRequest = JSON.parse(
    localStorage.getItem("recipeRequest") || "{}"
  );

  console.log("Données reçues:", recipeRequest);

  const recipeContent = document.getElementById("recipeContent");

  // Si pas de données, afficher erreur
  if (
    !recipeRequest ||
    !recipeRequest.ingredients ||
    recipeRequest.ingredients.length === 0
  ) {
    recipeContent.innerHTML = `
            <div class="recipe-card">
                <h2 style="color: #e74c3c;">⚠️ Données manquantes</h2>
                <p>Nous n'avons pas pu récupérer les données de votre recette.</p>
                <p>Veuillez retourner à la page précédente.</p>
                <div class="recipe-actions">
                    <a href="select.html" class="new-recipe-btn">← Retour à la sélection</a>
                </div>
            </div>
        `;
    return;
  }

  // Créer une recette factice avec les vraies données
  const recipe = createFakeRecipe(recipeRequest);

  // Afficher la recette
  recipeContent.innerHTML = `
        <div class="recipe-card">
            <div class="recipe-header">
                <h2>${recipe.name}</h2>
                <div class="recipe-meta">
                    <span>👥 ${recipeRequest.guests || 4} personnes</span>
                    <span>⏱️ ${recipe.totalTime} minutes</span>
                    <span>🥕 ${
                      recipeRequest.ingredients.length
                    } ingrédients</span>
                </div>
            </div>
            
            <div class="recipe-section">
                <h3>🥕 Ingrédients</h3>
                <ul class="ingredients-list">
                    ${recipe.ingredients
                      .map((ing) => `<li>${ing}</li>`)
                      .join("")}
                </ul>
            </div>
            
            <div class="recipe-section">
                <h3>👨‍🍳 Préparation</h3>
                <ol class="steps-list">
                    ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
                </ol>
            </div>
            
            ${
              recipeRequest.preferences
                ? `
            <div class="recipe-section" style="background: #fff8e1; padding: 15px; border-radius: 10px;">
                <h3>📝 Vos préférences</h3>
                <p>${recipeRequest.preferences}</p>
            </div>
            `
                : ""
            }
            
            <div class="recipe-actions">
                <button class="action-btn" onclick="saveRecipe()">💾 Sauvegarder</button>
                <button class="action-btn" onclick="shareRecipe()">🔗 Partager</button>
                <button class="action-btn" onclick="rateRecipe()">⭐ Noter</button>
                <a href="select.html" class="new-recipe-btn">🍳 Nouvelle recette</a>
            </div>
        </div>
    `;
}

function createFakeRecipe(request) {
  // Créer une recette basée sur les ingrédients
  const mainIngredient = request.ingredients[0] || "ingrédient";
  const secondIngredient = request.ingredients[1] || "légumes";

  return {
    name: `${capitalize(mainIngredient)} et ${capitalize(
      secondIngredient
    )} Rapides`,
    totalTime: Math.min(request.maxTime || 30, 45),
    ingredients: [
      `${(request.guests || 4) * 125}g de ${mainIngredient}`,
      `${(request.guests || 4) * 75}g de ${secondIngredient}`,
      ...request.ingredients
        .slice(2)
        .map((ing, i) => `${(request.guests || 4) * (50 + i * 10)}g de ${ing}`),
      "2 cuillères à soupe d'huile d'olive",
      "Sel et poivre au goût",
    ],
    steps: [
      `Préparer tous les ingrédients : laver, émincer, couper.`,
      `Faire chauffer l'huile dans une grande poêle à feu moyen.`,
      `Ajouter le ${mainIngredient} et faire revenir 5-7 minutes jusqu'à coloration.`,
      `Incorporer le ${secondIngredient}${
        request.ingredients.length > 2 ? " et les autres ingrédients" : ""
      }.`,
      `Laisser mijoter ${Math.floor(
        (request.maxTime || 30) * 0.6
      )} minutes en remuant de temps en temps.`,
      `Assaisonner avec sel, poivre et herbes si désiré.`,
      `Servir chaud et déguster immédiatement !`,
    ],
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function saveRecipe() {
  alert("Fonctionnalité de sauvegarde (sera ajoutée avec le backend)");
}

function shareRecipe() {
  alert("Partage : cette fonctionnalité sera complétée plus tard");
}

function rateRecipe() {
  const note = prompt("Notez cette recette de 1 à 5 étoiles :", "5");
  if (note) {
    alert(`Merci pour votre note de ${note} étoiles !`);
  }
}
