import express from 'express';
import User from '../models/user.js'
import authFunc from '../services/authService.js';
import { v4 as uuidv4 } from 'uuid'; 

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

//check if the user is logged in , if yes then don't show signup button
async function handleUserLogin(req,res){
    try {
        const {email, password } = req.body;
        console.log(email,password);
        const value = await User.find({email:email,password:password});
        // if(value!==[]){
        //     con
        // }
        
        if(value.length===0) 
        return res.render("login",{
            error: "Inavlid username or password",
        }) 

        const sessionId = uuidv4();
        authFunc.setUser(sessionId,value);
        res.cookie('uid',sessionId)

        const returnTo = req.session.returnTo || '/';
        delete req.session.returnTo; // Clear the stored URL
        return res.redirect(returnTo);
        // return res.redirect('/');

    } catch (error) {
        console.error('Error during user find:', error);
    }
}

//login
router.post("/login",handleUserLogin);
router.get("/login",(req,res)=>{
    res.render("login")
})

//logout
async function handleUserLogout(req,res){
    try {
        // console.log(req.session);
        res.clearCookie('uid');
        res.clearCookie('connect.sid');
        req.session.destroy((err)=>{
            if(!err){
                // req.session = null;
                res.send("You are logged out!!");
            }else {
                res.send(err);
            }
        })

    } catch (error) {
        console.error(error);
    }
}

router.get("/logout",handleUserLogout)


export default router;