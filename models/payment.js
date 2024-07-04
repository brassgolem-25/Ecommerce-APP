// order.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['Credit/Debit Card', 'UPI'],
        default:null,
    },
    cardDetails: {
        cardNumber: {
            type: String,
            required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
        },
        expiryDate: {
            type: String,
            required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
        },
        cvc: {
            type: String,
            required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
        },
        cardholderName: {
            type: String,
            required: function() { return this.paymentMethod === 'Credit/Debit Card'; }
        }
    },
    upiDetails: {
        upiId: {
            type: String,
            required: function() { return this.paymentMethod === 'UPI'; }
        }
    },
    paymentStatus: {
        type: String,
        default: 'Pending'
    }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema, 'Payment');

export default Payment;
