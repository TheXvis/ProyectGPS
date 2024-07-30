const express = require('express');
const router = express.Router();
const carrierController = require('../controllers/carrierController');
const upload = require('../controllers/carrierController').upload;


router.post('/crear', upload.single('imagenCarrier'), carrierController.createCarrier );
router.get('/ver/:rut', carrierController.getCarrier);
router.get('/verTodos', carrierController.getAllCarriers);
router.put('/editar/:rut', carrierController.updateCarrier);
router.delete('/borrar/:rut', carrierController.deleteCarrier);
router.put('/aceptar/:publicationId/:carrierRut', carrierController.aceptarPublicacion);
router.put('/cambiarDisp/:rut', carrierController.cambiarDisp);
router.post('/login', carrierController.loginCarrier);
module.exports = router;