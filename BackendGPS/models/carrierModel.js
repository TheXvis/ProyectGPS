const mongoose = require('mongoose');
const { Schema } = mongoose;

const carrierSchema = new mongoose.Schema({
    rut: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    descripcion: { type: String },
    vehiculo: { type: String, required: true },
    patente: { type: String, required: true },
    ubicacion: { type: String},
    capacidadCarga: { type: Number, required: true },
    calificacion: { type: Number, default: 0 },
  });
  
  module.exports = mongoose.model('Carrier', carrierSchema);