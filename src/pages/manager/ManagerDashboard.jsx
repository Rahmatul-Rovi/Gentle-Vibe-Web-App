import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  TrendingUp, Clock, Eye, X, ReceiptText, 
  RefreshCcw, User, Phone, CheckCircle2, ShoppingBag 
} from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0 });
  const [posOrders, setPosOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchOfflineData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setIsRefreshing(true);

      const res = await axios.get("http://localhost:5000/api/admin/orders/recent");

      const offlineOnly = res.data.filter(order => order.isPOS === true);

      const revenue = offlineOnly.reduce(
        (sum, order) => sum + (Number(order.totalAmount) || 0),
        0
      );

      setStats({ totalOrders: offlineOnly.length, totalRevenue: revenue });
      setPosOrders(offlineOnly); 
    } catch (err) {
      console.error("Failed to load POS data", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOfflineData(true);
  }, [fetchOfflineData]);

  useEffect(() => {
    const interval = setInterval(() => fetchOfflineData(false), 5000);
    return () => clearInterval(interval);
  }, [fetchOfflineData]);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin mb-4 text-blue-600"><RefreshCcw size={40} /></div>
        <div className="font-black text-slate-400 uppercase tracking-widest text-sm">Syncing Records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">POS Dashboard</h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Management & Logs</p>
        </div>
        <button
          onClick={() => fetchOfflineData(true)}
          className={`p-4 bg-white shadow-sm border rounded-2xl transition-all ${isRefreshing ? "text-blue-600" : "text-slate-600"}`}
        >
          <RefreshCcw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Total Revenue</p>
            <h3 className="text-4xl font-black text-emerald-600 italic">৳{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><TrendingUp size={32} /></div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Orders Processed</p>
            <h3 className="text-4xl font-black text-blue-600 italic">{stats.totalOrders}</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><ReceiptText size={32} /></div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-100">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
          <h3 className="font-black uppercase flex items-center gap-2 text-sm tracking-widest text-slate-700">
            <Clock size={18} className="text-blue-500" /> Transaction Logs
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Customer / Time</th>
                <th className="p-6">Amount</th>
                <th className="p-6">Method</th>
                <th className="p-6 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {posOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{order.customerName || "Walk-in Guest"}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase mt-1 flex items-center gap-1">
                      <Clock size={10} /> 
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      <span className="text-slate-300 mx-1">|</span>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="p-6 font-black text-slate-700 italic">৳{order.totalAmount}</td>
                  <td className="p-6">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
                      <CheckCircle2 size={10} /> Cash/Paid
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="p-3 hover:bg-black hover:text-white rounded-xl transition-all border border-slate-100 shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Professional Bill Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl relative overflow-hidden">
            {/* Header */}
            <div className="bg-slate-900 p-8 text-white">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500 rounded-lg"><ShoppingBag size={20} /></div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Bill Receipt</h2>
              </div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                ID: {selectedOrder.transactionId}
              </p>
            </div>

            {/* Customer Info */}
            <div className="p-8 pb-4 flex justify-between items-start border-b border-dashed">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Customer</p>
                <p className="font-bold text-slate-800">{selectedOrder.customerName}</p>
                <p className="text-xs text-slate-500">{selectedOrder.customerPhone}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Date & Time</p>
                <p className="text-xs font-bold text-slate-800">
                  {new Date(selectedOrder.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            {/* Product List */}
            <div className="p-8 space-y-4 max-h-[300px] overflow-y-auto">
              {(selectedOrder.products || []).map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="h-16 w-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                    {item.images && item.images[0] ? (
                      <img src={item.images[0]} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-300"><ShoppingBag size={20} /></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      {item.quantity} x ৳{item.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-700 italic text-sm">৳{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="p-8 bg-slate-50 pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Grand Total</span>
                <span className="text-3xl font-black text-emerald-600 italic">৳{selectedOrder.totalAmount}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;