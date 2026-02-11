import { Outlet, Link } from "react-router-dom";
import { LayoutDashboard, ShoppingCart, Users, Settings } from "lucide-react";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6">
        <h2 className="text-xl font-bold mb-10 tracking-tighter">GV PANEL</h2>
        <nav className="space-y-4">
          <Link to="/admin" className="flex items-center gap-3 hover:text-gray-400">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/orders" className="flex items-center gap-3 hover:text-gray-400">
            <ShoppingCart size={20} /> Orders
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 hover:text-gray-400">
            <Users size={20} /> Users
          </Link>
        </nav>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 p-10">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;