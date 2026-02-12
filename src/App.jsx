import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/AdminLayout";

// Pages
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerOrders from "./pages/manager/ManagerOrders";
// Notun Admin Pages
import AdminProfile from "./pages/admin/AdminProfile"; 
import MakeAdmin from "./pages/admin/MakeAdmin"; 
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. User & Public Routes */}
        <Route path="/" element={<MainLayout></MainLayout>}>
          <Route index element={<Home></Home>} /> 
          <Route path="login" element={<Login />} />
        </Route>

        {/* 2. Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<div className="p-4 font-bold uppercase">User Management</div>} />
          <Route path="profile" element={<AdminProfile />} /> {/* Admin Profile Route */}
          <Route path="make-admin" element={<MakeAdmin />} /> {/* Make Admin Route */}
          <Route path="settings" element={<div className="p-4 font-bold uppercase">Settings</div>} />
        </Route>

        {/* 3. Manager Routes */}
        <Route path="/manager" element={<AdminLayout />}>
          <Route index element={<ManagerOrders />} />
        </Route>

        {/* 4. 404 Route */}
        <Route path="*" element={<div className="h-screen flex items-center justify-center font-black uppercase tracking-widest">404 - Page Not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;