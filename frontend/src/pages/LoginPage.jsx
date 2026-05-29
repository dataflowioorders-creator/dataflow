import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { KeyRound, Mail, Cpu, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

const LoginPage = ({ handleLoginSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Login Form credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Unverified/OTP states
  const [isUnverified, setIsUnverified] = useState(false);
  const [otp, setOtp] = useState('');
  const [resendMessage, setResendMessage] = useState('');

  // Core UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Sign In submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      setLoading(true);
      setError('');
      const data = await api.auth.login(email, password);
      handleLoginSuccess(data);
      
      if (data.role === 'admin' || data.email === 'dataflow.io.orders@gmail.com') {
        navigate('/admin');
      } else {
        const origin = location.state?.from || '/';
        navigate(origin);
      }
    } catch (err) {
      if (err.isUnverified) {
        setIsUnverified(true);
        setError(err.message);
      } else {
        setError(err.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Code Verification
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;
    try {
      setLoading(true);
      setError('');
      const data = await api.auth.verifyOTP(email, otp);
      handleLoginSuccess(data);
      
      if (data.role === 'admin' || data.email === 'dataflow.io.orders@gmail.com') {
        navigate('/admin');
      } else {
        const origin = location.state?.from || '/';
        navigate(origin);
      }
    } catch (err) {
      setError(err.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      setLoading(true);
      setError('');
      setResendMessage('');
      const res = await api.auth.resendOTP(email);
      setResendMessage(res.message || 'New verification OTP sent to your inbox.');
      setTimeout(() => setResendMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to dispatch new OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-8 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_35px_rgba(168,85,247,0.15)] flex flex-col items-center">
        
        {/* Core Icon */}
        <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 mb-4 animate-pulse">
          {isUnverified ? (
            <ShieldCheck className="w-8 h-8 text-cyber-cyan" />
          ) : (
            <Cpu className="w-8 h-8 text-cyber-cyan" />
          )}
        </div>
        
        <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white mb-2 text-center">
          {isUnverified ? 'VERIFY SECURITY CODE' : 'AUTHORIZATION'}
        </h2>
        <p className="text-slate-500 text-xs font-rajdhani uppercase tracking-widest mb-8 text-center">
          {isUnverified ? `Verification code sent to ${email}` : 'Access user dashboard nodes'}
        </p>

        {error && (
          <div className="w-full p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono mb-6">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="w-full p-3 bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 rounded text-center text-xs font-rajdhani uppercase tracking-widest mb-6">
            {resendMessage}
          </div>
        )}

        {!isUnverified ? (
          // Standard Credentials login form
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-cyan w-full py-3 mt-4 rounded font-rajdhani uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? 'Validating Nodes...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          // Inline OTP Verification form
          <form onSubmit={handleVerifySubmit} className="w-full flex flex-col gap-5">
            <div>
              <label className="text-[10px] font-rajdhani text-slate-400 uppercase tracking-widest block mb-1">Enter 6-Digit OTP</label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  maxLength="6"
                  pattern="[0-9]{6}"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 123456"
                  className="w-full pl-10 pr-3 py-2.5 text-sm rounded glass-input text-center font-mono text-lg tracking-widest"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-cyber-cyan w-full py-3 mt-2 rounded font-rajdhani uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : 'Verify & Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={handleResendOTP}
              className="flex items-center justify-center gap-1.5 text-xs font-rajdhani uppercase tracking-widest text-slate-400 hover:text-white transition-colors py-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Resend Code
            </button>
          </form>
        )}

        <div className="mt-8 text-xs font-rajdhani uppercase tracking-widest text-slate-500">
          {isUnverified ? (
            <button onClick={() => setIsUnverified(false)} className="text-cyber-cyan hover:underline font-bold transition-all">
              ← Back to Login
            </button>
          ) : (
            <>
              Unregistered node?{' '}
              <Link to="/signup" className="text-cyber-cyan hover:underline font-bold transition-all ml-1">
                Register Account
              </Link>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
