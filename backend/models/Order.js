import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Can be guest or logged-in user
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    alternatePhone: {
      type: String,
      required: [true, 'Please add an alternate phone number'],
    },
    service: {
      type: String,
      required: [true, 'Please select a service'],
    },
    description: {
      type: String,
      required: [true, 'Please enter a project description'],
    },
    fileUrl: {
      type: String,
    },
    fileName: {
      type: String,
    },
    deadline: {
      type: Date,
      required: [true, 'Please set a deadline'],
    },
    budget: {
      type: String,
      required: [true, 'Please specify a budget range'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    deliveredFileUrl: {
      type: String,
    },
    deliveredFileName: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentScreenshotUrl: {
      type: String,
    },
    paymentScreenshotName: {
      type: String,
    },
    fixedAmount: {
      type: String,
      default: 'N/A',
    },
    isAmountAccepted: {
      type: Boolean,
      default: false,
    },
    amountAcceptedAt: {
      type: Date,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
