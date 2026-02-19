import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, ShoppingBag, PlusCircle, Package, LogOut, User } from "lucide-react";

const ManagerLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menu = [
    { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "POS Billing", path: "/manager/pos", icon: <ShoppingBag size={20}/> },
    { name: "Add Product", path: "/manager/add-product", icon: <PlusCircle size={20}/> },
    { name: "All Products", path: "/manager/products", icon: <Package size={20}/> },
    { name: "My Profile", path: "/manager/profile", icon: <User size={20}/> },
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Manager Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-5 flex flex-col">
        <h1 className="text-xl font-black italic mb-10 text-center">MANAGER PANEL</h1>
        <nav className="flex-1 space-y-2">
          {menu.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-lg font-bold">
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 font-bold hover:bg-red-500/10 rounded-lg">
          <LogOut size={20}/> Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-10 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;