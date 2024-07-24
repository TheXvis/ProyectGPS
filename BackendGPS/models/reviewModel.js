const mongoose = require('mongoose');
const { Schema } = mongoose;

const reseñaSchema = new Schema({
  rutUser: { type: String, ref: 'user', required: true },
  rutCarrier: { type: String, ref: 'carrier', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comentario: { type: String, required: true }
});

module.exports = mongoose.model('Reseña', reseñaSchema);