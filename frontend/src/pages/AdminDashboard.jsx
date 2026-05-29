import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  LayoutDashboard, ClipboardList, ShieldAlert, Cpu, 
  Trash2, Plus, RefreshCw, Star, Download, Upload, Sparkles, Edit3, Settings, X, Image
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const AdminDashboard = ({ token, user }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Loading / Error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Project Form State (Dual Add / Edit Mode)
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTech, setNewTech] = useState('');
  const [newCategory, setNewCategory] = useState('AI/ML');
  const [newGithub, setNewGithub] = useState('');
  const [newDemo, setNewDemo] = useState('');
  const [newImage, setNewImage] = useState('');
  const [projectSuccess, setProjectSuccess] = useState('');

  // Service Form State (Dual Add / Edit Mode)
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [servicePrice, setServicePrice] = useState('N/A');
  const [serviceIcon, setServiceIcon] = useState('Cpu');
  const [serviceSuccess, setServiceSuccess] = useState('');

  useEffect(() => {
    if (token && user && user.role === 'admin') {
      fetchDashboardData();
    }
  }, [token, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const ordersData = await api.orders.getAll(token);
      setOrders(ordersData);

      const projectsData = await api.projects.getAll();
      setProjects(projectsData);

      const servicesData = await api.services.getAll();
      setServices(servicesData);

      const feedbacksData = await api.feedback.getAll();
      setFeedbacks(feedbacksData);
    } catch (err) {
      setError(err.message || 'Failed to sync data node schemas.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus, token);
      const updated = await api.orders.getAll(token);
      setOrders(updated);
    } catch (err) {
      alert(err.message || 'Status translation error');
    }
  };

  const handleDeliveryUpload = async (orderId, file) => {
    if (!file) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      
      await api.orders.updateStatus(orderId, formData, token);
      const updated = await api.orders.getAll(token);
      setOrders(updated);
      alert('Project delivery file uploaded and dispatched successfully!');
    } catch (err) {
      alert(err.message || 'Delivery upload failed.');
    } finally {
      setLoading(false);
    }
  };

  // --- Project CRUD ---
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newTech) {
      alert('Please fill in Title, Description, and Tech Stack.');
      return;
    }

    try {
      const projData = {
        title: newTitle,
        description: newDesc,
        techStack: newTech,
        category: newCategory,
        githubLink: newGithub,
        demoLink: newDemo,
        image: newImage || undefined,
      };

      if (editingProjectId) {
        // Edit Mode
        await api.projects.update(editingProjectId, projData, token);
        setProjectSuccess('Project Node Updated successfully.');
      } else {
        // Add Mode
        await api.projects.create(projData, token);
        setProjectSuccess('New Project Node Published.');
      }
      
      resetProjectForm();
      const updated = await api.projects.getAll();
      setProjects(updated);
      setTimeout(() => setProjectSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Project operations error');
    }
  };

  const handleEditProjectClick = (proj) => {
    setEditingProjectId(proj._id);
    setNewTitle(proj.title);
    setNewDesc(proj.description);
    setNewTech(Array.isArray(proj.techStack) ? proj.techStack.join(', ') : proj.techStack);
    setNewCategory(proj.category);
    setNewGithub(proj.githubLink || '');
    setNewDemo(proj.demoLink || '');
    setNewImage(proj.image || '');
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setNewTitle('');
    setNewDesc('');
    setNewTech('');
    setNewGithub('');
    setNewDemo('');
    setNewImage('');
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Confirm deletion of this project node?')) return;
    try {
      await api.projects.delete(id, token);
      const updated = await api.projects.getAll();
      setProjects(updated);
    } catch (err) {
      alert(err.message || 'Delete operation error');
    }
  };

  // --- Service CRUD ---
  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!serviceTitle || !serviceDesc || !servicePrice) {
      alert('Please fill in Title, Description, and Price.');
      return;
    }

    try {
      const srvData = {
        title: serviceTitle,
        description: serviceDesc,
        price: servicePrice,
        icon: serviceIcon,
      };

      if (editingServiceId) {
        await api.services.update(editingServiceId, srvData, token);
        setServiceSuccess('Service Node Updated successfully.');
      } else {
        await api.services.create(srvData, token);
        setServiceSuccess('New Service Node Registered.');
      }

      resetServiceForm();
      const updated = await api.services.getAll();
      setServices(updated);
      setTimeout(() => setServiceSuccess(''), 4000);
    } catch (err) {
      alert(err.message || 'Service operations error');
    }
  };

  const handleEditServiceClick = (srv) => {
    setEditingServiceId(srv._id);
    setServiceTitle(srv.title);
    setServiceDesc(srv.description);
    setServicePrice(srv.price);
    setServiceIcon(srv.icon || 'Cpu');
  };

  const resetServiceForm = () => {
    setEditingServiceId(null);
    setServiceTitle('');
    setServiceDesc('');
    setServicePrice('N/A');
    setServiceIcon('Cpu');
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Confirm deletion of this service node?')) return;
    try {
      await api.services.delete(id, token);
      const updated = await api.services.getAll();
      setServices(updated);
    } catch (err) {
      alert(err.message || 'Delete operation error');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="bg-hexagons bg-cyber-grid min-h-[80vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-8 rounded-xl glass-panel border border-red-500/30 text-center flex flex-col items-center gap-4">
          <ShieldAlert className="w-12 h-12 text-red-400 animate-pulse" />
          <h2 className="font-orbitron font-extrabold text-xl text-white uppercase tracking-wider">SECURE GRID REJECTION</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-inter">
            Access credentials not recognized. Admin level authentication required to interact with this database node.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-screen pt-8 pb-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col gap-5">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 glass-panel border border-purple-500/20 p-6 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-cyber-cyan flex items-center justify-center">
              <img src={logoImg} className="w-8 h-8 object-contain" alt="DATA FLOW" />
            </div>
            <div>
              <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white">DATA FLOW CONTROL GRID</h2>
              <span className="text-[10px] font-rajdhani text-slate-500 uppercase tracking-widest">Global operations panel</span>
            </div>
          </div>

          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded bg-purple-950/40 border border-purple-500/30 hover:border-cyber-cyan/50 text-slate-300 hover:text-white transition-all text-xs font-rajdhani font-semibold uppercase tracking-wider flex items-center gap-1.5 self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Schema
          </button>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-purple-950/40 font-rajdhani uppercase text-sm tracking-wider">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'orders' ? 'border-b-2 border-cyber-cyan text-cyber-cyan font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Orders ({orders.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'projects' ? 'border-b-2 border-cyber-cyan text-cyber-cyan font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Showcase ({projects.length})
          </button>

          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'services' ? 'border-b-2 border-cyber-cyan text-cyber-cyan font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Services ({services.length})
          </button>

          <button 
            onClick={() => setActiveTab('feedbacks')}
            className={`px-6 py-3 transition-all ${
              activeTab === 'feedbacks' ? 'border-b-2 border-cyber-cyan text-cyber-cyan font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Reviews ({feedbacks.length})
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono">
            {error}
          </div>
        )}

        {/* LOADING STATE */}
        {loading ? (
          <div className="text-center py-20 font-rajdhani text-lg uppercase tracking-widest text-slate-500 animate-pulse">
            Connecting node matrices...
          </div>
        ) : (
          <div>
            {/* TAB 1: ORDERS LIST */}
            {activeTab === 'orders' && (
              <div className="glass-panel border border-purple-900/40 rounded-2xl shadow-[0_0_40px_rgba(168,85,247,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-inter border-collapse">
                    <thead>
                      <tr className="bg-purple-950/30 border-b border-purple-500/20 text-[10px] font-orbitron uppercase tracking-widest text-cyber-cyan shadow-sm">
                        <th className="p-3 font-semibold">Customer Details</th>
                        <th className="p-3 font-semibold">Service Required</th>
                        <th className="p-3 font-semibold">Budget / Deadline</th>
                        <th className="p-3 font-semibold">Project Parameters</th>
                        <th className="p-3 font-semibold w-[200px]">Status Controller</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/20">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-purple-950/20 transition-all border-b border-purple-950/30 last:border-0 group">
                          <td className="p-3 align-top">
                            <div className="font-bold text-white uppercase text-xs mb-0.5 group-hover:text-cyber-cyan transition-colors">{order.name}</div>
                            <div className="text-[10px] text-slate-300 mt-0.5">{order.email}</div>
                            <div className="text-[10px] text-slate-300 flex flex-col gap-0.5">
                              <span>P1: {order.phone}</span>
                              {order.alternatePhone && <span>P2: {order.alternatePhone}</span>}
                            </div>
                            <div className="flex flex-col gap-1.5 items-start mt-1.5">
                              <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold inline-block border ${
                                order.isPaid ? 'bg-green-950/80 text-green-400 border-green-800' : 'bg-yellow-950/80 text-yellow-400 border-yellow-800'
                              }`}>
                                {order.isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                              {order.paymentScreenshotUrl && (
                                <a 
                                  href={`http://localhost:5000${order.paymentScreenshotUrl}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[9px] text-cyber-cyan hover:underline font-mono"
                                  title="View Uploaded Payment Receipt Screenshot"
                                >
                                  <Image className="w-2.5 h-2.5" />
                                  View Receipt
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="p-3 align-top">
                            <span className="px-2 py-1 rounded bg-purple-950/80 border border-purple-500/50 text-purple-200 font-bold uppercase text-[9px] tracking-widest drop-shadow-[0_0_5px_rgba(168,85,247,0.6)]">
                              {order.service}
                            </span>
                          </td>
                          <td className="p-3 align-top font-mono text-[10px] sm:text-[11px]">
                            <div className="text-slate-400 font-semibold uppercase tracking-widest text-[9px] mb-0.5">Target Deadline:</div>
                            <div className="text-cyan-400 font-bold mt-0.5">{new Date(order.deadline).toLocaleDateString()}</div>
                          </td>
                          <td className="p-3 align-top max-w-xs">
                            <p className="text-[11px] text-slate-300 leading-snug mb-2 line-clamp-3">{order.description}</p>
                            {order.fileUrl && (
                              <a 
                                href={`http://localhost:5000${order.fileUrl}`} 
                                download
                                className="inline-flex items-center gap-1 text-[10px] text-cyber-cyan hover:underline font-mono"
                              >
                                <Download className="w-3 h-3" />
                                {order.fileName || 'Download Attachment'}
                              </a>
                            )}
                          </td>
                          <td className="p-3 align-top flex flex-col gap-2">
                            
                            {/* GPay Pricing Section */}
                            <div className="p-2 rounded bg-black/40 border border-purple-500/20">
                              <span className="text-[8px] font-mono text-purple-400 block uppercase tracking-wider mb-1">Project Pricing Matrix</span>
                              {(!order.fixedAmount || order.fixedAmount === 'N/A') ? (
                                <div className="flex gap-1 items-center mt-1">
                                  <input 
                                    type="text" 
                                    placeholder="Set Price (e.g. $150)" 
                                    className="px-1.5 py-1 rounded bg-black/60 border border-purple-500/30 text-[9px] text-white focus:outline-none focus:border-cyber-cyan w-full font-mono"
                                    id={`amount-input-${order._id}`}
                                  />
                                  <button 
                                    onClick={async () => {
                                      const val = document.getElementById(`amount-input-${order._id}`).value;
                                      if (!val) return alert('Enter amount first');
                                      try {
                                        await api.orders.fixAmount(order._id, val, token);
                                        fetchDashboardData();
                                      } catch (err) {
                                        alert(err.message);
                                      }
                                    }}
                                    className="px-2 py-1 rounded bg-purple-700 hover:bg-purple-600 text-white text-[8px] font-rajdhani uppercase font-bold tracking-wider shrink-0 transition-colors"
                                  >
                                    Fix Cost
                                  </button>
                                </div>
                              ) : (
                                <div className="text-[10px] font-mono leading-tight">
                                  <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Fixed Cost:</span>
                                    <span className="text-white font-bold">{order.fixedAmount}</span>
                                  </div>
                                  <div className="mt-1">
                                    {order.isAmountAccepted ? (
                                      <span className="text-[8px] px-1 py-0.5 rounded bg-green-950/80 text-green-400 border border-green-900 font-bold uppercase inline-block">
                                        Accepted by Client ✅
                                      </span>
                                    ) : (
                                      <span className="text-[8px] px-1 py-0.5 rounded bg-yellow-950/80 text-yellow-400 border border-yellow-900 font-bold uppercase inline-block animate-pulse">
                                        Awaiting Acceptance ⏳
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Status Dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`px-2 py-1.5 rounded font-mono text-[10px] uppercase font-bold border focus:outline-none w-full ${
                                order.status === 'Completed' ? 'bg-green-950/80 text-green-400 border-green-800' :
                                order.status === 'In Progress' ? 'bg-purple-950/80 text-purple-400 border-purple-800' :
                                order.status === 'Cancelled' ? 'bg-red-950/80 text-red-400 border-red-800' :
                                'bg-yellow-950/80 text-yellow-400 border-yellow-800'
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress" disabled={!order.isAmountAccepted}>
                                In Progress {!order.isAmountAccepted && '(Locked)'}
                              </option>
                              <option value="Completed" disabled={!order.isAmountAccepted || !order.paymentScreenshotUrl}>
                                Completed {!order.isAmountAccepted ? '(Price Locked)' : !order.paymentScreenshotUrl ? '(Awaiting GPay)' : ''}
                              </option>
                              <option value="Cancelled">Cancelled</option>
                            </select>

                            {/* Delivered Project Info */}
                            {order.deliveredFileUrl && (
                              <div className="p-1.5 rounded bg-green-950/20 border border-green-950/30 flex items-center justify-between gap-1.5">
                                <span className="text-[9px] font-mono text-green-400 truncate max-w-[80px]" title={order.deliveredFileName}>
                                  {order.deliveredFileName}
                                </span>
                                <a 
                                  href={`http://localhost:5000${order.deliveredFileUrl}`} 
                                  download={order.deliveredFileName}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-cyber-cyan hover:text-white"
                                  title="Download Delivered File"
                                >
                                  <Download className="w-3 h-3" />
                                </a>
                              </div>
                            )}

                            {/* Delivery Action Button */}
                            {order.paymentScreenshotUrl ? (
                              <div className="w-full">
                                <label className="cursor-pointer flex items-center justify-center gap-1 px-2 py-1.5 rounded bg-purple-950/40 hover:bg-purple-900 border border-purple-500/20 text-[9px] font-rajdhani text-purple-300 uppercase tracking-widest font-bold transition-all text-center w-full">
                                  <Upload className="w-2.5 h-2.5" />
                                  {order.deliveredFileUrl ? 'Replace Delivery' : 'Deliver Project'}
                                  <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={(e) => handleDeliveryUpload(order._id, e.target.files[0])} 
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="text-center p-2 rounded bg-yellow-950/20 border border-yellow-800/40 text-yellow-500 font-rajdhani text-[9px] uppercase font-bold tracking-widest leading-relaxed">
                                🔒 Awaiting GPay Receipt
                              </div>
                            )}

                            {/* Inline Payment Screenshot Receipt */}
                            {order.paymentScreenshotUrl && (
                              <a 
                                href={`http://localhost:5000${order.paymentScreenshotUrl}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 rounded bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/30 text-[9px] font-rajdhani text-cyan-300 uppercase tracking-widest font-bold transition-all text-center"
                                title="View full GPay Receipt"
                              >
                                <Image className="w-2.5 h-2.5" />
                                View GPay Receipt
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan="5" className="text-center py-12 text-slate-500 font-rajdhani text-sm uppercase tracking-wider">
                            No Client orders recorded.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PORTFOLIO SHOWCASE */}
            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Project Editor Form */}
                <div className="lg:col-span-4">
                  <div className="p-6 rounded-xl glass-panel border border-purple-950/80">
                    <h3 className="font-orbitron font-bold text-base text-white mb-6 uppercase tracking-wider border-b border-purple-950/50 pb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-cyber-cyan" />
                        {editingProjectId ? 'Edit Project Node' : 'Add Project Node'}
                      </span>
                      {editingProjectId && (
                        <button onClick={resetProjectForm} className="text-slate-400 hover:text-white" title="Cancel edit">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </h3>

                    {projectSuccess && (
                      <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-rajdhani uppercase tracking-widest text-center mb-4">
                        {projectSuccess}
                      </div>
                    )}

                    <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Title *</label>
                        <input
                          type="text"
                          required
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          placeholder="e.g. CyberSentinel AI"
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Tech Stack (comma separated) *</label>
                        <input
                          type="text"
                          required
                          value={newTech}
                          onChange={(e) => setNewTech(e.target.value)}
                          placeholder="e.g. Python, TensorFlow, React"
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Category *</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                          >
                            <option value="AI/ML">AI/ML</option>
                            <option value="Web">Web</option>
                            <option value="Research">Research</option>
                            <option value="Mobile Apps">Mobile Apps</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Image URL</label>
                          <input
                            type="url"
                            value={newImage}
                            onChange={(e) => setNewImage(e.target.value)}
                            placeholder="Optional Image URL"
                            className="w-full px-3 py-2 text-xs rounded glass-input"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Github Repository Link</label>
                        <input
                          type="url"
                          value={newGithub}
                          onChange={(e) => setNewGithub(e.target.value)}
                          placeholder="Repository link"
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Live Demo Link</label>
                        <input
                          type="url"
                          value={newDemo}
                          onChange={(e) => setNewDemo(e.target.value)}
                          placeholder="Demo Link"
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Description *</label>
                        <textarea
                          rows="3"
                          required
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="Summarize build purpose..."
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div className="flex gap-2">
                        {editingProjectId && (
                          <button
                            type="button"
                            onClick={resetProjectForm}
                            className="w-1/2 py-2.5 rounded text-xs uppercase font-rajdhani font-bold border border-slate-700 text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className={`btn-cyber-cyan ${editingProjectId ? 'w-1/2' : 'w-full'} py-2.5 rounded text-xs uppercase font-rajdhani font-bold tracking-widest`}
                        >
                          {editingProjectId ? 'Update Node' : 'Publish Project'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Showcase List */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {projects.map((proj) => (
                    <div key={proj._id} className="p-4 rounded glass-panel border border-purple-950/60 flex items-center justify-between gap-6 hover:border-purple-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <img 
                          src={proj.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=150&q=80'} 
                          alt="" 
                          className="w-12 h-12 rounded object-cover border border-purple-950"
                        />
                        <div>
                          <span className="text-[9px] font-rajdhani text-cyan-400 uppercase font-bold">{proj.category}</span>
                          <h4 className="font-orbitron text-sm font-bold text-white">{proj.title}</h4>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.techStack.map((tech, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-purple-950/30 text-[8px] font-mono text-purple-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProjectClick(proj)}
                          className="p-2 rounded bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/30 text-cyber-cyan transition-colors"
                          title="Edit project node"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj._id)}
                          className="p-2 rounded bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-red-400 transition-colors"
                          title="Delete project node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {projects.length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-rajdhani text-sm uppercase tracking-wider">
                      No active projects published.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: MANAGE SERVICES */}
            {activeTab === 'services' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Service Editor Form */}
                <div className="lg:col-span-4">
                  <div className="p-6 rounded-xl glass-panel border border-purple-950/80">
                    <h3 className="font-orbitron font-bold text-base text-white mb-6 uppercase tracking-wider border-b border-purple-950/50 pb-3 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Settings className="w-4 h-4 text-cyber-cyan" />
                        {editingServiceId ? 'Edit Service Node' : 'Add Service Node'}
                      </span>
                      {editingServiceId && (
                        <button onClick={resetServiceForm} className="text-slate-400 hover:text-white" title="Cancel edit">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </h3>

                    {serviceSuccess && (
                      <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-xs font-rajdhani uppercase tracking-widest text-center mb-4">
                        {serviceSuccess}
                      </div>
                    )}

                    <form onSubmit={handleServiceSubmit} className="flex flex-col gap-4">
                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Service Title *</label>
                        <input
                          type="text"
                          required
                          value={serviceTitle}
                          onChange={(e) => setServiceTitle(e.target.value)}
                          placeholder="e.g. AI & ML Solutions"
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>


                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Icon Identifier</label>
                        <select
                          value={serviceIcon}
                          onChange={(e) => setServiceIcon(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                        >
                          <option value="Cpu">Cpu (AI/Hardware)</option>
                          <option value="Globe">Globe (Web/Cloud)</option>
                          <option value="FileText">FileText (Research/Docs)</option>
                          <option value="BookOpen">BookOpen (Academic/Formatting)</option>
                          <option value="Terminal">Terminal (Scripting/Mini)</option>
                          <option value="Layers">Layers (Major/Full Stack)</option>
                          <option value="Palette">Palette (Logo/Design)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-rajdhani text-slate-400 uppercase block mb-1">Description *</label>
                        <textarea
                          rows="3"
                          required
                          value={serviceDesc}
                          onChange={(e) => setServiceDesc(e.target.value)}
                          placeholder="Outline service delivery specifications..."
                          className="w-full px-3 py-2 text-xs rounded glass-input"
                        />
                      </div>

                      <div className="flex gap-2">
                        {editingServiceId && (
                          <button
                            type="button"
                            onClick={resetServiceForm}
                            className="w-1/2 py-2.5 rounded text-xs uppercase font-rajdhani font-bold border border-slate-700 text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        )}
                        <button
                          type="submit"
                          className={`btn-cyber-purple ${editingServiceId ? 'w-1/2' : 'w-full'} py-2.5 rounded text-xs uppercase font-rajdhani font-bold tracking-widest`}
                        >
                          {editingServiceId ? 'Update Service' : 'Add Service'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Services List */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                  {services.map((srv) => (
                    <div key={srv._id} className="p-4 rounded glass-panel border border-purple-950/60 flex items-center justify-between gap-6 hover:border-purple-500/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded bg-purple-950 border border-purple-500/20 text-cyber-cyan font-bold font-mono">
                          {srv.icon || 'Cpu'}
                        </div>
                        <div>
                          <h4 className="font-orbitron text-sm font-bold text-white">{srv.title}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{srv.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditServiceClick(srv)}
                          className="p-2 rounded bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/30 text-cyber-cyan transition-colors"
                          title="Edit service node"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(srv._id)}
                          className="p-2 rounded bg-red-950/30 hover:bg-red-900/40 border border-red-900/30 text-red-400 transition-colors"
                          title="Delete service node"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && (
                    <div className="text-center py-12 text-slate-500 font-rajdhani text-sm uppercase tracking-wider">
                      No custom services registered.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: MANAGE FEEDBACKS */}
            {activeTab === 'feedbacks' && (
              <div className="flex flex-col gap-4">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="p-4 rounded glass-panel border border-purple-950/60 flex items-start justify-between gap-6 hover:border-purple-500/20 transition-all">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-orbitron text-sm font-bold text-white">{fb.name}</h4>
                        <span className="text-[10px] font-rajdhani text-cyan-400 uppercase font-bold border border-cyan-900/50 px-1.5 rounded">{fb.service}</span>
                      </div>
                      <div className="flex text-yellow-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < fb.rating ? 'fill-current' : 'text-slate-600'}`} />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300">"{fb.review}"</p>
                    </div>
                  </div>
                ))}
                {feedbacks.length === 0 && (
                  <div className="text-center py-12 text-slate-500 font-rajdhani text-sm uppercase tracking-wider">
                    No reviews received yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
