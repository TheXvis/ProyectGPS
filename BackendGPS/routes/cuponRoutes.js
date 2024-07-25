const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', cuponController.generateCoupon);
router.get('/', cuponController.getCoupon);
router.delete('/:id', cuponController.deleteCoupon);
router.put('/:id', cuponController.updateCoupon);
router.post('/:id/upload', upload.single('image'), cuponController.uploadCouponImage);

module.exports = router;
