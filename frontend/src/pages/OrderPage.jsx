import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ClipboardList, Upload, Send, CheckCircle } from 'lucide-react';

const OrderPage = ({ token, user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Inputs
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [service, setService] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('N/A');
  const [selectedFile, setSelectedFile] = useState(null);

  // Status
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submittedOrder, setSubmittedOrder] = useState(null);

  useEffect(() => {
    // Autofill name and email if logged in
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    // Read preSelectedService from location state
    if (location.state?.preSelectedService) {
      setService(location.state.preSelectedService);
    }
  }, [location]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !alternatePhone || !service || !description || !deadline || !budget) {
      setError('Please fill in all required inputs.');
      return;
    }

    if (phone.trim() === alternatePhone.trim()) {
      setError('Primary and Alternate mobile numbers must be different.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Create FormData object to support file upload
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('alternatePhone', alternatePhone);
      formData.append('service', service);
      formData.append('description', description);
      formData.append('deadline', deadline);
      formData.append('budget', budget);
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      const response = await api.orders.create(formData, token);
      setSuccess(true);
      setSubmittedOrder(response);
    } catch (err) {
      setError(err.message || 'Submission failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  // If user is not authenticated, render login prompt wall
  if (!user || !token) {
    return (
      <div className="bg-hexagons bg-cyber-grid min-h-[80vh] flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md p-8 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_35px_rgba(168,85,247,0.15)] text-center flex flex-col items-center gap-6">
          <div className="p-3.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-cyber-cyan animate-pulse">
            <ClipboardList className="w-8 h-8" />
          </div>
          
          <h2 className="font-orbitron font-extrabold text-xl uppercase tracking-wider text-white">
            AUTHENTICATION REQUIRED
          </h2>
          
          <p className="text-xs text-slate-400 leading-relaxed font-inter">
            To place custom project orders and track requirements timelines, you must be logged into the DATA FLOW security grid.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full mt-2">
            <button
              onClick={() => navigate('/login', { state: { from: '/order' } })}
              className="btn-cyber-cyan w-full py-2.5 rounded font-rajdhani text-xs uppercase tracking-widest font-bold"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup', { state: { from: '/order' } })}
              className="px-4 py-2.5 rounded border border-purple-500/30 text-purple-300 hover:text-white hover:border-cyber-cyan/50 w-full text-xs uppercase font-rajdhani tracking-widest font-semibold transition-all"
            >
              Register Node
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-[90vh] py-16 px-6">
      <div className="max-w-3xl mx-auto">
        
        {success ? (
          <div className="p-8 rounded-xl glass-panel border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col items-center text-center gap-6">
            <div className="p-4 rounded-full bg-cyan-950/60 border border-cyan-500/50 text-cyber-cyan animate-pulse">
              <CheckCircle className="w-12 h-12" />
            </div>
            
            <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white">
              ORDER TRANSMITTED
            </h2>
            
            <div className="w-full max-w-md p-6 rounded bg-black/40 border border-purple-950/80 font-mono text-xs text-left text-slate-300 flex flex-col gap-3">
              <div><span className="text-cyan-400">ORDER_ID:</span> {submittedOrder?._id}</div>
              <div><span className="text-cyan-400">SERVICE:</span> {submittedOrder?.service}</div>
              <div><span className="text-cyan-400">STATUS:</span> <span className="px-2 py-0.5 rounded bg-yellow-950 text-yellow-400 border border-yellow-800 text-[10px] uppercase font-bold">{submittedOrder?.status}</span></div>
              <div className="text-[10px] text-purple-400 border-t border-purple-950/50 pt-3">
                Use your Order ID to track project updates. Secure email confirmation dispatched.
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/status')}
                className="btn-cyber-cyan px-6 py-2.5 rounded font-rajdhani text-sm uppercase tracking-widest font-semibold"
              >
                Track Status
              </button>
              <button 
                onClick={() => {
                  setSuccess(false);
                  setDescription('');
                  setDeadline('');
                  setSelectedFile(null);
                }}
                className="px-6 py-2.5 rounded glass-panel text-white hover:text-cyber-cyan text-sm uppercase font-rajdhani tracking-widest font-semibold"
              >
                New Order
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_35px_rgba(168,85,247,0.15)]">
            
            <div className="flex items-center gap-3 border-b border-purple-950/60 pb-4 mb-8">
              <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/40 text-cyber-cyan">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-orbitron font-extrabold text-xl uppercase text-white tracking-wider">PROJECT ORDER PORTAL</h2>
                <span className="text-[10px] font-rajdhani text-slate-500 uppercase tracking-widest">Connect requirements nodes</span>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Contact info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 text-xs rounded glass-input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    disabled
                    value={email}
                    className="w-full px-3 py-2 text-xs rounded glass-input opacity-70 cursor-not-allowed bg-purple-950/10"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Phone Uplink 1 *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Primary Mobile Number"
                    className="w-full px-3 py-2 text-xs rounded glass-input"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Phone Uplink 2 *</label>
                  <input
                    type="tel"
                    required
                    value={alternatePhone}
                    onChange={(e) => setAlternatePhone(e.target.value)}
                    placeholder="Alternate Mobile Number"
                    className="w-full px-3 py-2 text-xs rounded glass-input"
                  />
                </div>
              </div>

              {/* Service & Deadline */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Choose Service *</label>
                  <select
                    required
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                  >
                    <option value="">Select service Node</option>
                    <option value="Journal & Research Papers">Journal & Research Papers</option>
                    <option value="Project Documentation">Project Documentation</option>
                    <option value="Mini Projects">Mini Projects</option>
                    <option value="Major Projects">Major Projects</option>
                    <option value="AI & ML Projects">AI & ML Projects</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Logo Designing">Logo Designing</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Target Deadline *</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded glass-input bg-cyber-dark text-slate-200"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Project Spec / Requirements *</label>
                <textarea
                  rows="5"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline complete project details, parameters, libraries to use, or research topic guidelines..."
                  className="w-full px-3 py-2 text-xs rounded glass-input"
                />
              </div>

              {/* File upload */}
              <div>
                <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Reference Files (Optional - SRS, PDFs, Assets)</label>
                <div className="relative border border-dashed border-purple-500/30 rounded-lg p-6 flex flex-col items-center justify-center bg-black/10 hover:bg-black/20 hover:border-cyber-cyan/50 transition-all cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-cyber-cyan mb-2" />
                  <span className="text-xs text-slate-300 font-semibold mb-1">
                    {selectedFile ? selectedFile.name : 'Select files to upload'}
                  </span>
                  <span className="text-[10px] text-slate-500">Max size: 10MB</span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-purple py-3 mt-4 rounded font-rajdhani uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
              >
                {loading ? 'Transmitting Data Nodes...' : 'Submit Project Parameters'}
                <Send className="w-4 h-4" />
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default OrderPage;
