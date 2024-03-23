const express = require('express');
const Publication = require('../models/PublicationModel'); // Asegúrate de que la ruta al modelo es correcta
const router = express.Router();

router.post('/crear', async (req, res) => {
  const publication = new Publication(req.body);
  try {
    await publication.save();
    res.status(201).send(publication);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.get('/verTodo', async (req, res) => {
  try {
    const publications = await Publication.find({});
    res.send(publications);
  } catch (e) {
    res.status(500).send();
  }
});

router.get('/ver/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const publication = await Publication.findById(_id);
    if (!publication) {
      return res.status(404).send();
    }
    res.send(publication);
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

module.exports = router;