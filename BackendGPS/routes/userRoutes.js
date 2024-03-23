const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ rut: req.body.rut });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.status(200).json({ token: token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

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

module.exports = router;

