import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Search, Trash2, Printer, User, Phone, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";

const POS = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const searchInputRef = useRef(null);

  // অটো ফোকাস ইনপুট (স্ক্যানারের জন্য)
  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  // রিয়েল টাইম সার্চ
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        const res = await axios.get(`http://localhost:5000/api/pos/search-product?query=${query}`);
        setSearchResults(res.data);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // কার্টে প্রোডাক্ট যোগ করা
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

  // প্রিন্ট এবং অর্ডার সাবমিট
  const handleCheckout = async () => {
    if (cart.length === 0) return Swal.fire("Empty Cart", "Add some products first!", "warning");

    try {
      const res = await axios.post("http://localhost:5000/api/pos/create-bill", {
        items: cart,
        customerName: customer.name,
        customerPhone: customer.phone,
        totalAmount,
        managerId: "Manager-01" // আপনি এখানে অরিজিনাল লগইন ইউজার আইডি দিতে পারেন
      });

      if (res.data.success) {
        Swal.fire("Success!", "Bill Generated", "success").then(() => {
          window.print(); // মেমো প্রিন্ট করার জন্য
          setCart([]);
          setCustomer({ name: "", phone: "" });
        });
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create bill", "error");
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen flex flex-col md:flex-row gap-6">
      {/* বাম পাশ: প্রোডাক্ট সার্চ ও সিলেকশন */}
      <div className="flex-1 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
            <ShoppingCart /> POS Terminal
          </h2>
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
            {/* সার্চ রেজাল্ট ড্রপডাউন */}
            {searchResults.length > 0 && (
              <div className="absolute w-full bg-white shadow-2xl rounded-2xl mt-2 z-50 border border-slate-100 overflow-hidden">
                {searchResults.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="p-4 hover:bg-black hover:text-white cursor-pointer transition-all flex justify-between items-center"
                  >
                    <span className="font-bold">{p.name}</span>
                    <span className="bg-slate-200 text-black px-2 py-1 rounded-md text-xs font-black">৳{p.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* কার্ট টেবিল */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs uppercase font-black text-slate-400">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Subtotal</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id} className="border-b border-slate-50 font-bold text-slate-700">
                  <td className="px-6 py-4">{item.name}</td>
                  <td className="px-6 py-4">৳{item.price}</td>
                  <td className="px-6 py-4">{item.quantity}</td>
                  <td className="px-6 py-4 text-black">৳{item.price * item.quantity}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => removeFromCart(item._id)} className="text-rose-500 hover:scale-110 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ডান পাশ: কাস্টমার এবং বিলিং */}
      <div className="w-full md:w-96 space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
          <h3 className="font-black uppercase text-slate-400 text-xs tracking-widest">Customer Details</h3>
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                placeholder="Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-slate-400" size={16} />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                placeholder="Phone Number"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
          </div>
          <hr />
          <div className="flex justify-between items-center text-2xl font-black italic">
            <span>TOTAL:</span>
            <span>৳{totalAmount}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <Printer /> GENERATE BILL
          </button>
        </div>
      </div>

      {/* প্রিন্ট টেমপ্লেট (এটি স্ক্রিনে দেখাবে না, শুধু প্রিন্টে আসবে) */}
      <div id="printable-memo" className="hidden print:block p-10 text-black">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black uppercase">GENTLE VIBE CLOTHING</h1>
          <p className="text-sm">Dhaka, Bangladesh | +880123456789</p>
          <p className="text-xs uppercase tracking-widest mt-1">Official Invoice</p>
        </div>
        <hr className="border-black mb-4" />
        <div className="flex justify-between text-sm mb-4">
          <span>Customer: {customer.name || "Walk-in Guest"}</span>
          <span>Date: {new Date().toLocaleDateString()}</span>
        </div>
        <table className="w-full text-left text-sm mb-6">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2">Item</th>
              <th className="py-2">Price</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item._id} className="border-b border-dotted border-slate-400">
                <td className="py-2">{item.name}</td>
                <td className="py-2">৳{item.price}</td>
                <td className="py-2">{item.quantity}</td>
                <td className="py-2 text-right">৳{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-right text-xl font-black italic">
          TOTAL AMOUNT: ৳{totalAmount}
        </div>
        <div className="text-center mt-10">
          <p className="text-xs font-bold">--- THANK YOU FOR SHOPPING WITH GENTLE VIBE ---</p>
        </div>
      </div>
    </div>
  );
};

export default POS;