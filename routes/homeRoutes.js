import express from 'express';
import Product from '../models/product.js';

const router = express.Router();
router.use(express.json());




async function getProducts(){
    try{
        // const productData = new Product({
        //     name:"HAVIT HV-G92 Gamepad",
        //     description:"GamePad",
        //     price:100,
        //     category:"Console"
        // })
        
        // await productData.save();
        const response = await Product.find({});
        console.log(response);
        // console.log("product created")
    }catch(error){
        console.log(error);
    }
}
//

getProducts();
// router.get("/",(req,res)=>{
//     res.render("homepage")
// })



export default router;