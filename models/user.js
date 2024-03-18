import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    dateofBirth:{
        type:Date
    },
    gender:{
        type:String
    },
    number:{
        type:String
    },
    address:{
        type:String
    }

},{timestamps : true})

const User = mongoose.model('User', userSchema,'User');

export default User;