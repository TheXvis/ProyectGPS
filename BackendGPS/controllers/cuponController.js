const Coupon = require('../models/cuponModel');

const generateCoupon = async (req, res, next) => {
    const { userId } = req.body;

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
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    generateCoupon
};