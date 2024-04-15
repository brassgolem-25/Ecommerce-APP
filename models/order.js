// order.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    paymentId : {
        type: String,
        required: true,
    },
    seller: {
        type: String,
        required: true,
    },
    invoice:{
        type:String
    },
    orderStatus:{
        type: String,
        required: true,
    },
    totalAmount:{
        type: Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema, 'Order');

export default Order;
