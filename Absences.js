const mongoose = require('mongoose');

const AbsenceSchema = new mongoose.Schema({
  professeurId: { type: String, required: true },
  classe: { type: String, required: true },
  absents: [
    {
      nom: { type: String, required: true },
      prenom: { type: String, required: true },
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Absence', AbsenceSchema);
