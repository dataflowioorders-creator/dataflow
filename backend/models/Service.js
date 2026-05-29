import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a service title'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a service description'],
    },
    price: {
      type: String,
      required: [true, 'Please add a pricing placeholder or range'],
    },
    icon: {
      type: String,
      default: 'Cpu', // Default icon name from Lucide
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
