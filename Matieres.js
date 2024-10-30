const mongoose = require("mongoose");

const MatiereSchema = new mongoose.Schema({
    nomMatiere: String,
    enseignants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enseignant' }]
}, {
    collection: "Matiere"
});

mongoose.model("Matiere", MatiereSchema);
