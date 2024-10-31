const productModel = require("../models/product-model");
const createError = require("../utils/errorhander");
const ApiFeatures = require("../utils/apiFeatures");
const { cloudinary } = require("../config/cloudinaryConfig");

//#create product --Admin
module.exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;

        // Ensure that images are provided
        if (!req.files || !req.files.images) {
            return res.status(400).json({
                success: false,
                message: "Please upload product images",
            }); 
        }

        // Handle multiple images
        const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

        // Cloudinary image upload
        const uploadedImages = await Promise.all(images.map(async (image) => {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
                folder: "products",
            });
            return {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }));

        // Create product in the database
        const product = await productModel.create({
            name,
            price,
            description,
            category,
            stock,
            image: uploadedImages,  // Use 'images' instead of 'image'
            user: req.user.id,
        });

        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
  
//# Update product --Admin
module.exports.updateProduct = async (req, res, next) => {
  try {
    let product = await productModel.findById(req.params.id);
    if (!product) {
      return next(createError("Product not found", 404));
    }

    // Check if new images are provided
    if (req.files && req.files.images) {
      // Handle multiple images
      const images = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

      // Delete existing images from Cloudinary if new images are provided
      if (images.length > 0) {
        for (let i = 0; i < product.image.length; i++) {
          await cloudinary.uploader.destroy(product.image[i].public_id);
        }

        // Upload new images to Cloudinary
        const uploadedImages = await Promise.all(
          images.map(async (image) => {
            const result = await cloudinary.uploader.upload(image.tempFilePath, {
              folder: "products",
            });
            return {
              public_id: result.public_id,
              url: result.secure_url,
            };
          })
        );

        // Update req.body with new images
        req.body.image = uploadedImages;
      }
    }

    // Update product in the database
    product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated product
      runValidators: true, // Run validations
      useFindAndModify: false, // Avoid deprecated method
    });
console.log(product);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//! delete product --Admin
module.exports.deletProduct = async (req, res, next) => {
  try {
    let product = await productModel?.findById(req.params.id);
    if (!product) {
      return next(createError("Product not found", 404));
    }

      // Deleting Images From Cloudinary
  for (let i = 0; i < product.image.length; i++) {
    await cloudinary.uploader.destroy(product.image[i].public_id);
  }


    product = await productModel?.findByIdAndDelete(req.params.id);
    console.log(product);

    res.status(200).json({
      success: true,
      message: "product delete successfuly",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, data: {}, message: error.message });
  }
};

//^Get All Product

module.exports.getallProduct = async (req, res) => {
  try {
    const resultPerPage = 8;
    const productcount = await productModel.countDocuments();

    const currentPage = Number(req.query.page) || 1; // Get the current page from query params (default to 1)

    // Apply search, filter, and price sorting but don't execute yet
    const apifeatures = new ApiFeatures(productModel.find(), req.query).search().filter().sortByPrice();

    // Get the filtered product count before applying pagination
    let productsQuery = apifeatures.query;
    let filteredProductCount = await productsQuery.clone().countDocuments(); // Use .clone() to reuse the query for counting

    // Apply pagination on the query
    apifeatures.pagination(resultPerPage);

    // Now execute the query with pagination applied
    let products = await apifeatures.query;

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Product Not Found`,
      });
    }

    // Send back the products along with pagination info
    res.status(200).json({
      success: true,
      products,
      productcount,
      resultPerPage,
      filteredProductCount,
      currentPage, // Send the current page to the frontend
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//^Get HomeProduct

module.exports.getallHome = async (req, res) => {
  try {
    // Find all products in the productModel
    const products = await productModel.find();

    // Check if no products were found
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, data: {}, message: "No products found" });
    }

    // Respond with products if found
    res.status(200).json({
      success: true,
      products, // Renamed from `product` to `products` for clarity
    });
  } catch (error) {
    // Log and handle errors
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

//^Get Product Details
module.exports.getProductDetails = async (req, res) => {
  try {
    let product = await productModel?.findById(req.params.id);
    if (!product) {
      return res.json({ success: false, data: {}, message: "Product Not Found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, data: {}, message: error.message });
  }
};

//^Create new Review or Update The Reviw
module.exports.createProductReiew = async (req, res, next) => {
  try {
    const { rating, comment, productID } = req.body;
    const Review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await productModel?.findById(productID);
    const isReview = product.reviews?.find((rev) => rev?.user.toString() === req.user._id.toString());
    if (isReview) {
      product?.reviews.forEach((rev) => {
        if (rev?.user?.toString() === req?.user?._id.toString()) {
          (rev.rating = rating), (rev.comment = comment);
        }
      });
    } else {
      product.reviews.push(Review);
      product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "reviews add succesfuly",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, data: {}, message: error.message });
  }
};

//^Get all reviews of product
module.exports.getProductReviews = async (req, res, next) => {
  try {
    // Debugging req.query
    console.log(req.query);

    const product = await productModel.findById(req.query.id);

    if (!product) {
      return next(createError("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//!delet product review
module.exports.deleteReview = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.query.productId);
    if (!product) {
      return next(createError("Product not found", 404));
    }
    if(product?.reviews?.length ==0){
      return next(createError("Product  Reviews not found", 404));
    }
    const reviews = product.reviews.filter((rev) => {
      rev._id.toString() !== req.query.id.toString();
    });

    let avg = 0;
    reviews.forEach((rev) => {
      avg = avg + rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
    await productModel.findByIdAndUpdate(req.query.productId, {reviews, ratings, numOfReviews}, 
      { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({
      success: true,
      message: "product review deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, data: {}, message: error.message });
  }
};

