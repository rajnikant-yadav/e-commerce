const mongoose = require('mongoose');

const address = {
    houseNo: {
        type: String,
        default: '',
    },
    colony: {
        type: String,
        default: '',
    },
    landmark: {
        type: String,
        default: '',
    },
    city: {
        type: String,
        default: '',
    },
    state: {
        type: String,
        default: '',
    },
    pincode: {
        type: String,
        default: '',
    },
    _id: false,
};

const addressSchema = new mongoose.Schema(address);
module.exports = addressSchema;
