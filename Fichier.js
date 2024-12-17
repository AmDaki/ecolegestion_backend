const mongoose = require('mongoose');

const FichierSchema = new mongoose.Schema({
  nomFichier: {
    type: String,
    required: true,
  },
  chemin: {
    type: String,
    required: true,
  },
  dateAjout: {
    type: Date,
    default: Date.now,
  },
  classe: {
    type: String, // Peut être un identifiant de classe si vous utilisez des références
    required: true,
  },
});

module.exports = mongoose.model('Fichier', FichierSchema);
