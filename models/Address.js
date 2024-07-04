import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, required: true },
    addressType: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const Address = mongoose.model('Address', addressSchema, 'Address');

export default Address;