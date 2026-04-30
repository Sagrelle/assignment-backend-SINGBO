const mongoose = require('mongoose');

const MatiereSchema = new mongoose.Schema({
  nom: String,
  image: String,
  prof: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prof'
  }
});

module.exports = mongoose.model("Matiere", MatiereSchema, "matiere");