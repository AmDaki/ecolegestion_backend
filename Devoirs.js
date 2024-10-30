const mongoose = require("mongoose");

const DevoirSchema = new mongoose.Schema({
    intitule: String,
    description: String,
    classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
    dateLimite: Date,
    enseignantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }
}, {
    collection: "Devoir"
});

mongoose.model("Devoir", DevoirSchema);
