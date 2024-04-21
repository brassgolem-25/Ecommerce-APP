// cart.js
import mongoose from 'mongoose';

const {Schema} = mongoose;

const cartSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  productId :{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productSize :{
    type: String,
    required: true
  }
},{timestamps:true});

const Cart = mongoose.model('Cart', cartSchema,'Cart');

export default Cart;
