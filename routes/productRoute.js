const express = require('express');
const { getallProduct, createProduct, updateProduct, deletProduct, getProductDetails, createProductReiew, getProductReviews, deleteReview, getallHome } = require('../controller/productCrontroller');
const { isAutherenticatedUser, Autherizeroles } = require('../middlewares/auth');
const router = express.Router();




router.get('/product' ,getallProduct)    //^get all product 
router.get('/products' ,getallHome)    //^get all Homeproduct 
router.post('/create',isAutherenticatedUser,Autherizeroles("admin","subadmin") ,createProduct)    //^create product 
router.put('/product/:id',isAutherenticatedUser,Autherizeroles("admin","subadmin"),updateProduct) //^update product 
router.delete('/product/:id',isAutherenticatedUser,Autherizeroles("admin","subadmin"),deletProduct) //!delete product
router.get('/admin/products',isAutherenticatedUser,Autherizeroles("admin","subadmin"),getallHome) //asmin product get deshbord
 
router.get('/product/:id',getProductDetails) //~single product access
router.put('/review',isAutherenticatedUser,createProductReiew) //^create Product Reiew
router.get('/reviews',getProductReviews) //^get Product Reviews
router.delete('/reviews',isAutherenticatedUser,deleteReview) //!delete Review



module.exports =router;