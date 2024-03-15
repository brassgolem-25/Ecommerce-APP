import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());


async function addToCart(req,res){
    // check if the user is logged in
    //product quantity ,
}


//home route
router.get("/",async (req,res)=>{
    try {
        const products = await Product.find({});
        res.render("homepage",{products:products})
    }catch{

    }
})



export default router;