import express from 'express';
import User from '../models/product.js'

const router = express.Router();
router.use(express.json());

//
async function handleUserLogin(req,res){
    try {
        const {email, password } = req.body;
        console.log(req.body);
        console.log(await User.find({email:email,password:password}));
        res.send("User Found Successfully");
    } catch (error) {
        console.error('Error during user find:', error);
    }
}

//login
router.post("/product",handleUserLogin);
router.get("/product",(req,res)=>{
    res.render("product")
})



export default router;