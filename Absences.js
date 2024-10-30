const mongoose = require("mongoose");

const AbsenceSchema = new mongoose.Schema({
    eleveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' },
    surveillantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Surveillant' },
    dateAbsence: Date,
    justification: String
}, {
    collection: "Absence"
});

mongoose.model("Absence", AbsenceSchema);
