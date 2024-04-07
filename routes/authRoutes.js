import express from 'express';
import User from '../models/user.js'
import authFunc from '../services/authService.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; // for password hashing
import jwt from 'jsonwebtoken'; // for password reset link
import nodemailer from 'nodemailer';

const router = express.Router();
router.use(express.json());

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const emailAlreadyExist = await User.find({ email: email });
        // console.log(emailAlreadyExist);
        if (emailAlreadyExist.length === 0) {
            await User.create({
                name,
                email,
                password: hashedPassword,
            });
            res.send("User Created Successfully");
        } else {
            res.send("User Already Exist");
        }
    } catch (error) {
        console.error('Error during user registration:', error);
    }
}

router.post("/signup", handleUserSignup);
router.get("/signup", (req, res) => {
    res.render("signup")
})

//check if the user is logged in , if yes then don't show signup button
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const value = await User.find({ email: email });

        if (value.length === 0) {
            console.log("Email not found")
            return res.render("login", {
                error: "Inavlid email",
            })
        }

        const userPassword = value[0].password;
        //compare the password in input and in DB
        const isMatch = await bcrypt.compare(password, userPassword);

        //check if password is matched if email is found
        if (isMatch) {
            const sessionId = uuidv4();
            authFunc.setUser(sessionId, value);
            res.cookie('uid', sessionId)

            const returnTo = req.session.returnTo || '/';
            delete req.session.returnTo; // Clear the stored URL
            return res.redirect(returnTo);
        } else {
            //if password not matched then paswword is wrong
            console.log("password is incorrect")

            return res.render("login", {
                error: "Inavlid password",
            })

        }
        // return res.redirect('/');

    } catch (error) {
        console.error('Error during user find:', error);
    }
}

//login
router.post("/login", handleUserLogin);
router.get("/login", (req, res) => {
    res.render("login")
})

//logout
async function handleUserLogout(req, res) {
    try {
        // console.log(req.session);
        res.clearCookie('uid');
        res.clearCookie('connect.sid');
        req.session.destroy((err) => {
            if (!err) {
                // req.session = null;
                res.send("You are logged out!!");
            } else {
                res.send(err);
            }
        })

    } catch (error) {
        console.error(error);
    }
}

router.get("/logout", handleUserLogout)

//forgot password
router.post('/forgotPassword', async (req, res) => {
    try {
        const userEmail = req.body.email;
        const secret = 'Tushar';
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            res.send("User doesn't exist");
        }
        else {
            const token = jwt.sign({ data: userEmail }, secret, { expiresIn: 60 * 60 });
            const reqUrl = "http://localhost:3000/auth/reset-password?token=" + token;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'exclusiveproducts2003@gmail.com',
                    pass: 'apebymyltzzjxkom'
                }
            });

            const mailOptions = {
                from: 'exclusiveproducts2003@gmail.com',
                to: userEmail,
                subject: 'Password Reset',
                html: `
                <p>Click the following link to reset your password :</p>
                <a href="${reqUrl}">Reset Password</a>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                } else {
                    console.log('Email sent:', info.response);
                }
            });
            res.render('login');
        }

        // console.log(val);

    } catch (error) {
        res.send(error);
    }
})

router.get('/forgotPassword', async (req, res) => {
    try {
        res.render('forgotPassword');
    } catch (error) {
        res.send(error);
    }
})

// reset password 
router.get('/reset-password', async (req, res) => {
    try {
        // console.log(req);
        const secret = process.env.JWTSecret;
        const token = req.query.token;
        try {
            const decoded = jwt.verify(token, secret);
            const userEmail = decoded.data;
            res.render('reset-password', { email: userEmail });
        } catch (error) {
            console.log("error verifying token");
        }
    } catch (error) {
        res.send(error);
    }
})

// implement the functionality to only allow one time password reset with one token
router.post('/reset-password', async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ email: email }, { $set: { password: hashedPassword } });
        res.render('login');
    } catch (error) {
        res.send(error);
    }
})

export default router;