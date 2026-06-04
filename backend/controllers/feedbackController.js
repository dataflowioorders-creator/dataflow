import Feedback from '../models/Feedback.js';

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Public
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ approved: true }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Submit feedback
// @route   POST /api/feedback
// @access  Public
export const createFeedback = async (req, res) => {
  try {
    const { name, rating, review, service } = req.body;

    const feedback = new Feedback({
      name,
      rating: Number(rating),
      review,
      service,
    });

    const createdFeedback = await feedback.save();
    res.status(201).json(createdFeedback);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    await feedback.deleteOne();
    res.json({ message: 'Feedback removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
