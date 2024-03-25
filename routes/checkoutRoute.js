import express, { response } from 'express';
import Cart from '../models/cart.js'
import Razorpay from 'razorpay';
import authService from '../services/authService.js';
import {ObjectId} from 'mongodb';

const keyID = process.env.RAZORPAY_KEYID;
const keySecret = process.env.RAZORPAY_KEYSECRET;
const router = express.Router();
router.use(express.json());
//

async function findCartItem(req, res) {
    try {
        // do better naming convention
        const user = authService.getUser(req.cookies.uid);
        const userId =  user[0]._id;

       const value = await Cart.aggregate([
        {$match : {userId : new ObjectId(userId)}},
        {
            $lookup :{
                from : 'Product',
                localField : 'productId',
                foreignField : '_id',
                as:'item'
            }
        }
        ])
        let products=[];let subTotal = 0;
       value.forEach((data)=>{
        const productData = data.item[0];
        productData.cartId = data._id;
        productData.quantity = data.quantity;
        products.push(productData);
        // console.log(products);
        subTotal += data.quantity*productData.price;
       })
        // console.log(products,subTotal);
        return subTotal;1
    }catch(error){
        console.log(error);
    }
}

//create order promise and then wait for that order to be created
function createOrder(options) {
    return new Promise((resolve, reject) => {
        var instance = new Razorpay({
            key_id: keyID,
            key_secret: keySecret,
        });

        instance.orders.create(options, function (err, order) {
            if (!err) {
                console.log(order);
                resolve(order);
            } else {
                reject(err);
            }
        });
    });
}

async function createAndProcessOrder(options) {
    try {
        return await createOrder(options);
    } catch (err) {
        console.error('Error creating order:', err);
    }
}


router.get("/", async (req, res) => {
    try {
        const subTotal = await findCartItem(req, res);
        // console.log(subTotal);
        // res.send('Checkout Page '+subTotal);
        const amount = (parseFloat(subTotal) * 100);
        console.log(amount);

        var options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR"
        };
        const response = await createAndProcessOrder(options);
        response.key = keyID;
        console.log(response);

        res.render('checkout', { response: JSON.stringify(response) })

    } catch (error) {
        console.log(error);
    }
})



export default router;