const mongoose = require('mongoose');

const ProfSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: String,
  telephone: String,
  photo: String
});

module.exports = mongoose.model('Prof', ProfSchema);