import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  BarElement,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TrendingUp, Users, Scissors, CalendarCheck, Clock, ArrowUpRight, ArrowDownRight, Star, Plus, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler
);

const Dashboard = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ datasets: [] });
  const navigate = useNavigate();

  const stats = [
    { title: "Today's Revenue", value: '₹12,450', icon: <TrendingUp size={24} />, trend: '+15.3%', isUp: true, color: "text-primary", bg: "from-primary/20 to-pink-500/5", glow: "shadow-primary/20" },
    { title: 'Appointments', value: '24', icon: <CalendarCheck size={24} />, trend: '+4.1%', isUp: true, color: "text-blue-400", bg: "from-blue-500/20 to-cyan-500/5", glow: "shadow-blue-500/20" },
    { title: 'New Customers', value: '18', icon: <Users size={24} />, trend: '-2.5%', isUp: false, color: "text-purple-400", bg: "from-purple-500/20 to-indigo-500/5", glow: "shadow-purple-500/20" },
    { title: 'Completed', value: '42', icon: <Scissors size={24} />, trend: '+8.0%', isUp: true, color: "text-amber-400", bg: "from-amber-500/20 to-orange-500/5", glow: "shadow-amber-500/20" },
  ];

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const ctx = chart.ctx;
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(255, 20, 147, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 20, 147, 0.0)');

    setChartData({
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Revenue (₹)',
        data: [4500, 5200, 4800, 7100, 8500, 12000, 15450],
        borderColor: '#ff1493',
        backgroundColor: gradient,
        borderWidth: 4,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ff1493',
        pointBorderWidth: 3,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      }]
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
        borderWidth: 1,
        borderColor: 'rgba(255, 20, 147, 0.2)'
      }
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false }, 
        ticks: { color: '#6b7280', font: { size: 12 } } 
      },
      x: { 
        grid: { display: false }, 
        ticks: { color: '#6b7280', font: { size: 12 } } 
      },
    },
  };

  const appointments = [
    { id: 1, name: 'Sathish Kumar', service: 'Haircut & Beard Trim', time: '10:00 AM', status: 'In Progress', color: 'text-blue-400 bg-blue-400/10' },
    { id: 2, name: 'Vignesh', service: 'Bridal Makeover', time: '11:30 AM', status: 'Waiting', color: 'text-amber-400 bg-amber-400/10' },
    { id: 3, name: 'Ramesh Raj', service: 'Hair Spa', time: '01:00 PM', status: 'Upcoming', color: 'text-gray-400 bg-gray-400/10' },
    { id: 4, name: 'Karthik', service: 'Detan & Facial', time: '02:30 PM', status: 'Upcoming', color: 'text-gray-400 bg-gray-400/10' },
  ];

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-6 lg:space-y-8 overflow-hidden page-transition">
      
      {/* Premium Hero Banner - Compacted */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden glass-card p-6 md:p-8 bg-gradient-to-br from-[#1a1a1a] to-dark shrink-0"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
              className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-1"
            >
              Master <span className="text-gradient">Dashboard</span>
            </motion.h1>
            <p className="text-gray-400 font-medium text-sm md:text-base flex items-center justify-center md:justify-start gap-2">
              <MapPin size={16} className="text-primary" />
              Vantha Vettuvom VIP Salon • Live Operations
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button onClick={() => navigate('/billing')} className="btn-primary group py-3 px-6">
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="text-sm font-bold">Generate New Invoice</span>
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid - Smaller cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 shrink-0">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            key={idx} 
            className="glass-card p-4 md:p-5 group hover:shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className={`absolute -right-2 -top-2 w-16 h-16 bg-gradient-to-br ${stat.bg} opacity-20 blur-xl`}></div>
            
            <div className="flex justify-between items-start mb-2 md:mb-4 relative z-10">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.bg} ${stat.color} shadow-lg ${stat.glow}`}>
                {React.cloneElement(stat.icon, { size: 20 })}
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.isUp ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts & Lists - Adaptive Height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-0">
        
        {/* Revenue Chart - Flexible */}
        <div className="glass-card p-5 md:p-6 lg:col-span-2 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 md:mb-6 shrink-0">
            <div>
              <h2 className="text-xl font-black flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                Sales Performance
              </h2>
            </div>
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary">Live View</span>
          </div>
          <div className="flex-1 w-full min-h-0 relative">
            <div className="absolute inset-0">
              {chartData.datasets.length > 0 && <Line ref={chartRef} data={chartData} options={{...chartOptions, maintainAspectRatio: false }} />}
            </div>
          </div>
        </div>

        {/* Schedule Sidebar - Internal Scroll */}
        <div className="glass-card p-5 md:p-6 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-4 md:mb-6 border-b border-white/5 pb-4 shrink-0">
            <h2 className="text-xl font-black flex items-center gap-2">
              <Clock className="text-primary" size={24} />
              Timeline
            </h2>
            <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[9px] font-black uppercase text-gray-400">8 Active</span>
            </div>
          </div>
          
          <div className="flex-1 space-y-3 overflow-y-auto pr-1 scroll-area">
            {appointments.map((apt, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + (i * 0.05) }}
                key={apt.id} 
                className="group relative flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-dark border border-white/10 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <span className="text-[10px] font-black text-white">{apt.time.split(' ')[0]}</span>
                  <span className="text-[8px] text-primary font-black uppercase">{apt.time.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate">{apt.name}</h4>
                  <p className="text-[10px] text-gray-500 truncate">{apt.service}</p>
                  <div className={`mt-1 inline-block px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${apt.color}`}>
                    {apt.status}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-white border border-primary/20 hover:bg-primary rounded-xl transition-all duration-300 shrink-0">
            Expand Schedule
          </button>
        </div>

      </div>

      {/* Insights Row - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 shrink-0">
        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 flex items-center justify-between bg-gradient-to-r from-primary/10 to-transparent border-primary/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg"><Star className="text-primary" size={18} /></div>
            <div>
              <h3 className="text-sm font-black text-white">Top Performer</h3>
              <p className="text-[10px] text-gray-400 font-medium">Haircut + Beard Deluxe</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white">18</div>
            <p className="text-[8px] text-primary font-black uppercase tracking-tighter">Units Today</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -2 }}
          className="glass-card p-4 flex items-center justify-between bg-gradient-to-r from-blue-500/10 to-transparent border-blue-500/10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg"><Users className="text-blue-400" size={18} /></div>
            <div>
              <h3 className="text-sm font-black text-white">Retention Index</h3>
              <p className="text-[10px] text-gray-400 font-medium">Customer return rate</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white">68%</div>
            <p className="text-[8px] text-blue-400 font-black uppercase tracking-tighter">+12% Gain</p>
          </div>
        </motion.div>
      </div>
      
    </div>
  );
};

export default Dashboard;
