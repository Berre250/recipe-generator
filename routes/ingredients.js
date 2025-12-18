// routes/ingredients.js
const express = require("express");
const router = express.Router();

const {
  searchProductsByText,
  mapToIngredientCards,
} = require("../services/openfoodfacts");

// GET /api/ingredients?q=tomate
router.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({ error: "Paramètre q manquant" });
    }

    const offJson = await searchProductsByText(q, 24);
    const cards = mapToIngredientCards(offJson);

    return res.json({
      query: q,
      count: cards.length,
      items: cards,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Erreur OFF", details: e.message });
  }
});

module.exports = router;
