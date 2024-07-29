const mongoose = require('mongoose');
const { Schema } = mongoose;

const carrierSchema = new mongoose.Schema({
    rut: { type: String, required: true, unique: true },
    password: {type: String, required : true},
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    telefono: { type: String, required: false },
    descripcion: { type: String },
    vehiculo: { type: String, required: false },
    patente: { type: String, required: false },
    ubicacion: { type: String},
    disponibilidad: { type: Boolean, default: false },
    capacidadCarga: { type: Number, required: false },
    calificacion: { type: Number, default: 0 },
    role: { type: String, required: true, default: 'carrier'},
    email: { type: String, required: false },
    imagenCarrier: { type: String, required: false },
  });
  
  module.exports = mongoose.model('Carrier', carrierSchema);