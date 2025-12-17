let selectedIngredients = [];

function addIngredient() {
  const input = document.getElementById("ingredientInput");
  const ingredient = input.value.trim();
  if (ingredient && !selectedIngredients.includes(ingredient)) {
    selectedIngredients.push(ingredient);
    updateIngredientsList();
    input.value = "";
  }
}

function updateIngredientsList() {
  const list = document.getElementById("ingredientsList");
  list.innerHTML = selectedIngredients
    .map((ing) => `<span class="ingredient-tag">${ing}</span>`)
    .join("");
}

async function generateRecipe() {
  if (selectedIngredients.length === 0) {
    alert("Ajoutez au moins un ingrédient !");
    return;
  }

  const guests = document.getElementById("guests").value;
  const maxTime = document.getElementById("maxTime").value;

  // Afficher le chargement
  document.getElementById("loading").style.display = "block";
  document.getElementById("generateBtn").disabled = true;

  try {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ingredients: selectedIngredients,
        guests: parseInt(guests),
        maxTime: parseInt(maxTime),
      }),
    });

    const recipe = await response.json();
    displayRecipe(recipe);
  } catch (error) {
    console.error("Erreur:", error);
    alert("Erreur lors de la génération");
  } finally {
    document.getElementById("loading").style.display = "none";
    document.getElementById("generateBtn").disabled = false;
  }
}

function displayRecipe(recipe) {
  const content = `
        <h3>${recipe.name} (${recipe.totalTime} min)</h3>
        <h4>Ingrédients :</h4>
        <ul>${recipe.ingredients.map((i) => `<li>${i}</li>`).join("")}</ul>
        <h4>Étapes :</h4>
        <ol>${recipe.steps.map((s) => `<li>${s}</li>`).join("")}</ol>
    `;
  document.getElementById("recipeContent").innerHTML = content;
  document.getElementById("recipeResult").style.display = "block";
}

function generateAnother() {
  document.getElementById("recipeResult").style.display = "none";
}
