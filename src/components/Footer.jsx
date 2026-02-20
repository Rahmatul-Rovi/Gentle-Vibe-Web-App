import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">ONE POINT PLUS</h2>
            <p className="text-gray-400 text-sm leading-relaxed uppercase tracking-wider">
              Elevating streetwear through minimalism and quality craftsmanship. Designed for those who move in silence.
            </p>
            <div className="flex gap-5">
              <a href="#" className="hover:text-gray-400 transition-all"><Instagram size={20} /></a>
              <a href="#" className="hover:text-gray-400 transition-all"><Facebook size={20} /></a>
              <a href="#" className="hover:text-gray-400 transition-all"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-gray-500">Shop</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
              <li><Link to="/shop" className="hover:pl-2 transition-all duration-300">All Collections</Link></li>
              <li><Link to="/collections/mens" className="hover:pl-2 transition-all duration-300">Menswear</Link></li>
              <li><Link to="/collections/womens" className="hover:pl-2 transition-all duration-300">Womenswear</Link></li>
              <li><Link to="/collections/new-arrival" className="hover:pl-2 transition-all duration-300">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-gray-500">Support</h4>
            <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
              <li><Link to="" className="hover:pl-2 transition-all duration-300">Contact Us</Link></li>
              <li><Link to="" className="hover:pl-2 transition-all duration-300">Shipping Policy</Link></li>
              <li><Link to="" className="hover:pl-2 transition-all duration-300">Returns & Exchanges</Link></li>
              <li><Link to="" className="hover:pl-2 transition-all duration-300">FAQs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-gray-500">Find Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-white" />
                <span>City Centre, Ground Floor Aurangzeb Road, Pabna</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-white" />
                <span>01719456261</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-white" />
                <span>support@onepointplus.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
          <p>© 2026 ONE POINT PLUS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;