import express from 'express';
import Cart from '../models/cart.js';
import Order from '../models/order.js'
import authService from '../services/authService.js';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import Razorpay from 'razorpay';
import Product from '../models/product.js'

const router = express.Router();
router.use(express.json());

//remove item from cart
router.post("/delete", async (req, res) => {
    try {
        // do better naming conventio
        const product_Id = req.body.delete;
        // console.log(product_Id);
        await Cart.deleteOne({ _id: product_Id })
        findCartItem(req, res);

    } catch (error) {
        console.log(error);
    }
})

//update cart from cart Page
router.post('/updateCart', async (req, res) => {
    try {
        const pId = req.body.product_Id;
        const quantity = req.body.product_Quantity;
        const user_Id = authService.getUser(req.cookies.uid);
        console.log("Product Data " + quantity)
        if (quantity === '0') {
            console.log(await Cart.findOneAndDelete({ productId: new ObjectId(pId), userId: user_Id }));
        } else {
            console.log(await Cart.findOneAndUpdate({ productId: new ObjectId(pId), userId: user_Id }, { $set: { "quantity": quantity } }));
        }

    } catch (error) {
        console.log(error);
    }
})

// add to cart route
router.post('/addToCart', async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        const pId = req.body.productId;
        const pSize = req.body.productSize;
        const productFound = await Cart.find({
            productId: pId,
            userId: new ObjectId(user[0]._id)
        });
        // console.log(productFound);
        if (productFound.length > 0) {
            console.log("Yes found");
            console.log(productFound);
            const cartId = productFound[0]._id;
            const newQuantity = productFound[0].quantity + 1;
            // const newQuantity  = await Cart.find({_id:pId});
            // console.log(newQuantity);
            await Cart.findOneAndUpdate({ _id: cartId }, { $set: { "quantity": newQuantity } });

        } else {
            await Cart.create({
                userId: user[0]._id,
                quantity: 1,
                productId: pId,
                productSize: pSize
            })
            console.log("Not found");
        }

        // res.send('Item added to cart');
    } catch (error) {
        console.log(error);
    }
})

async function findCartItem(req, res) {
    try {
        // do better naming convention
        const user = authService.getUser(req.cookies.uid);
        const userId = user[0]._id;

        const cartProduct = await Cart.aggregate([
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
        if (cartProduct !== undefined)
            cartProduct.forEach((data) => {
                if (data.item.length > 0) {
                    const productData = data.item[0];
                    productData.cartId = data._id;
                    productData.quantity = data.quantity;
                    products.push(productData);
                    const pSize = data.productSize;
                    const productPrice = parseFloat(productData.price);
                    const priceMap = {
                        'XS': productPrice - 2,
                        'S': productPrice - 1,
                        'M': productPrice,
                        'L': productPrice + 1,
                        'XL': productPrice + 2
                    };
                    subTotal += data.quantity * priceMap[pSize];
                }
            })
        // console.log(products,subTotal);
        // console.log(user);
        let isUserLoggedIn = true;
        if (user === undefined) {
            isUserLoggedIn = false;
        }
        return res.render('cart', { products: products, subTotal: subTotal, isUserLoggedIn: isUserLoggedIn });
    } catch (error) {
        console.log(error);
    }
}
//cart route
router.get("/", findCartItem);

//checkout route
// create new instance of razorpay
const keyID = process.env.RAZORPAY_KEYID;
const keySecret = process.env.RAZORPAY_KEYSECRET;

var instance = new Razorpay({ key_id: keyID, key_secret: keySecret })

router.post("/checkout", async (req, res) => {
    try {
        // const productDetails = await findCartItem(req, res);

        const subTotal = req.body.subTotal;
        const fromCart = req.body.fromCart;
        // res.send('Checkout Page '+subTotal);
        const amount = (parseFloat(subTotal) * 100);
        const user = authService.getUser(req.cookies.uid);
        const address = user[0].address;
        if (address === '') {
            // console.log("adress not provided,render account page");
            // res.send("Address not provided")
            res.redirect('/Account');
        } else {
            // console.log("adress given,render checkout page");

            var options = {
                amount: amount,  // amount in the smallest currency unit
                currency: "INR"
            };

            const response = await instance.orders.create(options);
            response.key = keyID;
            // console.log(response);
            response.isCart = (fromCart ? true : false);
            console.log("response")
            res.send(response);
            // console.log(productDetails.product);
            // console.log(re);
        }
    } catch (error) {
        console.log(error);
    }
})

router.post("/order", async (req, res) => {
    try {
        // console.log(req.body.data);
        const paymentData = req.body.data;
        const user = authService.getUser(req.cookies.uid);
        const userAddress = user[0].address;
        // console.log(userAddress)
        const paymentRes = await instance.payments.fetch(paymentData.razorpay_payment_id)
        console.log(paymentRes);
        if (paymentRes) {

            const productDetails = req.body.productsArrId;
            // console.log(productDetails[0])

            productDetails.forEach(async (product_Id) => {
                let user_Product_Data = null;
                let productQuantity = null;
                if (paymentData.isCart) {
                    user_Product_Data = await Cart.find({ userId: new ObjectId(user[0]._id), productId: new ObjectId(product_Id) });
                    // this is to only delte card data if the user is buying through cart
                    await Cart.findOneAndDelete({ userId: new ObjectId(user[0]._id), productId: new ObjectId(product_Id) })
                    console.log("from cart item deleted")
                }else {
                    user_Product_Data = await Product.find({_id:new ObjectId(product_Id)});
                    productQuantity = 1;
                }
                console.log(user_Product_Data);

                await Order.create({
                    userId: user[0]._id,
                    productId: product_Id,
                    quantity: productQuantity,
                    paymentType: paymentRes.method,
                    paymentId: paymentRes.id,
                    seller: 'Exlcusive',
                    orderStatus: 'Ordered',
                    totalAmount: paymentRes.amount,
                    address: userAddress
                })
            })

        }

    } catch (err) {
        console.log(err);
    }
})

export default router;