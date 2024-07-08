import express from 'express';
import User from '../models/user.js';
import Order from '../models/order.js';
import Product from '../models/product.js';
import authFunc from '../services/authService.js'
import { ObjectId } from 'mongodb';
import Address from '../models/Address.js';


const router = express.Router();
router.use(express.json());
//

async function  findUser(req,res){
   const userUID =req.cookies.uid;
   const userID = authFunc.getUser(userUID);
   // console.log(userID);
   const user = await User.find({_id:userID[0]._id});
   // console.log(user)
   // res.send(userID[0]._id);
//   return userID[0];
   return user[0]; 
}


// router.post('/updateEmail',async(req,res) => {
//    try{
//       const user = await findUser(req,res);
//       const userId = user._id;
//       const { email,mobile } = req.body;
//       await User.findOneAndUpdate({_id:new ObjectId(userId)},{$set:{"email":email,"number":mobile}});
//       return res.json({success:true, message: "Email is updated successfully"});
//    }catch(error){
//       console.log(error);
//    }
// })

router.get("/", async(req,res) => {
   try{
    const user = await findUser(req,res);
    res.render('account',{user:user});
   }catch(error){
    console.log(error);
   }
})

//user address
   router.post("/userAddress",async(req,res)=>{
      try{
         const user = await findUser(req,res);
         const userId = user._id;
         console.log(req.body);
         const { locality,state,userPincode } = req.body;
         // console.log(req.body);
         const update = {
            $set: {
                'address.state': state,
                'address.pincode': userPincode,
                'address.locality': locality
            }
        };
         await User.findOneAndUpdate({_id:new ObjectId(userId)},update);
         // res.redirect('/Account/Addresses');
         return res.json({success:true, message: "address update successfully"});
      }catch(error){
         console.log(error);
         return res.json({success:false, message: "some error occured"});
      } 
   })


//for all other page
router.get('/Page',async(req,res)=>{
   try{
      res.render('error404');
   }catch(error){
      console.log(error);
   }
})

//for orders
router.get('/order',async(req,res)=>{
   try{
      const user = await findUser(req,res);
      let isUserLoggedIn = true;
      if(user === undefined){
         isUserLoggedIn=false;
      }
      
      const userOrders = await Order.aggregate([{$match :{userId : new ObjectId(user)}},]);
      let productDetails = [];
      for(const orders of userOrders){
         const product = await Product.find({_id:new ObjectId(orders.productId)});
         let productArr = {};
         productArr.name = product[0].name;
         productArr.imageUrl = product[0].imageUrl;
         productArr.price = orders.totalAmount;
         productArr.seller = orders.seller;
         productArr.orderStatus = orders.orderStatus;
         productDetails.push(productArr);
      }
      let orderFilters = null;
            
      res.render('order',{productDetails:productDetails,isUserLoggedIn:isUserLoggedIn});
   }catch(error){
      console.log(error);
   }
})


export default router;