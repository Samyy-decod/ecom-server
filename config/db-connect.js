const mongoose = require('mongoose');

const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_URL);
        console.log(`Successfully connected to MongoDB database with host: ${connection.connection.host}`);
    } catch (error) {
        // console.log('Error connecting to MongoDB', { error });
    }
};

module.exports = connectToDatabase;
