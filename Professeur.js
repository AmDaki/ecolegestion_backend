const mongoose = require("mongoose");

const ProfesseurSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    classes: [{ type: String }],
    userType: String
}, {
    collection: "Professeur"
});

mongoose.model("Professeur", ProfesseurSchema);
