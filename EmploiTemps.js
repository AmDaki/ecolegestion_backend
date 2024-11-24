const mongoose = require('mongoose');

const EmploiTempsSchema = new mongoose.Schema({
  classe: { type: String, required: true, unique: true },
  emploiDuTemps: { type: Object, required: true },
}, { timestamps: true });

module.exports = mongoose.model('EmploiTemps', EmploiTempsSchema);
