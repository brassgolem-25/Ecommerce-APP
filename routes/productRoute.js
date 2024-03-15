import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());
//

router.get("/cart",(req,res)=>{
   try{
    //render cart page
    res.send('Added to cart')
   }catch(error){
    console.log(error);
   }
})



export default router;