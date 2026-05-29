import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Search, ClipboardList, CheckCircle2, Circle, Clock, Loader2, ArrowRight, Download, CreditCard, Star } from 'lucide-react';

const StatusTrackerPage = ({ token, user }) => {
  const navigate = useNavigate();

  const [searchId, setSearchId] = useState('');
  const [singleOrder, setSingleOrder] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Authenticated user's orders list
  const [myOrders, setMyOrders] = useState([]);
  const [loadingList, setLoadingList] = useState(false);

  // Review Form State
  const [reviewOrderIds, setReviewOrderIds] = useState({});
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Community Feedbacks
  const [feedbacks, setFeedbacks] = useState([]);

  const handleReviewSubmit = async (e, order) => {
    e.preventDefault();
    try {
      setReviewSubmitting(true);
      await api.feedback.submit({
        name: user?.name || order.name || 'Anonymous Client',
        service: order.service,
        rating: reviewRating,
        review: reviewComment
      });
      await api.orders.markReviewed(order._id);
      
      if (singleOrder && singleOrder._id === order._id) {
        setSingleOrder({ ...singleOrder, isReviewed: true });
      }
      if (myOrders.length > 0) {
        setMyOrders(myOrders.map(o => o._id === order._id ? { ...o, isReviewed: true } : o));
      }
      
      setReviewOrderIds({ ...reviewOrderIds, [order._id]: false });
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
    fetchFeedbacks();
  }, [user]);

  const fetchFeedbacks = async () => {
    try {
      const data = await api.feedback.getAll();
      setFeedbacks(data);
    } catch (err) {
      console.error('Failed to load feedbacks:', err);
    }
  };

  const fetchMyOrders = async () => {
    try {
      setLoadingList(true);
      const data = await api.orders.getMyOrders(token);
      setMyOrders(data);
    } catch (err) {
      console.error('Failed to load personalized builds:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      setSearchLoading(true);
      setSearchError('');
      setSingleOrder(null);

      const response = await fetch(`http://localhost:5000/api/orders/tracker/${searchId.trim()}`);
      if (!response.ok) {
        throw new Error('Project build node not registered or inactive.');
      }
      const data = await response.json();
      setSingleOrder(data);
    } catch (err) {
      setSearchError(err.message || 'No project matching this signature found.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Cyberpunk status timeline renderer
  const renderTimeline = (currentStatus) => {
    const statuses = ['Pending', 'In Progress', 'Completed'];
    const activeIndex = statuses.indexOf(currentStatus);

    return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 my-8 relative w-full">
        {/* Progress line */}
        <div className="hidden md:block absolute top-[15px] left-[5%] right-[5%] h-0.5 bg-purple-950 -z-10" />

        {statuses.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isActive = idx === activeIndex;

          return (
            <div key={step} className="flex md:flex-col items-center gap-3 md:gap-2 md:text-center w-full md:w-1/3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isActive ? 'bg-cyber-cyan border-cyber-cyan shadow-[0_0_15px_#06b6d4]' :
                isDone ? 'bg-purple-950 border-cyber-purple' :
                'bg-cyber-dark border-purple-950 text-slate-700'
              }`}>
                {isDone || (isActive && step === 'Completed') ? (
                  <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-cyber-dark' : 'text-cyber-cyan'}`} />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-cyber-dark animate-spin" />
                ) : (
                  <Circle className="w-3 h-3 text-slate-700" />
                )}
              </div>
              <div>
                <span className={`text-xs uppercase font-orbitron tracking-widest font-bold block ${
                  isActive ? 'text-cyber-cyan' : isDone ? 'text-purple-300' : 'text-slate-500'
                }`}>{step}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {step === 'Pending' ? 'Parameters Logged' :
                   step === 'In Progress' ? 'Active Synthesis' :
                   'Deploy Complete'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Pricing negotiation matrix renderer
  const renderPricingSection = (order) => {
    if (!order.fixedAmount || order.fixedAmount === 'N/A') {
      return (
        <div className="mt-4 p-4 rounded-lg bg-purple-950/10 border border-purple-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-left">
          <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
            <Loader2 className="w-3.5 h-3.5 text-cyber-cyan animate-spin" />
            <span>VALUATION STATUS:</span>
            <span className="text-cyber-cyan font-bold uppercase tracking-wider">Awaiting Administrator Valuation</span>
          </div>
          <span className="text-[10px] text-slate-500 font-rajdhani uppercase tracking-wider">Please check back shortly</span>
        </div>
      );
    }

    if (!order.isAmountAccepted) {
      return (
        <div className="mt-4 p-4 rounded-lg bg-yellow-950/10 border border-yellow-500/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
          <div>
            <span className="text-[10px] font-mono text-yellow-500 block uppercase tracking-widest font-bold animate-pulse">🔒 ACTION REQUIRED: PRICING DETECTED</span>
            <span className="text-white text-xs font-inter mt-1 block leading-relaxed">
              The administrator has valued this project build node at <strong className="text-yellow-400 font-mono text-sm">{order.fixedAmount}</strong>. Please review and authorize below to activate production work.
            </span>
          </div>
          <button
            onClick={async () => {
              try {
                await api.orders.acceptAmount(order._id, token);
                // Refresh searched order
                if (singleOrder && singleOrder._id === order._id) {
                  const response = await fetch(`http://localhost:5000/api/orders/tracker/${order._id}`);
                  const data = await response.json();
                  setSingleOrder(data);
                }
                // Refresh builds log list
                fetchMyOrders();
              } catch (err) {
                alert(err.message || 'Authorization matrix handshake rejected.');
              }
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-black text-xs font-rajdhani font-extrabold uppercase tracking-wider rounded shadow-[0_0_15px_rgba(234,179,8,0.25)] hover:shadow-[0_0_25px_rgba(234,179,8,0.45)] transition-all whitespace-nowrap"
          >
            Accept Price & Authorize Build
          </button>
        </div>
      );
    }

    return (
      <div className="mt-4 p-3 rounded bg-green-950/20 border border-green-500/30 text-xs text-green-400 font-mono flex flex-wrap items-center gap-2 text-left">
        <span>✅ PRICING MATRIX CLEARED:</span>
        <span className="text-white font-bold">{order.fixedAmount}</span>
        <span className="text-[10px] text-slate-500 font-rajdhani uppercase">(Authorized for Production)</span>
      </div>
    );
  };

  return (
    <div className="bg-hexagons bg-cyber-grid min-h-[90vh] py-16 px-6">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Search Tracker Section */}
        <div className="p-8 rounded-xl glass-panel border border-purple-500/20 shadow-[0_0_35px_rgba(168,85,247,0.1)]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-orbitron font-extrabold text-2xl uppercase tracking-wider text-white">TRACK BUILD NODE</h2>
            <p className="text-xs text-slate-400 font-inter mt-2 leading-relaxed">
              Enter your secure order signature to monitor synthesis, accept valuation details, and dispatch final deliverables.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-lg mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Secure Node ID (e.g. 65c2a1...)" 
                className="w-full pl-10 pr-4 py-2.5 rounded glass-input text-xs font-mono"
              />
            </div>
            <button type="submit" disabled={searchLoading} className="btn-cyber-cyan py-2.5 px-6 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              {searchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              Transmit
            </button>
          </form>

          {searchError && (
            <div className="max-w-lg mx-auto mt-4 p-3 bg-red-950/40 border border-red-500/40 text-red-400 rounded text-center text-xs font-mono">
              ❌ {searchError}
            </div>
          )}

          {/* Searched Order Result Card */}
          {singleOrder && (
            <div className="mt-8 p-6 rounded-lg bg-black/40 border border-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-purple-950/40 pb-4 mb-6">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">ORDER SIGNATURE: {singleOrder._id}</span>
                  <h3 className="font-orbitron font-extrabold text-lg text-white mt-1 uppercase">{singleOrder.service}</h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[9px] font-rajdhani text-slate-500 block uppercase">Target Date</span>
                    <span className="text-cyan-300 font-semibold">{new Date(singleOrder.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {renderTimeline(singleOrder.status)}

              {/* Pricing acceptance banner */}
              {renderPricingSection(singleOrder)}

              <div className="mt-6 pt-6 border-t border-purple-950/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">PAYMENT STATE</span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold inline-block mt-1 ${
                    singleOrder.isPaid ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                  }`}>
                    {singleOrder.isPaid ? 'Cleared / Verified' : 'Awaiting Payment'}
                  </span>
                </div>
                
                {singleOrder.isPaid ? (
                  singleOrder.deliveredFileUrl ? (
                    singleOrder.isReviewed ? (
                      <a 
                        href={`http://localhost:5000${singleOrder.deliveredFileUrl}`} 
                        download={singleOrder.deliveredFileName}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-cyber-cyan px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download Project Files
                      </a>
                    ) : (
                      <div className="flex flex-col items-end gap-2">
                        {!reviewOrderIds[singleOrder._id] ? (
                          <button 
                            onClick={() => setReviewOrderIds({...reviewOrderIds, [singleOrder._id]: true})}
                            className="btn-cyber-purple px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                          >
                            <Star className="w-3.5 h-3.5" />
                            Review to Unlock Download
                          </button>
                        ) : (
                          <form onSubmit={(e) => handleReviewSubmit(e, singleOrder)} className="p-4 bg-purple-950/20 border border-purple-500/30 rounded flex flex-col gap-3 min-w-[250px]">
                            <div className="text-[10px] font-rajdhani text-purple-300 uppercase tracking-widest text-center">Rate Your Experience</div>
                            <div className="flex justify-center gap-1">
                              {[1,2,3,4,5].map(num => (
                                <Star 
                                  key={num} 
                                  className={`w-5 h-5 cursor-pointer transition-colors ${num <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`}
                                  onClick={() => setReviewRating(num)}
                                />
                              ))}
                            </div>
                            <textarea 
                              required
                              placeholder="Leave a short comment..."
                              className="w-full px-2 py-1.5 text-[10px] rounded glass-input resize-none"
                              rows="2"
                              value={reviewComment}
                              onChange={e => setReviewComment(e.target.value)}
                            />
                            <button type="submit" disabled={reviewSubmitting} className="btn-cyber-cyan w-full py-1.5 rounded font-rajdhani text-[10px] uppercase font-bold">
                              {reviewSubmitting ? 'Submitting...' : 'Submit & Download'}
                            </button>
                          </form>
                        )}
                      </div>
                    )
                  ) : (
                    <span className="text-xs text-slate-400 italic">Payment cleared. Awaiting delivery upload from admin.</span>
                  )
                ) : (
                  (!singleOrder.fixedAmount || singleOrder.fixedAmount === 'N/A' || !singleOrder.isAmountAccepted) ? (
                    <span className="text-[10px] text-yellow-500 font-rajdhani font-semibold uppercase tracking-wider border border-yellow-800/30 p-2 rounded bg-yellow-950/10 flex items-center gap-1.5 animate-pulse">
                      🔒 Payment Locked Awaiting Price Authorization
                    </span>
                  ) : (
                    <button
                      onClick={() => navigate(`/payment/${singleOrder._id}`)}
                      className="btn-cyber-purple px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Proceed to Payment Page
                    </button>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* User's Order List (Only if logged in) */}
        {user && (
          <div className="p-8 rounded-xl glass-panel border border-cyan-500/20 shadow-[0_0_35px_rgba(6,182,212,0.15)]">
            
            <div className="flex items-center gap-3 border-b border-purple-950/60 pb-4 mb-6">
              <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyber-cyan">
                <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-orbitron font-extrabold text-xl uppercase text-white tracking-wider">YOUR SECURE BUILD LOGS</h2>
                <span className="text-[10px] font-rajdhani text-slate-500 uppercase tracking-widest">Active nodes for {user.name}</span>
              </div>
            </div>

            {loadingList ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-cyber-cyan animate-spin" />
              </div>
            ) : myOrders.length > 0 ? (
              <div className="flex flex-col gap-8">
                {myOrders.map((order) => (
                  <div key={order._id} className="p-6 rounded bg-black/40 border border-purple-950/60 hover:border-purple-500/30 transition-all">
                    
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-purple-950/40 pb-4 mb-6">
                      <div>
                        <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">ID: {order._id}</div>
                        <h3 className="font-orbitron font-bold text-white text-base mt-1">{order.service}</h3>
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[9px] font-rajdhani text-slate-500 block uppercase">Timeline</span>
                          <span className="text-cyan-300 font-semibold">{new Date(order.deadline).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-rajdhani text-slate-500 block uppercase">Status Node</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold ${
                            order.status === 'Completed' ? 'bg-green-950 text-green-400 border border-green-800' :
                            order.status === 'In Progress' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                            order.status === 'Cancelled' ? 'bg-red-950 text-red-400 border border-red-800' :
                            'bg-yellow-950 text-yellow-400 border border-yellow-800'
                          }`}>{order.status}</span>
                        </div>
                      </div>
                    </div>

                    {renderTimeline(order.status)}

                    {/* Pricing acceptance banner */}
                    {renderPricingSection(order)}

                    <div className="mt-6 pt-6 border-t border-purple-950/40 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div>
                        <span className="text-[10px] font-rajdhani text-slate-500 block uppercase">PAYMENT STATE</span>
                        <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold inline-block mt-1 ${
                          order.isPaid ? 'bg-green-950 text-green-400 border border-green-800' : 'bg-yellow-950 text-yellow-400 border border-yellow-800'
                        }`}>
                          {order.isPaid ? 'Cleared / Verified' : 'Awaiting Payment'}
                        </span>
                      </div>
                      
                      {order.isPaid ? (
                        order.deliveredFileUrl ? (
                          order.isReviewed ? (
                            <a 
                              href={`http://localhost:5000${order.deliveredFileUrl}`} 
                              download={order.deliveredFileName}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-cyber-cyan px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Download Project Files
                            </a>
                          ) : (
                            <div className="flex flex-col items-end gap-2">
                              {!reviewOrderIds[order._id] ? (
                                <button 
                                  onClick={() => setReviewOrderIds({...reviewOrderIds, [order._id]: true})}
                                  className="btn-cyber-purple px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                                >
                                  <Star className="w-3.5 h-3.5" />
                                  Review to Unlock Download
                                </button>
                              ) : (
                                <form onSubmit={(e) => handleReviewSubmit(e, order)} className="p-4 bg-purple-950/20 border border-purple-500/30 rounded flex flex-col gap-3 min-w-[250px]">
                                  <div className="text-[10px] font-rajdhani text-purple-300 uppercase tracking-widest text-center">Rate Your Experience</div>
                                  <div className="flex justify-center gap-1">
                                    {[1,2,3,4,5].map(num => (
                                      <Star 
                                        key={num} 
                                        className={`w-5 h-5 cursor-pointer transition-colors ${num <= reviewRating ? 'fill-yellow-500 text-yellow-500' : 'text-slate-600'}`}
                                        onClick={() => setReviewRating(num)}
                                      />
                                    ))}
                                  </div>
                                  <textarea 
                                    required
                                    placeholder="Leave a short comment..."
                                    className="w-full px-2 py-1.5 text-[10px] rounded glass-input resize-none"
                                    rows="2"
                                    value={reviewComment}
                                    onChange={e => setReviewComment(e.target.value)}
                                  />
                                  <button type="submit" disabled={reviewSubmitting} className="btn-cyber-cyan w-full py-1.5 rounded font-rajdhani text-[10px] uppercase font-bold">
                                    {reviewSubmitting ? 'Submitting...' : 'Submit & Download'}
                                  </button>
                                </form>
                              )}
                            </div>
                          )
                        ) : (
                          <span className="text-xs text-slate-400 italic">Payment cleared. Awaiting delivery upload from admin.</span>
                        )
                      ) : (
                        (!order.fixedAmount || order.fixedAmount === 'N/A' || !order.isAmountAccepted) ? (
                          <span className="text-[10px] text-yellow-500 font-rajdhani font-semibold uppercase tracking-wider border border-yellow-800/30 p-2 rounded bg-yellow-950/10 flex items-center gap-1.5 animate-pulse">
                            🔒 Payment Locked Awaiting Price Authorization
                          </span>
                        ) : (
                          <button
                            onClick={() => navigate(`/payment/${order._id}`)}
                            className="btn-cyber-purple px-5 py-2 rounded font-rajdhani text-xs uppercase tracking-widest font-bold flex items-center gap-2"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            Proceed to Payment Page
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 font-rajdhani text-base uppercase tracking-wider">
                No active project connections detected.
              </div>
            )}
          </div>
        )}

        {/* Global Platform Reviews */}
        <div className="p-8 rounded-xl glass-panel border border-yellow-500/20 shadow-[0_0_35px_rgba(234,179,8,0.15)]">
          <div className="flex items-center gap-3 border-b border-purple-950/60 pb-4 mb-6">
            <div className="p-2 rounded-lg bg-yellow-950/60 border border-yellow-500/40 text-yellow-400">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-orbitron font-extrabold text-xl uppercase text-white tracking-wider">CLIENT LOGS</h2>
              <span className="text-[10px] font-rajdhani text-slate-500 uppercase tracking-widest">Recent platform feedback</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feedbacks.slice(0, 6).map((fb) => (
              <div key={fb._id} className="p-4 rounded bg-black/40 border border-purple-950/60 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white text-xs">{fb.name}</span>
                  <span className="text-[9px] font-rajdhani text-cyan-400 uppercase border border-cyan-900/50 px-1.5 rounded">{fb.service}</span>
                </div>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < fb.rating ? 'fill-current' : 'text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-[11px] text-slate-300 italic line-clamp-3">"{fb.review}"</p>
              </div>
            ))}
            {feedbacks.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-6 text-slate-500 font-rajdhani text-xs uppercase tracking-wider">
                No reviews found in the system.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StatusTrackerPage;
