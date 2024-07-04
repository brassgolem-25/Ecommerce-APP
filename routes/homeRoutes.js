import express from 'express';
import Product from '../models/product.js';
import authService from '../services/authService.js';
import WhishList from '../models/whistList.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
router.use(express.json());

router.get("/payment",async(req,res)=>{
    const orderDetails = {
       productName :'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
        totalCost: '109.95',
        orderNumber : '3f1381e0922d6fbb5ac5',
        timeRemaining : '120'
    };
    res.render('paymentPage',{orderDetails:orderDetails});
})

router.get('/expired',async(req,res)=>{
    res.render('paymentPageExpired')
})

//home route
router.get("/",async (req,res)=>{
    try {
        const products = await Product.find({});
        // const category = await Product.distinct("category");
        const user = authService.getUser(req.cookies.uid);
        // console.log(user);
        let isUserLoggedIn=true;
        let wishListItemMap;
        
        if(user===undefined){
            isUserLoggedIn=false;
        }else {
         const whistListItem = await WhishList.find({userId: new ObjectId(user[0]._id)});
         wishListItemMap = whistListItem.map((data)=>{
            // console.log("in Map"+ data);
            return data.productId;
         }) 
        }
        // console.log(whistListItem)
        const category = ["Women's Fashion","Men's Fashion","Electronics","Home & Lifestyle","Medicine"]
        // res.render("homepage",{products:products,productCategory:category,isUserLoggedIn:isUserLoggedIn, whistListItem:JSON.stringify(wishListItemMap)})
        res.render("tempProductPage",{products:products,productCategory:category,isUserLoggedIn:isUserLoggedIn, whistListItem:JSON.stringify(wishListItemMap)})
    }catch(error){
        console.log(error)
    }
})

//category route
router.get("/category/:categoryID",async(req,res) => {
    let categoryName = req.params.categoryID;
    categoryName += ' clothing'
    const user = authService.getUser(req.cookies.uid);
    // console.log(user);
    let isUserLoggedIn=true;
    if(user===undefined){
        isUserLoggedIn=false;
    }
    const searchInput = new RegExp(categoryName);
    const products = await Product.find({"category":searchInput})
    if(products.length>0){
    res.render('newCategoryPage',{products:products,isUserLoggedIn:isUserLoggedIn});
    }else {
        // res.render('error404')
        console.log("Not Found")
    }

})



export default router;