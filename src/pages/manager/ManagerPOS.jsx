import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Trash2, Printer, User, Phone, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";

const ManagerPOS = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const searchInputRef = useRef(null);
  
  // লোকাল স্টোরেজ থেকে ম্যানেজার ইনফো নেওয়া
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        // প্রোডাক্ট সার্চ এপিআই
        const res = await axios.get(`http://localhost:5000/api/pos/search-product?query=${query}`);
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const addToCart = (product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(cart.map((item) => item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setQuery("");
    setSearchResults([]);
    searchInputRef.current.focus();
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item._id !== id));
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return Swal.fire("Empty Cart", "Add some products first!", "warning");

    try {
      const res = await axios.post("http://localhost:5000/api/pos/create-bill", {
        items: cart,
        customerName: customer.name,
        customerPhone: customer.phone,
        totalAmount,
        managerId: user?._id || "Manager-01" // ডাইনামিক আইডি
      });

      if (res.data.success) {
        Swal.fire("Success!", "Bill Generated", "success").then(() => {
          window.print(); 
          setCart([]);
          setCustomer({ name: "", phone: "" });
        });
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create bill", "error");
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
       <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <ShoppingCart className="text-blue-600" /> POS Terminal
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Manager: {user?.name || "Shop Manager"}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Search & Cart */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-slate-100 rounded-2xl focus:ring-2 ring-black outline-none font-bold"
              placeholder="Scan Barcode or Type Product Name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute w-full bg-white shadow-2xl rounded-2xl mt-2 z-50 border border-slate-100 overflow-hidden">
                {searchResults.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="p-4 hover:bg-black hover:text-white cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div>
                        <p className="font-bold">{p.name}</p>
                        <p className="text-xs opacity-60">Stock: {p.stock} pcs</p>
                    </div>
                    <span className="bg-slate-200 text-black px-2 py-1 rounded-md text-xs font-black">৳{p.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-[10px] uppercase font-black text-slate-400 tracking-widest">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cart.map((item) => (
                  <tr key={item._id} className="font-bold text-slate-700">
                    <td className="px-6 py-4 text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-sm">৳{item.price}</td>
                    <td className="px-6 py-4 text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-black font-black">৳{item.price * item.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => removeFromCart(item._id)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Billing */}
        <div className="w-full lg:w-96">
          <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl sticky top-6">
            <h3 className="font-black uppercase text-slate-400 text-xs tracking-[3px] mb-6">Checkout Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Customer Name</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white font-bold outline-none ring-1 ring-slate-700 focus:ring-white"
                  placeholder="Guest Customer"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500">Phone Number</label>
                <input
                  type="text"
                  className="w-full bg-slate-800 border-none rounded-xl py-3 px-4 text-white font-bold outline-none ring-1 ring-slate-700 focus:ring-white"
                  placeholder="017xxxxxxxx"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 mb-8">
              <div className="flex justify-between items-center mb-2 text-slate-400 font-bold uppercase text-xs">
                <span>Subtotal</span>
                <span>৳{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-3xl font-black italic tracking-tighter">
                <span>TOTAL</span>
                <span className="text-emerald-400">৳{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Printer size={20} /> PRINT INVOICE
            </button>
          </div>
        </div>
      </div>

      {/* প্রিন্ট মেমো */}
      <div id="printable-memo" className="hidden print:block p-8 text-black bg-white">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase tracking-tighter">GENTLE VIBE CLOTHING</h1>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Premium Lifestyle Store</p>
          <p className="text-[10px] mt-1 italic">Dhaka, Bangladesh | +880123456789</p>
        </div>
        
        <div className="flex justify-between text-[10px] font-bold border-y border-black py-2 mb-4">
          <span>INV: #{Math.floor(Math.random() * 90000) + 10000}</span>
          <span>DATE: {new Date().toLocaleString()}</span>
        </div>

        <div className="text-[10px] mb-4">
          <p className="font-black">CUSTOMER: <span className="font-normal">{customer.name || "WALK-IN GUEST"}</span></p>
          <p className="font-black">PHONE: <span className="font-normal">{customer.phone || "N/A"}</span></p>
        </div>

        <table className="w-full text-[10px] mb-6">
          <thead>
            <tr className="border-b border-black text-left font-black">
              <th className="py-1">ITEM</th>
              <th className="py-1 text-center">QTY</th>
              <th className="py-1 text-right">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id} className="border-b border-dotted border-slate-300">
                <td className="py-2 uppercase font-bold">{item.name}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right font-black">৳{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right space-y-1">
          <p className="text-[12px] font-black italic">NET PAYABLE: ৳{totalAmount}</p>
        </div>

        <div className="text-center mt-10 border-t border-black pt-4">
          <p className="text-[8px] font-black uppercase">--- Thanks for shopping with us ---</p>
          <p className="text-[7px] mt-1">Software by Gentle Vibe IT</p>
        </div>
      </div>
    </div>
  );
};

export default ManagerPOS;