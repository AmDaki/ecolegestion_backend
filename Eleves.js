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
    classe: { type: String, default: null },
    absences: [{
        date: Date,
        estAbsent: Boolean
    }]
}, 
{
    collection: "Eleves" // Définir la collection ici
});

mongoose.model("Eleves", ElevesSchema);
