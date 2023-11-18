const mongoose = require('mongoose');

const product = {
    name: {
        type: String,
        required: [true, 'Name must be Provided'],
    },
    category: {
        type: String,
        enum: ['shoes', 'upperwear', 'bottomwear', 'eyewear', 'headwear', 'others'],
        required: [true, 'Category must be Provided'],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'unisex'],
        required: [true, 'Gender must be provided'],
    },
    images: {
        type: String,
        default: 'https://i.pinimg.com/originals/2c/91/19/2c911938dd88e26dd3cb432c3ff86397.jpg',
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    cost: {
        type: String,
        required: [true, 'Cost must be provided'],
    },
    review: {
        type: Array,
    },
    rating: {
        type: Number,
    },
};

const productSchema = new mongoose.Schema(product);
module.exports = mongoose.model('Product', productSchema);
