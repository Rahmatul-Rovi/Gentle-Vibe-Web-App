import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, LogOut } from 'lucide-react';
import { AuthContext } from '../providers/AuthProvider';
import { useCart } from '../context/CartContext'; // 1. Cart hook import koro

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const { cart } = useCart(); // 2. Cart data nao

  // 3. Total items calculation
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogOut = () => {
    logOut()
      .then(() => alert("Logged Out!"))
      .catch(err => console.log(err));
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="navbar h-20 p-0">
          
          {/* Mobile Menu & Logo */}
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden p-0 mr-2">
                <Menu size={24} />
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-xl bg-white rounded-none w-64 uppercase font-medium tracking-wider gap-2">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/collections">Collections</Link></li>
                <li><Link to="/mens">Mens</Link></li>
                <li><Link to="/womens">Womens</Link></li>
              </ul>
            </div>
            <Link to="/" className="text-2xl font-black tracking-tighter cursor-pointer">
              GENTLE VIBE
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex items-center gap-8">
              <li><Link to="/" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Home</Link></li>
              <li><Link to="/collections" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Collections</Link></li>
              <li><Link to="/mens" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Mens</Link></li>
              <li><Link to="/womens" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">Womens</Link></li>
              <li><Link to="/new-arrival" className="text-[13px] font-bold uppercase tracking-widest hover:text-gray-500 transition-colors">New Arrival</Link></li>
            </ul>
          </div>

          {/* Action Icons Section */}
          <div className="navbar-end gap-2 md:gap-5">
            <button className="p-2 hover:bg-gray-50 rounded-full transition-all hidden sm:block">
              <Search size={20} strokeWidth={1.5} />
            </button>
            
            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar border border-gray-100">
                  <div className="w-8 rounded-full">
                    <img src={user?.photoURL || "https://i.ibb.co/mJR9hS1/user.png"} alt="profile" />
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-4 shadow-2xl menu menu-sm dropdown-content bg-white rounded-none w-52 border border-gray-50">
                  <li className="mb-2 px-2 py-1">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Account</span>
                    <p className="font-bold text-xs truncate">{user?.displayName || "Gentle User"}</p>
                  </li>
                  <hr className="border-gray-50 my-1" />
                  <li><Link to="/user/profile" className="text-xs uppercase font-bold py-3">Dashboard</Link></li>
                  <li>
                    <button onClick={handleLogOut} className="text-xs uppercase font-bold py-3 text-red-500">
                      <LogOut size={14} /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-2 hover:text-gray-500 transition-all">
                <User size={20} strokeWidth={1.5} />
                <span className="text-[12px] font-bold uppercase hidden md:block tracking-wider">Login</span>
              </Link>
            )}

            {/* Shopping Bag - Now Dynamic! */}
            <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-all relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute top-1 right-1 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;