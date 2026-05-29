import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, BASE_URL } from '../services/api';
import { ShieldCheck, Lock, Loader2, CheckCircle2, Cpu, Upload, Image as ImageIcon, QrCode } from 'lucide-react';
import gpayQrImg from '../assets/gpay_qr.png';

const PaymentPage = ({ token, user }) => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Receipt Screenshot State
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Payment states
  const [processing, setProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('AUTHENTICATION REQUIRED. Please sign in to authorize transactions.');
      setLoading(false);
      return;
    }
    fetchOrderDetails();
  }, [orderId, token]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${BASE_URL}/api/orders/tracker/${orderId}`);
      if (!response.ok) {
        throw new Error('Project node not found in register.');
      }
      const data = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to sync with order node.');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setScreenshotPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!screenshotFile) {
      alert('Please upload a screenshot of your payment receipt to submit.');
      return;
    }

    try {
      setProcessing(true);
      
      // Cyberpunk loading visual simulation
      setProcessStep(1); // 'Initializing Tunnel...'
      await new Promise(r => setTimeout(r, 1000));
      
      setProcessStep(2); // 'Uploading Receipt Matrix...'
      await new Promise(r => setTimeout(r, 1200));

      setProcessStep(3); // 'Encrypting Handshake...'
      await new Promise(r => setTimeout(r, 1000));

      // Append screenshot file to FormData
      const formData = new FormData();
      formData.append('file', screenshotFile);

      // Make actual API call to finalize payment with screenshot upload
      await api.orders.pay(orderId, formData, token);
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Secure payment gateway rejected the receipt handshake.');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-hexagons bg-cyber-grid min-h-[85vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyber-cyan animate-spin" />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="bg-hexagons bg-cyber-grid min-h-[85vh] flex items-center justify-center px-6">
        <div className="w-full max-w-md p-8 rounded-xl glass-panel border border-red-500/20 text-center flex flex-col items-center gap-6">
          <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded-xl animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-orbitron font-extrabold text-xl uppercase tracking-wider text-white">SECURE HANDSHAKE FAILURE</h2>
          <p className="text-xs text-slate-400 font-inter leading-relaxed">{error}</p>
          <button onClick={() => navigate('/status')} className="btn-cyber-cyan py-2.5 px-6 rounded font-rajdhani text-xs uppercase tracking-widest font-bold">
            Return to Tracker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-[90vh] py-16 px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Order Details Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="p-6 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <h3 className="font-orbitron font-extrabold text-sm uppercase text-white tracking-wider border-b border-purple-950/60 pb-3 mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyber-cyan" /> Secure Order Node
            </h3>

            <div className="flex flex-col gap-4 text-xs font-mono text-slate-300">
              <div>
                <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">Order ID</span>
                <span className="text-white select-all">{order?._id}</span>
              </div>
              <div>
                <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">Project Category</span>
                <span className="text-cyber-cyan font-bold">{order?.service}</span>
              </div>
              <div>
                <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">Deadline Node</span>
                <span className="text-purple-300">{new Date(order?.deadline).toLocaleDateString()}</span>
              </div>
              <div className="pt-2 border-t border-purple-950/30">
                <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">Fulfillment Status</span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold inline-block mt-1 ${
                  order?.status === 'Completed' ? 'bg-green-950 text-green-400 border border-green-800' :
                  order?.status === 'In Progress' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                  'bg-yellow-950 text-yellow-400 border border-yellow-800'
                }`}>{order?.status}</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-cyan-950/10 border border-cyan-500/20 flex gap-3 text-cyan-300 text-xs">
            <ShieldCheck className="w-5 h-5 shrink-0 animate-pulse" />
            <p className="font-inter leading-relaxed">
              Data Flow employs military-grade 256-bit SSL encryption. Transaction nodes are immediately cleared and zero logs are saved.
            </p>
          </div>
        </div>

        {/* Payment Gate Panel */}
        <div className="lg:col-span-7">
          {success ? (
            <div className="p-8 rounded-xl glass-panel border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.15)] flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="p-4 rounded-full bg-cyan-950/60 border border-cyan-500/50 text-cyber-cyan animate-pulse">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white">
                RECEIPT TRANSMITTED
              </h2>
              
              <p className="text-xs text-slate-300 font-inter leading-relaxed max-w-sm">
                Secure transaction receipt has been uploaded successfully. The administrator has been notified and will verify the transaction node shortly.
              </p>

              <button
                onClick={() => navigate('/status')}
                className="btn-cyber-cyan py-3 px-8 rounded font-rajdhani text-sm uppercase tracking-widest font-bold mt-2"
              >
                Track Status & Download
              </button>
            </div>
          ) : processing ? (
            <div className="p-8 rounded-xl glass-panel border border-purple-500/20 flex flex-col items-center justify-center text-center min-h-[350px] gap-6">
              <Loader2 className="w-12 h-12 text-cyber-purple animate-spin" />
              <div>
                <h3 className="font-orbitron font-bold text-white text-base uppercase tracking-wider">
                  {processStep === 1 ? 'INITIALIZING TUNNEL...' : 
                   processStep === 2 ? 'UPLOADING RECEIPT MATRIX...' : 
                   'ENCRYPTING HANDSHAKE...'}
                </h3>
                <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest mt-2 block animate-pulse">
                  ESTABLISHING SECURE CRYPTO GATEWAY HANDSHAKE...
                </span>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_35px_rgba(168,85,247,0.1)]">
              
              <div className="flex items-center gap-3 border-b border-purple-950/60 pb-4 mb-6">
                <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-cyber-cyan">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-orbitron font-extrabold text-xl uppercase text-white tracking-wider">GPAY TRANSACTION LINK</h2>
                  <span className="text-[10px] font-rajdhani text-slate-500 uppercase tracking-widest">Scan QR Code & Transmit Verification Screenshot</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-6">
                
                {/* QR Code Container */}
                <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-black/50 border border-purple-500/30 text-center">
                  <span className="text-[10px] font-rajdhani text-purple-300 uppercase tracking-widest font-bold mb-3 block">
                    STEP 1: SCAN SECURE GPAY UPI NODE
                  </span>
                  
                  {/* Glowing QR wrapper */}
                  <div className="p-4 rounded-xl bg-white/5 border-2 border-cyber-cyan shadow-[0_0_20px_rgba(6,182,212,0.3)] animate-pulse max-w-[200px] mb-3">
                    <img 
                      src={gpayQrImg} 
                      alt="Google Pay UPI QR Code" 
                      className="w-full h-auto rounded"
                    />
                  </div>
                  
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wide">
                    Double-check payment terminal is active
                  </span>
                </div>

                {/* Screenshot Uploader */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-rajdhani text-purple-300 uppercase tracking-widest font-bold block">
                    STEP 2: UPLOAD TRANSACTION SCREENSHOT
                  </span>
                  
                  <label className="flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed border-purple-500/20 hover:border-purple-500/50 cursor-pointer bg-purple-950/10 hover:bg-purple-950/20 transition-all text-center">
                    <Upload className="w-8 h-8 text-cyber-cyan mb-2" />
                    <span className="text-xs text-slate-300 font-rajdhani font-bold uppercase tracking-wider">
                      {screenshotFile ? 'Replace Selected Screenshot' : 'Choose Receipt Screenshot'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 font-mono">
                      PNG, JPG, or JPEG up to 10MB
                    </span>
                    <input 
                      type="file" 
                      required
                      accept="image/*"
                      className="hidden" 
                      onChange={handleScreenshotChange} 
                    />
                  </label>
                </div>

                {/* Live Preview */}
                {screenshotPreview && (
                  <div className="p-4 rounded-lg bg-black/40 border border-cyan-500/30">
                    <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider mb-2 block flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5" /> SCREENSHOT TRANSMISSION PREVIEW:
                    </span>
                    <div className="max-w-[250px] mx-auto rounded overflow-hidden border border-slate-800">
                      <img 
                        src={screenshotPreview} 
                        alt="Receipt Preview" 
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!screenshotFile}
                  className={`py-3 mt-2 rounded font-rajdhani uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    screenshotFile 
                      ? 'btn-cyber-cyan shadow-[0_0_20px_rgba(6,182,212,0.2)]' 
                      : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  Transmit Payment Screenshot
                </button>

              </form>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PaymentPage;
