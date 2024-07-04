import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type:String,
    },
    googleId : {
        type:String
    },
    email :{
        type:String,
    },
    password :{
        type:String,
    },
    number:{
        type:String
    },
    address: {
        area: {type:String},
        street: { type: String },
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        locality: { type: String },
        addressType: { type: String }
    }

},{timestamps : true})

const User = mongoose.model('User', userSchema,'User');

export default User;