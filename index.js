import express from 'express';
import authRoute from './routes/authRoutes.js';
import path from 'path';
import mongooseConnect from './connect.js';

const app = express();

app.set("view engine","ejs");
app.set("views", path.resolve("./public/views"))
//middlewares
app.use(express.urlencoded({ extended: true })); // to represent extra character
app.use(express.json());

//db connect verification
let connection = await mongooseConnect();
// router for login/signup
app.use('/auth',authRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

