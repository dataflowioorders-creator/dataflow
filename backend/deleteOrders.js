import mongoose from 'mongoose';
import Order from './models/Order.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/DataFlow')
  .then(async () => {
    console.log('Connected to DB');
    const result = await Order.deleteMany({});
    console.log('Deleted all orders:', result);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
