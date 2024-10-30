const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    userType: String
   
   
}, {
    collection: "Admin"
});

mongoose.model("Admin", AdminSchema);
