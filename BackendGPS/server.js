const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Asegúrate de servir la carpeta de subidas

const port = 3000;

const userRoutes = require('./routes/userRoutes');
const carrierRoutes = require('./routes/carrierRoutes');
const publicationRoutes = require('./routes/publicationRoutes');
const cuponRoutes = require('./routes/cuponRoutes');

// Conexión a la base de datos
const uri = process.env.MONGODB_URI;
mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
}).then(() => console.log('Base de datos conectada')).catch(e => console.log(e));

// Uso de rutas
app.use('/user', userRoutes);
app.use('/carrier', carrierRoutes);
app.use('/publication', publicationRoutes);
app.use('/cupon', cuponRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta de login
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

// Ruta de registro
app.post('/registro', async (req, res) => {
  const { rut, password, Nombre, Apellido, Telefono, email } = req.body;

  const user = new User({ rut, password, Nombre, Apellido, email, Telefono });
  await user.save();

  res.status(201).send({ message: 'User registered successfully' });
});



// Middleware para manejar errores
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});
