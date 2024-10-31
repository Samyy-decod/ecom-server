const mongoose = require("mongoose");

const orderschema = mongoose.Schema({
  shippingInfo: {

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    phoneNo: {
        type: Number,
        required: true,
      },
  },

  orderItems: [
    {
      name: {
        type: String,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      image: {
        type: String,
        require: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        require: true,
      },
  
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

  paymentInfo: {
    id: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
    },
  },
  paidAt: {
    type: Date,
    require: true,
  },
  itemsPrice: {
    type: Number,
    default: 0,
    require: true,
  },
  texPrice: {
    type: Number,
    default: 0,
    require: true,
  },
  shippingPrice: {
    type: Number,
    default: 0,
    require: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
    require: true,
  },
  orderStatus: {
    type: String,
    enum: ["processing", "delivered"],
    default: "processing",
  },
  deliverdAt: {
    type: Date,
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderschema);
