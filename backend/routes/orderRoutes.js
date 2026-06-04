import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  getOrderStatusPublic,
  payOrder,
  fixOrderAmount,
  acceptOrderAmount,
  markOrderReviewed,
  deleteOrder,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration (Memory Storage for Base64)
const storage = multer.memoryStorage();

// File filter (optional)
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Resolve upload middleware for the request
const checkAuthOptional = (req, res, next) => {
  // If there's an authorization header, verify it to link order to user
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.route('/')
  .post(checkAuthOptional, upload.single('file'), createOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.put('/:id/status', protect, admin, upload.single('file'), updateOrderStatus);
router.put('/:id/pay', protect, upload.single('file'), payOrder);
router.get('/tracker/:id', getOrderStatusPublic);

router.put('/:id/fix-amount', protect, admin, fixOrderAmount);
router.put('/:id/accept-amount', protect, acceptOrderAmount);
router.route('/:id/review').put(protect, markOrderReviewed);
router.route('/:id').delete(protect, admin, deleteOrder);

export default router;
