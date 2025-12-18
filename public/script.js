console.log("✅ Script chargé");

// ========= INIT =========
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".ingredients-page")) initIngredientsPage();
  if (document.querySelector(".recipe-page")) initRecipePage();
  if (document.querySelector(".history-page")) initHistoryPage();

  // Header scroll (optionnel)
  const header = document.querySelector(".app-header");
  if (header) {
    document.addEventListener("scroll", () => {
      header.classList.toggle("app-header-scrolled", window.scrollY > 10);
    });
  }
});

// ========= FILTRE “INGRÉDIENTS PROPRES” =========
function isCleanIngredientName(name) {
  const n = name.toLowerCase().trim();

  // ❌ mots qui indiquent souvent un produit transformé
  const blacklist = [
    "ketchup",
    "chips",
    "biscuit",
    "gâteau",
    "gateau",
    "chocolat",
    "bonbon",
    "pizza",
    "sandwich",
    "burger",
    "tacos",
    "wrap",
    "nugget",
    "plat",
    "cuisiné",
    "cuisinee",
    "cuisinée",
    "prêt",
    "pret",
    "micro-ondes",
    "sauce",
    "pesto",
    "mayonnaise",
    "moutarde",
    "vinaigrette",
    "soupe",
    "velouté",
    "veloute",
    "conserve",
    "boîte",
    "boite",
    "boisson",
    "jus",
    "soda",
    "coca",
    "barre",
    "céréales",
    "cereales",
    "dessert",
    "glace",
    "aromatisé",
    "aromatise",
    "saveur",
    "arôme",
    "arome",
    "épices",
    "epices",
    "assaisonnement",
  ];

  if (blacklist.some((w) => n.includes(w))) return false;

  // ✅ heuristiques “ingrédient brut”
  // 1) noms très longs = souvent marketing (ex: "miettes de ... à la sauce ...")
  if (n.length > 32) return false;

  // 2) trop de mots = souvent produit composé
  const words = n.split(/\s+/).filter(Boolean);
  if (words.length > 4) return false;

  // 3) chiffres / poids / pourcentages = souvent emballage
  if (/\b\d+(\.\d+)?\s?(g|kg|ml|l|cl|%)\b/i.test(n)) return false;

  return true;
}

// ========= PAGE INGREDIENTS =========
async function initIngredientsPage() {
  const grid = document.querySelector(".ingredients-grid");
  const selectedListEl = document.getElementById("selected-ingredients");
  const counterEl = document.getElementById("ingredient-counter");
  const generateBtn = document.getElementById("generate-recipe-btn");

  const peopleInput = document.getElementById("people-count");
  const cookTimeInput = document.getElementById("max-cook-time");
  const notesInput = document.getElementById("user-notes");

  let selectedIngredients = [];

  // ✅ Mots-clés “mix” (ajoute/enlève ce que tu veux)
  const keywords = [
    // légumes
    "tomate",
    "oignon",
    "ail",
    "carotte",
    "poivron",
    "brocoli",
    "courgette",
    "aubergine",
    "pomme de terre",
    "champignon",
    // protéines
    "poulet",
    "boeuf",
    "thon",
    "saumon",
    "oeuf",
    "lentilles",
    "pois chiches",
    // féculents
    "riz",
    "pâtes",
    "semoule",
    "farine",
    // produits simples
    "fromage",
    "beurre",
    "huile",
    "crème",
    // épices simples (si tu veux les garder, enlève "épices" de la blacklist)
    "sel",
    "poivre",
  ];

  // Petit message de chargement
  grid.innerHTML = `<p style="padding:12px;">Chargement des ingrédients…</p>`;

  try {
    // 1) Appels API en parallèle
    const responses = await Promise.all(
      keywords.map((kw) =>
        fetch(
          `http://localhost:3000/api/ingredients?q=${encodeURIComponent(kw)}`
        )
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    );

    // 2) Merge items
    const allItems = responses
      .filter(Boolean)
      .flatMap((d) => (Array.isArray(d.items) ? d.items : []));

    // 3) Dé-doublonnage + filtre “propre”
    const seen = new Set();
    let items = allItems.filter((it) => {
      const name = (it.name || "").trim();
      const imageUrl = (it.imageUrl || "").trim();
      if (!name || !imageUrl) return false;

      if (!isCleanIngredientName(name)) return false;

      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // 4) Mélange (shuffle) pour une liste vraiment “mix”
    items = items.sort(() => Math.random() - 0.5);

    // 5) Limite à 90 max
    items = items.slice(0, 90);

    // 6) Render
    grid.innerHTML = "";
    if (items.length === 0) {
      grid.innerHTML = `<p style="padding:12px;">Aucun ingrédient trouvé (filtre trop strict). Dis-moi et je l’assouplis.</p>`;
      return;
    }

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.className = "ingredient-card";
      btn.dataset.name = item.name;

      btn.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.name}">
        <span>${item.name}</span>
      `;

      btn.addEventListener("click", () => {
        const name = btn.dataset.name;

        if (selectedIngredients.includes(name)) {
          selectedIngredients = selectedIngredients.filter((i) => i !== name);
          btn.classList.remove("selected");
        } else {
          selectedIngredients.push(name);
          btn.classList.add("selected");
        }
        updateIngredientUI();
      });

      grid.appendChild(btn);
    });

    updateIngredientUI();
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="padding:12px;">Erreur chargement. Vérifie que le backend tourne sur http://localhost:3000</p>`;
  }

  function updateIngredientUI() {
    if (counterEl) {
      counterEl.textContent = `${selectedIngredients.length}/90 ingrédients sélectionnés`;
    }

    if (selectedListEl) {
      selectedListEl.innerHTML = "";
      selectedIngredients.forEach((name) => {
        const li = document.createElement("li");
        li.textContent = name;
        selectedListEl.appendChild(li);
      });
    }
  }

  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      if (selectedIngredients.length === 0) {
        alert("Sélectionne au moins un ingrédient 🙂");
        return;
      }

      const payload = {
        ingredients: selectedIngredients,
        people: Number(peopleInput?.value || 2),
        maxCookTime: Number(cookTimeInput?.value || 30),
        notes: notesInput?.value || "",
      };

      localStorage.setItem("recipeRequest", JSON.stringify(payload));
      window.location.href = "../recipe/index.html";
    });
  }
}

// ========= PAGE RECETTE =========
function initRecipePage() {
  const recipeLoadingEl = document.getElementById("recipe-loading");
  const recipeTextEl = document.getElementById("recipe-text");
  const saveBtn = document.getElementById("save-history-btn");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("rating-comment");

  const requestStr = localStorage.getItem("recipeRequest");
  if (!requestStr) {
    if (recipeLoadingEl) {
      recipeLoadingEl.textContent =
        "Aucune sélection trouvée. Retourne à la page ingrédients.";
    }
    return;
  }

  const requestData = JSON.parse(requestStr);

  generateRecipeFake(requestData)
    .then((text) => {
      if (recipeLoadingEl) recipeLoadingEl.style.display = "none";
      if (recipeTextEl) recipeTextEl.textContent = text;
    })
    .catch((err) => {
      console.error(err);
      if (recipeLoadingEl)
        recipeLoadingEl.textContent = "Erreur génération recette.";
    });

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      if (!recipeTextEl || !recipeTextEl.textContent.trim()) return;

      const entry = {
        date: new Date().toISOString(),
        request: requestData,
        recipeText: recipeTextEl.textContent,
        rating: Number(ratingInput?.value || 0),
        comment: commentInput?.value || "",
      };

      const historyStr = localStorage.getItem("recipeHistory");
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.push(entry);
      localStorage.setItem("recipeHistory", JSON.stringify(history));

      alert("Recette enregistrée dans l’historique ✅");
    });
  }
}

async function generateRecipeFake({ ingredients, people, maxCookTime, notes }) {
  return `
Recette improvisée avec : ${ingredients.join(", ")}

Pour ${people} personne(s), temps max : ${maxCookTime} minutes.
Préférences / contraintes : ${notes || "aucune"}.

1. Prépare tous tes ingrédients.
2. Lance la cuisson des plus longs à cuire.
3. Assaisonne et ajuste.
4. Déguste !

(Remplace ce texte par OpenAI plus tard)
`.trim();
}

// ========= PAGE HISTORIQUE =========
function initHistoryPage() {
  const listEl = document.getElementById("history-list");
  if (!listEl) return;

  const historyStr = localStorage.getItem("recipeHistory");
  if (!historyStr) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  const history = JSON.parse(historyStr);
  if (!history.length) {
    listEl.textContent = "Aucune recette enregistrée pour le moment.";
    return;
  }

  listEl.innerHTML = "";
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

// ========= LOGIN =========
function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;

  if (!username || !password) {
    alert("Veuillez remplir tous les champs");
    return false;
  }

  fetch(
    `http://localhost:3000/auth/login?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`,
    {
      method: "GET",
    }
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Réponse login :", data);

      if (data.success) {
        alert("Connexion réussie ✅");

        window.location.href = "ingredients.html";
      } else {
        alert(data.message || "Identifiants incorrects");
      }
    })
    .catch((err) => {
      console.error("Erreur login :", err);
      alert("Erreur serveur");
    });

  return false;
}
