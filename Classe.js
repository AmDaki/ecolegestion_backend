const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema({
  nomClasse: { type: String, required: true, unique: true }, // Utilisé comme référence
  niveau: { type: String, required: true },
  capacite: { type: Number, required: true },
  professeur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professeur', // Référence au modèle Professeur
    required: true
  },
  eleves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eleves' // Référence au modèle Eleves
  }]
});

const Classe = mongoose.model("Classe", classeSchema);

module.exports = Classe;
