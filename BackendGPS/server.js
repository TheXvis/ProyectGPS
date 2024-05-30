const express = require('express');
const cors = require('cors');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
app.use(express.json());
app.use(cors());
const port = 3000;

const userRoutes = require('./routes/userRoutes');
const carrierRoutes = require('./routes/carrierRoutes');
const publicationRoutes = require('./routes/publicationRoutes');

const User = require('./models/userModel');
const Carrier = require('./models/carrierModel');


require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, 
}).then(() => console.log('Base de datos conectada')).catch(e => console.log(e));

app.use('/user', userRoutes);
app.use('/carrier', carrierRoutes);
app.use('/publication', publicationRoutes);
app.use('/images', express.static('images'));

app.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ rut: req.body.rut });
    let userType = 'user';

    if (!user) {
      user = await Carrier.findOne({ rut: req.body.rut });
      userType = 'carrier';
    }

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ _id: user._id, role: userType }, process.env.JWT_SECRET);
    res.status(200).json({ token: token, role: userType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});