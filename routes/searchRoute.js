import express from 'express';
import Product from "../models/product.js"

const router = express.Router();
router.use(express.json());

router.post("/",async (req,res)=>{
    try {
        const { searchText } = req.body;
        const searchProduct = [];
        if( searchText !==""){
            const searchInput = new RegExp(searchText,'i');
            const products = await Product.find({"name":searchInput});
            products.forEach(item =>{
                const objData = {};
                objData.name = item.name;
                objData.image = item.imageUrl;
                objData.id = item._id;
                searchProduct.push(objData);
            })
            return res.json(searchProduct);
        }
        return res.json(searchProduct);
             
    }catch(error){
        console.log(error);
    }
})


export default router;