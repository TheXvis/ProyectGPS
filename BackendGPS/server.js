const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes/fileRoutes');
require('dotenv').config();

const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
  .then(() => console.log('Base de datos conectada'))
  .catch(e => console.log(e));


  
app.use('/', router);

app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});