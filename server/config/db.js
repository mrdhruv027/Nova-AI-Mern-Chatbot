const mongoose = require('mongoose');

let isInMemoryFallback = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nova_ai_chatbot';
    
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 4000,
    });

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(` MongoDB Connection Failed: ${error.message}`);
    console.warn(' Running backend in local memory storage mode for chats/users. Connect a real MongoDB instance via MONGODB_URI in .env for persistent storage.');
    isInMemoryFallback = true;
    return null;
  }
};

const getIsInMemory = () => isInMemoryFallback;

module.exports = { connectDB, getIsInMemory };
