import express from 'express';
import Product from '../models/product.js';
import authService from '../services/authService.js';
import Payment from '../models/payment.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
//

router.get("/:productName", async (req, res) => {
   try {
      //render cart page
      //  res.send(req);
      const productName = req.params.productName;
      // const productName  = pName.replace(/-/g,' ')
      const product = await Product.findOne({ name: productName });
      const user = authService.getUser(req.cookies.uid);
      let isUserLoggedIn = true;
      let isWishlisted = false;
      if (user === undefined) {
         isUserLoggedIn = false;
      } else {
         // const wishListItem  = await WhisList.find({userId: user[0]._id,productId:productId});
         // console.log(wishListItem);
         // if(wishListItem.length>0){
         //   isWishlisted=true;
         // }
      }
      // res.render('productPage',{product:product,isUserLoggedIn:isUserLoggedIn,isWishlisted:isWishlisted})
      res.render('newProductPage', { product: product })
   } catch (error) {
      console.log(error);
   }
})

router.post("/processPayment", async (req, res) => {
   try {
      const user = authService.getUser(req.cookies.uid);
      const productName = req.body.productName;
      const totalCost = req.body.cost;
      const quantity = req.body.quantity
      console.log(totalCost);
      if (user != undefined) {
         const userId = user[0]._id;
         const secret = process.env.JWTSecret;
         const currentYear = new Date().getFullYear().toString();
         const serverOrdNumber = currentYear + Math.floor(Math.random() * 10000).toString().padStart(4, '0')
         const generateUserToken = jwt.sign({ userId: userId, productName: productName, quantity: quantity, totalCost: totalCost, orderNumber: serverOrdNumber }, secret, { expiresIn: 60 * 2 });
         const redirectUrl = "/payment/" + generateUserToken;

         const orderNumber = serverOrdNumber;
         const payment = new Payment({
            userId,
            orderNumber,
            productName,
            totalCost,
            cardDetails: {},
            upiDetails: {}
         });
         try {
            const paymentResponse = await payment.save();

            // console.log("Payment Response " + paymentResponse);
            // console.log(redirectUrl);
            return res.json({ success: true, message: "Redirecting to payment page", url: redirectUrl, clientordNumber: serverOrdNumber });
         } catch (error) {
            console.log(error);
         }

      } else {
         return res.json({ success: false, message: "Please Log In to continue!!" });
      }
   } catch (e) {
      console.log(e);
   }
})



export default router;