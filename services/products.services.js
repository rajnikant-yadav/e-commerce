const { createHttpError } = require('../errors/custom-error');
const Product = require('../models/Product');

const getAllProductsSvc = async (_page, queryObject) => {
    try {
        let result = Product.find(queryObject);
        const page = _page || 1;
        skip = (page - 1) * 10;

        result = result.skip(skip).limit(10);
        if (!result) {
            const error = createHttpError(`No Product Found `, 404);
            throw error;
        }
        const allProducts = await result;
        return allProducts;
    } catch (error) {
        throw error;
    }
};
const addProductSvc = async (payload) => {
    try {
        const insertedProduct = await Product.create(payload);
        if (!insertedProduct) {
            const error = createHttpError(`Bad Request`, 400);
            throw error;
        }
        return insertedProduct;
    } catch (error) {
        if ((error.name = 'ValidationError')) {
            const dbError = new Error(`Validation error : ${error.message}`);
            dbError.type = 'ValidationError';
            throw dbError;
        }
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type Error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        throw error;
    }
};
const getProductByIdSvc = async (productId) => {
    try {
        const productDetails = await Product.findById({ _id: productId });
        if (!productDetails) {
            const error = createHttpError(`No Product Found with Given Id`, 404);
            throw error;
        }
        return productDetails;
    } catch (error) {
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        if (error.type === 'NotFound') {
            throw error;
        }
        throw error;
    }
};
const editProductByIdSvc = async (productId, productDetails) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate({ _id: productId }, productDetails, {
            new: true,
            runValidators: true,
        });
        if (!updatedProduct) {
            const error = createHttpError('No Product Found with Given Id', 404);
            throw error;
        }
        return updatedProduct;
    } catch (error) {
        if (error.name === 'CastError') {
            const dbError = new Error(`Data Type error : ${error.message}`);
            dbError.type = 'CastError';
            throw dbError;
        }
        if (error.type === 'NotFound') {
            throw error;
        }
        throw error;
    }
};
const deleteProductByIdSvc = async (productId) => {
    const deletedProductDetails = await Product.findByIdAndDelete({ _id: productId });
    if (!deletedProductDetails) {
        const error = createHttpError(`No Product Found with Given Id`, 404);
        throw error;
    }
    return deletedProductDetails;
};

module.exports = {
    getAllProductsSvc,
    addProductSvc,
    getProductByIdSvc,
    editProductByIdSvc,
    deleteProductByIdSvc,
};
