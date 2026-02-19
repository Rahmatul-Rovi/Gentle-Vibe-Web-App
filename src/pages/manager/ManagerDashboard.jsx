import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, TrendingUp, Clock, Eye, X, ReceiptText } from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [posOrders, setPosOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchOfflineData = async () => {
    try {
      setLoading(true);
      // সব অর্ডার নিয়ে আসা
      const res = await axios.get("http://localhost:5000/api/admin/orders"); 
      
      // শুধু POS ডাটা ফিল্টার করা (অনলাইন অর্ডার বাদ দেওয়া হয়েছে)
      const offlineOnly = res.data.filter(order => order.isPOS === true);
      
      // ক্যালকুলেশন
      const revenue = offlineOnly.reduce((sum, order) => sum + order.totalAmount, 0);
      
      setStats({
        totalOrders: offlineOnly.length,
        totalRevenue: revenue
      });
      
      // রিসেন্ট ৫টি অফলাইন অর্ডার
      setPosOrders(offlineOnly.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      
    } catch (err) {
      console.error("Failed to load POS data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfflineData();
  }, []);

  if (loading) return <div className="p-10 font-black text-center text-slate-400 uppercase tracking-widest">Loading Offline Sales...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">POS Sales Overview</h1>
        <p className="text-slate-500 font-bold">This dashboard only shows offline counter sales.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Offline Revenue</p>
            <h3 className="text-4xl font-black mt-1">৳{stats.totalRevenue}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-lg shadow-emerald-200">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total POS Bills</p>
            <h3 className="text-4xl font-black mt-1">{stats.totalOrders}</h3>
          </div>
          <div className="bg-black text-white p-5 rounded-2xl shadow-lg">
            <ReceiptText size={28} />
          </div>
        </div>
      </div>

      {/* Offline Orders Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest">
            <Clock size={18} /> Recent Counter Sales
          </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-6 py-4">Bill ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posOrders.length > 0 ? posOrders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-xs uppercase text-slate-500 tracking-tighter italic">#{order.transactionId?.slice(-10)}</td>
                <td className="px-6 py-4 font-bold text-sm">{order.customerName || "Walk-in"}</td>
                <td className="px-6 py-4 font-black text-sm">৳{order.totalAmount}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                    className="p-2 hover:bg-black hover:text-white rounded-xl border transition-all"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            )) : (
                <tr><td colSpan="4" className="p-10 text-center font-bold text-slate-300">NO POS DATA FOUND</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing items */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden p-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            <h2 className="text-xl font-black uppercase mb-4">Bill Details</h2>
            <div className="space-y-3">
               {selectedOrder.cartItems?.map((item, i) => (
                   <div key={i} className="flex justify-between font-bold text-sm border-b pb-2">
                       <span>{item.name} x{item.quantity}</span>
                       <span>৳{item.price * item.quantity}</span>
                   </div>
               ))}
               <div className="pt-4 text-2xl font-black text-right">TOTAL: ৳{selectedOrder.totalAmount}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;