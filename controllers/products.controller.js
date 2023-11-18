const { createHttpError } = require('../errors/custom-error');
const {
    getAllProductsSvc,
    addProductSvc,
    getProductByIdSvc,
    editProductByIdSvc,
    deleteProductByIdSvc,
} = require('../services/products.services');

const getAllProducts = async (req, res, next) => {
    const { page, name, category, gender } = req.query;
    const queryObject = {};
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' };
    }
    if (category) {
        queryObject.category = category;
    }
    if (gender) {
        queryObject.gender = gender;
    }
    try {
        const allProducts = await getAllProductsSvc(page, queryObject);
        const allProductDetails = { success: true, products: allProducts };
        res.status(201).json(allProductDetails);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};
const addProduct = async (req, res, next) => {
    const productData = req.body;
    if (Object.keys(productData).length === 0) {
        const httpError = createHttpError('Body is missing', 400);
        next(httpError);
        return;
    }
    try {
        const insertedProduct = await addProductSvc(productData);

        const productDetails = { success: true, products: insertedProduct };
        res.status(201).json(productDetails);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};
const getProductById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const fetchProduct = await getProductByIdSvc(productId);
        const productDetail = { success: true, product: fetchProduct };
        res.status(201).json(productDetail);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};
const editProductById = async (req, res, next) => {
    const productId = req.params.id;
    const productDetails = req.body;
    try {
        const updatedProduct = await editProductByIdSvc(productId, productDetails);
        const productDetail = { success: true, product: updatedProduct };
        res.status(201).json(productDetail);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};
const deleteProductById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const deletedProductDetails = await deleteProductByIdSvc(productId);
        const productDetails = { success: true, product: deletedProductDetails };
        res.status(201).json(productDetails);
    } catch (error) {
        const httpError = createHttpError(error.message, 400);
        next(httpError);
    }
};

module.exports = {
    getAllProducts,
    addProduct,
    editProductById,
    getProductById,
    deleteProductById,
};
