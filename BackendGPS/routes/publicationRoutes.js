const express = require('express');
const Publication = require('../models/publicationModel');
const User = require('../models/userModel');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images')
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // append the original file extension
  }
})

const upload = multer({ storage: storage });

router.post('/crear', upload.single('imagen'), async (req, res) => {
  const { rutUser } = req.body;
  const user = await User.findOne({ rut: rutUser });

  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const publication = new Publication({
    ...req.body,
    imagen: req.file ? req.file.path : 'No tiene',
  });

  try {
    await publication.save();
    res.status(201).send(publication);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/images/:filename', (req, res) => {
  res.sendFile(path.resolve('images', req.params.filename));
});

router.get('/verTodo', async (req, res) => {
  try {
    const publications = await Publication.find({});
    res.send(publications);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/ver/:rutUser', async (req, res) => {
  const rutUser = req.params.rutUser;
  try {
    const publications = await Publication.find({ rutUser: rutUser });
    if (!publications.length) {
      return res.status(404).send();
    }
    res.send(publications);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch('/editar/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  try {
    const publication = await Publication.findById(req.params.id);
    if (!publication) {
      return res.status(404).send();
    }
    updates.forEach((update) => publication[update] = req.body[update]);
    await publication.save();
    res.send(publication);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/borrar/:id', async (req, res) => {
  try {
    const publication = await Publication.findByIdAndDelete(req.params.id);
    if (!publication) {
      return res.status(404).send();
    }
    res.send(publication);
  } catch (e) {
    res.status(500).send();
  }
});

router.put('/cancelar/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const publication = await Publication.findById(_id);
    if (!publication) {
      return res.status(404).send({ error: 'Publication not found' });
    }
    publication.estado = 'cancelada';
    await publication.save();
    res.send("Publicacion cancelada con exito");
  } catch (e) {
    res.status(500).send({ error: 'An error occurred', details: e });
  }
});
module.exports = router;