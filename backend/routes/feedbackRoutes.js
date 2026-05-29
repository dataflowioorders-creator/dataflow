import express from 'express';
import { getFeedbacks, createFeedback } from '../controllers/feedbackController.js';

const router = express.Router();

router.route('/')
  .get(getFeedbacks)
  .post(createFeedback);

export default router;
