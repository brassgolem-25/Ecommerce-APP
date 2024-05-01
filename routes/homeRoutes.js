import express from 'express';
import Product from '../models/product.js';
import authService from '../services/authService.js';
import WhishList from '../models/whistList.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
router.use(express.json());


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
        res.render("homepage",{products:products,productCategory:category,isUserLoggedIn:isUserLoggedIn,
            whistListItem:JSON.stringify(wishListItemMap)})
    }catch(error){
        console.log(error)
    }
})

//category route
router.get("/category/:categoryID",async(req,res) => {
    const categoryName = req.params.categoryID;
    //below is to check for 's in women and mens fastion and convert it to lowercase to search in DB.
    const getSpaceIndex = categoryName.indexOf(' ');
    let categoryStr;
    if(getSpaceIndex>=0){
        categoryStr=categoryName.substring(0, categoryName.indexOf(' ')).toLowerCase();
    }else{
    categoryStr=categoryName.toLowerCase();
    }
    const user = authService.getUser(req.cookies.uid);
    // console.log(user);
    let isUserLoggedIn=true;
    if(user===undefined){
        isUserLoggedIn=false;
    }
    const searchInput = new RegExp(categoryStr);
    const products = await Product.find({"category":searchInput})
    if(products.length>0){
    res.render('category',{products:products,isUserLoggedIn:isUserLoggedIn});
    }else {
        res.render('error404')
    }

})



export default router;