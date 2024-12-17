const mongoose = require("mongoose");

const ElevesSchema = new mongoose.Schema({
  identifiant: String,
  nom: String,
  prenom: String,
  telephone: String,
  password: String,
  DateNaissance: String,
  userType: String,
  NiveauClasse: String,
  classe: { type: String, default: null }, // Utilisation de nomClasse comme référence
  absences: [{
    date: Date,
    estAbsent: Boolean
  }],
  fichiers: [{
    nomFichier: String,
    chemin: String, // Stocker le chemin ou l'URL du fichier
    dateAjout: { type: Date, default: Date.now }
  }]
});

const Eleves = mongoose.model("Eleves", ElevesSchema);

module.exports = Eleves;
