import express from 'express';
import User from '../models/user.js'
import authFunc from '../services/authService.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'; // for password hashing
import jwt from 'jsonwebtoken'; // for password reset link
import nodemailer from 'nodemailer';
import { authenticator } from 'otplib'; // for otp generation
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend"; // for sending mail of otp or anything else
import { OAuth2Client } from 'google-auth-library';// for oauth via google
import { validateState } from '../middlewares/validateState.js';
import { configDotenv } from 'dotenv';


// console.log(process.env.mailersend_apikey)
configDotenv();
const secret = process.env.OTP_SECRET;

const router = express.Router();
router.use(express.json());

//create user session and cookie
async function createUserSession(res, userEmail) {
    try {
        const sessionId = uuidv4();
        const user = await User.find({email:userEmail})
        authFunc.setUser(sessionId, user);
        res.cookie('uid', sessionId)
        //pass req in paramter if want to check user is saved or not
        // const user = authFunc.getUser(req.cookies.uid);
        // return user;
    } catch (error) {
        console.log("Error creating user Session " + error);
    }
}

//google oauth setup
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "http://localhost:3000/auth/google/callback");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, "https://ecommerce-app-production-3f9f.up.railway.app/auth/google/callback");

router.get('/google',validateState, (req, res) => {

    const { state } = req.query;
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        state: state,
    });
    res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
    try {
        const { code, state } = req.query;
        const { tokens } = await client.getToken(code);
        client.setCredentials(tokens);

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const googleId = payload['sub'];
        const email = payload['email'];
        const name = payload['name'];

        let user = await User.findOne({ googleId });
        if (state == "signup") {
            if (!user) {
                user = new User({
                    googleId,
                    name,
                    email,
                });
                await user.save();
                console.log("User created and saved in backend")
                return res.redirect("/");
            } else {
                // user already exist
                return res.redirect("/auth/login?error=user_already_exists")
            }
        }
        if(state=="login"){
            if(!user){
                return res.redirect('/auth/signup?error=user_not_found');
            }
        }
        await createUserSession(res,email);
        return res.redirect('/');

    } catch (error) {
        console.error('Error during Google OAuth callback:', error);
        res.redirect('/');
    }
});

async function handleUserSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        console.log(req.body['password']);
        const salt = await bcrypt.genSalt(10);
        console.log(salt)
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log(hashedPassword)
        const emailAlreadyExist = await User.find({ email: email });
        // console.log(emailAlreadyExist);
        if (emailAlreadyExist.length === 0) {
            await User.create({
                name,
                email,
                password: hashedPassword,
            });
            // res.send("User Created Successfully");
            createUserSession(res, email);
            res.redirect('/');
        } else {
            res.json({ success: false, message: "The mail already exist.Please login" });
        }
    } catch (error) {
        console.error('Error during user registration:', error);
    }
}

router.post("/signup", handleUserSignup);
router.get("/signup", (req, res) => {
    try {
        const user = authFunc.getUser(req.cookies.uid);

        let isUserLoggedIn = true;
        if (user === undefined) {
            isUserLoggedIn = false;
            res.render("signup", { isUserLoggedIn: isUserLoggedIn })
        } else {
            res.redirect('/Account')
        }
    } catch (error) {
        console.log(error);
    }

})

//generate OTP and sent to email
const generateOTP = async (email) => {
    const token = authenticator.generate(secret);
    try {
        // send email
        const otpMessage = "Hello, " + token + " is your one-time passcode (OTP) for the Exclusive app"
        const mailerSend = new MailerSend({
            apiKey: process.env.MAILSENDAPI,
        });


        const sentFrom = new Sender(process.env.MAILSENDADR, "Exclusive");

        const recipients = [
            new Recipient(email, "Tushar Tiwari")
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject("Your One-Time Passcode from Exclusive")
            .setText(otpMessage);

        try{
            await mailerSend.email.send(emailParams);
        }catch(error){
            console.log(error);
        }
        //   console.log("Mail Sent")

        console.log("token " + token)
        // return token;
    } catch (err) {
        console.log(err);
    }
}

//check if the user is logged in , if yes then don't show signup button
async function handleUserLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log(email, password);

        const value = await User.find({ email: email });

        if (value.length === 0) {
            // console.log("Email not found")
            return res.json({ success: false, message: "You are not registered with us.Please Login!" })
        }

        const userPassword = value[0].password;
        //compare the password in input and in DB
        const isMatch = await bcrypt.compare(password, userPassword);

        //check if password is matched if email is found
        if (isMatch) {
            generateOTP(email);
            return res.json({ success: true, message: "OTP has been sent to your email ID" });
        } else {
            //if password not matched then paswword is wrong

            return res.json({ success: false, message: "wrong password" })

        }
    } catch (error) {
        console.log('Error during user find:', error);
        return res.json({ success: false });
    }
}
//login
router.post("/login", handleUserLogin);
router.get("/login", (req, res) => {
    try {
        const user = authFunc.getUser(req.cookies.uid);

        let isUserLoggedIn = true;
        if (user === undefined) {
            isUserLoggedIn = false;
            res.render("login", { isUserLoggedIn: isUserLoggedIn })
        } else {
            res.redirect('/Account')
        }

    } catch (error) {
        console.log(error);
    }
})

//otp verify
router.post("/otpVerify", async (req, res) => {
    try {
        const { otp, email } = req.body;
        const isValid = authenticator.check(otp, secret);
        console.log("is OTP valid " + isValid)
        if (isValid) {
            console.log("Yes it's valid")
            const value = await User.find({ email: email });
            const sessionId = uuidv4();
            authFunc.setUser(sessionId, value);
            res.cookie('uid', sessionId)
            const user = authFunc.getUser(req.cookies.uid);
            console.log("user details" + user)
            //
            // const secret = process.env.JWTSecret;
            // const token = jwt.sign({ data: email }, secret, { expiresIn: '12h' });
            // localStorage.setItem('token', token);
            // localStorage.setItem('tokenExpiration', '12h')
            // console.log(token);

            return res.json({ success: true, message: "OTP is validated"})
        } else {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

    } catch (error) {
        console.log(error);
    }
})

router.post("/resendOTP", async (req, res) => {
    try {
        const { email } = req.body;
        generateOTP(email);
        return res.json({ success: true, message: "OTP has been sent again" });
    } catch (error) {
        console.log(error);
    }
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
                res.redirect("/")
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
        const secret = process.env.JWTSecret;
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            res.send("User doesn't exist");
        }
        else {
            const token = jwt.sign({ data: userEmail }, secret, { expiresIn: 60 * 60 });
            const reqUrl = "http://localhost:3000/auth/reset-password?token=" + token;
            const ecomEmail = process.env.exclusiveEmail;
            const password = process.env.exclusivePass;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: ecomEmail,
                    pass: password
                }
            });

            const mailOptions = {
                from: ecomEmail,
                to: userEmail,
                subject: 'Password Reset',
                html: `
                <p>Click the following link to reset your password :</p>
                <a href="${reqUrl}">Reset Password</a>
                <br><p>This is for Test Purpose Only.</p>`
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