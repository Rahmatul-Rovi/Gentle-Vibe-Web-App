import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TrendingUp, Clock, Eye, X, ReceiptText, RefreshCcw, User, Phone, CheckCircle2 } from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [posOrders, setPosOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ ডাটা ফেচিং ফাংশন (অপ্টিমাইজড)
  const fetchOfflineData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setIsRefreshing(true);

      const res = await axios.get("http://localhost:5000/api/admin/orders");

      // ১. শুধুমাত্র POS বা Offline অর্ডারগুলো ফিল্টার করা
      // এখানে ensures করা হয়েছে যে order.isPOS true অথবা status 'Paid'
      const offlineOnly = res.data.filter(order => order.isPOS === true);

      // ২. রেভিনিউ ক্যালকুলেশন (Number নিশ্চিত করা হয়েছে)
      const revenue = offlineOnly.reduce(
        (sum, order) => sum + (Number(order.totalAmount) || 0),
        0
      );

      setStats({
        totalOrders: offlineOnly.length,
        totalRevenue: revenue,
      });

      // ৩. লেটেস্ট ট্রানজ্যাকশন সবার উপরে রাখা (Sorting)
      const sortedOrders = [...offlineOnly].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosOrders(sortedOrders);
    } catch (err) {
      console.error("Failed to load POS data", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // 🔥 Initial Load
  useEffect(() => {
    fetchOfflineData(true);
  }, [fetchOfflineData]);

  // 🔥 Auto Refresh Every 5 Seconds (রিয়েল-টাইম আপডেট নিশ্চিত করতে)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOfflineData(false);
    }, 5000); 

    return () => clearInterval(interval);
  }, [fetchOfflineData]);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin mb-4 text-blue-600">
          <RefreshCcw size={40} />
        </div>
        <div className="font-black text-slate-400 uppercase tracking-widest text-sm">
          Syncing POS Data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            POS Sales Dashboard
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Real-time offline transaction tracking
          </p>
        </div>

        <button
          onClick={() => fetchOfflineData(true)}
          className={`p-4 bg-white shadow-sm border rounded-2xl hover:bg-slate-50 transition-all ${
            isRefreshing ? "text-blue-600" : "text-slate-600"
          }`}
        >
          <RefreshCcw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">
              Total Revenue (Offline)
            </p>
            <h3 className="text-4xl font-black text-emerald-600 italic">
              ৳{stats.totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
            <TrendingUp size={32} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">
              Bills Cleared
            </p>
            <h3 className="text-4xl font-black text-blue-600 italic">
              {stats.totalOrders}
            </h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
            <ReceiptText size={32} />
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest text-slate-700">
            <Clock size={18} className="text-blue-500" /> Transaction Logs
          </h3>
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-500">
            LIVE UPDATING
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Customer Details</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posOrders.length > 0 ? (
                posOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-6">
                      <div>
                        <p className="font-bold text-slate-800 flex items-center gap-2">
                          <User size={14} className="text-slate-400" />
                          {order.customerName || "Walk-in Guest"}
                        </p>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-2 mt-1">
                          <Phone size={12} />
                          {order.customerPhone || "N/A"}
                        </p>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className="font-black text-slate-700 italic">৳{order.totalAmount}</span>
                    </td>

                    <td className="p-6">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
                        <CheckCircle2 size={10} /> Paid
                      </span>
                    </td>

                    <td className="p-6 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                        }}
                        className="p-3 hover:bg-black hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
                    No POS Transactions Found Today
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[40px] w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-black mb-6 uppercase tracking-tighter border-b pb-4">
              Bill Details
            </h2>

            <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {(selectedOrder.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-black text-slate-700 italic">
                    ৳{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase text-xs">Grand Total</span>
              <span className="text-3xl font-black text-emerald-600 italic">
                ৳{selectedOrder.totalAmount}
              </span>
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-8 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;