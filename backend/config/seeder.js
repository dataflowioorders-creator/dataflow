import Service from '../models/Service.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

const initialServices = [
  {
    title: 'Journal & Research Papers',
    description: 'IEEE/Springer compliant academic writing, research formatting, literature surveys, and paper drafting services.',
    price: '$150 - $400',
    icon: 'FileText',
  },
  {
    title: 'Project Documentation',
    description: 'Comprehensive SRS documents, UML diagrams, architecture patterns, and detailed user manuals for your applications.',
    price: '$80 - $200',
    icon: 'BookOpen',
  },
  {
    title: 'Mini Projects',
    description: 'Rapid prototyping, utility scripts, database integrations, and console applications tailored to specific requirements.',
    price: '$100 - $300',
    icon: 'Terminal',
  },
  {
    title: 'Major Projects',
    description: 'Enterprise-grade systems, complex system integrations, distributed architectures, and end-to-end custom products.',
    price: '$500 - $2000',
    icon: 'Layers',
  },
  {
    title: 'AI & ML Projects',
    description: 'Neural networks, Natural Language Processing, computer vision, data analysis pipelines, and predictive modelling.',
    price: '$350 - $1200',
    icon: 'Cpu',
  },
  {
    title: 'Web Development',
    description: 'Futuristic, ultra-fast web apps using React, Node.js, Next.js, and interactive cyber-tech CSS animations.',
    price: '$300 - $1500',
    icon: 'Globe',
  },
  {
    title: 'Logo Designing',
    description: 'Premium vector logos, modern minimalist brand assets, and custom cyberpunk UI/UX graphics.',
    price: '$50 - $150',
    icon: 'Palette',
  },
];

const initialProjects = [
  {
    title: 'CyberSentinel AI',
    description: 'Deep learning autoencoder for real-time network anomaly detection and intrusion mitigation.',
    techStack: ['Python', 'TensorFlow', 'FastAPI', 'React'],
    githubLink: 'https://github.com/dataflow/cybersentinel-ai',
    demoLink: 'https://cybersentinel.dataflow.io',
    category: 'AI/ML',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Decentralized Data Vault',
    description: 'Futuristic cloud storage application using glassmorphism dashboard styling and end-to-end client-side encryption.',
    techStack: ['Node.js', 'React', 'MongoDB', 'Web3.js'],
    githubLink: 'https://github.com/dataflow/decentralized-vault',
    demoLink: 'https://vault.dataflow.io',
    category: 'Web',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Quantum Route Optimization',
    description: 'Research modeling quantum annealing approaches and simulated annealing for resolving complex logistics routing.',
    techStack: ['Python', 'Qiskit', 'NumPy', 'LaTeX'],
    githubLink: 'https://github.com/dataflow/quantum-optimizer',
    demoLink: '',
    category: 'Research',
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'BioSynth Diagnostics',
    description: 'Cross-platform mobile camera application scanning crop leafs to diagnose crop diseases in offline environments.',
    techStack: ['React Native', 'TensorFlow Lite', 'Node.js', 'Express'],
    githubLink: 'https://github.com/dataflow/biosynth-mobile',
    demoLink: 'https://biosynth.dataflow.io',
    category: 'Mobile Apps',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  },
];

export const seedDatabase = async () => {
  try {
    // Seed primary admin (dataflow.io.orders@gmail.com)
    const primaryAdminEmail = process.env.RECEIVER_EMAIL || 'dataflow.io.orders@gmail.com';
    const primaryAdminExists = await User.findOne({ email: primaryAdminEmail });
    if (!primaryAdminExists) {
      await User.create({
        name: 'Data Flow Admin',
        email: primaryAdminEmail,
        password: 'admin123',
        role: 'admin',
        isVerified: true,
      });
      console.log(`Seeded primary admin user: ${primaryAdminEmail} (password: admin123)`);
    } else {
      // Ensure the primary admin email role is set to admin
      primaryAdminExists.role = 'admin';
      primaryAdminExists.isVerified = true;
      await primaryAdminExists.save();
    }

    // Demote any other admin users to customer
    await User.updateMany(
      { email: { $ne: primaryAdminEmail }, role: 'admin' },
      { role: 'customer' }
    );
    console.log("Enforced single admin policy: Demoted all other admin roles to customer.");

    // Seed services
    const serviceCount = await Service.countDocuments({});
    if (serviceCount === 0) {
      await Service.insertMany(initialServices);
      console.log('Seeded initial services database!');
    }

    // Seed projects
    const projectCount = await Project.countDocuments({});
    if (projectCount === 0) {
      await Project.insertMany(initialProjects);
      console.log('Seeded initial showcase projects database!');
    }
  } catch (error) {
    console.error(`Database seeding failed: ${error.message}`);
  }
};
