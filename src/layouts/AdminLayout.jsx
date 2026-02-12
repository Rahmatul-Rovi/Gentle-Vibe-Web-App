import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  PlusSquare,
  Shirt,
  Settings,
  ShieldCheck,
  User,
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  // Active link check korar jonno ekta chotto function
  const isActive = (path) =>
    location.pathname === path
      ? "text-white bg-gray-900"
      : "text-gray-400 hover:text-white";

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-6 sticky top-0 h-screen">
        <div className="mb-10">
          <h2 className="text-xl font-black tracking-tighter italic">
            GENTLE VIBE
          </h2>
          <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase">
            Admin Panel
          </p>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin")}`}
          >
            <LayoutDashboard size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Dashboard
            </span>
          </Link>

          {/* --- ADD PRODUCT LINK --- */}
          <Link
            to="/admin/add-product"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/add-product")}`}
          >
            <PlusSquare size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Add Product
            </span>
          </Link>

          <Link
            to="/admin/all-products"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/all-products")}`}
          >
            <Shirt size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Products
            </span>
          </Link>

          <Link
            to="/admin/orders"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/orders")}`}
          >
            <ShoppingCart size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Orders
            </span>
          </Link>

          <Link
            to="/admin/users"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/users")}`}
          >
            <Users size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Users
            </span>
          </Link>

          <Link
            to="/admin/make-admin"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/make-admin")}`}
          >
            <ShieldCheck size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Make Admin
            </span>
          </Link>

          <Link
            to="/admin/profile"
            className={`flex items-center gap-3 p-3 rounded-none transition-all ${isActive("/admin/profile")}`}
          >
            <User size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">
              Profile
            </span>
          </Link>

          <div className="pt-10 border-t border-gray-800 mt-10">
            <Link
              to="/"
              className="flex items-center gap-3 p-3 text-gray-500 hover:text-white transition-all"
            >
              <Settings size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">
                Back to Shop
              </span>
            </Link>
          </div>
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <h1 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
            Management / {location.pathname.split("/").pop()}
          </h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              System Online
            </span>
          </div>
        </header>
        <div className="p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
