const express = require('express');
const app = express();
const port = 3000;
const router = require('./routes/fileRoutes');

app.use('/', router);

app.listen(port, () => {
  console.log(`Aplicación escuchando en http://localhost:${port}`);
});