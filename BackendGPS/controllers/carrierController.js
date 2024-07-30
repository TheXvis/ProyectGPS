const express = require('express');
const Carrier = require('../models/carrierModel');
const bcrypt = require('bcrypt');
const Publication = require('../models/publicationModel');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadsCarrier/'); // Carpeta donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

const createCarrier = async (req, res) => {
    try {
        const { nombre, apellido, rut } = req.body;
        const regex = /^[a-zA-Z\s]+$/;

        if (!regex.test(nombre) || !regex.test(apellido)) {
            return res.status(400).send({ error: 'Nombre y apellido solo pueden contener letras.' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const carrierData = {
            ...req.body,
            password: hashedPassword,
        };

        if (req.file) {
            carrierData.imagenCarrier = req.file.path; // Guardar la ruta del archivo si existe
        }

        const carrier = new Carrier(carrierData);
        await carrier.save();
        res.status(201).send(carrier);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};

const getCarrier = async (req, res) => {
    try {
        const carrier = await Carrier.findOne({ rut: req.params.rut });
        if (!carrier) {
            return res.status(404).send("Not Found");
        }
        res.send(carrier);
    } catch (error) {
        res.status(500).send();
    }
};

const getAllCarriers = async (req, res) => {
    try {
        const carriers = await Carrier.find({});
        res.send(carriers);
    } catch (error) {
        res.status(500).send();
    }
};

const updateCarrier = async (req, res) => {
    try {
        const carrier = await Carrier.findOneAndUpdate({ rut: req.params.rut }, req.body, { new: true });
        if (!carrier) {
            return res.status(404).send();
        }
        res.send(carrier);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteCarrier = async (req, res) => {
    try {
        const carrier = await Carrier.findOneAndDelete({ rut: req.params.rut });
        if (!carrier) {
            return res.status(404).send();
        }
        res.send(carrier);
    } catch (error) {
        res.status(500).send();
    }
};

const aceptarPublicacion = async (req, res) => {
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
        publication.estado = 'Pendiente';
        await publication.save();
        res.send("Publicacion aceptada con exito");
    } catch (e) {
        console.error(e);
        res.status(500).send({ error: 'An error occurred', details: e });
    }
};

const cambiarDisp = async (req, res) => {
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
};

const loginCarrier = async (req, res) => {
    const { rut, password } = req.body;
  
    try {
      // Buscar al carrier por rut en la base de datos
      const carrier = await Carrier.findOne({ rut });
      console.log(`Carrier encontrado: ${carrier}`);
      console.log(`Rut recibido: ${rut}`);
      
      if (!carrier) {
        console.log('rut:');
        return res.status(404).json({ error: 'Carrier no encontrado SAS' });
      }
  
      // Verificar la contraseña
      const passwordMatch = await bcrypt.compare(password, carrier.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }
  
      // Devolver token JWT con información del carrier
      const token = jwt.sign(
        { rut: carrier.rut, role: carrier.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      console.log(`Rol devuelto por el backend: ${carrier.role}`);
  
      // Devolver token y rol del carrier
      res.json({ token, role: carrier.role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

module.exports = {
    createCarrier,
    getCarrier,
    getAllCarriers,
    updateCarrier,
    deleteCarrier,
    aceptarPublicacion,
    cambiarDisp,
    loginCarrier,
    upload
};