import express from 'express';
import Cart from '../models/cart.js';
import authService from '../services/authService.js';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';

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
                    const pSize =data.productSize;
                    const productPrice =  parseFloat(productData.price);
                    const priceMap = {
                        'XS': productPrice-2,
                        'S': productPrice-1,
                        'M': productPrice,
                        'L': productPrice+1,
                        'XL': productPrice+2
                      };
                    subTotal += data.quantity * priceMap[pSize];
                }
            })
        // console.log(products,subTotal);
        // console.log(user);
        let isUserLoggedIn=true;
        if(user===undefined){
            isUserLoggedIn=false;
        }
        return res.render('cart', { products: products, subTotal: subTotal,isUserLoggedIn:isUserLoggedIn });
    } catch (error) {
        console.log(error);
    }
}
//cart route
router.get("/", findCartItem);


export default router;