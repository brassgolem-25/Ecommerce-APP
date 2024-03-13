import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());


async function getProducts(req,res){
    try{
        
        res.send(await Product.find({}))

    }catch(error){
        console.log(error);
    }
}
//

router.get("/",(req,res)=>{
    getProducts(req,res);
})



export default router;