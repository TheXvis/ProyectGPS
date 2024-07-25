const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();



router.post('/crear', async (req, res) => {
  try {
    const { rut, password, Nombre, Apellido, Telefono, email, role } = req.body;

    console.log('Datos recibidos:', req.body); 

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      rut,
      password: hashedPassword,
      Nombre,
      Apellido,
      Telefono,
      email,
      role: role || 'user' 
    });

    console.log('Usuario creado:', newUser); // Verifica el objeto de usuario antes de guardarlo

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error al crear usuario:', error);

    if (error.code === 11000) {
      // Clave duplicada
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({ message: `El ${field} ya está registrado` });
    } else {
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { rut, password } = req.body;

  try {
    console.log(`Intentando iniciar sesión con RUT: ${rut}`); // Log para el RUT

    const user = await User.findOne({ rut });
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log(`Usuario encontrado: ${JSON.stringify(user)}`); // Log para el usuario encontrado

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log(`Contraseña correcta. Rol del usuario: ${user.role}`); // Log para la contraseña correcta y el rol del usuario

    const token = jwt.sign(
      { rut: user.rut, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log(`Token generado para el usuario con rol: ${user.role}`); // Log para el token generado

    res.json({ token, role: user.role });
  } catch (error) {
    console.error(`Error en el endpoint de login: ${error.message}`); // Log para errores
    res.status(500).json({ error: error.message });
  }
});


router.get('/verTodos', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/ver/:rut', async (req, res) => {
    try {
      const user = await User.findOne({ rut: req.params.rut });
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.delete('/borrar/:rut', async (req, res) => {
    try {
      const user = await User.findOneAndDelete({ rut: req.params.rut });
      if (user) {
        res.status(200).json({ message: 'User deleted' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put('/editar/:rut', async (req, res) => {
    try {
      const user = await User.findOne({ rut: req.params.rut });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const updatedUser = await User.findOneAndUpdate(
        { rut: req.params.rut },
        req.body,
        { new: true }
      );
  
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post('/registro', async (req, res) => {
    try {
      const { rut, password, Nombre, Apellido, email, Telefono } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        rut,
        password: hashedPassword,
        Nombre,
        Apellido,
        email,
        Telefono
        
      });
      
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});



module.exports = router;

