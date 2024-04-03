const mongoose = require('mongoose');
const { Schema } = mongoose;

const carrierSchema = new mongoose.Schema({
    rut: { type: String, required: true, unique: true },
    password: {type: String, required : true},
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: true },
    descripcion: { type: String },
    vehiculo: { type: String, required: true },
    patente: { type: String, required: true },
    ubicacion: { type: String},
    disponibilidad: { type: Boolean, default: false },
    capacidadCarga: { type: Number, required: true },
    calificacion: { type: Number, default: 0 },
    role: { type: String, required: true, default: 'carrier'},
  });
  
  module.exports = mongoose.model('Carrier', carrierSchema);