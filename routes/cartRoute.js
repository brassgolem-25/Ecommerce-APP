import express from 'express';
import Cart from '../models/cart.js';
import authService from '../services/authService.js';
import { ObjectId } from 'mongodb';
import Razorpay from 'razorpay';
import Product from '../models/product.js'

const router = express.Router();
router.use(express.json());

//remove item from cart
router.post("/deleteFromCart", async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        const userId = user[0]._id;

        const productName = req.body.productName;
        const product = await Product.find({ name: productName })

        // console.log(product);
        const productId = product[0]._id;
        await Cart.deleteOne({ productId: productId, userId: userId });
        return res.json({ success: true, message: "The Item is removed from the cart!" });

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
        // console.log("Product Data " + quantity)
        if (quantity === '0') {
            console.log(await Cart.findOneAndDelete({ productId: new ObjectId(pId), userId: user_Id }));
        } else {
            console.log(await Cart.findOneAndUpdate({ productId: new ObjectId(pId), userId: user_Id }, { $set: { "quantity": quantity } }));
        }

    } catch (error) {
        console.log(error);
    }
})

//total Cart Items
router.get('/itemCount', async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        const userId = user[0]._id;
        const userCartCount = await Cart.aggregate([
            { $match: { "userId": new ObjectId(userId) } },
            { $group: { _id: "$userId", "cartItemCount": { $count: {} } } }]);

        // console.log(userCartCount);
        let itemCount = 0;
        if (userCartCount.length > 0) {
            itemCount = userCartCount[0].cartItemCount;
        }
        return res.json({ success: true, message: itemCount });

    } catch (error) {
        console.log(error);
    }
})

// add to cart route
router.post('/addToCart', async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        console.log(user)
        const productName = req.body.productName;
        const product = await Product.find({ name: productName })

        // console.log(product);
        const productId = product[0]._id;
        const productFound = await Cart.find({
            productId: new ObjectId(productId),
            userId: new ObjectId(user[0]._id)
        });
        if (productFound.length > 0) {
            return res.json({ success: true, message: "The Product is already in cart!!!" });
            // console.log("Yes found");
            // console.log(productFound);
            // const cartId = productFound[0]._id;
            // const newQuantity = productFound[0].quantity + 1;
            // // const newQuantity  = await Cart.find({_id:pId});
            // // console.log(newQuantity);
            // await Cart.findOneAndUpdate({ _id: cartId }, { $set: { "quantity": newQuantity } });
        } else {
            await Cart.create({
                userId: user[0]._id,
                quantity: 1,
                productId: productId,
                productSize: 'M'
            })
        }
        return res.json({ success: true, message: "The Product is added to cart!!!" });
        // res.send('Item added to cart');
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: "Please try again later." });

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
                    const productPrice = parseFloat(productData.price);
                    subTotal += data.quantity * productPrice;
                }
            })
        // console.log(products,subTotal);
        // console.log(user);
        let isUserLoggedIn = true;
        if (user === undefined) {
            isUserLoggedIn = false;
        }
        // return res.render('cart', { products: products, subTotal: subTotal, isUserLoggedIn: isUserLoggedIn });
        return res.render('newCart', { products: products, subTotal: subTotal })
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
        res.render('paymentPage')
        // const subTotal = req.body.subTotal;
        // const fromCart = req.body.fromCart;
        // // res.send('Checkout Page '+subTotal);
        // const amount = (parseFloat(subTotal) * 100);
        // const user = authService.getUser(req.cookies.uid);
        // const address = user[0].address;
        // if (address === '') {
        //     // console.log("adress not provided,render account page");
        //     // res.send("Address not provided")
        //     res.redirect('/Account');
        // } else {
        //     // console.log("adress given,render checkout page");

        //     var options = {
        //         amount: amount,  // amount in the smallest currency unit
        //         currency: "INR"
        //     };

        //     const response = await instance.orders.create(options);
        //     response.key = keyID;
        //     // console.log(response);
        //     response.isCart = (fromCart ? true : false);
        //     console.log("response")
        //     res.send(response);
        //     // console.log(productDetails.product);
        //     // console.log(re);
        // }
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
        // const paymentRes = await instance.payments.fetch(paymentData.razorpay_payment_id)
        const orderResponse = await instance.orders.create({
            amount: 50000,
            currency: "INR",
            receipt: "receipt#1",
        })
        console.log(orderResponse);
        if (orderResponse) {

            // const productDetails = req.body.productsArrId;
            // // console.log(productDetails[0])

            // productDetails.forEach(async (product_Id) => {
            //     let user_Product_Data = null;
            //     let productQuantity = null;
            //     if (paymentData.isCart) {
            //         user_Product_Data = await Cart.find({ userId: new ObjectId(user[0]._id), productId: new ObjectId(product_Id) });
            //         // this is to only delte card data if the user is buying through cart
            //         await Cart.findOneAndDelete({ userId: new ObjectId(user[0]._id), productId: new ObjectId(product_Id) })
            //         productQuantity = user_Product_Data.quantity;
            //         console.log("from cart item deleted")
            //     }else {
            //         user_Product_Data = await Product.find({_id:new ObjectId(product_Id)});
            //         productQuantity = 1;
            //     }
            //     console.log(user_Product_Data);

            //     await Order.create({
            //         userId: user[0]._id,
            //         productId: product_Id,
            //         quantity: productQuantity,
            //         paymentType: paymentRes.method,
            //         paymentId: paymentRes.id,
            //         seller: 'Exlcusive',
            //         orderStatus: 'Ordered',
            //         totalAmount: paymentRes.amount,
            //         address: userAddress
            //     })
            // })

        }

    } catch (err) {
        console.log(err);
    }
})

export default router;