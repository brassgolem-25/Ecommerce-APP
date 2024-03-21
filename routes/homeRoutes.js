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
        const category = await Product.distinct("category");
        res.render("homepage",{products:products,productCategory:category})
    }catch(error){
        console.log(error)
    }
})

//category route
router.get("/category/:categoryID",async(req,res) => {
    const categoryID = req.params.categoryID;

    const products = await Product.find({"category":categoryID})
    res.render('category',{products:products});
})



export default router;