import express from 'express';
import Cart from '../models/cart.js';
import authService from '../services/authService.js';
import { isValidObjectId } from 'mongoose';

const router = express.Router();
router.use(express.json());


router.post('/addToCart',async(req,res)=>{
    try{
        const user = authService.getUser(req.cookies.uid);
        const pId = req.body.productId;
        console.log(user);
        console.log(isValidObjectId(pId))
        // console.log(req);
        await Cart.create({
            userId : user[0]._id,
            quantity:2,
            productId : pId
        })
        // res.send('Item added to cart');
    }catch(error){
        console.log(error);
    }
})

//cart route
router.get("/",async (req,res)=>{
    try {
        // const products = await Cart.find({});
       const value = await Cart.aggregate([
            {
                $lookup :{
                    from : 'Product',
                    localField : 'productId',
                    foreignField : '_id',
                    as:'item'
                }
            }
        ])
        let products=[];
        let quantity;
       value.forEach((data)=>{
        quantity=data.quantity;
        products.push(data.item[0]);
       })
        // console.log(products);
        res.render('cart',{products:products,quantity:quantity});    
    }catch(error){
        console.log(error);
    }
})



export default router;