import express from 'express';
import User from '../models/user.js'

const router = express.Router();
router.use(express.json());

async function handleUserSignup(req,res){
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        await User.create({
            name,
            email,
            password,
        });
        res.send("User Created Successfully");
    } catch (error) {
        console.error('Error during user registration:', error);
    }
}

router.post("/signup",handleUserSignup);
router.get("/signup",(req,res)=>{
    res.render("signup")
})

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
router.post("/login",handleUserLogin);
router.get("/login",(req,res)=>{
    res.render("login")
})



export default router;