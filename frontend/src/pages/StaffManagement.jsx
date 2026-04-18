import React, { useState } from 'react';
import { Settings, UserPlus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const StaffManagement = ({ users, setUsers }) => {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const staffList = users.filter(u => u.role === 'staff');

  const handleAddStaff = (e) => {
    e.preventDefault();
    if (newEmail && newPassword) {
      const newUser = {
        id: Date.now(),
        email: newEmail,
        password: newPassword,
        role: 'staff'
      };
      setUsers([...users, newUser]);
      setNewEmail('');
      setNewPassword('');
    }
  };

  const handleRemoveStaff = (id) => {
    setUsers(users.filter(u => u.id !== id || u.role === 'admin')); // Prevent deleting admin
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Staff Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">Add or remove staff logins</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Add new Staff */}
        <div className="glass-card p-6 lg:col-span-1 border-primary/20 bg-primary/5">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="text-primary" size={24} /> Add Login
          </h2>
          <form onSubmit={handleAddStaff} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Staff Email ID</label>
              <input
                type="text"
                placeholder="staff_name@vv.com"
                className="glass-input w-full"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Password</label>
              <input
                type="text"
                placeholder="Create a strong password"
                className="glass-input w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full py-3 mt-4">
              Add Staff Credentials
            </button>
          </form>
        </div>

        {/* Right Column: List of existing Staff */}
        <div className="glass-card p-6 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-white/10 pb-4">
            <Settings className="text-primary" size={24} /> Active Staff Access
          </h2>
          
          <div className="space-y-3">
            {staffList.map((staff, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={staff.id} 
                className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div>
                  <h3 className="font-bold text-white text-lg">{staff.email}</h3>
                  <p className="text-sm text-gray-400 font-mono mt-1">Pass: {staff.password}</p>
                </div>
                <button 
                  onClick={() => handleRemoveStaff(staff.id)}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors shadow-none hover:shadow-lg hover:shadow-red-500/50"
                  title="Revoke Access"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}

            {staffList.length === 0 && (
              <div className="text-center p-8 text-gray-500 border border-dashed border-gray-600 rounded-xl">
                No staff logins created yet. Create one from the left panel.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffManagement;
