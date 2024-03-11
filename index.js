import express from 'express';
import authRoute from './routes/authRoutes.js';
import homeRoute from './routes/homeRoutes.js';
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
console.log(connection);
// router for login/signup
app.use('/auth',authRoute);

//router for homepage
app.use('/',homeRoute);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

