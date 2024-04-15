import express, { response } from 'express';
import Cart from '../models/cart.js'
import Razorpay from 'razorpay';
import authService from '../services/authService.js';
import { ObjectId } from 'mongodb';
import Order from '../models/order.js'
import Product from '../models/product.js'

const keyID = process.env.RAZORPAY_KEYID;
const keySecret = process.env.RAZORPAY_KEYSECRET;
const router = express.Router();
router.use(express.json());


//find all the cart item
async function findCartItem(req, res) {
    try {
        // do better naming convention
        const user = authService.getUser(req.cookies.uid);
        const userId = user[0]._id;

        const value = await Cart.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            {
                $lookup: {
                    from: 'Product',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'item'
                }
            }
        ])
        let products = []; let subTotal = 0;
        value.forEach((data) => {
            const productData = data.item[0];
            productData.cartId = data._id;
            productData.quantity = data.quantity;
            products.push(productData);
            // console.log(products);
            subTotal += data.quantity * productData.price;
        })
        // console.log(products,subTotal);
        const productDetails = {};
        productDetails.product = products,
            productDetails.subTotal = subTotal
        console.log(productDetails);
        return productDetails;
    } catch (error) {
        console.log(error);
    }
}

// create new instance of razorpay
var instance = new Razorpay({ key_id: keyID, key_secret: keySecret })

//checkout route
router.get("/", async (req, res) => {
    try {
        const productDetails = await findCartItem(req, res);
        const subTotal = productDetails.subTotal;
        // console.log(subTotal);
        // res.send('Checkout Page '+subTotal);
        const amount = (parseFloat(subTotal) * 100);
        console.log(amount);
        const user = authService.getUser(req.cookies.uid);
        const address = user[0].address;
        if (address === '') {
            console.log("adress not provided,render account page");
            res.redirect('/Account');
        } else {
            console.log("adress given,render checkout page");

            var options = {
                amount: amount,  // amount in the smallest currency unit
                currency: "INR"
            };

            const response = await instance.orders.create(options);
            response.key = keyID;
            // console.log(response);
            response.isCart = true;
            res.render('checkout', { response: JSON.stringify(response) })
            // console.log(productDetails.product);
            console.log(req.body);
        }
    } catch (error) {
        console.log(error);
    }
})

//route for buy now
router.get("/product/:productId", async (req, res) => {
    try {
        const pid = req.params.productId;
        const product = await Product.find({ _id: pid });
        console.log(product);
        const totalAmount = parseFloat(product[0].price) * 100;
        const response = await instance.orders.create({
            amount: totalAmount,
            currency: 'INR',
        })

        response.key = keyID;
        response.isCart = false;
        console.log(response)
        res.render('checkout', { response: JSON.stringify(response) })
    } catch (error) {
        console.log(error);
    }
})

router.post("/order", async (req, res) => {
    try {
        // console.log(req.body.data); --> razorpay data 
        const paymentData = req.body.data;
        const user = authService.getUser(req.cookies.uid);

        const paymentRes = await instance.payments.fetch(paymentData.razorpay_payment_id)
        // console.log(paymentData);
        if (paymentRes) {

            const productDetails = await findCartItem(req, res);

            const products = productDetails.product;
            products.forEach(async (data) => {
                if (paymentData.isCart) { // this is to only delte card data if the user is buying through cart
                    await Cart.findOneAndDelete({ _id: new ObjectId(data.cartId) })
                    console.log("from cart item deleted")
                }
                await Order.create({
                    userId: user[0]._id,
                    productId: data._id,
                    quantity: data.quantity,
                    paymentType: 'Online',
                    paymentId: paymentRes.id,
                    seller: 'Exlcusive',
                    orderStatus: 'Ordered',
                    totalAmount: data.price
                })
            })

        }


    } catch (err) {
        console.log(err);
    }
})

export default router;