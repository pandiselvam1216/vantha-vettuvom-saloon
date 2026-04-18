import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Scissors, Sparkles, Filter, Droplet, Star, X } from 'lucide-react';
import { storage } from '../utils/storage';

const Services = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const [services, setServices] = useState(storage.getServices());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', category: 'Hair', price: '', duration: '30 mins', description: '' });

  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = activeFilter === 'All' 
    ? services 
    : services.filter(service => service.category === activeFilter);

  // Stats
  const totalServices = services.length;
  const avgPrice = Math.round(services.reduce((sum, s) => sum + s.price, 0) / totalServices);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hair': return <Scissors size={18} />;
      case 'Beard': return <Sparkles size={18} />;
      case 'Skin': return <Droplet size={18} />;
      default: return <Star size={18} />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hair': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'Beard': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Skin': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };
  const handleAddService = () => {
    if (!newService.name || !newService.price) return;
    storage.saveService({ ...newService, price: Number(newService.price) });
    setServices(storage.getServices());
    setIsModalOpen(false);
    setNewService({ name: '', category: 'Hair', price: '', duration: '30 mins', description: '' });
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      storage.deleteService(id);
      setServices(storage.getServices());
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      
      {/* Premium Header Banner */}
      <div className="relative overflow-hidden glass-card p-6 md:p-8 rounded-3xl border-white/10 shadow-2xl bg-gradient-to-br from-[#1a1a1a] to-dark">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              <Scissors className="text-primary hidden md:block" size={32} />
              Service <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Menu</span>
            </h1>
            <p className="text-gray-400 font-medium">Manage your salon offerings, pricing, and categories.</p>
          </div>
          
          <div className="flex gap-4 items-center w-full md:w-auto">
            <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Total Items</p>
                <p className="text-xl font-bold text-white">{totalServices}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Avg. Price</p>
                <p className="text-xl font-bold text-primary">₹{avgPrice}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary py-3 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/30 font-bold w-full md:w-auto justify-center"
            >
              <Plus size={20} /> Add New Service
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white/5 p-2 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide px-2">
          <div className="flex items-center gap-2 text-gray-400 mr-2 shrink-0">
            <Filter size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Filter:</span>
          </div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
                activeFilter === category 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid (Cards instead of Table) */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredServices.map((service, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={service.id}
              className="glass-card p-6 border-white/5 hover:border-primary/40 relative overflow-hidden group transition-all"
            >
              {/* Optional Popular Ribbon */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                  Popular
                </div>
              )}
              
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 ${getCategoryColor(service.category)}`}>
                  {getCategoryIcon(service.category)}
                </div>
                <div className="flex-1 min-w-0 pr-12">
                  <h3 className="font-bold text-xl text-white truncate">{service.name}</h3>
                  <div className="flex items-center gap-3 mt-1.5 opacity-80">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className="text-sm text-gray-400 font-medium flex items-center gap-1">
                      {service.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-6 line-clamp-2 h-10">
                {service.description}
              </p>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto">
                <div className="text-2xl font-black text-primary tracking-tight">
                  ₹{service.price}
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary hover:border-primary/30 flex items-center justify-center text-gray-400 transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteService(service.id)}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center text-gray-400 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredServices.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
          <Scissors size={64} className="mb-4 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-400">No services found in this category.</h2>
        </div>
      )}
      {/* Add Service Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card w-full max-w-md p-6 border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Add New Service</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Service Name</label>
                  <input 
                    type="text" className="glass-input w-full" 
                    value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Category</label>
                    <select 
                      className="glass-input w-full bg-dark"
                      value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}
                    >
                      <option value="Hair">Hair</option>
                      <option value="Beard">Beard</option>
                      <option value="Skin">Skin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Price (₹)</label>
                    <input 
                      type="number" className="glass-input w-full" 
                      value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Duration</label>
                  <input 
                    type="text" className="glass-input w-full" 
                    value={newService.duration} onChange={e => setNewService({...newService, duration: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description</label>
                  <textarea 
                    className="glass-input w-full h-20 resize-none" 
                    value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})}
                  />
                </div>
                <button onClick={handleAddService} className="btn-primary w-full py-3 font-bold mt-4">Save Service</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
