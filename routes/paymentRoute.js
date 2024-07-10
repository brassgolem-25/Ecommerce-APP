import express from 'express';
import Payment from '../models/payment.js';
import authService from '../services/authService.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import Product from '../models/product.js';
import Order from '../models/order.js';


const router = express.Router();
router.use(express.json());
//
const keyID = process.env.RAZORPAY_KEYID;
const keySecret = process.env.RAZORPAY_KEYSECRET;

router.get("/:token", async (req, res) => {
   try {
      const secret = process.env.JWTSecret;
      const generatedToken = req.params.token;
      // console.log("generatedToken"+generatedToken)
      const response = jwt.verify(generatedToken, secret);
      console.log(response);
      const productName = response.productName;
      const userId = response.userId;
      // const orderNumber = userId.substr(5) + Math.floor(Math.random() * 10);
      const orderNumber = response.orderNumber;
      const totalCost = response.totalCost;
      const quantity = response.quantity;
      const startTime = response.iat;
      const endTime = response.exp;


      const orderDetails = { productName: productName, totalCost: totalCost, orderNumber: orderNumber,quantity:quantity, startTime: startTime, endTime: endTime };
      // console.log(orderDetails);
      const paymentDetails = await Payment.find({ userId: new ObjectId(userId), orderNumber: orderNumber });
      const userPaymentStatus = paymentDetails[0].paymentStatus;
      if (userPaymentStatus != 'Completed') {
         res.render('paymentPage', { orderDetails: orderDetails });
      } else {
         res.render('paymentPageExpired');
      }


   } catch (e) {
      res.render('paymentPageExpired')
      console.log(e);
   }
})

router.post('/initiatePayment', async (req, res) => {
   try {
      const { productName, orderNumber, paymentMethod, cardDetails, upiDetails, quantity } = req.body;
      const totalCost = parseInt(req.body.totalCost);
      const user = authService.getUser(req.cookies.uid);
      const userId = user[0]._id;
      const updatePaymentStatus = await Payment.findOneAndUpdate({ userId: new ObjectId(userId), orderNumber: orderNumber },
         {
            $set: {
               paymentStatus: "Completed",
               paymentMethod: paymentMethod,
               cardDetails: paymentMethod === 'Credit/Debit Card' ? cardDetails : {},
               upiDetails: paymentMethod === 'UPI' ? upiDetails : {}
            }
         }
      )
      
      const productDetail = await Product.find({ name: productName });
      const productId = productDetail[0]._id;
      await Order.create({
         userId: userId,
         productId: productId,
         quantity: quantity,
         orderId: orderNumber,
         seller: 'Exclusive',
         paymentType: paymentMethod,
         orderStatus: 'Shipped',
         totalAmount: totalCost,

      })

      return res.json({ success: true, message: "Payment done" });
   } catch (error) {
      console.log(error);
      return res.json({ success: false, message: "Payment failed" });
   }
})


//check payment status 
router.post('/paymentStatus', async (req, res) => {
   try {
      const user = authService.getUser(req.cookies.uid);
      const userId = user[0]._id;
      const { orderNumber } = req.body;
      // console.log("orderNumber"+ orderNumber);
      const paymentResponse = await Payment.find({ userId: new ObjectId(userId), orderNumber: orderNumber });
      // console.log("Payment Response " + paymentResponse[0]);
      const clientPaymentStatus = paymentResponse[0].paymentStatus;
      // console.log("clientPaymentStatus" + clientPaymentStatus);
      if (clientPaymentStatus === 'Pending') {
         console.log("Payment not done!!");
         return res.json({ isPaymentCompleted: false, message: "Payment not completed!" });
      }
      const clientPaymentMethod = paymentResponse[0].paymentMethod;
      return res.json({ isPaymentCompleted: true, message: "Payment completed", paymentMethod: clientPaymentMethod });

   } catch (error) {
      console.log(error);
   }
})

export default router;