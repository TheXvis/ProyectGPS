const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
    rutUser: { type: String, required: true },
    rutCarrier: { type: String },
    nombre: { type: String, required: true },
    tipoMercancia: { type: String, required: true },
    imagen: { type: String },
    peso: { type: Number, required: true },
    precio: { type: Number, required: true },
    ubicacionCarga: { type: String, required: true },
    ubicacionDescarga: { type: String, required: true },
    estado: { type: String},
  });

module.exports = mongoose.model('Publication', publicationSchema);