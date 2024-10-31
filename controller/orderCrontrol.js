
const OrderModel = require("../models/order-Model");
const productModel = require("../models/product-model");
const createError = require("../utils/errorhander");

//#Create Order
module.exports.CreateOrder = async (req, res, next) => {
  const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;
 console.log("rew.body----",req.body)
  try {

    const formattedOrderItems = orderItems.map(item => ({
        product: item.id, // Yahan product ID ko set karein
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity
      }));

    const order = await OrderModel.create({
      shippingInfo,
      orderItems:formattedOrderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id, // Ensure you are using the user._id field
    });
    console.log("order create ho gyaaaa--->>", order);

    res.status(200).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

//# Get Single ORder
module.exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate("user", "name email");
    if (!order) {
      return next(createError(`Order Dose Not Exist With Id ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      message: "Order found successfully",
      order,
    });
  } catch (error) {
    console.error("Error Finding order:", error);
    res.status(500).json({
      success: false,
      message: "Order finding failed",
      error: error.message,
    });
  }
};

// #Get logged-in user's order
module.exports.myOrder = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const orders = await OrderModel.find({ user: userId });

    if (!orders || orders.length === 0) {
      return next(createError(`No orders found for this user`, 404));
    }

    res.status(200).json({
      success: true,
      message: "Orders found successfully",
      orders,
    });
  } catch (error) {
    console.error("Error finding orders:", error);
    res.status(500).json({
      success: false,
      message: "Order finding failed",
      error: error.message,
    });
  }
};

//# Get All Orders ---Admin
module.exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find();

    if (!orders) {
      return next(createError("Orders not found", 404));
      
    }

    let totalAmount = 0;
    orders.forEach((order) => {
      //! kitne order ke pese bante he kul milka kr sbke jitne bhi db me he
      totalAmount = totalAmount + order.totalPrice;
    });

    res.status(200).json({
      success: true,
      message: " All Orders found successfully",
      totalAmount,
      orders,
    });
  } catch (error) {
    console.error("Error finding All orders:", error);
    res.status(500).json({
      success: false,
      message: "Order finding All failed",
      error: error.message,
    });
  }
};

//# Update Order Status and Adjust Stock --Admin

module.exports.updateOrder = async (req, res, next) => {
    try {
      const order = await OrderModel.findById(req.params.id);
  
      if (!order) { 
        return res.status(404).json({
          success: false,
          message: "Order not found with this Id",
        });
      }
  
      if (order.orderStatus === "Delivered") {
        return res.status(400).json({
          success: false,
          message: "You have already delivered this order",
        });
      }
  
      if (req.body.status === "Shipped") {
        await Promise.all(
            order.orderItems.map( async (item)=>{
                const productId = item.product;
                const quantity = item.quantity;
                
                await updateStock(productId, quantity); // Update stock with product ID and quantity
            })
    
          
        );
      }
  
      order.orderStatus = req.body.status;
  
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
      }
  
      await order.save({ validateBeforeSave: false });
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error finding orders:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating the order",
        error: error.message,
      });
    }
  };

  
  async function updateStock(productId, quantity) {

    console.log("_id=>",productId,quantity);

    const product = await productModel.findById(productId);

    if (!product) {
        throw createError("Product not found with this Id", 404);
    }

    product.stock -= quantity;

    if (product.stock < 0) {
        throw createError("Stock cannot be negative", 400);
    }

    await product.save({ validateBeforeSave: false });
}


 

//! Order Delete ---Admin
module.exports.DeleteOrder = async (req, res, next) => {
  try {
    const userID = req.params.id;
    const order = await OrderModel?.findById(userID);

    if (!order) {
      return next(createError("Orders not found", 404));
    }
    product = await OrderModel?.findByIdAndDelete(userID);

    res.status(200).json({
      success: true,
      message: "Order delete successfuly",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, data: {}, message: error.message });
  }
};
