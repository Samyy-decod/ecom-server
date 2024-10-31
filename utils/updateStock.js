const productModel = require("../models/product-model");


module.exports.updateStock = async ( order) => {
    try {
        console.log("productId==>>",order);

        
        const product = await productModel.findById(order?.product);

        if (!product) {
            throw new Error(`Product not found with ID ${order?.product}`);
        }

        product.stock = product.stock - order?.quantity;

        await product.save({ validateBeforeSave: false });
    } catch (error) {
        console.error(`Error updating stock for product ID: ${order?.product}`, error);
        throw new Error(error.message);
    }
};
