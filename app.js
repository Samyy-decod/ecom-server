const express = require('express');
const productRouter = require('./routes/productRoute') 
const errorhander = require('./middlewares/error') 
const userRoutes = require('./routes/userRoutes/userRoutes')
const adminRoutes = require('./routes/adminRoutes/adminRoutes')
const orderRoutes = require('./routes/orderRoutes')
const payment = require("./routes/paymentRoute");
const dotenv = require('dotenv');

const bodyparser = require('body-parser')
const cookieParser = require('cookie-parser');
const fileUpload = require("express-fileupload");

dotenv.config({ path: './config/.env' });

const cors = require('cors')
const app =express();

app.use(express.json()) 
app.use(cookieParser());

app.set('view engine', 'ejs');

app.use(cors({
    origin: ['http://localhost:3000' , 'http://192.168.29.64:3000'], //Isme tu sirf apni website ko allow karta hai, apni API se data lene ka right milega. 
    credentials: true, //  Yaha cookies, tokens wagairah ko send kar sakta hai safely.
  }));
app.use(bodyparser.urlencoded({ extended: true }));

app.use(fileUpload({
  useTempFiles: true, // Use temporary files during upload process
  tempFileDir: '/tmp/', // Temporary directory for uploaded files
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit the file size to 10MB
}));
app.use(bodyparser.json());

//! Router...
app.use('/api/v1',productRouter)
app.use('/api/v1',userRoutes)
app.use('/api/v1',adminRoutes)
app.use('/api/v1',orderRoutes)
app.use("/api/v1", payment);

//!middelware for Error..
app.use(errorhander)
module.exports = app;

