import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import {
  Search,
  Trash2,
  Printer,
  ShoppingCart,
  User,
  Phone,
  Tag,
} from "lucide-react";
import Swal from "sweetalert2";
import { useReactToPrint } from "react-to-print";

const ManagerPOS = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [cart, setCart] = useState([]);
  const [customer, setCustomer] = useState({ name: "", phone: "" });
  const [manualDiscount, setManualDiscount] = useState(0); // ম্যানুয়াল ডিসকাউন্ট স্টেট
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const searchInputRef = useRef(null);
  const componentRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  const generateInvoiceNumber = () => {
    return `POS${Date.now().toString().slice(-6)}`;
  };

  useEffect(() => {
    setInvoiceNumber(generateInvoiceNumber());
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${invoiceNumber}`,
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const res = await axios.get(
            `http://localhost:5000/api/pos/search-product?query=${query}`,
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

  const addToCart = (product) => {
    if (product.stock <= 0) {
      Swal.fire("Out of Stock", `${product.name} is unavailable`, "warning");
      return;
    }
    
    // প্রোডাক্টে ডিসকাউন্ট থাকলে সেই প্রাইস ক্যালকুলেট করা
    const hasDiscount = product.discount && product.discount > 0;
    const finalPrice = hasDiscount 
        ? Math.round(product.price - (product.price * product.discount / 100)) 
        : product.price;

    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        Swal.fire("Stock Limit", "No more stock available!", "warning");
        return;
      }
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, finalPrice, quantity: 1 }]);
    }
    setQuery("");
    setSearchResults([]);
    searchInputRef.current.focus();
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  // সাবটোটাল (প্রোডাক্ট ডিসকাউন্ট সহ কিন্তু ম্যানুয়াল ডিসকাউন্ট বাদে)
  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.finalPrice * item.quantity, 0);
  }, [cart]);

  // ফাইনাল পেয়েবল (সাবটোটাল - ম্যানুয়াল ডিসকাউন্ট)
  const netPayable = useMemo(() => {
    const total = subtotal - Number(manualDiscount);
    return total > 0 ? total : 0;
  }, [subtotal, manualDiscount]);

  const handleCheckout = async () => {
    if (cart.length === 0)
      return Swal.fire("Empty Cart", "Please Add Product!", "warning");
    if (!customer.phone)
      return Swal.fire("Phone Required", "Enter Customer Mobile Number", "warning");

    try {
      const payload = {
        items: cart.map((item) => ({
          _id: item._id,
          name: item.name,
          quantity: Number(item.quantity),
          price: Number(item.finalPrice), // ডিসকাউন্টেড প্রাইস যাচ্ছে
          originalPrice: Number(item.price),
          images: item.images
        })),
        customerName: customer.name || "Walk-in Guest",
        customerPhone: customer.phone,
        subtotal: subtotal,
        manualDiscount: Number(manualDiscount),
        totalAmount: netPayable,
      };

      const res = await axios.post("http://localhost:5000/api/pos/create-bill", payload);

      if (res.data.success) {
        await Swal.fire({ icon: "success", title: "Bill Created!", timer: 800, showConfirmButton: false });

        const printContent = componentRef.current.innerHTML;
        const printWindow = window.open("", "_blank", "width=800,height=600");
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Invoice</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                @page { size: 80mm auto; margin: 0; }
                body { font-family: 'Courier New', monospace; display: flex; justify-content: center; }
                .receipt-container { width: 80mm; padding: 10px; background: white; }
              </style>
            </head>
            <body>
              <div class="receipt-container">${printContent}</div>
              <script>
                setTimeout(() => { window.print(); window.close(); }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();

        setCart([]);
        setCustomer({ name: "", phone: "" });
        setManualDiscount(0);
        setInvoiceNumber(`POS${Date.now().toString().slice(-6)}`);
      }
    } catch (err) {
      console.error("Checkout Error:", err);
      Swal.fire("Error", "Check-out failed", "error");
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2 text-slate-800">
            <ShoppingCart className="text-blue-600" /> POS SYSTEM
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Operator: {user?.name || "Cashier"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400">INVOICE NO</p>
          <p className="font-black text-blue-600">#{invoiceNumber}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Search & Cart */}
        <div className="flex-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-slate-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              className="w-full pl-12 pr-4 py-4 bg-white shadow-sm rounded-2xl outline-none font-bold"
              placeholder="Search Product..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searchResults.length > 0 && (
              <div className="absolute w-full bg-white shadow-2xl rounded-2xl mt-2 z-50 border border-slate-100 overflow-hidden">
                {searchResults.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => addToCart(p)}
                    className="p-4 hover:bg-blue-600 hover:text-white cursor-pointer transition-all flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                        <span className="font-bold">{p.name}</span>
                        {p.discount > 0 && <span className="text-[10px] bg-rose-500 text-white w-fit px-1">{p.discount}% OFF</span>}
                    </div>
                    <span className="font-black">৳{p.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
            <table className="w-full text-left">
              <thead className="bg-slate-50">
                <tr className="text-[11px] uppercase font-black text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4 text-center">Price</th>
                  <th className="px-6 py-4 text-center">Qty</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {cart.map((item) => (
                  <tr key={item._id} className="font-bold text-slate-700">
                    <td className="px-6 py-4 text-sm uppercase">
                        {item.name}
                        {item.discount > 0 && <p className="text-[9px] text-rose-500 italic">(-{item.discount}%)</p>}
                    </td>
                    <td className="px-6 py-4 text-center">৳{item.finalPrice}</td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right italic">৳{item.finalPrice * item.quantity}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => removeFromCart(item._id)} className="text-rose-500 p-2"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Customer & Checkout */}
        <div className="w-full lg:w-96">
          <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl">
            <h3 className="font-black uppercase text-slate-400 text-[10px] tracking-[3px] mb-6">Customer Details</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                className="w-full bg-slate-800 rounded-xl py-3 px-4 text-white outline-none"
                placeholder="Customer Name"
                value={customer.name}
                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              />
              <input
                type="text"
                className="w-full bg-slate-800 rounded-xl py-3 px-4 text-white outline-none"
                placeholder="Customer Phone"
                value={customer.phone}
                onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>

            <h3 className="font-black uppercase text-slate-400 text-[10px] tracking-[3px] mb-4">Discount (Flat)</h3>
            <div className="relative mb-8">
                <Tag size={16} className="absolute left-4 top-3.5 text-slate-500" />
                <input
                    type="number"
                    className="w-full bg-slate-800 rounded-xl py-3 pl-10 pr-4 text-emerald-400 font-bold outline-none"
                    placeholder="Enter Discount Amount"
                    value={manualDiscount}
                    onChange={(e) => setManualDiscount(e.target.value)}
                />
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-2 mb-8">
              <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
                <span>Subtotal</span>
                <span>৳{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-rose-400 text-xs font-bold uppercase">
                <span>Discount</span>
                <span>-৳{manualDiscount || 0}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-slate-400 font-bold text-xs uppercase">Net Payable</span>
                <span className="text-4xl font-black text-emerald-400 italic">৳{netPayable}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-500 flex items-center justify-center gap-3 active:scale-95 transition-all"
            >
              <Printer size={22} /> Generate & PRINT
            </button>
          </div>
        </div>
      </div>

      {/* ✅ প্রিন্ট সেকশন */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={componentRef} className="p-4 text-black bg-white w-[80mm] font-mono">
          <div className="text-center mb-4">
            <h1 className="text-xl font-bold uppercase">ONE POINT PLUS</h1>
            <p className="text-[10px]">Sector-07, Uttara, Dhaka</p>
            <div className="border-b border-black border-dashed my-2"></div>
            <p className="text-[12px] font-bold">SALES RECEIPT</p>
          </div>

          <div className="mb-2 space-y-1 text-[10px]">
            <div className="flex justify-between"><span>Inv: #{invoiceNumber}</span><span>Date: {new Date().toLocaleDateString()}</span></div>
            <p>Cashier: {user?.name || "Admin"}</p>
            <div className="border-b border-black border-dotted my-1"></div>
            <p>Customer: {customer.name || "Walk-in"}</p>
            <p>Phone: {customer.phone || "N/A"}</p>
          </div>

          <div className="border-t border-b border-black border-dashed py-2 my-2">
            {cart.map((item, i) => (
              <div key={i} className="mb-2 text-[10px]">
                <p className="uppercase font-bold">{item.name}</p>
                <div className="flex justify-between">
                  <span>{item.quantity} x {item.finalPrice}</span>
                  <span>৳{item.finalPrice * item.quantity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-1 text-[11px] font-bold">
             <div className="flex justify-between"><span>SUBTOTAL</span><span>৳{subtotal}.00</span></div>
             {manualDiscount > 0 && <div className="flex justify-between text-rose-600"><span>DISCOUNT</span><span>-৳{manualDiscount}.00</span></div>}
             <div className="flex justify-between text-[14px] font-black border-t border-black border-double pt-1">
                <span>GRAND TOTAL</span><span>৳{netPayable}.00</span>
             </div>
          </div>

          <div className="mt-6 text-center pt-4 border-t border-black border-dashed">
            <p className="text-[11px] font-bold uppercase">Thank You!</p>
            <p className="text-[9px] mt-1 italic">Software by: OnePointPlus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPOS;