let selectedIngredients = [];

function addIngredient() {
  const input = document.getElementById("ingredientInput");
  const ingredient = input.value.trim().toLowerCase();

  if (ingredient && !selectedIngredients.includes(ingredient)) {
    if (selectedIngredients.length >= 90) {
      alert("Maximum 90 ingrédients !");
      return;
    }

    selectedIngredients.push(ingredient);
    updateIngredientsList();
    updateCounter();
    updateGenerateButton();
    input.value = "";
    input.focus();
  }
}

function removeIngredient(ingredient) {
  selectedIngredients = selectedIngredients.filter(
    (item) => item !== ingredient
  );
  updateIngredientsList();
  updateCounter();
  updateGenerateButton();
}

function updateIngredientsList() {
  const list = document.getElementById("ingredientsList");
  const emptyMessage = document.getElementById("emptyMessage");

  if (selectedIngredients.length === 0) {
    emptyMessage.style.display = "block";
    list.innerHTML = "";
    return;
  }

  emptyMessage.style.display = "none";
  list.innerHTML = selectedIngredients
    .map(
      (ing) => `
        <div class="ingredient-tag">
            ${ing}
            <button class="remove-btn" onclick="removeIngredient('${ing}')">×</button>
        </div>
    `
    )
    .join("");
}

function updateCounter() {
  document.getElementById("counter").textContent = selectedIngredients.length;
}

function updateGenerateButton() {
  const button = document.getElementById("generateBtn");
  button.disabled = selectedIngredients.length === 0;
}

// Boutons +/-
function increment(fieldId) {
  const input = document.getElementById(fieldId);
  input.value = parseInt(input.value) + 1;
}

function decrement(fieldId) {
  const input = document.getElementById(fieldId);
  if (input.value > parseInt(input.min)) {
    input.value = parseInt(input.value) - 1;
  }
}

// Génération de recette
async function generateRecipe() {
  if (selectedIngredients.length === 0) return;

  const guests = document.getElementById("guests").value;
  const maxTime = document.getElementById("maxTime").value;
  const preferences = document.getElementById("preferences").value;

  // Animation de chargement
  document.getElementById("loading").style.display = "block";
  document.getElementById("generateBtn").disabled = true;

  // Préparer les données
  const recipeData = {
    ingredients: selectedIngredients,
    guests: parseInt(guests),
    maxTime: parseInt(maxTime),
    preferences: preferences,
    generatedAt: new Date().toISOString(),
  };

  console.log("Sauvegarde des données:", recipeData);

  // Sauvegarder dans localStorage
  localStorage.setItem("recipeRequest", JSON.stringify(recipeData));

  // Vérifier la sauvegarde
  const saved = localStorage.getItem("recipeRequest");
  console.log("Vérification:", saved);

  // Redirection après 1.5 secondes
  setTimeout(() => {
    window.location.href = "result.html";
  }, 1500);
}

// Entrée pour ajouter un ingrédient
document
  .getElementById("ingredientInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addIngredient();
    }
  });

// Initialisation
updateGenerateButton();
