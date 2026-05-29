import Project from '../models/Project.js';

// @desc    Get all projects (with optional filtering)
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, demoLink, category, image } = req.body;

    const project = new Project({
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()),
      githubLink,
      demoLink,
      category,
      image,
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, demoLink, category, image } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.techStack = techStack
        ? (Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()))
        : project.techStack;
      project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
      project.demoLink = demoLink !== undefined ? demoLink : project.demoLink;
      project.category = category || project.category;
      project.image = image || project.image;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
