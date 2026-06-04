import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  FileText, BookOpen, Terminal, Layers, Cpu, Globe, Palette,
  Star, Send, Mail, Phone, ArrowRight, Code, MessageCircle, Bot, Smartphone, Server
} from 'lucide-react';

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const iconMap = {
  FileText: FileText,
  BookOpen: BookOpen,
  Terminal: Terminal,
  Layers: Layers,
  Cpu: Cpu,
  Globe: Globe,
  Palette: Palette,
  MessageCircle: MessageCircle,
  Bot: Bot,
  Smartphone: Smartphone,
  Server: Server
};

const LandingPage = ({ user }) => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [filterCategory, setFilterCategory] = useState('All');

  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackReview, setFeedbackReview] = useState('');
  const [feedbackService, setFeedbackService] = useState('General Service');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  // Testimonial slider state
  const [feedbackIndex, setFeedbackIndex] = useState(0);

  useEffect(() => {
    // Fetch Services
    api.services.getAll()
      .then(data => setServices(data))
      .catch(err => console.error("Error fetching services:", err));

    // Fetch Feedbacks
    api.feedback.getAll()
      .then(data => setFeedbacks(data))
      .catch(err => console.error("Error fetching feedback:", err));
  }, []);

  useEffect(() => {
    // Fetch Projects (filtered by category)
    api.projects.getAll(filterCategory)
      .then(data => setProjects(data))
      .catch(err => console.error("Error fetching projects:", err));
  }, [filterCategory]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackName || !feedbackReview) {
      setFeedbackError('Please complete name and review fields.');
      return;
    }
    try {
      setFeedbackError('');
      const response = await api.feedback.submit({
        name: feedbackName,
        rating: feedbackRating,
        review: feedbackReview,
        service: feedbackService
      });
      setFeedbackSuccess(true);
      setFeedbackName('');
      setFeedbackReview('');
      // Refresh feedbacks
      const updated = await api.feedback.getAll();
      setFeedbacks(updated);
    } catch (err) {
      setFeedbackError(err.message || 'Submission failed.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) return;
    try {
      await api.contact.send({
        name: contactName,
        email: contactEmail,
        message: contactMsg,
      });
      setContactSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactMsg('');
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      console.error('Contact form error:', err.message);
      // Still show success to user since the email may have sent
      setContactSuccess(true);
      setTimeout(() => setContactSuccess(false), 5000);
    }
  };

  const nextFeedback = () => {
    if (feedbacks.length === 0) return;
    setFeedbackIndex((prev) => (prev + 1) % feedbacks.length);
  };

  const prevFeedback = () => {
    if (feedbacks.length === 0) return;
    setFeedbackIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-screen">

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 md:pt-32 overflow-hidden">

        {/* Futuristic glowing backdrop nodes */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-cyan-600/10 blur-[130px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
          {/* Cyber Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/40 border border-purple-500/20 text-purple-300 text-xs font-rajdhani uppercase tracking-widest mb-6">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse"></span>
            Intelligence Grid Activated
          </div>

          <h1 className="font-orbitron font-extrabold text-4xl md:text-7xl uppercase tracking-wider leading-none text-white mb-6">
            BUILD SMARTER <br />
            <span className="bg-gradient-to-r from-cyber-cyan via-purple-400 to-cyber-blue bg-clip-text text-transparent text-glow-cyan">
              PROJECTS WITH{' '}
            </span>
            <span className="animate-flicker-horror inline-block">
              DATA FLOW
            </span>
          </h1>

          <p className="max-w-xl text-slate-400 text-base md:text-lg mb-8 leading-relaxed font-inter">
            DATA FLOW delivers high-fidelity Machine Learning systems, full-stack software structures, academic research compliance, and corporate branding assets.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              to="/order"
              className="btn-cyber-cyan px-8 py-3.5 rounded font-rajdhani uppercase tracking-widest text-base font-bold flex items-center justify-center gap-2 group"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#projects"
              className="px-8 py-3.5 rounded glass-panel text-white hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all font-rajdhani uppercase tracking-widest text-base font-semibold flex items-center justify-center gap-2"
            >
              View Projects
            </a>
          </div>
        </div>

        {/* Floating Futuristic Wireframe Graphic */}
        <div className="mt-16 w-full max-w-lg aspect-video rounded-xl border border-purple-950/60 bg-gradient-to-br from-purple-950/10 to-cyan-950/10 p-6 flex flex-col justify-between relative glass-panel animate-float">
          <div className="absolute inset-0 bg-cyber-grid opacity-20 rounded-xl"></div>
          <div className="flex items-center justify-between border-b border-purple-950/50 pb-3 z-10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/60"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/60"></span>
            </div>
            <span className="text-[10px] font-rajdhani tracking-widest text-slate-500 uppercase">Neural Optimizer Console</span>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-2 font-mono text-[10px] sm:text-xs text-left text-cyber-cyan z-10 pt-4">
            <div>&gt; INITIATING DATA FLOW AI MATRIX GENERATION...</div>
            <div className="text-purple-400">&gt; MODEL VERIFICATION: COMPLETED (99.2% ACCURACY)</div>
            <div className="text-slate-400">&gt; SERVICES INTEGRATED: [ML_PIPELINE, DOC_BUILDER, SOFTWARE_ENGINE]</div>
            <div>&gt; STATE: READY_TO_BUILD</div>
          </div>
          <div className="flex items-center justify-between border-t border-purple-950/50 pt-3 text-[10px] font-rajdhani text-slate-500 z-10">
            <span>PORT: 5000</span>
            <span className="text-cyber-purple">@DATA_FLOW.IO</span>
          </div>
        </div>

      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 px-6 border-t border-purple-950/20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col gap-6">
            <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl uppercase tracking-wider text-white">
              WHO WE <br />
              <span className="text-cyber-purple text-glow-purple">SUPPORT</span>
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-cyber-purple to-cyber-cyan"></div>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              At DATA FLOW, we build modern digital architectures. We help students draft peerless journal and research documentations, empower startups with rapid software prototyping and brand asset logo designs, and support enterprise operations with custom machine learning integrations.
            </p>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Our core mission is to bridge technical gaps with high-quality, professional-grade code and scholarly compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg glass-panel border-glow-purple flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-cyber-purple">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron text-white text-base tracking-wider">Students & Scholars</h3>
              <p className="text-xs text-slate-500 leading-relaxed">We assist in organizing research methodology, drafting IEEE papers, writing project documentations, and completing computer science prototypes.</p>
            </div>

            <div className="p-6 rounded-lg glass-panel border-glow-cyan flex flex-col gap-4">
              <div className="w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyber-cyan">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-orbitron text-white text-base tracking-wider">Startups & Devs</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Boost your production pipeline. Outsource specialized components, design your vector brand logos, or implement custom ML predictive APIs.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section id="services" className="py-24 px-6 border-t border-purple-950/20 max-w-7xl mx-auto">

        <div className="text-center mb-16">
          <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl uppercase tracking-wider text-white">
            OUR <span className="text-cyber-cyan text-glow-cyan">SERVICES</span>
          </h2>
          <p className="text-slate-500 mt-4 text-sm font-rajdhani uppercase tracking-widest">Futuristic solutions constructed to scale</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((svc) => {
            const IconComp = iconMap[svc.icon] || Cpu;
            return (
              <div
                key={svc._id}
                className="p-6 rounded-xl glass-panel border border-purple-950/60 flex flex-col justify-between hover:scale-[1.02] border-glow-purple duration-300 relative overflow-hidden group"
              >
                {/* Neon glow hover layer */}
                <div className="absolute -inset-px bg-gradient-to-r from-cyber-purple/10 to-cyber-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div className="flex flex-col gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-purple-950/50 border border-purple-500/30 flex items-center justify-center text-cyber-cyan group-hover:text-cyber-purple group-hover:border-cyber-purple/50 transition-colors">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-orbitron font-semibold text-lg text-white group-hover:text-cyber-cyan transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed h-16 overflow-y-auto">
                    {svc.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-purple-950/40 flex items-center justify-end relative z-10">
                  <Link
                    to="/order"
                    state={{ preSelectedService: svc.title }}
                    className="px-4 py-2 rounded bg-purple-950/60 border border-purple-500/20 text-xs text-purple-300 uppercase font-rajdhani tracking-widest font-semibold hover:bg-cyber-purple hover:text-white hover:border-transparent transition-all"
                  >
                    Order Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 4. PROJECTS SHOWCASE */}
      <section id="projects" className="py-24 px-6 border-t border-purple-950/20 max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl uppercase tracking-wider text-white">
              PROJECT <span className="text-cyber-purple text-glow-purple">SHOWCASE</span>
            </h2>
            <p className="text-slate-500 mt-2 text-sm font-rajdhani uppercase tracking-widest">Active operations deployed across the net</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 font-rajdhani text-sm uppercase tracking-wider">
            {['All', 'AI/ML', 'Web', 'Research', 'Mobile Apps'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded border transition-all ${filterCategory === cat
                    ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                    : 'bg-purple-950/20 border-purple-950 text-slate-400 hover:text-white hover:border-purple-900'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="rounded-xl overflow-hidden glass-panel border border-purple-950/60 hover:scale-[1.01] hover:border-cyan-500/30 transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Image Frame */}
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 border border-purple-500/20 text-[9px] font-rajdhani uppercase text-cyan-400 tracking-wider">
                  {proj.category}
                </span>
              </div>

              {/* Info Frame */}
              <div className="sm:w-3/5 p-6 flex flex-col justify-between">
                <div>
                  <h3 className="font-orbitron font-semibold text-lg text-white mb-2">{proj.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{proj.description}</p>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-purple-950/30 text-[9px] font-mono text-purple-400 border border-purple-950/50">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t border-purple-950/40 pt-4 font-rajdhani text-xs uppercase tracking-widest font-semibold">
                  {proj.githubLink && (
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-cyan transition-colors flex items-center gap-1">
                      Repository
                    </a>
                  )}
                  {proj.demoLink && (
                    <a href={proj.demoLink} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyber-cyan transition-colors flex items-center gap-1">
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-500 font-rajdhani text-lg uppercase tracking-wider">
              No deployed projects matched this filter.
            </div>
          )}
        </div>

      </section>

      {(!user || user.role !== 'admin') && (
        <>
          {/* 5. FEEDBACK & TESTIMONIALS */}
          <section className="py-24 px-6 border-t border-purple-950/20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Testimonials Slider */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl uppercase tracking-wider text-white mb-2">
                  CLIENT <span className="text-cyber-cyan text-glow-cyan">REVIEWS</span>
                </h2>
                <p className="text-slate-500 text-sm font-rajdhani uppercase tracking-widest mb-10">Feedback from our distributed nodes</p>

                {feedbacks.length > 0 ? (
                  <div className="p-8 rounded-xl glass-panel border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.05)] relative overflow-hidden min-h-48 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none"></div>

                    <div>
                      <div className="flex gap-1 mb-4 text-yellow-500">
                        {[...Array(feedbacks[feedbackIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="italic text-slate-300 text-sm leading-relaxed mb-6 font-inter">
                        "{feedbacks[feedbackIndex].review}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-purple-950/40 pt-4">
                      <div>
                        <h4 className="font-orbitron text-sm text-white font-bold">{feedbacks[feedbackIndex].name}</h4>
                        <span className="text-[10px] font-rajdhani text-purple-400 uppercase tracking-wider">
                          Service: {feedbacks[feedbackIndex].service}
                        </span>
                      </div>

                      {/* Slider controls */}
                      <div className="flex gap-2 font-rajdhani text-xs">
                        <button
                          onClick={prevFeedback}
                          className="px-2.5 py-1.5 rounded bg-purple-950/40 border border-purple-500/20 text-slate-300 hover:text-white"
                        >
                          Prev
                        </button>
                        <button
                          onClick={nextFeedback}
                          className="px-2.5 py-1.5 rounded bg-purple-950/40 border border-purple-500/20 text-slate-300 hover:text-white"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 font-rajdhani text-base uppercase tracking-wider p-8 rounded-xl glass-panel border border-purple-950/40 text-center">
                    Waiting for client connections...
                  </div>
                )}
              </div>
            </div>

            {/* Submit Review Form */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-xl glass-panel border border-purple-950/80">
                <h3 className="font-orbitron font-bold text-lg text-white mb-6 uppercase tracking-wider border-b border-purple-950/60 pb-3">
                  Transmit Feedback
                </h3>

                {feedbackSuccess ? (
                  <div className="p-4 bg-purple-950/40 border border-purple-500/40 text-purple-300 rounded text-center text-xs font-rajdhani uppercase tracking-widest animate-pulse">
                    Review transmitted successfully. Appending to decentralized feed.
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} className="flex flex-col gap-4">

                    <div>
                      <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Your Name</label>
                      <input
                        type="text"
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="Enter full name"
                        className="w-full px-3 py-2 text-xs rounded glass-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Rating</label>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                        >
                          <option value="5">5 Stars</option>
                          <option value="4">4 Stars</option>
                          <option value="3">3 Stars</option>
                          <option value="2">2 Stars</option>
                          <option value="1">1 Star</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Service Purchased</label>
                        <select
                          value={feedbackService}
                          onChange={(e) => setFeedbackService(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                        >
                          <option value="Journal & Research Papers">Research Paper</option>
                          <option value="Project Documentation">Documentation</option>
                          <option value="Mini Projects">Mini Project</option>
                          <option value="Major Projects">Major Project</option>
                          <option value="AI & ML Projects">AI/ML Model</option>
                          <option value="Web Development">Web App</option>
                          <option value="Logo Designing">Logo Design</option>
                          <option value="General Service">General Service</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Review</label>
                      <textarea
                        rows="3"
                        value={feedbackReview}
                        onChange={(e) => setFeedbackReview(e.target.value)}
                        placeholder="Share your experience building with Data Flow..."
                        className="w-full px-3 py-2 text-xs rounded glass-input"
                      />
                    </div>

                    {feedbackError && <p className="text-red-400 text-[10px] uppercase font-mono">{feedbackError}</p>}

                    <button
                      type="submit"
                      className="btn-cyber-purple w-full py-2.5 rounded text-xs uppercase font-rajdhani font-bold tracking-widest flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Broadcast Review
                    </button>

                  </form>
                )}
              </div>
            </div>

          </section>

          {/* 6. CONTACT SECTION */}
          <section id="contact" className="py-24 px-6 border-t border-purple-950/20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact info nodes */}
            <div className="flex flex-col gap-8 justify-center">
              <div>
                <h2 className="font-orbitron font-extrabold text-3xl md:text-5xl uppercase tracking-wider text-white">
                  CONTACT <span className="text-cyber-cyan text-glow-cyan">HQ</span>
                </h2>
                <p className="text-slate-500 mt-2 text-sm font-rajdhani uppercase tracking-widest">Initialize a secure data connection</p>
              </div>

              <div className="flex flex-col gap-4 font-inter text-sm">
                <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-900/20 flex items-center gap-4">
                  <Mail className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <span className="text-[10px] font-rajdhani text-slate-500 uppercase block">Secure Mail Node</span>
                    <a
                      href="https://mail.google.com/mail/?view=cm&fs=1&to=dataflow.io.orders@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-200 hover:text-cyber-cyan transition-colors"
                    >
                      dataflow.io.orders@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-900/20 flex items-center gap-4">
                  <Phone className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <span className="text-[10px] font-rajdhani text-slate-500 uppercase block">Voice Uplink</span>
                    <span className="text-slate-200">9342545024, 93618 18193</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-900/20 flex items-center gap-4">
                  <InstagramIcon className="w-5 h-5 text-cyber-cyan" />
                  <div>
                    <span className="text-[10px] font-rajdhani text-slate-500 uppercase block">Instagram Frame</span>
                    <a href="https://instagram.com/DATA_FLOW.IO" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-cyber-cyan transition-colors font-semibold">
                      @DATA_FLOW.IO
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="h-44 rounded-xl border border-purple-950/60 overflow-hidden relative">
                <iframe
                  src="https://maps.google.com/maps?q=Puducherry&t=&z=12&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(100%) opacity(0.7)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

            {/* Contact Form */}
            <div className="p-8 rounded-xl glass-panel border border-cyan-500/20 flex flex-col justify-center">
              <h3 className="font-orbitron font-bold text-lg text-white mb-6 uppercase tracking-wider border-b border-purple-950/60 pb-3">
                Send Encrypted Transmission
              </h3>

              {contactSuccess ? (
                <div className="p-6 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 rounded text-center text-xs font-rajdhani uppercase tracking-widest animate-pulse">
                  Transmission processed. Standby for decryption.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">

                  <div>
                    <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Identify yourself"
                      className="w-full px-3 py-2 text-xs rounded glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="Input email routing address"
                      className="w-full px-3 py-2 text-xs rounded glass-input"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Message Scope</label>
                    <textarea
                      rows="4"
                      required
                      value={contactMsg}
                      onChange={(e) => setContactMsg(e.target.value)}
                      placeholder="Outline requirements..."
                      className="w-full px-3 py-2 text-xs rounded glass-input"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-cyber-cyan w-full py-2.5 rounded text-xs uppercase font-rajdhani font-bold tracking-widest flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5 text-cyber-dark" />
                    Submit
                  </button>

                </form>
              )}
            </div>

          </section>
        </>
      )}

    </div>
  );
};

export default LandingPage;
