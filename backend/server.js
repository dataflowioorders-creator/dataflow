import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { seedDatabase } from './config/seeder.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow all origins for dev/testing. Adjust for production.
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Resolve paths for static directories in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve uploads folder static directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'DATA FLOW AI & Software Solutions API is running...' });
});

// Custom error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
