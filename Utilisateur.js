const mongoose = require("mongoose");

const UtilisateurSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    email: String,
    password: String,
    userType: { type: String, enum: ['eleve', 'parent', 'enseignant', 'surveillant', 'administrateur'] }
}, {
    collection: "Utilisateur"
});

mongoose.model("Utilisateur", UtilisateurSchema);
