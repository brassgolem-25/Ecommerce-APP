import express from 'express';
import User from '../models/user.js';
import authFunc from '../services/authService.js'

const router = express.Router();
router.use(express.json());
//

function findUser(req,res){
   const userUID =req.cookies.uid;
   const userID = authFunc.getUser(userUID);
   // console.log(userID);
   // const user = await User.find({});
   // res.send(userID[0]._id);
  return userID[0];
}

router.post('/profile',async(req,res) => {
   try{
      const user = findUser(req,res);
      const _id = user._id;
      const { gender, dateofBirth,number, address } = req.body;
      console.log(dateofBirth);
      const updatedUser =  await User.findOneAndUpdate({_id:_id},{$set:{gender, dateofBirth,number, address}},{new:true});
      // res.render('account',{user:user});
      res.redirect('/Account');
   }catch(error){
      console.log(error);
   }
})

router.get("/", async(req,res) => {
   try{
    //render account page
    const user = findUser(req,res);
    console.log(user);
    res.render('account',{user:user});
   }catch(error){
    console.log(error);
   }
})



export default router;