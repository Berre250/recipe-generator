const express = require("express");
const router = express.Router();
const auth = require("../services/auth");

router.get("/{:username&}{:password}", async (req, res, next) => {
  try {
    console.log(req.query);
    // const { username, password } = req.body;

    // // 1) Vérif body
    // if (!username || !password) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Missing username or password",
    //   });
    // }

    // 2) Appel service
    const user = await auth.login(req.query.username, req.query.password);

    // // 3) Identifiants invalides
    // if (!user) {
    //   return res.status(401).json({
    //     error: true,
    //     message: "Invalid credentials",
    //   });
    // }

    // // 4) OK
    // return res.status(200).json({
    //   success: true,
    //   message: "login successful",
    //   user,
    // });
  } catch (err) {
    console.error(`Error while getting users `, err.message);
    next(err);
  }
});

module.exports = router;
