import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());
//

router.get("/:productId", async(req,res)=>{
   try{
    //render cart page
   //  res.send(req);
   const productId = req.params.productId;
   const product = await Product.findById(productId);
   console.log(product);
   res.render('productPage',{product:product})

   }catch(error){
    console.log(error);
   }
})



export default router;