import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0, // Minimum price should be 0 or more
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: String, // URL for the product image
    rating:{
        type: Object,
        required: true,
    },
},{timestamps : true});

const Product = mongoose.model('Product', productSchema,'Product');

export default Product;

//{
//     id: 1,
//     title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
//     price: 109.95,
//     description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
//     category: "men's clothing",
//     image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
//     rating: { rate: 3.9, count: 120 }
//   }