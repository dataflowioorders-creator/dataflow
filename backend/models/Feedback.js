import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    rating: {
      type: Number,
      required: [true, 'Please select a star rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: [true, 'Please write a review'],
    },
    service: {
      type: String,
      default: 'General Service',
    },
    approved: {
      type: Boolean,
      default: true, // Auto-approve or set to admin review, let's auto-approve for simplicity
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
