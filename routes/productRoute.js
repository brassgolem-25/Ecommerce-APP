import express from 'express';
import Product from '../models/product.js';
import authService from '../services/authService.js';

const router = express.Router();
router.use(express.json());
//

router.get("/:productId", async(req,res)=>{
   try{
    //render cart page
   //  res.send(req);
   const productId = req.params.productId;
   const product = await Product.findById(productId);
   // console.log(product);
   const user = authService.getUser(req.cookies.uid);
   let isUserLoggedIn=true;
   if(user===undefined){
       isUserLoggedIn=false;
   }
   res.render('productPage',{product:product,isUserLoggedIn:isUserLoggedIn})
   }catch(error){
    console.log(error);
   }
})

export default router;