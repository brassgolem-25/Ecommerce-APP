//userOTP.js
import mongoose from 'mongoose';

const {Schema} = mongoose;

const userOTPSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token :{
    type: String,
    required:true
  }
},{timestamps:true});

const userOTP = mongoose.model('userOTP', userOTPSchema,'userOTP');

export default userOTP;
