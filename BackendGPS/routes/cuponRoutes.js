const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');
const multer = require('multer');
const path = require('path');
const Cupon = require('../models/cuponModel'); // Asegúrate de importar tu modelo de cupon

// Configuración de multer para almacenar archivos en la carpeta images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Ruta para subir archivos
router.post('/upload/:couponId', upload.single('file'), async (req, res) => {
    try {
        const couponId = req.params.couponId;
        const filePath = req.file.path.replace(/\\/g, '/');

        // Actualiza el cupón en la base de datos con la ruta de la imagen
        const updatedCoupon = await Cupon.findByIdAndUpdate(couponId, { receipt: filePath }, { new: true });

        if (!updatedCoupon) {
            return res.status(404).json({ error: 'Cupón no encontrado' });
        }

        res.status(200).json({ receipt: filePath });
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        res.status(500).json({ error: 'Error al subir el archivo', details: error.message });
    }
});

router.post('/', cuponController.generateCoupon);
router.get('/', cuponController.getCoupon);
router.delete('/:id', cuponController.deleteCoupon);
router.put('/:id', cuponController.updateCoupon);
router.post('/:id/upload', upload.single('image'), cuponController.uploadCouponImage);

module.exports = router;
