const mongoose = require('mongoose');

let isInMemoryFallback = false;
let mongoError = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nova_ai_chatbot';
    
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    isInMemoryFallback = false;
    mongoError = null;
    return conn;
  } catch (error) {
    console.warn(` MongoDB Connection Failed: ${error.message}`);
    mongoError = error.message;
    isInMemoryFallback = true;
    return null;
  }
};

const getIsInMemory = () => isInMemoryFallback;
const getMongoError = () => mongoError;

module.exports = { connectDB, getIsInMemory, getMongoError };
