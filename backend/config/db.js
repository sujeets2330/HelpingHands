// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         await mongoose.connect('mongodb://127.0.0.1:27017/HelpingHands');

//         console.log('MongoDB connected successfully');
//     } catch (error) {
//         console.error('Error connecting to MongoDB:', error);
//         process.exit(1); 
//     }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    // ❌ DO NOT exit process on Vercel
  }
};

module.exports = connectDB;
