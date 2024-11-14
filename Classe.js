const mongoose = require("mongoose");

const classeSchema = new mongoose.Schema({
    nomClasse: { type: String, required: true },
    niveau: { type: String, required: true },
    capacite: { type: Number, required: true },
    professeur_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professeur', // Référence à la collection Professeur
    },
    EleveId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Eleves' },
});

const Classe = mongoose.model("Classe", classeSchema);

module.exports = Classe;
