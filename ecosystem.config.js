module.exports = {
  apps: [{
    name: 'ecom-server',
    script: 'server.js',
    watch: true,
    ignore_watch: [".git", "node_modules"],
    env: {
      PORT: 4000,
      DB_URL: "mongodb://localhost:27017/mydatabase",
      JWT_KEY: process.env.JWT_KEY,
      JWT_EXPIRE: "24h",
      COOKIE_EXPIRE: "7",
      FRENTED_URL: "http://localhost:3000",

      // Gmail SMTP configuration
      SMPT_SERVICE: "gmail",
      SMPT_MAIL: "boykhan701434@gmail.com",
      SMPT_PASSWORD:  process.env.SMPT_PASSWORD,
      SMPT_HOST: "smtp.gmail.com", // Correct SMTP host for Gmail

      // Cloudinary
      CLOUDINARY_NAME: "samyy",
      CLOUDINARY_API_KEY: "538659919598949",
      CLOUDINARY_API_SECRET: "z53Lf-HB1x_jOird8pWc5CAMAxk",

      // Stripe
      STRIPE_API_KEY: "pk_test_51QAqNnP91LvaK5S5Mo7vuwv70K2x0eSqPkHeivsvNT3yrRnsQcGI6aDcObbmAXjQkWb1e498n2l8ztRR0KT1pnh400sWpWdJuj",
      STRIPE_SECRET_KEY: "sk_test_51QAqNnP91LvaK5S57uZdYgdxjVNeQkUUGpK0avcIiWLkinBcxyTe1wrIoEK8O2t1dzz9TKeA8A597KJ0kNv1RmM8003LvwnCKv"
    },
  }]
};
