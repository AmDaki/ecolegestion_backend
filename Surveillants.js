const mongoose = require("mongoose");

const SurveillantsSchema = new mongoose.Schema({
    identifiant: String,
    classesAssignées: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classe' }]
}, {
    collection: "Surveillants"
});

mongoose.model("Surveillants", SurveillantsSchema);
