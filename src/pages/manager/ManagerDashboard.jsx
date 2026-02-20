import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { 
  TrendingUp, Clock, Eye, X, ReceiptText, 
  RefreshCcw, CheckCircle2, CalendarDays
} from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({ 
    totalOrders: 0, 
    totalRevenue: 0, 
    todayRevenue: 0 
  });
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

      // ১. শুধুমাত্র POS অর্ডারগুলো ফিল্টার করা
      const offlineOnly = res.data.filter(order => order.isPOS === true);

      // আজকের তারিখ নির্ধারণ (Comparison এর জন্য)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let totalRev = 0;
      let todayRev = 0;

      const processedOrders = offlineOnly.map(order => {
        const amount = Number(order.totalAmount) || 0;
        const orderDate = new Date(order.createdAt);
        
        // লাইফটাইম রেভিনিউ যোগ করা
        totalRev += amount;

        // আজকের রেভিনিউ চেক করা
        if (orderDate >= today) {
          todayRev += amount;
        }

        return {
          ...order,
          actualSaleAmount: amount 
        };
      });

      setStats({ 
        totalOrders: processedOrders.length, 
        totalRevenue: totalRev,
        todayRevenue: todayRev 
      });
      setPosOrders(processedOrders); 
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
        <div className="font-black text-slate-400 uppercase tracking-widest text-sm text-center">Syncing Live Records...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 bg-slate-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter text-slate-900 italic">POS Dashboard</h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mt-1 italic">Real-time Sales Log</p>
        </div>
        <button
          onClick={() => fetchOfflineData(true)}
          className={`p-4 bg-white shadow-sm border rounded-2xl transition-all ${isRefreshing ? "text-blue-600 border-blue-100" : "text-slate-600"}`}
        >
          <RefreshCcw size={20} className={isRefreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Cash Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border-2 border-blue-50 transition-all hover:shadow-md">
          <div>
            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[2px] mb-2">Today's Collection</p>
            <h3 className="text-4xl font-black text-slate-900 italic">৳{stats.todayRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600"><CalendarDays size={32} /></div>
        </div>

        {/* Lifetime Revenue Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100 transition-all hover:shadow-md">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Net Cash Inflow (Total)</p>
            <h3 className="text-4xl font-black text-emerald-600 italic">৳{stats.totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><TrendingUp size={32} /></div>
        </div>

        {/* Order Count Card */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm flex justify-between items-center border border-slate-100">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[2px] mb-2">Order Volume</p>
            <h3 className="text-4xl font-black text-slate-700 italic">{stats.totalOrders}</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl text-slate-500"><ReceiptText size={32} /></div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[32px] shadow-sm overflow-hidden border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-6">Customer / Time</th>
                <th className="p-6">Paid Amount (৳)</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posOrders.map((order) => (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-6">
                    <p className="font-bold text-slate-800">{order.customerName || "Walk-in Guest"}</p>
                    <p className="text-[10px] text-blue-500 font-black mt-1 uppercase flex items-center gap-1">
                      <Clock size={10} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="p-6">
                    <p className="font-black text-slate-900 italic text-xl">৳{order.actualSaleAmount}</p>
                    {order.manualDiscount > 0 && (
                      <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase">
                        Disc Included
                      </span>
                    )}
                  </td>
                  <td className="p-6">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase">
                      <CheckCircle2 size={10} /> Paid
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => { setSelectedOrder(order); setIsModalOpen(true); }}
                      className="p-3 bg-slate-100 hover:bg-black hover:text-white rounded-xl transition-all shadow-sm"
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

      {/* Modal - Details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-slate-900 p-8 text-white">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Sale Receipt</h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                TX ID: {selectedOrder._id.slice(-10).toUpperCase()}
              </p>
            </div>

            <div className="p-8 space-y-4 bg-white max-h-[300px] overflow-y-auto">
              {(selectedOrder.products || selectedOrder.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-2">
                  <div>
                    <p className="font-bold text-xs text-slate-800 uppercase">{item.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{item.quantity} x ৳{item.price}</p>
                  </div>
                  <p className="font-black text-slate-700 italic text-sm">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="px-8 py-6 bg-slate-50 space-y-3">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Subtotal (Before Disc)</span>
                <span>৳{(Number(selectedOrder.actualSaleAmount) + Number(selectedOrder.manualDiscount))}</span>
              </div>
              
              {selectedOrder.manualDiscount > 0 && (
                <div className="flex justify-between text-[10px] font-black text-rose-500 uppercase italic">
                  <span>- Manual Discount</span>
                  <span>৳{selectedOrder.manualDiscount}</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
                <span className="font-black text-slate-900 uppercase text-xs tracking-[2px]">Final Paid</span>
                <span className="text-3xl font-black text-emerald-600 italic">৳{selectedOrder.actualSaleAmount}</span>
              </div>
            </div>

            <div className="p-8 pt-4 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">
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