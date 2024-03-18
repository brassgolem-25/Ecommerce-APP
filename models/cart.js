// cart.js
import mongoose from 'mongoose';

const {Schema} = mongoose;

const cartSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ]
},{timestamps:true});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
