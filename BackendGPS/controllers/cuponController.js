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

const deleteCoupon = async (req, res, next) => {
    const { id } = req.params;
  
    try {
      const coupon = await Coupon.findById(id);
      if (!coupon) {
        return res.status(404).json({ error: 'Cupón no encontrado' });
      }
  
      await Coupon.deleteOne({ _id: id });
      res.status(200).json({ message: 'Cupón eliminado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar el cupón' });
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
    getCoupon,
    deleteCoupon,
};