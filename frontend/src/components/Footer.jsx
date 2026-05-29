import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Send, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/logo.png';

const InstagramIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
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

const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-purple-950/40 bg-cyber-darker text-slate-400 font-inter">
      {/* Decorative cyber grid accent */}
      <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 z-10">
        
        {/* Info Col */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logoImg} 
              alt="DATA FLOW" 
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-orbitron font-bold text-lg tracking-wider text-white">
              DATA FLOW
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-slate-500">
            A premium cyber-tech startup providing high-end AI models, software applications, research formatting, and futuristic custom software development.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a 
              href="https://instagram.com/DATA_FLOW.IO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded bg-purple-950/30 border border-purple-900/30 text-purple-400 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all duration-300"
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href="https://mail.google.com/mail/?view=cm&fs=1&to=dataflow.io.orders@gmail.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded bg-purple-950/30 border border-purple-900/30 text-purple-400 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all duration-300"
              title="Open in Gmail"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a 
              href="tel:9342545024" 
              className="p-2 rounded bg-purple-950/30 border border-purple-900/30 text-purple-400 hover:text-cyber-cyan hover:border-cyber-cyan/40 transition-all duration-300"
              title="Call: 9342545024, 9361818193"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-orbitron text-sm uppercase text-white tracking-widest mb-6 border-b border-purple-950/50 pb-2">
            Navigate
          </h4>
          <ul className="flex flex-col gap-3 font-rajdhani text-base uppercase tracking-wider">
            <li><Link to="/" className="hover:text-cyber-cyan transition-colors">Home</Link></li>
            <li><a href="#services" className="hover:text-cyber-cyan transition-colors">Services</a></li>
            <li><a href="#projects" className="hover:text-cyber-cyan transition-colors">Projects</a></li>
            <li><Link to="/order" className="hover:text-cyber-cyan transition-colors">Order Now</Link></li>
            <li><Link to="/status" className="hover:text-cyber-cyan transition-colors">Track Order</Link></li>
          </ul>
        </div>

        {/* Services Links */}
        <div>
          <h4 className="font-orbitron text-sm uppercase text-white tracking-widest mb-6 border-b border-purple-950/50 pb-2">
            Expertise
          </h4>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="hover:text-cyber-purple transition-colors">AI & Machine Learning</li>
            <li className="hover:text-cyber-purple transition-colors">Mini & Major Software</li>
            <li className="hover:text-cyber-purple transition-colors">Academic Research Papers</li>
            <li className="hover:text-cyber-purple transition-colors">UML & SRS Documentation</li>
            <li className="hover:text-cyber-purple transition-colors">Modern UI Logo Design</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-orbitron text-sm uppercase text-white tracking-widest mb-6 border-b border-purple-950/50 pb-2">
            HQ Node
          </h4>
          <ul className="flex flex-col gap-4 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-cyber-cyan shrink-0" />
              <a href="mailto:dataflow.io.orders@gmail.com" className="truncate hover:text-cyber-cyan transition-colors">
                dataflow.io.orders@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-cyber-cyan shrink-0" />
              <span>9342545024, 9361818193</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-cyber-cyan shrink-0" />
              <span>Puducherry</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="relative border-t border-purple-950/20 py-6 text-center text-xs text-slate-600 font-rajdhani uppercase tracking-widest z-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center items-center">
          <span>&copy; {new Date().getFullYear()} DATA FLOW. All Rights Reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
