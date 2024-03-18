import express from 'express';
import authRoute from './routes/authRoutes.js';
import homeRoute from './routes/homeRoutes.js';
import path from 'path';
import mongooseConnect from './connect.js';
import productRoute from './routes/productRoute.js';
import cartRoute from './routes/cartRoute.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import authentication from './middlewares/authentication.js'
import accountRoute from './routes/accountRoute.js'

const app = express();

app.set("view engine","ejs");
app.set("views", path.resolve("./public/views"))
//middlewares
app.use(express.urlencoded({ extended: true })); // to represent extra character
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,
}));

//db connect verification
let connection = await mongooseConnect();
console.log(connection);
// router for login/signup
app.use('/auth',authRoute);

//router for homepage
app.use('/',homeRoute);
//router for products
app.use('/product',productRoute)

//router for cart
app.use('/cart',authentication,cartRoute)

//router for account
app.use('/account',authentication,accountRoute)


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

