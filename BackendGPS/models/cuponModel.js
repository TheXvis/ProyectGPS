const mongoose = require('mongoose');
const { Schema } = mongoose;

const CouponSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    amount: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    isPaid: { type: Boolean, default: false },
    accountToTransfer: { type: String, default: '20618792-1' }, 
    accountName: { type: String, default: 'Rodrigo Beltran' },
    imageUrl: { type: String }
});


module.exports = mongoose.model('Coupon', CouponSchema);

