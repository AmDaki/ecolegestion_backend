const mongoose = require("mongoose");

const ParentSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    userType: String,
    enfants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }]
}, {
    collection: "Parent"
});

mongoose.model("Parent", ParentSchema);
