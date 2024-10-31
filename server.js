// server.js
const app = require('./app');
const dotenv = require('dotenv');
const connectToDatabase = require('./config/db-connect');
const cloudinary = require('./config/cloudinaryConfig');

// Load environment variables
dotenv.config({ path: './config/.env' }); // Correct path to .env file

connectToDatabase();

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});
