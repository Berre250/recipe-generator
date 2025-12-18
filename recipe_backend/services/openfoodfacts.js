// services/openfoodfacts.js
const OFF_BASE = "https://world.openfoodfacts.org";

async function searchProductsByText(query, pageSize = 24) {
  const url = new URL("/cgi/search.pl", OFF_BASE);
  url.searchParams.set("search_simple", "1");
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("search_terms", query);

  // On limite les champs pour aller plus vite
  // image_front_url est très utile pour afficher des images de face
  url.searchParams.set("fields", "product_name,image_front_url,image_url,code");

  const res = await fetch(url.toString(), {
    headers: { "User-Agent": "MaCuisine/1.0 (school project)" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`OFF error ${res.status}: ${text.slice(0, 120)}`);
  }

  return res.json();
}

function mapToIngredientCards(offJson) {
  const products = Array.isArray(offJson.products) ? offJson.products : [];

  // On transforme en { name, imageUrl }
  const cards = products
    .map((p) => {
      const name = (p.product_name || "").trim();
      const imageUrl = p.image_front_url || p.image_url || "";
      if (!name || !imageUrl) return null;
      return { name, imageUrl };
    })
    .filter(Boolean);

  // Dé-doublonnage par nom
  const seen = new Set();
  return cards.filter((c) => {
    const key = c.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { searchProductsByText, mapToIngredientCards };
