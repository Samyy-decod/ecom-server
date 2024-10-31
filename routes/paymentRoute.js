// Route file: paymentRoute.js
const express = require('express');
const router = express.Router();
const {isAutherenticatedUser} = require('../middlewares/auth');
const { processPayment, sendStripeApiKey } = require('../controller/paymentController');

// Route to process payment
router.post("/payment/process", isAutherenticatedUser, processPayment);

// Route to get Stripe API key
router.get("/stripeapikey", isAutherenticatedUser, sendStripeApiKey);

module.exports = router;
