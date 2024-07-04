import mongoose from "mongoose";

const googleOauthSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email :{
        type:String,
        required:true
    },
    password :{
        type:String
    },
    number:{
        type:String
    },
    googleId : {
        type:String
    }

},{timestamps : true})

const googleOauth = mongoose.model('googleOauthSchema', googleOauthSchema,'googleOauthSchema');

export default googleOauth;