import express from 'express';
import { getFeedbacks, createFeedback, deleteFeedback } from '../controllers/feedbackController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFeedbacks)
  .post(createFeedback);

router.route('/:id').delete(protect, admin, deleteFeedback);

export default router;
