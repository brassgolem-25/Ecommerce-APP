import express from 'express';
import Cart from '../models/cart.js';
import authService from '../services/authService.js';

const router = express.Router();
router.use(express.json());


router.post('/addToCart',async(req,res)=>{
    try{
        console.log(req.body.pid);
    }catch(error){
        console.log(error);
    }
})

//cart route
router.get("/",async (req,res)=>{
    try {
        res.send("you are logged in!!YA, you can see the cart now");    
    }catch(error){
        console.log(error);
    }
})



export default router;