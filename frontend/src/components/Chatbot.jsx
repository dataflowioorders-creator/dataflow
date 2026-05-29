import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Cpu, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'DATA FLOW Core Online. I am your AI navigator. Ask me about services, custom orders, or budget guidelines.',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollRef = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollRef();
    }
  }, [messages, isOpen, isTyping]);

  const handleSuggest = (topic) => {
    let userMsg = '';
    let botReply = '';
    
    if (topic === 'services') {
      userMsg = 'What services do you offer?';
      botReply = 'We specialize in: \n• Journal & Research Papers\n• SRS & UML Project Documentation\n• Mini & Major Custom Software\n• AI & Machine Learning models\n• Full-Stack Web Development\n• Cyberpunk UI Logo Design';
    } else if (topic === 'order') {
      userMsg = 'How do I place an order?';
      botReply = 'You can click on the "Order Now" button in our navigation bar, or select any service card and press "Order Now" to go to our Customer Order Portal. You can upload project files and set your budget there!';
    } else if (topic === 'budget') {
      userMsg = 'What are your budget ranges?';
      botReply = 'Our basic branding starts at $50. Documentation runs $80-$200, research papers $150-$400, mini software prototypes $100-$300, and comprehensive AI/ML or major Web applications range from $350 to $2000 depending on complexity.';
    } else if (topic === 'contact') {
      userMsg = 'How do I contact you?';
      botReply = 'Reach us via Instagram @DATA_FLOW.IO, email at dataflow.io.orders@gmail.com, or use the contact forms at the bottom of the home screen.';
    }

    setMessages((prev) => [...prev, { sender: 'user', text: userMsg, timestamp: new Date() }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply, timestamp: new Date() }]);
    }, 800);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setMessages((prev) => [...prev, { sender: 'user', text: userText, timestamp: new Date() }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let botReply = "My neural nodes are processing that request. For complex project estimations, please use our Order Page or reach out directly to our admin team at dataflow.io.orders@gmail.com.";

      const lower = userText.toLowerCase();
      if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        botReply = "Greetings! I am the DATA FLOW assistant. What kind of AI, software, or research project can we build for you today?";
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('charge')) {
        botReply = "Service rates vary:\n• Logo: $50+\n• Documentation: $80+\n• Mini Projects: $100+\n• Research Papers: $150+\n• ML/Web Apps: $300-$2000. \n\nYou can set your budget range on our Order Page!";
      } else if (lower.includes('order') || lower.includes('submit') || lower.includes('buy') || lower.includes('hire')) {
        botReply = "To place an order, navigate to the Order Portal. You'll specify your service, deadline, budget, and can upload requirements files directly.";
      } else if (lower.includes('status') || lower.includes('track')) {
        botReply = "You can track your order using the 'Track Project' option in the navbar. Simply sign in to view your orders, or enter your Order ID there.";
      } else if (lower.includes('instagram') || lower.includes('ig')) {
        botReply = "Follow our nodes on Instagram @DATA_FLOW.IO for portfolio showcases and active updates.";
      } else if (lower.includes('ai') || lower.includes('ml') || lower.includes('machine') || lower.includes('model')) {
        botReply = "We develop custom ML pipelines, NLP bots, computer vision classifiers, and predictive analytics models using TensorFlow, PyTorch, and FastAPI. Tell us your requirements!";
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: botReply, timestamp: new Date() }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-inter">
      {/* Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:scale-105 transition-all duration-300 relative group"
        >
          <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-45"></div>
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-cyber-dark/95 border border-purple-500/30 px-3 py-1 rounded-md text-xs font-rajdhani uppercase tracking-widest text-cyber-cyan transition-all origin-right">
            Query AI
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[480px] rounded-xl glass-panel border border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-purple-950/80 via-cyber-dark to-cyan-950/80 border-b border-purple-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-950 border border-purple-500/30">
                <Cpu className="w-4 h-4 text-cyber-cyan" />
              </div>
              <div>
                <h3 className="font-orbitron font-bold text-sm tracking-wider text-white">CORE ASSISTANT</h3>
                <span className="text-[10px] font-rajdhani text-cyan-400 tracking-widest uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
                  Node: Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-black/20">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 max-w-[85%] ${m.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                <div className={`p-2 rounded-lg text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-purple-600/40 border border-purple-500/40 text-white rounded-br-none'
                    : 'bg-slate-900/80 border border-purple-950/40 text-slate-200 rounded-bl-none'
                }`}>
                  {m.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="self-start flex gap-2 max-w-[80%] items-center">
                <div className="bg-slate-900/80 border border-purple-950/40 p-2.5 rounded-lg rounded-bl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce delay-100"></span>
                  <span className="w-1.5 h-1.5 bg-cyber-cyan rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Chips */}
          <div className="px-4 py-2 bg-black/45 border-t border-purple-950/30 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button onClick={() => handleSuggest('services')} className="px-2 py-1 rounded bg-purple-950/40 border border-purple-500/20 text-[10px] uppercase font-rajdhani tracking-wider text-purple-300 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all">
              Services
            </button>
            <button onClick={() => handleSuggest('order')} className="px-2 py-1 rounded bg-purple-950/40 border border-purple-500/20 text-[10px] uppercase font-rajdhani tracking-wider text-purple-300 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all">
              How to Order
            </button>
            <button onClick={() => handleSuggest('budget')} className="px-2 py-1 rounded bg-purple-950/40 border border-purple-500/20 text-[10px] uppercase font-rajdhani tracking-wider text-purple-300 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all">
              Pricing
            </button>
            <button onClick={() => handleSuggest('contact')} className="px-2 py-1 rounded bg-purple-950/40 border border-purple-500/20 text-[10px] uppercase font-rajdhani tracking-wider text-purple-300 hover:border-cyber-cyan/50 hover:text-cyber-cyan transition-all">
              Social
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSend} className="p-3 bg-cyber-darker border-t border-purple-950/40 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Query neural network..."
              className="flex-1 bg-black/40 border border-purple-950/50 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-cyan-500/50 text-slate-200"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-purple-900/60 hover:bg-purple-800 border border-purple-500/30 text-white hover:text-cyber-cyan transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
