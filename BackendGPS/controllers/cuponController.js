const Coupon = require('../models/cuponModel.js');



const generateCoupon = async (req, res, next) => {
    const { userId, amount, dueDate  } = req.body;

    const coupon = new Coupon({
        userId,
        amount,
        dueDate
    });

    try {
        await coupon.save();
        res.status(200).json(coupon);
    } catch (error) {
        console.error(error);
        if (error.name === 'ValidationError') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};



const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cupones', error });
  }
};

module.exports = {
    generateCoupon,
    getCoupon
};