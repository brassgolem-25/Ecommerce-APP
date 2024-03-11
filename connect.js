import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';

// mongoose.connect("mongodb+srv://tushartiwari2002:M4Nke5ktHD5ZMPIV@ecommerce.hc4yyqb.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce")
//     .then(() => console.log("DB connected successfully"))
//     .catch((err) => console.log(err));
    
//M4Nke5ktHD5ZMPIV
//tushartiwari2002

configDotenv();

const url = process.env.MONGODB_URI;
console.log(url);

const mongooseConnect = async () => {
    try {
        await mongoose.connect(url);
        return "Connected";
    }catch(error){
        console.log(error);
    }
}

export default mongooseConnect;
