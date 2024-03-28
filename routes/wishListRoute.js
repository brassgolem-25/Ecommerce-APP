import express from 'express';
import WhisList from '../models/whistList.js';
import authService from '../services/authService.js';
import { ObjectId } from 'mongodb';


const router = express.Router();
router.use(express.json());

// add to wishlist similar to cart
router.post('/addToWish', async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        const pId = req.body.productId;
        const productFound = await WhisList.find({
            productId: pId,
            userId: new ObjectId(user[0]._id)
        });
        // console.log(productFound);
        if (productFound.length > 0) {
            console.log("Yes found");
            console.log(productFound);
            const wishlistId = productFound[0]._id;
            const newQuantity = productFound[0].quantity + 1;
            // const newQuantity  = await Cart.find({_id:pId});
            // console.log(newQuantity);
            await WhisList.findOneAndUpdate({ _id: wishlistId }, { $set: { "quantity": newQuantity } });
        } else {
            await WhisList.create({
                userId: user[0]._id,
                quantity: 1,
                productId: pId
            })
            console.log("Not found");
        }

        // res.send('Item added to cart');
    } catch (error) {
        console.log(error);
    }
})
//get item from whislist
router.get("/",async (req,res)=>{
    try {
        // do better naming conventio
        const products = await WhisList.find({});
        res.send(products);
             
    }catch(error){
        console.log(error);
    }
})


export default router;