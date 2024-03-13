import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());


async function addToCart(req,res){
    // check if the user is logged in
    //product quantity ,
}

router.get("/",(req,res)=>{
    res.render("homepage")
})



export default router;