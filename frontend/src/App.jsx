import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OrderPage from './pages/OrderPage';
import StatusTrackerPage from './pages/StatusTrackerPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const profile = await api.auth.getMe(token);
          setUser(profile);
        } catch (err) {
          console.error("Session expired or token invalid.");
          handleLogout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const handleLoginSuccess = (data) => {
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    setToken(data.token);
    localStorage.setItem('token', data.token);
  };

  const handleLogout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark flex items-center justify-center font-rajdhani text-lg uppercase tracking-widest text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Matrix...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-cyber-dark text-slate-200 flex flex-col justify-between">
        
        {/* Navigation grid */}
        <Navbar user={user} handleLogout={handleLogout} />

        {/* Core page views */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage user={user} />} />
            
            <Route 
              path="/login" 
              element={!user ? <LoginPage handleLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/signup" 
              element={!user ? <SignupPage handleLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} 
            />
            
            <Route 
              path="/order" 
              element={<OrderPage token={token} user={user} />} 
            />
            
            <Route 
              path="/status" 
              element={<StatusTrackerPage token={token} user={user} />} 
            />
            
            <Route 
              path="/payment/:orderId" 
              element={<PaymentPage token={token} user={user} />} 
            />
            
            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' 
                  ? <AdminDashboard token={token} user={user} /> 
                  : <Navigate to="/login" />
              } 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Global Floating AI Chatbot Assistant */}
        <Chatbot />

        {/* Futuristic footer links */}
        <Footer />

      </div>
    </BrowserRouter>
  );
}

export default App;
