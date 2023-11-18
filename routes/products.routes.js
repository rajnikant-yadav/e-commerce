const express = require('express');
const {
    getAllProducts,
    addProduct,
    getProductById,
    editProductById,
    deleteProductById,
} = require('../controllers/products.controller');
const router = express.Router();

router.get('/', getAllProducts);
router.post('/', addProduct);
router.get('/:id', getProductById);
router.patch('/:id', editProductById);
router.delete('/:id', deleteProductById);

module.exports = router;
