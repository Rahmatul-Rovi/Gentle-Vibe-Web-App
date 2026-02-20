import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { Search, Trash2, Printer, ShoppingCart, User, Phone } from "lucide-react";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";

const ManagerPOS = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const searchInputRef = useRef(null);
  const componentRef = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Stable Invoice Generator
  const generateInvoiceNumber = () => {
    return `POS${Date.now().toString().slice(-6)}`;
  };

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  // ✅ প্রিন্টিং সেটআপ
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // নতুন ভার্সনে এটি contentRef হিসেবে কাজ করে
    documentTitle: `Invoice_${invoiceNumber}`,
    onAfterPrint: () => {
      // প্রিন্ট হয়ে গেলে সব রিসেট হবে
      setCart([]);
      setCustomer({ name: "", phone: "" });
      setInvoiceNumber(generateInvoiceNumber());
    }
  });

  // ✅ ডিবউন্স সার্চ (Debounced Search)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/pos/search-product?query=${query}`
          );
          setSearchResults(res.data);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // ✅ কার্টে অ্যাড করা (Stock Safety সহ)
  const addToCart = (product) => {
    if (product.stock <= 0) {
      Swal.fire("Out of Stock", `${product.name} is unavailable`, "warning");
      return;
    }

    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        Swal.fire("Stock Limit", "No more stock available!", "warning");
        return;
      }
      setCart(cart.map((item) =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    setQuery("");
    setSearchResults([]);
    searchInputRef.current.focus();
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // ✅ মোট টাকা হিসাব (Total Amount)
  const totalAmount = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // ✅ চেকআউট হ্যান্ডলার
  const handleCheckout = async () => {
    if (cart.length === 0) return Swal.fire("Empty Cart", "Add some products first!", "warning");
    if (!customer.phone) return Swal.fire("Phone Required", "Enter customer phone number", "warning");

    try {
      // ১. ডাটাবেজে বিল সেভ করা
      const res = await axios.post("http://localhost:5000/api/pos/create-bill", {
        items: cart,
        customerName: customer.name || "Walk-in Guest",
        customerPhone: customer.phone,
        totalAmount: Number(totalAmount),
        managerId: user?.id || "Manager-01",
        invoiceNumber,
        isPOS: true, // এটি ড্যাশবোর্ডে ডাটা দেখানোর জন্য মাস্ট
        paymentStatus: "Paid" // সরাসরি পেইড হিসেবে গণ্য হবে
      });

      if (res.data.success) {
        // ২. প্রিন্ট ট্রিগার করা
        handlePrint();

        // ৩. সাকসেস মেসেজ
        await Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: "Invoice Generated & Stock Updated",
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to create bill", "error");
    }
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
          <ShoppingCart className="text-blue-600" /> POS Terminal
        </h1>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
          Manager: {user?.name || "Shop Manager"}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* LEFT SIDE: Search & Cart */}
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
                    <span className="bg-slate-200 text-black px-2 py-1 rounded-md text-xs font-black">
                      ৳{p.price}
                    </span>
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
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="font-bold text-slate-700 border-b border-slate-50 last:border-0">
                    <td className="px-6 py-4 text-sm">{item.name}</td>
                    <td className="px-6 py-4 text-sm">৳{item.price}</td>
                    <td className="px-6 py-4 text-sm">{item.quantity}</td>
                    <td className="px-6 py-4 text-right font-black italic">
                      ৳{item.price * item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT SIDE: Summary */}
        <div className="w-full lg:w-96">
          <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl sticky top-6">
            <h3 className="font-black uppercase text-slate-400 text-xs tracking-[3px] mb-6">
              Checkout Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">Customer Name</label>
                <div className="relative mt-1">
                  <User size={14} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full bg-slate-800 rounded-xl py-3 pl-10 pr-4 text-white font-bold outline-none ring-1 ring-slate-700 focus:ring-white"
                    placeholder="Walk-in Guest"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400">Phone Number *</label>
                <div className="relative mt-1">
                  <Phone size={14} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full bg-slate-800 rounded-xl py-3 pl-10 pr-4 text-white font-bold outline-none ring-1 ring-slate-700 focus:ring-white"
                    placeholder="017xxxxxxxx"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6 mb-8">
              <div className="flex justify-between items-center text-3xl font-black italic tracking-tighter">
                <span>TOTAL</span>
                <span className="text-emerald-400">৳{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
            >
              <Printer size={20} /> GENERATE & PRINT
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Hidden Print Section (Invoice Design) */}
      <div style={{ display: "none" }}>
        <div ref={componentRef} className="p-10 text-black bg-white w-[80mm] mx-auto font-sans">
          <div className="text-center border-b-2 border-dashed border-black pb-4 mb-4">
            <h1 className="text-xl font-black uppercase tracking-widest">ONE POINT PLUS</h1>
            <p className="text-[10px] mt-1 font-bold">POS TRANSACTION INVOICE</p>
          </div>

          <div className="flex justify-between text-[10px] mb-4 font-bold">
            <span>INV: #{invoiceNumber}</span>
            <span>{new Date().toLocaleString()}</span>
          </div>

          <div className="mb-4 text-[10px] font-bold">
            <p>Customer: {customer.name || "Walk-in Guest"}</p>
            <p>Phone: {customer.phone || "N/A"}</p>
          </div>

          <table className="w-full text-[10px] border-b border-dashed border-black mb-4">
            <thead>
              <tr className="border-b border-black">
                <th className="text-left pb-1">ITEM</th>
                <th className="text-center pb-1">QTY</th>
                <th className="text-right pb-1">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i} className="font-medium">
                  <td className="py-1 uppercase">{item.name}</td>
                  <td className="text-center py-1">{item.quantity}</td>
                  <td className="text-right py-1">৳{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right font-black text-sm">
            TOTAL AMOUNT: ৳{totalAmount}
          </div>

          <div className="mt-6 text-center text-[8px] font-bold border-t border-dashed border-black pt-4">
            <p>THANK YOU FOR YOUR BUSINESS!</p>
            <p className="mt-1 uppercase tracking-widest">Managed by: {user?.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPOS;