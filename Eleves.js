const mongoose = require("mongoose");

const ElevesSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    DateNaiss: String,
    classe: String,
    userType: String,
    classeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classe' },
    bulletin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bulletin' }]
}, {
    collection: "Eleves"
});

mongoose.model("Eleves", ElevesSchema);
