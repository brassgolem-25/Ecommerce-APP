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
},{timestamps : true});

const Product = mongoose.model('Product', productSchema,'Product');

export default Product;
