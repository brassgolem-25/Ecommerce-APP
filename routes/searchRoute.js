import express from 'express';
import Product from "../models/product.js"
const router = express.Router();
router.use(express.json());

//remove item from cart
router.post("/",async (req,res)=>{
    try {
        // do better naming conventio
        const text = req.body.searchText;
        if(text!==""){
            const searchInput = new RegExp(req.body.searchText);
            const product = await Product.find({"name":searchInput});
            console.log(product);
        }
        // console.log();
             
    }catch(error){
        console.log(error);
    }
})


export default router;