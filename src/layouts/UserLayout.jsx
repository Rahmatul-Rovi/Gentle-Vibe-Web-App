import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    User, 
    ShoppingBag, 
    LogOut, 
    Menu, 
    ArrowLeft 
} from 'lucide-react';

const UserLayout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { name: 'Dashboard', path: '/user', icon: <LayoutDashboard size={18} /> },
        { name: 'Profile', path: '/user/profile', icon: <User size={18} /> },
        { name: 'Orders', path: '/user/orders', icon: <ShoppingBag size={18} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex">
            {/* Mobile Toggle Button */}
            <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden fixed bottom-6 right-6 z-50 bg-black text-white p-4 rounded-full shadow-2xl"
            >
                <Menu size={24} />
            </button>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#0A0A0A] text-white z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-500 ease-in-out border-r border-white/5 flex flex-col`}>
               
                {/* Logo Section */}
                <Link to="/">
                    <div className="p-10">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Gentle Vibe</h2>
                        <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] mt-2 font-bold">User Dashboard</p>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                                location.pathname === item.path 
                                ? 'bg-white text-black shadow-[0_10px_20px_rgba(255,255,255,0.1)]' 
                                : 'text-gray-500 hover:text-white hover:bg-white/5'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                    
                    <div className="my-6 border-t border-white/5"></div>

                    {/* --- BACK TO SHOP (UPPER POSITION) --- */}
                    <Link 
                        to="/" 
                        className="flex items-center gap-4 px-5 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                        <ArrowLeft size={18} />
                        Back to Shop
                    </Link>

                    {/* Logout Button */}
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-5 py-4 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </nav>

                {/* Footer credit or version (Optional) */}
                <div className="p-10 opacity-20">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em]">v.2.0.26</p>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-72 transition-all duration-300">
                <header className="bg-white border-b border-gray-100 py-6 px-10 flex justify-between items-center sticky top-0 z-30">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Management /</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-black">
                            {location.pathname.split('/').pop() || 'Dashboard'}
                        </span>
                    </div>
                </header>

                <div className="p-10 max-w-6xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default UserLayout;