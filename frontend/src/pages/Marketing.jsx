import React, { useState } from 'react';
import { MessageCircle, Users, CheckSquare, Send, Megaphone, Smartphone, Star, Clock, CheckCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Marketing = () => {
  const [message, setMessage] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock DB Customers with tags
  const customers = [
    { id: 1, name: 'Sathish Kumar', phone: '9876543210', lastVisit: '2 days ago', tag: 'Regular', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
    { id: 2, name: 'Vignesh', phone: '9988776655', lastVisit: '1 week ago', tag: 'VIP', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' },
    { id: 3, name: 'Ramesh', phone: '9123456780', lastVisit: '1 month ago', tag: 'At Risk', color: 'text-red-400 bg-red-400/10 border-red-400/20' },
    { id: 4, name: 'Siva', phone: '9000011111', lastVisit: '2 months ago', tag: 'Lost', color: 'text-gray-400 bg-gray-400/10 border-gray-400/20' },
    { id: 5, name: 'Karthik', phone: '9234567890', lastVisit: 'Today', tag: 'Regular', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20' },
  ];

  const handleSelect = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(customerId => customerId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSelectAll = (filtered) => {
    if (selectedCustomers.length === filtered.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filtered.map(c => c.id));
    }
  };

  const handleSendTemplate = (template) => {
    setMessage(template);
  };

  const handleSendBulk = () => {
    if (selectedCustomers.length === 0) return alert("Please select at least one customer.");
    if (!message.trim()) return alert("Please type a message to send.");
    alert(`Woohoo! 🚀\nBroadcasting to ${selectedCustomers.length} customers via API...`);
    setMessage('');
    setSelectedCustomers([]);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full overflow-hidden space-y-4 md:space-y-6 lg:gap-0 page-transition">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl border-white/10 shadow-2xl bg-gradient-to-br from-[#121212] to-dark">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-green-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              <Megaphone className="text-green-500 hidden md:block" size={32} />
              Broadcast <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">Marketing</span>
            </h1>
            <p className="text-gray-400 font-medium">Re-engage audiences and boost sales with instant WhatsApp blasts.</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="glass-card px-4 py-2 border-green-500/30 bg-green-500/10 flex items-center gap-3 shadow-lg">
              <MessageCircle className="text-green-400" size={24} />
              <div>
                <p className="text-xs text-green-300 font-bold uppercase">Cloud API Status</p>
                <p className="text-sm font-black text-white">Connected 🟢</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0 overflow-hidden">
        
        {/* Left Column: Composer & Live Preview (Cols span 7) */}
        <div className="lg:col-span-7 space-y-6 overflow-y-auto pr-1 scroll-area">
          
          {/* Quick Templates row */}
          <div className="glass-card p-5 border-white/5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2"><Star size={16} className="text-yellow-400"/> Suggested Templates</h3>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => handleSendTemplate("Special Offer! Get 20% off on your next Hair Spa. Valid till Sunday! 💇‍♂️")} 
                className="text-xs font-bold bg-white/5 hover:bg-green-500/20 hover:text-green-400 px-4 py-2 rounded-xl transition border border-white/10 hover:border-green-500/50"
              >
                Weekend Offer 💸
              </button>
              <button 
                onClick={() => handleSendTemplate("Happy Diwali! Visit Just Hair for your festival grooming and get 10% off! ✨🎉")} 
                className="text-xs font-bold bg-white/5 hover:bg-yellow-500/20 hover:text-yellow-400 px-4 py-2 rounded-xl transition border border-white/10 hover:border-yellow-500/50"
              >
                Festival Greeting ✨
              </button>
              <button 
                onClick={() => handleSendTemplate("It's been a while! We miss you at Just Hair. Drop by this week for a fresh look. 💈")} 
                className="text-xs font-bold bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 px-4 py-2 rounded-xl transition border border-white/10 hover:border-blue-500/50"
              >
                Miss You / Retention 🥺
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Editor Area */}
            <div className="glass-card p-6 border-white/5 flex flex-col relative">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="text-primary" size={20} /> Write Message
              </h2>
              <textarea
                className="glass-input w-full flex-1 resize-none min-h-[200px] text-sm leading-relaxed"
                placeholder="Type your WhatsApp message here or select a template above..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
              <div className="flex justify-between items-center mt-3 text-xs text-gray-500 font-mono">
                <span>{message.length} characters</span>
                <span>{message.split(' ').filter(c => c).length} words</span>
              </div>
            </div>

            {/* Simulated Smartphone Preview */}
            <div className="glass-card p-6 border-white/5 flex flex-col items-center bg-black/40">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2 w-full">
                <Smartphone className="text-white" size={16} /> Live Client Preview
              </h2>
              
              {/* Phone Mockup */}
              <div className="relative w-[240px] h-[400px] bg-[#0b141a] rounded-[2rem] border-[6px] border-[#1f2c34] shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3 shadow-md z-10">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center font-bold text-white text-xs">JH</div>
                  <div>
                    <h4 className="text-white font-medium text-sm leading-tight">Just Hair Salon</h4>
                    <p className="text-[#8696a0] text-[10px]">Verified Business</p>
                  </div>
                </div>
                {/* Chat Body */}
                <div className="flex-1 bg-[#0b141a] p-3 overflow-y-auto" style={{backgroundImage: "url('https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png')", backgroundSize: 'contain'}}>
                  
                  <AnimatePresence>
                    {message ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-[#005c4b] text-[#e9edef] text-xs p-2 rounded-lg rounded-tl-sm shadow-sm inline-block max-w-[90%] whitespace-pre-wrap float-left clear-both mb-2"
                      >
                        {message}
                        {/* Timestamp tick */}
                        <div className="flex justify-end items-center gap-1 mt-1 opacity-70">
                          <span className="text-[9px]">10:30 AM</span>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-[#202c33] text-[#8696a0] text-xs p-2 rounded-lg rounded-tl-sm mt-4 italic inline-block pb-3">
                        Your typed message will magically appear here to preview...
                      </div>
                    )}
                  </AnimatePresence>
                  
                </div>
                {/* Bottom Bar */}
                <div className="h-10 bg-[#202c33] w-full mt-auto"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Audience Selector (Col span 5) */}
        <div className="lg:col-span-5 glass-card p-0 overflow-hidden border-white/5 flex flex-col h-full min-h-0">
          
          <div className="p-6 border-b border-white/10 bg-black/20">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Users className="text-primary" size={24} />
              Target Audience
            </h2>
            
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-400 font-medium">Selected: <b className="text-white">{selectedCustomers.length}</b>/{customers.length}</span>
              <button 
                onClick={() => handleSelectAll(filteredCustomers)}
                className="text-xs font-bold uppercase tracking-wider bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition"
              >
                Select All
              </button>
            </div>
            
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full text-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative">
            {filteredCustomers.length === 0 && (
               <div className="text-center text-gray-500 mt-10">No matching customers found.</div>
            )}
            
            {filteredCustomers.map((customer) => (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                key={customer.id} 
                onClick={() => handleSelect(customer.id)}
                className={`relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
                  selectedCustomers.includes(customer.id) 
                    ? 'border-green-500/50 bg-green-500/10' 
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center border transition-all shrink-0 ${selectedCustomers.includes(customer.id) ? 'bg-green-500 border-green-500' : 'border-gray-500 bg-black/50'}`}>
                  {selectedCustomers.includes(customer.id) && <CheckSquare size={14} className="text-white" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white text-md truncate">{customer.name}</h3>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md border ${customer.color}`}>{customer.tag}</span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono flex items-center gap-3">
                    <span>📱 {customer.phone}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {customer.lastVisit}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl">
             <button 
              onClick={handleSendBulk}
              disabled={selectedCustomers.length === 0 || !message}
              className={`w-full py-4 text-lg font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl ${
                selectedCustomers.length === 0 || !message 
                ? 'bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed' 
                : 'bg-green-500 hover:bg-green-400 text-white border-none hover:shadow-green-500/40 hover:-translate-y-1'
              }`}
            >
              <Send size={20} />
              {selectedCustomers.length > 0 ? `Launch Campaign (${selectedCustomers.length})` : 'Select Audience'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Marketing;
