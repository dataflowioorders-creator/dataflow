import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a project title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a project description'],
    },
    techStack: {
      type: [String],
      required: [true, 'Please add a tech stack'],
    },
    githubLink: {
      type: String,
      default: '',
    },
    demoLink: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['AI/ML', 'Web', 'Research', 'Mobile Apps'],
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', // Beautiful tech/abstract image default
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
