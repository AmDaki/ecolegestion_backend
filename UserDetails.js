const mongoose = require("mongoose");

const UserDetailSchema=new mongoose.Schema({
    identifiant: String,
    nom: String,
    prenom: String,
    telephone: String,
    password: String,
    userType: String
},{
    collection: "UserInfo"
});

mongoose.model("UserInfo",UserDetailSchema);