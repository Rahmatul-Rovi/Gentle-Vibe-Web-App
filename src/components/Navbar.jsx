import React from 'react';
import { Search, ShoppingBag, User, Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="navbar h-20 p-0">
          
          {/* Logo Section */}
          <div className="navbar-start">
            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-none w-52 uppercase">
                <li><a>Home</a></li>
                <li><a>All Collections</a></li>
                <li><a>Mens</a></li>
                <li><a>Womens</a></li>
                <li><a>Kids</a></li>
              </ul>
            </div>
            <a className="text-2xl font-black tracking-tighter cursor-pointer">GENTLE VIBE</a>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-center hidden lg:flex">
            <ul className="flex items-center gap-8">
              <li><a className="nav-link">Home</a></li>
              <li><a className="nav-link">All Collections</a></li>
              <li><a className="nav-link">Mens</a></li>
              <li><a className="nav-link">Womens</a></li>
              <li><a className="nav-link">New Arrival</a></li>
            </ul>
          </div>

          {/* Icons Section */}
          <div className="navbar-end gap-2 md:gap-5">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all hidden md:block">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-all relative">
              <ShoppingBag size={20} strokeWidth={1.5} />
              <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Navbar;