const mongoose = require("mongoose");

const ClasseSchema = new mongoose.Schema({
    nomClasse: String,
    niveau: String,
    capacité: String,
    eleves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }],
    enseignants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }]
}, {
    collection: "Classe"
});

mongoose.model("Classe", ClasseSchema);
