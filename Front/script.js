// Script JS pour l'application de recettes
// TODO: nettoyer le code plus tard

// Variable globale pour compter les ingrédients sélectionnés
let selectedIngredients = [];

// Fonction qui s'exécute quand la page charge
document.addEventListener("DOMContentLoaded", function () {
  console.log("Page chargée !");

  // Si on est sur la page des ingrédients
  if (document.getElementById("ingredientsGrid")) {
    initIngredientsPage();
  }

  // Si on est sur la page de recette
  if (document.getElementById("starRating")) {
    initRecipePage();
  }
});

// ===== PAGE DES INGRÉDIENTS =====

function initIngredientsPage() {
  // Récupère tous les ingrédients
  const ingredients = document.querySelectorAll(".ingredient-item");

  // Ajoute un event listener sur chaque ingrédient
  ingredients.forEach(function (ingredient) {
    ingredient.addEventListener("click", function () {
      toggleIngredient(this);
    });
  });

  console.log(
    "Page ingrédients initialisée avec " + ingredients.length + " ingrédients"
  );
}

// Fonction pour sélectionner/désélectionner un ingrédient
function toggleIngredient(element) {
  const ingredientName = element.getAttribute("data-ingredient");

  // Vérifie si l'ingrédient est déjà sélectionné
  if (element.classList.contains("selected")) {
    // Désélectionne
    element.classList.remove("selected");
    // Enlève de la liste
    const index = selectedIngredients.indexOf(ingredientName);
    if (index > -1) {
      selectedIngredients.splice(index, 1);
    }
  } else {
    // Sélectionne
    element.classList.add("selected");
    selectedIngredients.push(ingredientName);
  }

  // Met à jour le compteur
  updateCounter();
}

// Met à jour le compteur d'ingrédients
function updateCounter() {
  const counter = document.getElementById("ingredientCounter");
  if (counter) {
    counter.textContent =
      selectedIngredients.length + "/90 ingrédients sélectionnés";
  }
}

// Fonction pour générer la recette
function generateRecipe() {
  // TODO: connecter au backend plus tard
  console.log(
    "Génération de recette avec ces ingrédients:",
    selectedIngredients
  );

  if (selectedIngredients.length === 0) {
    alert("Veuillez sélectionner au moins un ingrédient !");
    return;
  }

  // Pour l'instant on redirige juste vers la page recette
  // Plus tard il faudra appeler l'API
  alert(
    "TODO: Connecter au backend pour générer la recette\n\nIngrédients sélectionnés: " +
      selectedIngredients.length
  );

  // Redirection vers la page recette (pour l'instant avec une recette exemple)
  window.location.href = "recipe.html";
}

// ===== PAGE DE LOGIN =====

function handleLogin(event) {
  event.preventDefault(); // Empêche le rechargement de la page

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Validation basique
  if (email === "" || password === "") {
    alert("Veuillez remplir tous les champs !");
    return false;
  }

  // TODO: faire la vraie connexion avec l'API
  console.log("Tentative de connexion avec:", email);

  // Pour l'instant on simule une connexion réussie
  alert("Connexion réussie ! (simulation)");

  // Redirige vers la page des ingrédients
  window.location.href = "ingredients.html";

  return false;
}

// ===== PAGE D'INSCRIPTION =====

function handleSignup(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Vérification des champs vides
  if (
    name === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    alert("Tous les champs sont obligatoires !");
    return false;
  }

  // Vérification que les mots de passe correspondent
  if (password !== confirmPassword) {
    alert("Les mots de passe ne correspondent pas !");
    return false;
  }

  // TODO: vérifier la longueur du mot de passe (minimum 8 caractères par exemple)

  // TODO: appeler l'API d'inscription
  console.log("Inscription de:", name, email);

  alert(
    "Inscription réussie ! (simulation)\nVous pouvez maintenant vous connecter."
  );

  // Redirige vers la page de connexion
  window.location.href = "login.html";

  return false;
}

// ===== PAGE DE RECETTE =====

function initRecipePage() {
  const stars = document.querySelectorAll(".star");

  // Ajoute les événements sur les étoiles
  stars.forEach(function (star, index) {
    star.addEventListener("click", function () {
      rateRecipe(index + 1);
    });

    // Effet hover
    star.addEventListener("mouseenter", function () {
      highlightStars(index + 1);
    });
  });

  // Remet les étoiles à zéro quand on sort de la zone
  document.querySelector(".stars").addEventListener("mouseleave", function () {
    const currentRating = getCurrentRating();
    highlightStars(currentRating);
  });
}

// Fonction pour noter la recette
function rateRecipe(rating) {
  console.log("Note donnée:", rating);

  // TODO: envoyer la note au backend

  highlightStars(rating);

  // Sauvegarde la note (pour l'instant juste dans la page)
  document.querySelector(".stars").setAttribute("data-rating", rating);

  alert("Merci pour votre note de " + rating + " étoiles !");
}

// Met en surbrillance les étoiles jusqu'à un certain niveau
function highlightStars(count) {
  const stars = document.querySelectorAll(".star");
  stars.forEach(function (star, index) {
    if (index < count) {
      star.classList.add("active");
      star.textContent = "★";
    } else {
      star.classList.remove("active");
      star.textContent = "☆";
    }
  });
}

// Récupère la note actuelle
function getCurrentRating() {
  const starsContainer = document.querySelector(".stars");
  if (starsContainer) {
    return parseInt(starsContainer.getAttribute("data-rating")) || 0;
  }
  return 0;
}

// ===== FONCTIONS UTILITAIRES =====

// Fonction pour afficher un message (pas utilisée pour l'instant)
function showMessage(message, type) {
  // TODO: créer une belle notification
  alert(message);
}

// Fonction pour valider un email
function isValidEmail(email) {
  // Regex simple pour valider l'email
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Fonction pour débugger - à retirer plus tard
function debug() {
  console.log("=== DEBUG INFO ===");
  console.log("Ingrédients sélectionnés:", selectedIngredients);
  console.log("URL actuelle:", window.location.href);
  console.log("==================");
}

// Log pour vérifier que le script est bien chargé
console.log("✅ Script chargé avec succès");

// ========= SÉLECTION D’INGRÉDIENTS (ingredients.html) =========
document.addEventListener("DOMContentLoaded", () => {
  const ingredientsPage = document.querySelector(".ingredients-page");
  if (ingredientsPage) initIngredientsPage();

  const recipePage = document.querySelector(".recipe-page");
  if (recipePage) initRecipePage();

  const historyPage = document.querySelector(".history-page");
  if (historyPage) initHistoryPage();
});

function initIngredientsPage() {
  const ingredientCards = document.querySelectorAll(".ingredient-card");
  const selectedListEl = document.getElementById("selected-ingredients");
  const counterEl = document.getElementById("ingredient-counter");
  const generateBtn = document.getElementById("generate-recipe-btn");

  const peopleInput = document.getElementById("people-count");
  const cookTimeInput = document.getElementById("max-cook-time");
  const notesInput = document.getElementById("user-notes");

  let selectedIngredients = [];

  ingredientCards.forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.dataset.name;

      if (selectedIngredients.includes(name)) {
        selectedIngredients = selectedIngredients.filter((i) => i !== name);
        card.classList.remove("selected");
      } else {
        selectedIngredients.push(name);
        card.classList.add("selected");
      }

      updateIngredientUI();
    });
  });

  function updateIngredientUI() {
    counterEl.textContent = `${selectedIngredients.length}/90 ingrédients sélectionnés`;

    selectedListEl.innerHTML = "";
    selectedIngredients.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      selectedListEl.appendChild(li);
    });
  }

  generateBtn.addEventListener("click", () => {
    if (selectedIngredients.length === 0) {
      alert("Sélectionne au moins un ingrédient 🙂");
      return;
    }

    const payload = {
      ingredients: selectedIngredients,
      people: Number(peopleInput.value || 2),
      maxCookTime: Number(cookTimeInput.value || 30),
      notes: notesInput.value || "",
    };

    // On stocke pour la page recette
    localStorage.setItem("recipeRequest", JSON.stringify(payload));
    window.location.href = "recipe.html";
  });
}

// ========= PAGE RECETTE (recipe.html) =========
function initRecipePage() {
  const recipeLoadingEl = document.getElementById("recipe-loading");
  const recipeTextEl = document.getElementById("recipe-text");
  const saveBtn = document.getElementById("save-history-btn");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("rating-comment");

  const requestStr = localStorage.getItem("recipeRequest");
  if (!requestStr) {
    recipeLoadingEl.textContent =
      "Aucune sélection trouvée. Retourne à la page ingrédients.";
    return;
  }

  const requestData = JSON.parse(requestStr);
  generateRecipe(requestData)
    .then((text) => {
      recipeLoadingEl.style.display = "none";
      recipeTextEl.textContent = text;
    })
    .catch((err) => {
      console.error(err);
      recipeLoadingEl.textContent =
        "Erreur lors de la génération de la recette.";
    });

  saveBtn.addEventListener("click", () => {
    if (!recipeTextEl.textContent.trim()) return;

    const entry = {
      date: new Date().toISOString(),
      request: requestData,
      recipeText: recipeTextEl.textContent,
      rating: Number(ratingInput.value || 0),
      comment: commentInput.value || "",
    };

    const historyStr = localStorage.getItem("recipeHistory");
    let history = historyStr ? JSON.parse(historyStr) : [];
    history.push(entry);
    localStorage.setItem("recipeHistory", JSON.stringify(history));

    alert("Recette enregistrée dans l’historique ✅");
  });
}

/**
 * Génére une recette à partir des paramètres.
 * Ici on met un exemple de texte "fake" pour que ça marche sans backend.
 * Tu remplaceras l’intérieur par un appel à ton backend (OpenAI + Open Food Facts).
 */
async function generateRecipe({ ingredients, people, maxCookTime, notes }) {
  // — VERSION SIMPLE SANS API (pour tester l’UI) —
  const fakeText = `
Recette improvisée avec : ${ingredients.join(", ")}

Pour ${people} personne(s), temps max : ${maxCookTime} minutes.

Préférences / contraintes : ${notes || "aucune"}.

1. Prépare tous tes ingrédients en petits dés ou lamelles.
2. Lance la cuisson des ingrédients les plus longs à cuire.
3. Assaisonne avec sel, poivre, herbes et un filet d'huile d'olive.
4. Termine la cuisson en gardant du croquant et déguste immédiatement !

(Remplace ce texte par la réponse OpenAI)
  `.trim();

  return fakeText;

  // — VERSION À CONNECTER À TON BACKEND —
  // const response = await fetch('https://ton-backend.com/api/generate-recipe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ingredients, people, maxCookTime, notes })
  // });
  // const data = await response.json();
  // return data.recipeText;
}

// ========= PAGE HISTORIQUE (history.html) =========
function initHistoryPage() {
  const listEl = document.getElementById("history-list");
  const historyStr = localStorage.getItem("recipeHistory");

  if (!historyStr) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  const history = JSON.parse(historyStr);
  if (history.length === 0) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  history.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "history-card";

    const date = new Date(entry.date).toLocaleString("fr-FR");

    card.innerHTML = `
      <h2>Recette du ${date}</h2>
      <p><strong>Ingrédients :</strong> ${entry.request.ingredients.join(
        ", "
      )}</p>
      <p><strong>Personnes :</strong> ${entry.request.people}</p>
      <p><strong>Temps max :</strong> ${entry.request.maxCookTime} min</p>
      ${entry.rating ? `<p><strong>Note :</strong> ${entry.rating}/5</p>` : ""}
      ${
        entry.comment
          ? `<p><strong>Commentaire :</strong> ${entry.comment}</p>`
          : ""
      }
      <details>
        <summary>Voir la recette</summary>
        <pre>${entry.recipeText}</pre>
      </details>
    `;
    listEl.appendChild(card);
  });
}
// ========= SÉLECTION D’INGRÉDIENTS (ingredients.html) =========
document.addEventListener("DOMContentLoaded", () => {
  const ingredientsPage = document.querySelector(".ingredients-page");
  if (ingredientsPage) initIngredientsPage();

  const recipePage = document.querySelector(".recipe-page");
  if (recipePage) initRecipePage();

  const historyPage = document.querySelector(".history-page");
  if (historyPage) initHistoryPage();
});

function initIngredientsPage() {
  const ingredientCards = document.querySelectorAll(".ingredient-card");
  const selectedListEl = document.getElementById("selected-ingredients");
  const counterEl = document.getElementById("ingredient-counter");
  const generateBtn = document.getElementById("generate-recipe-btn");

  const peopleInput = document.getElementById("people-count");
  const cookTimeInput = document.getElementById("max-cook-time");
  const notesInput = document.getElementById("user-notes");

  let selectedIngredients = [];

  ingredientCards.forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.dataset.name;

      if (selectedIngredients.includes(name)) {
        selectedIngredients = selectedIngredients.filter((i) => i !== name);
        card.classList.remove("selected");
      } else {
        selectedIngredients.push(name);
        card.classList.add("selected");
      }

      updateIngredientUI();
    });
  });

  function updateIngredientUI() {
    counterEl.textContent = `${selectedIngredients.length}/90 ingrédients sélectionnés`;

    selectedListEl.innerHTML = "";
    selectedIngredients.forEach((name) => {
      const li = document.createElement("li");
      li.textContent = name;
      selectedListEl.appendChild(li);
    });
  }

  generateBtn.addEventListener("click", () => {
    if (selectedIngredients.length === 0) {
      alert("Sélectionne au moins un ingrédient 🙂");
      return;
    }

    const payload = {
      ingredients: selectedIngredients,
      people: Number(peopleInput.value || 2),
      maxCookTime: Number(cookTimeInput.value || 30),
      notes: notesInput.value || "",
    };

    // On stocke pour la page recette
    localStorage.setItem("recipeRequest", JSON.stringify(payload));
    window.location.href = "recipe.html";
  });
}

// ========= PAGE RECETTE (recipe.html) =========
function initRecipePage() {
  const recipeLoadingEl = document.getElementById("recipe-loading");
  const recipeTextEl = document.getElementById("recipe-text");
  const saveBtn = document.getElementById("save-history-btn");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("rating-comment");

  const requestStr = localStorage.getItem("recipeRequest");
  if (!requestStr) {
    recipeLoadingEl.textContent =
      "Aucune sélection trouvée. Retourne à la page ingrédients.";
    return;
  }

  const requestData = JSON.parse(requestStr);
  generateRecipe(requestData)
    .then((text) => {
      recipeLoadingEl.style.display = "none";
      recipeTextEl.textContent = text;
    })
    .catch((err) => {
      console.error(err);
      recipeLoadingEl.textContent =
        "Erreur lors de la génération de la recette.";
    });

  saveBtn.addEventListener("click", () => {
    if (!recipeTextEl.textContent.trim()) return;

    const entry = {
      date: new Date().toISOString(),
      request: requestData,
      recipeText: recipeTextEl.textContent,
      rating: Number(ratingInput.value || 0),
      comment: commentInput.value || "",
    };

    const historyStr = localStorage.getItem("recipeHistory");
    let history = historyStr ? JSON.parse(historyStr) : [];
    history.push(entry);
    localStorage.setItem("recipeHistory", JSON.stringify(history));

    alert("Recette enregistrée dans l’historique ✅");
  });
}

/**
 * Génére une recette à partir des paramètres.
 * Ici on met un exemple de texte "fake" pour que ça marche sans backend.
 * Tu remplaceras l’intérieur par un appel à ton backend (OpenAI + Open Food Facts).
 */
async function generateRecipe({ ingredients, people, maxCookTime, notes }) {
  // — VERSION SIMPLE SANS API (pour tester l’UI) —
  const fakeText = `
  Recette improvisée avec : ${ingredients.join(", ")}
  
  Pour ${people} personne(s), temps max : ${maxCookTime} minutes.
  
  Préférences / contraintes : ${notes || "aucune"}.
  
  1. Prépare tous tes ingrédients en petits dés ou lamelles.
  2. Lance la cuisson des ingrédients les plus longs à cuire.
  3. Assaisonne avec sel, poivre, herbes et un filet d'huile d'olive.
  4. Termine la cuisson en gardant du croquant et déguste immédiatement !
  
  (Remplace ce texte par la réponse OpenAI)
    `.trim();

  return fakeText;

  // — VERSION À CONNECTER À TON BACKEND —
  // const response = await fetch('https://ton-backend.com/api/generate-recipe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ingredients, people, maxCookTime, notes })
  // });
  // const data = await response.json();
  // return data.recipeText;
}

// ========= PAGE HISTORIQUE (history.html) =========
function initHistoryPage() {
  const listEl = document.getElementById("history-list");
  const historyStr = localStorage.getItem("recipeHistory");

  if (!historyStr) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  const history = JSON.parse(historyStr);
  if (history.length === 0) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  history.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "history-card";

    const date = new Date(entry.date).toLocaleString("fr-FR");

    card.innerHTML = `
        <h2>Recette du ${date}</h2>
        <p><strong>Ingrédients :</strong> ${entry.request.ingredients.join(
          ", "
        )}</p>
        <p><strong>Personnes :</strong> ${entry.request.people}</p>
        <p><strong>Temps max :</strong> ${entry.request.maxCookTime} min</p>
        ${
          entry.rating ? `<p><strong>Note :</strong> ${entry.rating}/5</p>` : ""
        }
        ${
          entry.comment
            ? `<p><strong>Commentaire :</strong> ${entry.comment}</p>`
            : ""
        }
        <details>
          <summary>Voir la recette</summary>
          <pre>${entry.recipeText}</pre>
        </details>
      `;
    listEl.appendChild(card);
  });
}
document.addEventListener("scroll", () => {
  const header = document.querySelector(".app-header");
  if (!header) return;

  const scrolled = window.scrollY > 10;
  header.classList.toggle("app-header-scrolled", scrolled);
});
