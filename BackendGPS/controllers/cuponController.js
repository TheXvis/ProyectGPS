const Coupon = require('../models/cuponModel.js');

const generateCoupon = async (req, res, next) => {
    const { userId, amount, dueDate, publicationName, publicationDestination } = req.body;

    const coupon = new Coupon({
        userId,
        amount,
        dueDate,
        publicationDestination,
        publicationName,
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

// Obtener cupones por userId
const getCoupon = async (req, res, next) => {
    const { userId } = req.query;

    try {
        // Filtrar cupones por userId
        const query = userId ? { userId } : {};
        const coupons = await Coupon.find(query);
        res.json(coupons);
    } catch (error) {
        console.error('Error al obtener los cupones:', error);
        res.status(500).send('Error al obtener los cupones');
    }
};

const updateCoupon = async (req, res, next) => {
    const { id } = req.params;
    const { isPaid } = req.body;

    try {
        const updatedCoupon = await Coupon.findByIdAndUpdate(id, { isPaid }, { new: true });
        if (!updatedCoupon) {
            return res.status(404).send('Cupón no encontrado');
        }
        res.json(updatedCoupon);
    } catch (error) {
        console.error('Error al actualizar el cupón:', error);
        res.status(500).send('Error al actualizar el cupón');
    }
};

const uploadCouponImage = async (req, res) => {
    try {
        const couponId = req.params.id;
        const imageUrl = req.file.path;

        if (!req.file) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo' });
        }

        // Actualizar el cupón con la URL de la imagen
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId,
            { imageUrl: imageUrl },
            { new: true }
        );

        res.status(200).json(updatedCoupon);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).json({ error: error.message });
    }
};

const deleteCouponImage = async (req, res) => {
    try {
        const couponId = req.params.id;

        // Actualizar el cupón con la URL de la imagen
        const updatedCoupon = await Coupon.findByIdAndUpdate(
            couponId,
            { imageUrl: null },
            { new: true }
        );

        res.status(200).json(updatedCoupon);
    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    generateCoupon,
    getCoupon,
    deleteCoupon,
    updateCoupon,
    uploadCouponImage,
    deleteCouponImage,
};
