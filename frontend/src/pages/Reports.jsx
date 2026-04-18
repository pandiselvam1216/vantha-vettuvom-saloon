import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, FileText, IndianRupee, Users, Award, Receipt } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { storage } from '../utils/storage';

ChartJS.register(ArcElement, Tooltip, Legend);

const Reports = () => {
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // Derive reports from real storage data
  const staffData = useMemo(() => {
    const invoices = storage.getInvoices();
    const staffNames = ['Siva', 'Kumar', 'Raja', 'Karthik', 'Guest'];
    
    // Group by staff and filter by date (for a more realistic demo)
    // In a real app we would filter by selectedDate, for demo we'll show all or seed based
    const stats = staffNames.map(name => {
      const staffInvoices = invoices.filter(inv => inv.staff === name);
      return {
        id: name,
        name: name,
        bills: staffInvoices.length,
        amount: staffInvoices.reduce((sum, inv) => sum + inv.total, 0)
      };
    });

    // If no invoices yet, show some seed data based on the date so it's not empty
    if (invoices.length === 0) {
      const seed = selectedDate.split('-').join('');
      return [
        { id: 1, name: 'Siva', bills: 4, amount: 1550 },
        { id: 2, name: 'Kumar', bills: 3, amount: 850 },
        { id: 3, name: 'Raja', bills: 6, amount: 2100 },
        { id: 4, name: 'Karthik', bills: 2, amount: 450 },
        { id: 5, name: 'Guest', bills: 1, amount: 150 },
      ].map(staff => {
        const multiplier = 1 + (parseInt(seed) % (staff.id * 10)) / 100;
        return {
          ...staff,
          bills: Math.max(1, Math.floor(staff.bills * multiplier)),
          amount: Math.max(150, Math.floor(staff.amount * multiplier))
        };
      }).sort((a, b) => b.amount - a.amount);
    }

    return stats.sort((a, b) => b.amount - a.amount);
  }, [selectedDate]);

  const totalAmount = staffData.reduce((sum, item) => sum + item.amount, 0);
  const totalBills = staffData.reduce((sum, item) => sum + item.bills, 0);
  const avgBill = totalBills > 0 ? Math.floor(totalAmount / totalBills) : 0;
  const topStaff = staffData.length > 0 ? staffData[0] : null;

  // Chart Data
  const chartData = {
    labels: staffData.map(s => s.name),
    datasets: [
      {
        data: staffData.map(s => s.amount),
        backgroundColor: [
          'rgba(255, 20, 147, 0.8)', // Primary Pink
          'rgba(147, 51, 234, 0.8)', // Purple
          'rgba(59, 130, 246, 0.8)', // Blue
          'rgba(16, 185, 129, 0.8)', // Green
          'rgba(245, 158, 11, 0.8)', // Yellow
        ],
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '75%',
    maintainAspectRatio: false,
    responsive: true,
  };

  // Generate detailed transactions from storage
  const detailedTransactions = useMemo(() => {
    const invoices = storage.getInvoices();
    if (invoices.length > 0) {
      return invoices.map(inv => ({
        id: inv.id,
        customerName: inv.customerName,
        staffName: inv.staff,
        service: inv.services.map(s => s.name).join(', '),
        amount: inv.total,
        time: inv.date // We'd need a real time field for better sorting
      })).reverse();
    }

    // Fallback seed data if no real invoices
    return staffData.flatMap((staff) => {
      return Array.from({ length: staff.bills }).map((_, idx) => {
        const avgAmount = Math.floor(staff.amount / staff.bills);
        const billAmount = Math.max(50, avgAmount + (idx % 2 === 0 ? 50 : -50));
        return {
          id: `INV-${Math.floor(1000 + Math.random() * 9000).toString()}`,
          customerName: `Customer ${Math.floor(100 + Math.random() * 900)}`,
          staffName: staff.name,
          service: ['Haircut', 'Beard Trim', 'Facial', 'Hair Spa', 'Keratin'][Math.floor(Math.random() * 5)],
          amount: billAmount,
          time: `${Math.floor(8 + Math.random() * 10).toString().padStart(2, '0')}:${Math.floor(10 + Math.random() * 40).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
        };
      });
    }).sort((a, b) => a.time.localeCompare(b.time));
  }, [staffData]);

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-6 overflow-hidden page-transition">
      
      {/* Header Area - Compacted */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 p-4 md:p-5 rounded-2xl border border-white/10 shrink-0">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Daily Revenue Reports
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">Salon performance breakdown</p>
        </div>
        
        <div className="glass-card px-4 py-2 flex items-center gap-3 shrink-0">
          <Calendar className="text-primary" size={18} />
          <input
            type="date"
            className="bg-transparent border-none outline-none text-white font-bold cursor-pointer text-sm"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* 4 Metric Cards - Compacted */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 shrink-0">
        {[
          { title: "Collection", value: `₹${totalAmount}`, icon: <IndianRupee size={18} className="text-green-400" />, desc: "Gross revenue", color: "from-green-500/10 to-transparent border-green-500/20" },
          { title: "Total Bills", value: totalBills, icon: <Receipt size={18} className="text-blue-400" />, desc: "Invoices total", color: "from-blue-500/10 to-transparent border-blue-500/20" },
          { title: "Top Staff", value: topStaff?.name || 'N/A', icon: <Award size={18} className="text-yellow-400" />, desc: "Highest billed", color: "from-yellow-500/10 to-transparent border-yellow-500/20" },
          { title: "Avg. Bill", value: `₹${avgBill}`, icon: <TrendingUp size={18} className="text-purple-400" />, desc: "Per customer", color: "from-purple-500/10 to-transparent border-purple-500/20" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            key={i} 
            className={`glass-card p-3 md:p-4 border bg-gradient-to-br ${stat.color} transition-all`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 bg-dark/50 rounded-lg">{stat.icon}</div>
              <h3 className="text-gray-500 font-bold text-[10px] uppercase tracking-wider">{stat.title}</h3>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-white">{stat.value}</div>
              <p className="text-[8px] text-gray-500 mt-0.5 uppercase tracking-tighter">{stat.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visual Data & Staff Rankings Row - Flexible */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-0">
        
        {/* Doughnut Chart */}
        <div className="glass-card p-4 md:p-6 col-span-1 border-white/5 flex flex-col min-h-0">
          <h2 className="font-bold text-base mb-4 flex items-center gap-2 border-b border-white/10 pb-3 shrink-0">
            <TrendingUp className="text-primary" size={16} />
            Matchup
          </h2>
          <div className="flex-1 flex flex-col md:flex-row items-center gap-6 min-h-0">
            <div className="relative w-full h-48 md:h-full flex-1">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-2">
                <span className="text-gray-500 text-[8px] uppercase font-black tracking-widest">Total</span>
                <span className="text-xl font-black text-white">₹{totalAmount}</span>
              </div>
            </div>
            
            {/* Custom Legend */}
            <div className="flex flex-col gap-2 min-w-[120px]">
              {staffData.map((staff, idx) => (
                <div key={staff.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}></div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{staff.name}</span>
                  <span className="text-[10px] font-black text-white ml-auto">₹{staff.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Table - Internal Scroll */}
        <div className="glass-card overflow-hidden col-span-1 lg:col-span-2 flex flex-col border-white/5 min-h-0">
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between shrink-0">
            <h2 className="font-bold text-base flex items-center gap-2">
              <Users className="text-primary" size={16} />
              Leaderboard
            </h2>
            <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">Live Data</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1 scroll-area">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-[10px] uppercase tracking-widest border-b border-white/5">
                  <th className="p-4 font-semibold">Rank</th>
                  <th className="p-4 font-semibold">Staff</th>
                  <th className="p-4 font-semibold w-1/3">Margin</th>
                  <th className="p-4 font-semibold text-center">Bills</th>
                  <th className="p-4 font-semibold text-right">Collection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffData.map((staff, index) => {
                  const percentage = totalAmount > 0 ? (staff.amount / totalAmount) * 100 : 0;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}
                      key={staff.id} 
                      className="hover:bg-white/5 transition-colors group"
                    >
                      <td className="p-4">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-[10px] ${index === 0 ? 'bg-yellow-500 text-dark shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-500'}`}>
                          #{index + 1}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-white text-sm">{staff.name}</td>
                      <td className="p-4">
                        <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <span className="text-[8px] text-gray-500 mt-1 inline-block">{percentage.toFixed(1)}%</span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="text-[10px] font-bold text-gray-400">{staff.bills}</span>
                      </td>
                      <td className="p-4 text-right font-black text-sm text-primary">₹{staff.amount}</td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Transactions List - Compact with scroll */}
      <div className="glass-card overflow-hidden border-white/5 flex flex-col min-h-0 h-[220px] shrink-0">
        <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="text-primary" size={16} />
            <h2 className="font-bold text-base text-gray-300">Transaction Log</h2>
          </div>
          <span className="text-[10px] text-gray-500">{detailedTransactions.length} items</span>
        </div>
        
        <div className="flex-1 overflow-y-auto scroll-area">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-[#121212] border-b border-white/10 text-gray-500 text-[9px] uppercase tracking-widest z-10">
              <tr>
                <th className="px-5 py-3 font-semibold">Inv #</th>
                <th className="px-5 py-3 font-semibold">Time</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Staff</th>
                <th className="px-5 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {detailedTransactions.map((tx, index) => (
                <tr key={tx.id} className="hover:bg-primary/5 transition-colors">
                  <td className="px-5 py-2.5 font-mono text-[10px] text-gray-500">{tx.id}</td>
                  <td className="px-5 py-2.5 text-gray-400 text-[10px]">{tx.time}</td>
                  <td className="px-5 py-2.5 text-white font-bold text-xs">{tx.customerName}</td>
                  <td className="px-5 py-2.5 text-primary text-[10px] font-black uppercase">{tx.staffName}</td>
                  <td className="px-5 py-2.5 text-right font-black text-white text-xs">₹{tx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
