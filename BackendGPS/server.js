const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;
const userRoutes = require('./routes/userRoutes');
const carrierRoutes = require('./routes/carrierRoutes');

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


app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});