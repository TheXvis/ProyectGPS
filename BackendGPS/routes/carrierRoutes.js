const express = require('express');
const router = express.Router();
const Carrier = require('../models/carrierModel');
const Publication = require('../models/publicationModel');
const bcrypt = require('bcrypt');


router.post('/crear', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const carrier = new Carrier({
      ...req.body,
      password: hashedPassword,
    });

    await carrier.save();
    res.status(201).send(carrier);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/ver/:rut', async (req, res) => {
  try {
    const carrier = await Carrier.findOne({ rut: req.params.rut });
    if (!carrier) {
      return res.status(404).send("Not Found");
    }
    res.send(carrier);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/verTodos', async (req, res) => {
  try {
    const carriers = await Carrier.find({});
    res.send(carriers);
  } catch (error) {
    res.status(500).send();
  }
});

router.put('/editar/:rut', async (req, res) => {
  try {
    const carrier = await Carrier.findOneAndUpdate({ rut: req.params.rut }, req.body, { new: true });
    if (!carrier) {
      return res.status(404).send();
    }
    res.send(carrier);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete('/borrar/:rut', async (req, res) => {
  try {
    const carrier = await Carrier.findOneAndDelete({ rut: req.params.rut });
    if (!carrier) {
      return res.status(404).send();
    }
    res.send(carrier);
  } catch (error) {
    res.status(500).send();
  }
});

router.put('/aceptar/:publicationId/:carrierRut', async (req, res) => {
  const publicationId = req.params.publicationId;
  const carrierRut = req.params.carrierRut;
  try {
    const carrier = await Carrier.findOne({ rut: carrierRut });
    if (!carrier) {
      return res.status(404).send({ error: 'Carrier not found' });
    }
    const publication = await Publication.findById(publicationId);
    if (!publication) {
      return res.status(404).send({ error: 'Publication not found' });
    }
    publication.rutCarrier = carrier.rut;
    publication.estado = 'aceptada';
    await publication.save();
    res.send("Publicacion aceptada con exito");
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'An error occurred', details: e });
  }
});

router.put('/cambiarDisp/:rut', async (req, res) => {
  const rut = req.params.rut;
  try {
    const carrier = await Carrier.findOne({ rut: rut });
    if (!carrier) {
      return res.status(404).send({ error: 'Carrier not found' });
    }
    carrier.disponibilidad = !carrier.disponibilidad;
    await carrier.save();
    res.send(carrier);
  } catch (e) {
    res.status(500).send({ error: 'An error occurred', details: e });
  }
});
module.exports = router;