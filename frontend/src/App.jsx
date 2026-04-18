import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Billing from './pages/Billing';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Reports from './pages/Reports';
import StaffManagement from './pages/StaffManagement';
import Marketing from './pages/Marketing';

const defaultUsers = [
  { id: 1, email: 'admin@vv.com', password: 'admin', role: 'admin' },
  { id: 2, email: 'staff@vv.com', password: 'staff', role: 'staff' }
];

function App() {
  const [users, setUsers] = useState(defaultUsers);
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Routes>
      <Route path="/login" element={<Login users={users} onLogin={(user) => setCurrentUser(user)} />} />
      
      {/* Protected Routes wrapped in Layout */}
      {currentUser ? (
        <Route path="/" element={<Layout currentUser={currentUser} onLogout={() => setCurrentUser(null)} />}>
          {currentUser.role === 'admin' ? (
            <>
              <Route index element={<Dashboard />} />
              <Route path="billing" element={<Billing />} />
              <Route path="customers" element={<Customers />} />
              <Route path="services" element={<Services />} />
              <Route path="reports" element={<Reports />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="staff" element={<StaffManagement users={users} setUsers={setUsers} />} />
            </>
          ) : (
            <>
              {/* Staff routes */}
              <Route index element={<Navigate to="/billing" replace />} />
              <Route path="billing" element={<Billing />} />
              <Route path="*" element={<Navigate to="/billing" replace />} />
            </>
          )}
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
}

export default App;
