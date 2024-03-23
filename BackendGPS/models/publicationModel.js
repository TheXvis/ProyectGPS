const mongoose = require('mongoose');
const { Schema } = mongoose;

const publicationSchema = new Schema({
    rutUsuario: { type: String, required: true },
    rutTransportista: { type: String },
    nombre: { type: String, required: true },
    tipoMercancia: { type: String, required: true },
    imagen: { type: String },
    peso: { type: Number, required: true },
    precio: { type: Number, required: true },
    ubicacion: { type: String, required: true },
    estado: { type: String},
  });

module.exports = mongoose.model('Publication', publicationSchema);