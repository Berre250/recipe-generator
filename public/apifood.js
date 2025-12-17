// ============================================
// FICHIER : select.js
// BUT : Uniquement la logique UI, utilise l'API
// ============================================

// Variables globales UI
let currentCategory = "all";
let currentPage = 1;
let isLoading = false;

// ==================== INITIALISATION ====================
document.addEventListener("DOMContentLoaded", function () {
  console.log("UI Sélection chargée");

  // Vérifier que l'API est disponible
  if (!window.FoodFactsAPI) {
    console.error("API non chargée !");
    showError("Service API non disponible. Rechargez la page.");
    return;
  }

  // Charger la première catégorie
  loadCategory("all");

  // Configurer la recherche
  setupSearch();

  // Initialiser le bouton
  updateGenerateButton();
});

// ==================== CHARGEMENT CATÉGORIE ====================
async function loadCategory(category) {
  if (isLoading) return;

  console.log(`UI: Chargement catégorie ${category}`);

  // Mettre à jour l'UI
  updateCategoryButtons(category);

  // Afficher loading
  showLoading(true);

  try {
    // Appeler l'API
    const ingredients = await window.FoodFactsAPI.fetchIngredientsByCategory(
      category,
      currentPage
    );

    console.log(`UI: ${ingredients.length} ingrédients reçus`);

    // Afficher les résultats
    displayIngredients(ingredients);

    // Sauvegarder l'état
    currentCategory = category;
  } catch (error) {
    console.error("UI: Erreur chargement catégorie:", error);
    showError(
      `Impossible de charger les ingrédients. Erreur: ${error.message}`
    );

    // Afficher une grille vide
    displayIngredients([]);
  } finally {
    showLoading(false);
  }
}

function updateCategoryButtons(selectedCategory) {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeBtn = document.querySelector(
    `.category-btn[onclick*="${selectedCategory}"]`
  );
  if (activeBtn) {
    activeBtn.classList.add("active");
  }
}

// ==================== AFFICHAGE INGRÉDIENTS ====================
function displayIngredients(ingredients) {
  const grid = document.getElementById("ingredientsGrid");

  if (!ingredients || ingredients.length === 0) {
    grid.innerHTML = `
            <div class="no-ingredients" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p>Aucun ingrédient trouvé pour cette catégorie.</p>
                <button onclick="retryLoad()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 5px;">
                    Réessayer
                </button>
            </div>
        `;
    return;
  }

  // Récupérer les noms déjà sélectionnés
  const selectedNames = selectedIngredients.map((item) => item.name);

  // Générer le HTML
  grid.innerHTML = ingredients
    .map((ingredient) => {
      const isSelected = selectedNames.includes(ingredient.name);

      return `
            <div class="ingredient-card ${isSelected ? "selected" : ""}" 
                 onclick="handleIngredientClick('${ingredient.name.replace(
                   /'/g,
                   "\\'"
                 )}', '${ingredient.image}')"
                 data-name="${ingredient.name}">
                <img src="${ingredient.image}" 
                     alt="${ingredient.name}" 
                     class="ingredient-image"
                     onerror="this.onerror=null; this.src='https://via.placeholder.com/100x80?text=${encodeURIComponent(
                       ingredient.name.substring(0, 10)
                     )}'">
                <div class="ingredient-name">${ingredient.name}</div>
            </div>
        `;
    })
    .join("");
}

// ==================== GESTION DES INGRÉDIENTS ====================
function handleIngredientClick(name, image) {
  console.log(`UI: Clic sur ingrédient: ${name}`);

  // Vérifier si déjà sélectionné
  const existingIndex = selectedIngredients.findIndex(
    (item) => item.name === name
  );

  if (existingIndex >= 0) {
    // Retirer
    selectedIngredients.splice(existingIndex, 1);
    updateCardSelection(name, false);
  } else {
    // Ajouter (max 90)
    if (selectedIngredients.length >= 90) {
      alert("Maximum 90 ingrédients sélectionnés !");
      return;
    }

    selectedIngredients.push({ name, image });
    updateCardSelection(name, true);
  }

  // Mettre à jour l'UI
  updateSelectedList();
  updateGenerateButton();
}

function updateCardSelection(ingredientName, isSelected) {
  const cards = document.querySelectorAll(
    `.ingredient-card[data-name="${ingredientName}"]`
  );
  cards.forEach((card) => {
    if (isSelected) {
      card.classList.add("selected");
    } else {
      card.classList.remove("selected");
    }
  });
}

function updateSelectedList() {
  const container = document.getElementById("selectedIngredients");
  const emptyMsg = document.getElementById("emptySelection");
  const counter = document.getElementById("selectedCount");

  // Mettre à jour le compteur
  counter.textContent = selectedIngredients.length;

  // Vider le conteneur
  container.innerHTML = "";

  if (selectedIngredients.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  // Ajouter chaque ingrédient sélectionné
  selectedIngredients.forEach((ingredient) => {
    const div = document.createElement("div");
    div.className = "selected-ingredient";
    div.innerHTML = `
            <img src="${ingredient.image}" 
                 alt="${ingredient.name}" 
                 onerror="this.style.display='none'">
            ${ingredient.name}
            <button class="remove-btn" onclick="removeIngredient('${ingredient.name.replace(
              /'/g,
              "\\'"
            )}')">×</button>
        `;
    container.appendChild(div);
  });
}

function removeIngredient(name) {
  console.log(`UI: Retrait ingrédient: ${name}`);

  selectedIngredients = selectedIngredients.filter(
    (item) => item.name !== name
  );
  updateCardSelection(name, false);
  updateSelectedList();
  updateGenerateButton();
}

// ==================== RECHERCHE ====================
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("autocompleteResults");

  searchInput.addEventListener(
    "input",
    debounce(async function (e) {
      const query = e.target.value.trim();

      if (query.length < 2) {
        resultsContainer.style.display = "none";
        return;
      }

      try {
        // Appeler l'API de recherche
        const results = await window.FoodFactsAPI.searchIngredients(query);

        // Afficher les résultats
        if (results.length > 0) {
          displaySearchResults(results, query);
        } else {
          resultsContainer.innerHTML = `
                    <div class="autocomplete-item">
                        Aucun résultat pour "${query}"
                    </div>
                `;
          resultsContainer.style.display = "block";
        }
      } catch (error) {
        console.error("UI: Erreur recherche:", error);
        resultsContainer.innerHTML = `
                <div class="autocomplete-item">
                    Service de recherche indisponible
                </div>
            `;
        resultsContainer.style.display = "block";
      }
    }, 300)
  );

  // Cacher les résultats au clic extérieur
  document.addEventListener("click", function (e) {
    if (
      !searchInput.contains(e.target) &&
      !resultsContainer.contains(e.target)
    ) {
      resultsContainer.style.display = "none";
    }
  });
}

function displaySearchResults(results, query) {
  const container = document.getElementById("autocompleteResults");

  container.innerHTML = results
    .map(
      (item) => `
        <div class="autocomplete-item" 
             onclick="handleSearchResultClick('${item.name.replace(
               /'/g,
               "\\'"
             )}', '${item.image}')">
            <img src="${item.image}" 
                 alt="${item.name}"
                 onerror="this.src='https://via.placeholder.com/40x40?text=${encodeURIComponent(
                   item.name.substring(0, 2)
                 )}'">
            <span>${item.name}</span>
        </div>
    `
    )
    .join("");

  container.style.display = "block";
}

function handleSearchResultClick(name, image) {
  // Ajouter l'ingrédient
  if (!selectedIngredients.find((item) => item.name === name)) {
    if (selectedIngredients.length >= 90) {
      alert("Maximum 90 ingrédients sélectionnés !");
      return;
    }

    selectedIngredients.push({ name, image });
    updateSelectedList();
    updateGenerateButton();
  }

  // Nettoyer la recherche
  document.getElementById("searchInput").value = "";
  document.getElementById("autocompleteResults").style.display = "none";
}

// ==================== UTILITAIRES UI ====================
function showLoading(show) {
  isLoading = show;
  const grid = document.getElementById("ingredientsGrid");

  if (show) {
    grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div class="spinner"></div>
                <p style="margin-top: 15px; color: #666;">Chargement des ingrédients...</p>
            </div>
        `;
  }
}

function showError(message) {
  const grid = document.getElementById("ingredientsGrid");
  grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #e74c3c;">
            <p>⚠️ ${message}</p>
            <button onclick="retryLoad()" style="margin-top: 15px; padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px;">
                Réessayer
            </button>
        </div>
    `;
}

function retryLoad() {
  loadCategory(currentCategory);
}

function updateGenerateButton() {
  const button = document.getElementById("generateBtn");
  button.disabled = selectedIngredients.length === 0;
}

// ==================== GÉNÉRATION RECETTE ====================
function generateRecipe() {
  if (selectedIngredients.length === 0) return;

  const guests = document.getElementById("guests").value;
  const maxTime = document.getElementById("maxTime").value;
  const preferences = document.getElementById("preferences").value;

  // Préparer les données
  const recipeData = {
    ingredients: selectedIngredients.map((item) => item.name),
    guests: parseInt(guests),
    maxTime: parseInt(maxTime),
    preferences: preferences,
  };

  console.log("Données recette:", recipeData);

  // Sauvegarder et rediriger
  localStorage.setItem("recipeRequest", JSON.stringify(recipeData));

  // Afficher loading
  document.getElementById("loading").style.display = "block";
  document.getElementById("generateBtn").disabled = true;

  // Redirection après 1 seconde
  setTimeout(() => {
    window.location.href = "result.html";
  }, 1000);
}

// ==================== FONCTIONS GLOBALES ====================
// Pour qu'elles soient accessibles depuis HTML

window.filterCategory = function (category) {
  currentPage = 1;
  loadCategory(category);
};

window.loadMoreIngredients = function () {
  currentPage++;
  loadCategory(currentCategory);
};

window.decrement = function (fieldId) {
  const input = document.getElementById(fieldId);
  if (input.value > parseInt(input.min)) {
    input.value = parseInt(input.value) - 1;
  }
};

window.increment = function (fieldId) {
  const input = document.getElementById(fieldId);
  input.value = parseInt(input.value) + 1;
};

// ==================== UTILITAIRES ====================
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
