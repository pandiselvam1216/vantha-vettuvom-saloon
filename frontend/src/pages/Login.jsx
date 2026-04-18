import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';

const Login = ({ users, onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate a bit of loading for premium feel
    setTimeout(() => {
      if (email && password) {
        const match = users.find(u => u.email === email && u.password === password);
        
        if (match) {
          onLogin(match);
          navigate(match.role === 'staff' ? '/billing' : '/');
        } else {
          setError('Invalid Email or Password.');
          setLoading(false);
        }
      }
    }, 800);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-mesh flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-card w-full max-w-md p-10 relative z-10 overflow-hidden"
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-10"
        >
          <motion.div 
            variants={itemVariants}
            className="w-24 h-24 mx-auto bg-gradient-to-tr from-primary to-pink-500 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,20,147,0.5)] relative group cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all"></div>
            <span className="text-5xl font-black text-white relative z-10">V</span>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-white/10 rounded-[2.5rem] opacity-50"
            ></motion.div>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-4xl font-extrabold tracking-tight mb-2 text-white">
            Vantha <span className="text-primary">Vettuvom</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-400 font-medium flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-primary" />
            Enterprise Salon Management
          </motion.p>
        </motion.div>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <User className="text-gray-500 group-focus-within:text-primary" size={20} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="glass-input w-full pl-14"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </motion.div>
            
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within:text-primary">
                <Lock className="text-gray-500 group-focus-within:text-primary" size={20} />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="glass-input w-full pl-14"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </motion.div>
          </motion.div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 text-sm font-bold bg-red-400/10 p-3 rounded-xl border border-red-400/20 text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            variants={itemVariants}
            type="submit" 
            disabled={loading}
            className={`btn-primary w-full group ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </motion.button>
        </form>

        <motion.div 
          variants={itemVariants}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-4 text-[10px] uppercase font-bold tracking-widest text-gray-500">
            <div className="h-px bg-white/10 flex-1"></div>
            <span>Demo Credentials</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          <div className="flex justify-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
              <span className="text-white">admin@vv.com</span> / admin
            </div>
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400">
              <span className="text-white">staff@vv.com</span> / staff
            </div>
          </div>
          <p className="text-gray-500 text-[11px] mt-6 cursor-pointer hover:text-primary transition-colors">
            Forgot password? <span className="text-white font-bold underline underline-offset-4">Contact Workspace Owner</span>
          </p>
        </motion.div>
      </motion.div>
      
      {/* Version Tag */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="mt-20 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]"
      >
        Vantha Vettuvom v2.4.0 • Enterprise Edition
      </motion.div>
    </div>
  );
};

export default Login;
