// Correct the stripe key to use the SECRET key in the backend
const stripe = require("stripe")("sk_test_51QAqNnP91LvaK5S57uZdYgdxjVNeQkUUGpK0avcIiWLkinBcxyTe1wrIoEK8O2t1dzz9TKeA8A597KJ0kNv1RmM8003LvwnCKv");

// Function to process payment
module.exports.processPayment = async (req, res, next) => {
    const { amount } = req.body;
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount,
            currency: "inr",
            metadata: {
                company: "Ecommerce",
            },
        });
        res.status(200).json({ success: true, client_secret: myPayment.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Function to send Stripe API key (use the publishable key here)
module.exports.sendStripeApiKey = async (req, res, next) => {
    res.status(200).json({ stripeApiKey: 'pk_test_51QAqNnP91LvaK5S5Mo7vuwv70K2x0eSqPkHeivsvNT3yrRnsQcGI6aDcObbmAXjQkWb1e498n2l8ztRR0KT1pnh400sWpWdJuj' });
};
