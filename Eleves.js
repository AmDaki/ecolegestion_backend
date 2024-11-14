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

    classeId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Classe' },
}, {
    collection: "Eleves"
});

mongoose.model("Eleves", ElevesSchema);
