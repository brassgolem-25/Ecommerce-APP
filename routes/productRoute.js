import express from 'express';
import Product from '../models/product.js';
import WhisList from '../models/whistList.js';
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
   let isWishlisted = false;
   if(user===undefined){
       isUserLoggedIn=false;
   }else {
      const wishListItem  = await WhisList.find({userId: user[0]._id,productId:productId});
      console.log(wishListItem);
      if(wishListItem.length>0){
        isWishlisted=true;
      }
   }
   res.render('productPage',{product:product,isUserLoggedIn:isUserLoggedIn,isWishlisted:isWishlisted})
   }catch(error){
    console.log(error);
   }
})

export default router;