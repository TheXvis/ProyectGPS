const express = require('express');
const router = express.Router();
const cuponController = require('../controllers/cuponController');


router.post('/', cuponController.generateCoupon); 
router.get('/', cuponController.getCoupon);

module.exports = router;