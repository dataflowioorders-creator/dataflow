import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { KeyRound, Mail, Cpu, User, ArrowRight } from 'lucide-react';

const SignupPage = ({ handleLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    try {
      setLoading(true);
      setError('');
      const data = await api.auth.register(name, email, password);
      
      handleLoginSuccess(data);
      
      if (data.role === 'admin' || data.email === 'dataflow.io.orders@gmail.com') {
        navigate('/admin');
      } else {
        const origin = location.state?.from || '/';
        navigate(origin);
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try checking details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-8 rounded-xl glass-panel border border-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col items-center">
        
        <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 mb-4">
          <Cpu className="w-8 h-8 text-cyber-purple" />
        </div>
        
        <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white mb-2 text-center">
          CREATE PROFILE
        </h2>
        <p className="text-slate-500 text-xs font-rajdhani uppercase tracking-widest mb-8 text-center">
          Register user grid nodes
        </p>

        {error && (
          <div className="w-full p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-5">
          <div>
            <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Your Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Email Node Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="identity@domain.com"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded glass-input"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Access Cipher (Password)</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded glass-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-cyber-purple w-full py-3 mt-4 rounded font-rajdhani uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
          >
            {loading ? 'Creating Node...' : 'Sign Up'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 text-xs font-rajdhani uppercase tracking-widest text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-cyber-purple hover:underline font-bold transition-all ml-1">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
