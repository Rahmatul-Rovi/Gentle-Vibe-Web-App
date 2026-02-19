import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { ShoppingBag, TrendingUp, Clock, Eye, X, ReceiptText, RefreshCcw, User, Phone } from "lucide-react";

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

  const fetchOfflineData = useCallback(async (showLoading = true) => {
    try {
      if(showLoading) setLoading(true);
      setIsRefreshing(true);

      const res = await axios.get("http://localhost:5000/api/admin/orders"); 
      
      // শুধু POS ডাটা ফিল্টার
      const offlineOnly = res.data.filter(order => order.isPOS === true);
      
      const revenue = offlineOnly.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      
      setStats({
        totalOrders: offlineOnly.length,
        totalRevenue: revenue
      });
      
      const sortedOrders = offlineOnly.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosOrders(sortedOrders);
      
    } catch (err) {
      console.error("Failed to load POS data", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOfflineData();
  }, [fetchOfflineData]);

  if (loading) return (
    <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
      <div className="animate-spin mb-4 text-blue-600"><RefreshCcw size={40} /></div>
      <div className="font-black text-slate-400 uppercase tracking-widest text-center">Loading POS Sales...</div>
    </div>
  );

  return (
    <div className="space-y-8 p-2">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">POS Sales Overview</h1>
          <p className="text-slate-500 font-bold">Manager access to all counter transactions.</p>
        </div>
        <button 
          onClick={() => fetchOfflineData(false)}
          className={`p-3 bg-white border rounded-2xl hover:bg-slate-50 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <RefreshCcw size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue (Offline)</p>
            <h3 className="text-4xl font-black mt-1 text-emerald-600">৳{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-emerald-500 text-white p-5 rounded-2xl shadow-lg">
            <TrendingUp size={28} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bills Cleared</p>
            <h3 className="text-4xl font-black mt-1 text-blue-600">{stats.totalOrders}</h3>
          </div>
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg">
            <ReceiptText size={28} />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest">
            <Clock size={18} /> Transaction Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-6 py-4">Customer Info</th>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posOrders.length > 0 ? posOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  {/* কাস্টমার নাম ও ফোন এখানে দেখাবে */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-sm uppercase flex items-center gap-1">
                        <User size={12} className="text-blue-500" /> {order.customerName || "Walk-in Guest"}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Phone size={10} /> {order.customerPhone || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-black text-slate-500">ID: #{order._id?.slice(-8)}</p>
                    <p className="text-[10px] font-bold text-slate-400 italic">{new Date(order.createdAt).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4 font-black text-sm text-slate-900">৳{order.totalAmount}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="p-2 bg-slate-100 hover:bg-black hover:text-white rounded-xl transition-all"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                  <tr><td colSpan="4" className="p-20 text-center font-bold text-slate-300 italic uppercase">No Transactions Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden relative">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-rose-50 rounded-full transition-colors"
            >
              <X size={20}/>
            </button>
            
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-xl font-black uppercase tracking-tighter">Bill Receipt</h2>
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                   <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-2 mb-1">
                     <User size={14} /> Name: <span className="text-black font-black">{selectedOrder.customerName || "Walk-in Guest"}</span>
                   </p>
                   <p className="text-xs font-black text-slate-500 uppercase flex items-center gap-2">
                     <Phone size={14} /> Phone: <span className="text-black font-black">{selectedOrder.customerPhone || "N/A"}</span>
                   </p>
                </div>
              </div>

              <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                 {/* এখানে আপনার ডাটাবেসের ফিল্ড অনুযায়ী items বা cartItems ব্যবহার করুন */}
                 {(selectedOrder.items || selectedOrder.cartItems || []).map((item, i) => (
                     <div key={i} className="flex justify-between items-center border-b border-slate-100 pb-2">
                         <div>
                            <p className="font-bold text-sm text-slate-800 uppercase">{item.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold">Qty: {item.quantity} × ৳{item.price}</p>
                         </div>
                         <span className="font-black text-sm">৳{item.price * item.quantity}</span>
                     </div>
                 ))}
              </div>

              <div className="mt-8 pt-4 border-t-2 border-black flex justify-between items-center">
                <span className="font-black text-xs uppercase tracking-widest text-slate-400">Net Amount</span>
                <span className="text-3xl font-black text-black tracking-tighter">৳{selectedOrder.totalAmount}</span>
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;