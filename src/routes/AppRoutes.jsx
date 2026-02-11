import { Routes, Route } from "react-router-dom";
import Home from "../pages/user/Home";
import Login from "../pages/Login";
// Manager & Admin Pages (Pore banabo, ekhon just placeholder)
const ManagerDashboard = () => <div className="p-10">Manager Dashboard</div>;
const AdminDashboard = () => <div className="p-10 text-red-600">Admin Analytics Panel</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public & User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Manager Routes */}
      <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      
      {/* 404 Page */}
      <Route path="*" element={<h1 className="text-center py-20">404 - Not Found</h1>} />
    </Routes>
  );
};

export default AppRoutes;