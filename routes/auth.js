const express = require("express");
const router = express.Router();
const auth = require("../services/auth");

router.get("/login", async (req, res, next) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.json({
      success: false,
      message: "Username ou mot de passe manquant",
    });
  }

  const user = await auth.login(username, password);

  if (!user) {
    return res.json({
      success: false,
      message: "Identifiants incorrects",
    });
  }

  res.json({
    success: true,
    message: "Connexion réussie",
    user,
  });
});

module.exports = router;
