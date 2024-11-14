const mongoose = require("mongoose");

const ProfesseurSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    classe_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classe', // Référence à la collection Classe
    },
    userType: String
}, {
    collection: "Professeur"
});

mongoose.model("Professeur", ProfesseurSchema);
