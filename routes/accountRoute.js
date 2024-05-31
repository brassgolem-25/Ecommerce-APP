import express from 'express';
import User from '../models/user.js';
import authFunc from '../services/authService.js'
import { ObjectId } from 'mongodb';


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


router.post('/profile',async(req,res) => {
   try{
      const user = await findUser(req,res);
      const userId = user._id;
      const { firstName,lastName,gender, email,mobile, address } = req.body;
      const fullName = firstName+lastName;
      // console.log(req.body);
      await User.findOneAndUpdate({_id:new ObjectId(userId)},{$set:{"name":fullName,"email":email,"number":mobile,"gender":gender,"address":address}});
      // res.render('account',{user:user});
      res.redirect('/Account');
   }catch(error){
      console.log(error);
   }
})

router.get("/", async(req,res) => {
   try{
    //render account page
    const user = await findUser(req,res);
   //  console.log(user);
   let isUserLoggedIn = true;
   if (user === undefined) {
       isUserLoggedIn = false;
   }
    res.render('account',{user:user,isUserLoggedIn:isUserLoggedIn});
   }catch(error){
    console.log(error);
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
         res.render('order');
   }catch(error){
      console.log(error);
   }
})

export default router;