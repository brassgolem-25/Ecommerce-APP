import express from 'express';
import authFunc from '../services/authService.js'
import Order from '../models/order.js';
import {ObjectId} from 'mongodb';

const router = express.Router();
router.use(express.json());
//

function findUser(req,res){
   const userUID =req.cookies.uid;
   const userID = authFunc.getUser(userUID);

  return userID[0]._id;
}

router.get("/", async(req,res) => {
   try{
    //render order page
    const user = findUser(req,res);
    console.log("User" +user);
   //  const orders = await Order.aggregate([{$match :{userId : new ObjectId(user)}}]);
   let isUserLoggedIn = true;
   if(user === undefined){
      isUserLoggedIn=false;
   }
   //  res.render('order',{isUserLoggedIn:isUserLoggedIn});
   res.send(user);
   }catch(error){
    console.log(error);
   }
})



export default router;