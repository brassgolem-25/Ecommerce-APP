// WhisList.js
import mongoose from 'mongoose';

const {Schema} = mongoose;

const whisListSchema = new mongoose.Schema({
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
  }
},{timestamps:true});

const WhisList = mongoose.model('WhisList', whisListSchema,'WhisList');

export default WhisList;
