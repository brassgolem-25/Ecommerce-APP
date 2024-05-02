import express from 'express';
import WhisList from '../models/whistList.js';
import authService from '../services/authService.js';
import { ObjectId } from 'mongodb';


const router = express.Router();
router.use(express.json());

//remove item from whisList and remove button style
router.post('/remove',async (req,res)=>{
    try{
        const user = authService.getUser(req.cookies.uid);
        const pId = req.body.productId;
        const productFound = await WhisList.findOneAndDelete({
            productId: pId,
            userId: new ObjectId(user[0]._id)
        });
        console.log(productFound)
        res.send("removed");
    }catch(error){
        console.log(error)
    }
})

// add to wishlist similar to cart
router.post('/add', async (req, res) => {
    try {
        const user = authService.getUser(req.cookies.uid);
        const pId = req.body.productId;
        const productFound = await WhisList.find({
            productId: pId,
            userId: new ObjectId(user[0]._id)
        });
        // console.log(productFound);
        if (productFound.length > 0) {
            console.log("Already in whishlist "+productFound);
            // console.log(productFound);
            // const newQuantity  = await Cart.find({_id:pId});
            // console.log(newQuantity);
            // await WhisList.findOneAndUpdate({ _id: wishlistId }, { $set: { "quantity": newQuantity } });
            // return "Already in WishList";
        } else {
            await WhisList.create({
                userId: user[0]._id,
                quantity: 1,
                productId: pId
            })
            console.log("Not found");
            // return "Added to wishLi"
        }
        res.send("added")

        // res.send('Item added to cart');
    } catch (error) {
        console.log(error);
    }
})
//get item from whislist
// router.get("/",async (req,res)=>{
//     try {
//         // do better naming conventio
//         const products = await WhisList.find({});
//         res.send(products);
             
//     }catch(error){
//         console.log(error);
//     }
// })


export default router;