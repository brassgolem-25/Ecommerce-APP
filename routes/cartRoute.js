import express from 'express';

const router = express.Router();
router.use(express.json());


//cart route
router.get("/",async (req,res)=>{
    try {
        res.send("you are logged in!!YA, you can see the cart now");
    }catch(error){
        console.log(error);
    }
})



export default router;