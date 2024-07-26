const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
  rutUser: { type: String, required: true },
  rutCarrier: { type: String },
  nombre: { type: String, required: true },
  tipoMercancia: { type: String, required: true },
  imagen: { type: String },
  precio: { type: String },
  peso: { type: Number, required: true },
  estado: { type: String, default: 'Pendiente' },
});

module.exports = mongoose.model('Publication', publicationSchema);