const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  rut: { type: String, required: true, unique: true },
  password: {type: String, required : true},
  
  Nombre: { type: String, required: true },
  Apellido: { type: String, required: true },
  Telefono: { type: String, required: true },
  email: { type: String, required: true },
  publicaciones: {type: String},
  role: { type: String, required: true, default: 'admin'},
});
  
  const User = mongoose.model('userModel', userSchema);
  
  module.exports = User;