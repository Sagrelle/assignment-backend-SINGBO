const express = require('express');
const router = express.Router();
const User = require('../model/User');

// =====================
// LOGIN
// =====================
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (!user) {
    console.log("USER NOT FOUND");
    return res.status(401).json({ message: "Identifiants incorrects" });
  }
  console.log("USER FOUND:", user);

  res.json({
    message: "Connexion réussie",
    user: {
      username: user.username,
      role: user.role
    }
  });
});


// =====================
// REGISTER 🔥 AJOUT ICI
// =====================
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifier si utilisateur existe déjà
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Utilisateur déjà existant"
      });
    }

    // Créer utilisateur
    const newUser = new User({
      username,
      password,
      role: "user"
    });

    await newUser.save();

    res.json({
      message: "Inscription réussie",
      user: {
        username: newUser.username,
        role: newUser.role
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Erreur serveur",
      error
    });
  }
});

module.exports = router;