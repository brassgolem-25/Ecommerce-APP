import express from 'express';
const router = express.Router();
router.use(express.json());

//remove item from cart
router.post("/",async (req,res)=>{
    try {
        // do better naming conventio
       console.log(req.body.searchText);
    //    const product = await Product.find
             
    }catch(error){
        console.log(error);
    }
})


export default router;