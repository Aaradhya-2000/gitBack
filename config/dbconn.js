const mongoose = require("mongoose")
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DBCON, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Add other options as needed, e.g., useCreateIndex: true, useFindAndModify: false
        });
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit process with failure
    }
};


module.exports = connectDB