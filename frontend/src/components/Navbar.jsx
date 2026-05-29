import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cpu, Menu, X, LogOut, LayoutDashboard, ClipboardList, Sun, Moon } from 'lucide-react';
import logoImg from '../assets/logo.png';

const Navbar = ({ user, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Default to dark theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.style.backgroundColor = '#05040a';
      document.body.style.color = '#e2e8f0';
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.style.backgroundColor = '#05040a';
      document.body.style.color = '#e2e8f0';
    }
  };

  const isActive = (path) => {
    return location.pathname === path ? 'text-cyber-cyan border-b-2 border-cyber-cyan font-semibold' : 'text-slate-300 hover:text-cyber-cyan transition-colors';
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-purple-950/40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMobileMenu}>
          <img 
            src={logoImg} 
            alt="DATA FLOW" 
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
          />
          <span className="font-orbitron font-bold text-xl tracking-wider bg-gradient-to-r from-white via-purple-300 to-cyber-cyan bg-clip-text text-transparent">
            DATA FLOW
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8 font-rajdhani text-lg uppercase tracking-wide">
          <Link to="/" className={isActive('/')}>Home</Link>
          <a href="#services" className="text-slate-300 hover:text-cyber-cyan transition-colors" onClick={() => {
            if (location.pathname !== '/') navigate('/');
          }}>Services</a>
          <a href="#projects" className="text-slate-300 hover:text-cyber-cyan transition-colors" onClick={() => {
            if (location.pathname !== '/') navigate('/');
          }}>Projects</a>
          {(!user || user.role !== 'admin') && (
            <>
              <div className="relative group">
                <button className={`flex items-center gap-1 transition-colors py-4 ${location.pathname.startsWith('/order') || location.pathname.startsWith('/status') ? 'text-cyber-cyan font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'text-slate-300 hover:text-cyber-cyan'}`}>
                  Orders
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full mt-[-10px] w-56 rounded-md shadow-lg bg-[#0a0816] border border-purple-500/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden backdrop-blur-md">
                  <div className="py-1 flex flex-col">
                    <Link to="/order" className={`px-4 py-3 text-sm font-rajdhani font-semibold uppercase tracking-wide transition-colors ${location.pathname === '/order' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-slate-300 hover:bg-purple-900/40 hover:text-white'}`}>
                      Place Order
                    </Link>
                    <Link to="/status" className={`px-4 py-3 text-sm font-rajdhani font-semibold uppercase tracking-wide transition-colors ${location.pathname === '/status' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-slate-300 hover:bg-purple-900/40 hover:text-white'}`}>
                      Track Order
                    </Link>
                    <Link to="/status" className={`px-4 py-3 text-sm font-rajdhani font-semibold uppercase tracking-wide transition-colors ${location.pathname === '/status' ? 'bg-cyber-cyan/20 text-cyber-cyan' : 'text-slate-300 hover:bg-purple-900/40 hover:text-white'}`}>
                      My Orders
                    </Link>
                  </div>
                </div>
              </div>
              <a href="#contact" className="text-slate-300 hover:text-cyber-cyan transition-colors" onClick={() => {
                if (location.pathname !== '/') navigate('/');
              }}>Contact</a>
            </>
          )}
        </div>

        {/* Action Controls */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-lg border border-purple-500/20 text-slate-300 hover:text-cyber-cyan hover:border-cyber-cyan/30 transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-rajdhani text-purple-300 border-r border-purple-900/50 pr-4">
                HELLO, <span className="font-bold text-white uppercase">{user.name.split(' ')[0]}</span>
              </span>
              
              {user.role === 'admin' && (
                <Link to="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all text-sm uppercase font-rajdhani font-semibold">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}

              <button 
                onClick={() => { handleLogout(); navigate('/'); }} 
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-red-950/30 border border-red-900/30 text-red-400 hover:bg-red-900/40 hover:text-white transition-all text-sm uppercase font-rajdhani font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white uppercase font-rajdhani font-semibold transition-all">
                Login
              </Link>
              <Link to="/signup" className="btn-cyber-cyan px-4 py-2 rounded text-sm uppercase font-rajdhani tracking-wider font-semibold">
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-lg border border-purple-500/20 text-slate-300"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg border border-purple-500/20 text-slate-300 hover:text-cyber-cyan transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-purple-950/40 flex flex-col gap-4 font-rajdhani text-lg uppercase tracking-wide">
          <Link to="/" className="text-slate-300 hover:text-cyber-cyan py-1" onClick={closeMobileMenu}>Home</Link>
          <a href="#services" className="text-slate-300 hover:text-cyber-cyan py-1" onClick={() => { closeMobileMenu(); if (location.pathname !== '/') navigate('/'); }}>Services</a>
          <a href="#projects" className="text-slate-300 hover:text-cyber-cyan py-1" onClick={() => { closeMobileMenu(); if (location.pathname !== '/') navigate('/'); }}>Projects</a>
          {(!user || user.role !== 'admin') && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-purple-400 font-bold border-b border-purple-900/30 pb-1 text-sm tracking-widest">Orders Management</span>
                <Link to="/order" className="text-slate-300 hover:text-cyber-cyan py-1 pl-4" onClick={closeMobileMenu}>Place Order</Link>
                <Link to="/status" className="text-slate-300 hover:text-cyber-cyan py-1 pl-4" onClick={closeMobileMenu}>Track Order</Link>
                <Link to="/status" className="text-slate-300 hover:text-cyber-cyan py-1 pl-4" onClick={closeMobileMenu}>My Orders</Link>
              </div>
              <a href="#contact" className="text-slate-300 hover:text-cyber-cyan py-1" onClick={() => { closeMobileMenu(); if (location.pathname !== '/') navigate('/'); }}>Contact</a>
            </div>
          )}
          
          <div className="border-t border-purple-950/20 pt-4 flex flex-col gap-3">
            {user ? (
              <>
                <div className="text-sm text-purple-300 uppercase">
                  Logged in as: <span className="font-bold text-white">{user.name}</span>
                </div>
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300 text-sm" onClick={closeMobileMenu}>
                    <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={() => { handleLogout(); closeMobileMenu(); navigate('/'); }} 
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-red-950/30 border border-red-900/30 text-red-400 text-sm"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="text-center py-2 text-slate-300 border border-purple-900/30 rounded" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/signup" className="text-center py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
