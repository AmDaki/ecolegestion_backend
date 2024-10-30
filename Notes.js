const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    valeur: Number,
    matiere: String,
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
    matiereId: { type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' },
    enseignantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' },
    date: { type: Date, default: Date.now }
}, {
    collection: "Note"
});

mongoose.model("Note", NoteSchema);
