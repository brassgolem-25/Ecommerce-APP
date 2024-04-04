// complete when you want to show something specific to a user
import authFunc from '../services/authService.js';


async function restrictToLoggedinUserOnly(req,res,next){
   const userUID =req.cookies.uid;
   const user = authFunc.getUser(userUID);
   
   if(!userUID || !user){
    req.session.returnTo = req.originalUrl;
    return res.redirect('/auth/login');
   }

  //  if(!user){
  //   req.session.returnTo = req.originalUrl;
  //   return res.redirect('/auth/login');
  //  }

  // console.log(req.user);// this is the mail and password
  // what this does is, if we put next , the cart/ or any other router or the function is rendered if the user is logged in
  next();
}

export default restrictToLoggedinUserOnly;