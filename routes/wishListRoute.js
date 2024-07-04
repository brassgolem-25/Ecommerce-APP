import express from 'express';
import WhisList from '../models/whistList.js';
import Product from '../models/product.js';
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
        const productName = req.body.productName;
        const product = await Product.find({ name: productName })
        const pId = product[0]._id;
        // console.log(productFound);
        const productFound = await WhisList.find({productId: pId,userId:user[0]._id});
        if (productFound.length > 0) {
            return res.json({success:true,message:"Product is already in wishlist"});
        } else {
            await WhisList.create({
                userId: user[0]._id,
                quantity: 1,
                productId: pId
            })
            // return "Added to wishLi"
        }
        res.json({success:true,message:"Product Added to wishlist"});

        // res.send('Item added to cart');
    } catch (error) {
        console.log(error);
        return res.json({success:false,message:"Please try again later!!"});
    }
})
//get item from whislist
router.get("/",async (req,res)=>{
    try {
        // do better naming conventio
        const user = authService.getUser(req.cookies.uid);
        const userId = user[0]._id;

        const wishlistProduct = await WhisList.aggregate([
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
        res.render('wishList',{wishlistProducts:wishlistProduct})

             
    }catch(error){
        console.log(error);
    }
})


export default router;