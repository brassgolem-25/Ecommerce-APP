import express from 'express';
import User from '../models/user.js';
import authFunc from '../services/authService.js'

const router = express.Router();
router.use(express.json());
//

router.get("/", async(req,res) => {
   try{
    //render account page
    // res.send('User is lgged in , the account page is visible');
    const userUID =req.cookies.uid;
    const userID = authFunc.getUser(userUID);
    // console.log(userID);
    // const user = await User.find({});
    // res.send(userID[0]._id);
    const user = userID[0];
    res.render('account',{user:user});
   }catch(error){
    console.log(error);
   }
})



export default router;