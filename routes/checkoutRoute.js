import express, { response } from 'express';
import Cart from '../models/cart.js'
import Razorpay from 'razorpay';
import authService from '../services/authService.js';
import { ObjectId } from 'mongodb';
import Order from '../models/order.js'

const keyID = process.env.RAZORPAY_KEYID;
const keySecret = process.env.RAZORPAY_KEYSECRET;
const router = express.Router();
router.use(express.json());

// user Id

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

var instance = new Razorpay({ key_id: keyID, key_secret: keySecret })

router.get("/", async (req, res) => {
    try {
        const productDetails = await findCartItem(req, res);
        const subTotal = productDetails.subTotal;
        // console.log(subTotal);
        // res.send('Checkout Page '+subTotal);
        const amount = (parseFloat(subTotal) * 100);
        console.log(amount);

        var options = {
            amount: amount,  // amount in the smallest currency unit
            currency: "INR"
        };

        const response = await instance.orders.create(options);
        response.key = keyID;
        // console.log(response);
        res.render('checkout', { response: JSON.stringify(response) })
        // console.log(productDetails.product);
        console.log(req.body);
    } catch (error) {
        console.log(error);
    }
})

router.post("/orderNow", async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);

        console.log(req.body.productId);
    } catch (error) {
        console.log(error);
    }
})

router.post("/response", async (req, res) => {
    try {
        console.log(req.body.data);
        const paymentData = req.body.data;
        const user = authService.getUser(req.cookies.uid);

        // const orderData = await instance.orders.fetch(paymentData.razorpay_order_id)
        // console.log(orderData);
        const paymentRes = await instance.payments.fetch(paymentData.razorpay_payment_id)
        if (paymentRes) {
            const productDetails = await findCartItem(req, res);
            const products = productDetails.product;
            products.forEach(async (data) => {
                await Cart.findOneAndDelete({ _id: new ObjectId(data.cartId) })
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

            res.send('Order Successfull')
        }

    } catch (err) {
        console.log(err);
    }
})

export default router;