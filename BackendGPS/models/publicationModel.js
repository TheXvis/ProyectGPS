const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
  rutUser: { type: String, required: true },
  rutCarrier: { type: String },
  nombre: { type: String, required: true },
  tipoMercancia: { type: String, required: true },
  imagen: { type: String },
  peso: { type: Number, required: true },
  precio: { type: Number, required: false },
  ubicacionCarga: { type: Schema.Types.Mixed, required: false },
  ubicacionDescarga: { type: Schema.Types.Mixed, required: false },
  estado: { type: String, required: true, default: 'Disponible' },
});

module.exports = mongoose.model('Publication', publicationSchema);