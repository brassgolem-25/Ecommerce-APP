import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

configDotenv();

const url = process.env.MONGODB_URI;
// console.log(url);

const mongooseConnect = async () => {
    try {
        await mongoose.connect(url);
        return "Connected";
    }catch(error){
        console.log(error);
    }
}

export default mongooseConnect;
