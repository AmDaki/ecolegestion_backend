const mongoose = require("mongoose");

const ProfesseurSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    matieres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Matiere' }],
    classesEnseignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classe' }], 
    userType: String
}, {
    collection: "Professeur"
});

mongoose.model("Professeur", ProfesseurSchema);
