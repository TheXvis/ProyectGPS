const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/crear', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        ...req.body,
        password: hashedPassword,
      });
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (error) {
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

