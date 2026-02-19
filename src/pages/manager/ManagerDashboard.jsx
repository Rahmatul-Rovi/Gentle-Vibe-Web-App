import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, Package, TrendingUp, Clock } from "lucide-react";

const ManagerDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchManagerStats = async () => {
      try {
        // এখানে অ্যাডমিনের এপিআই ব্যবহার করলেও ডাটা শুধু ম্যানেজারের ভিউতে দেখাচ্ছে
        const statsRes = await axios.get("http://localhost:5000/api/admin/stats");
        const ordersRes = await axios.get("http://localhost:5000/api/admin/orders/recent");
        
        setStats(statsRes.data);
        setRecentOrders(ordersRes.data.slice(0, 5)); // শুধু শেষের ৫টি অর্ডার দেখাবে
        setLoading(true);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerStats();
  }, []);

  if (loading) return <div className="p-10 font-black text-center">LOADING MANAGER DATA...</div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Manager Overview</h1>
        <p className="text-slate-500 font-bold">Welcome back! Here's what's happening in the shop today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Sales</p>
            <h3 className="text-3xl font-black mt-1">৳{stats.totalRevenue}</h3>
          </div>
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Orders Processed</p>
            <h3 className="text-3xl font-black mt-1">{stats.totalOrders}</h3>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
            <ShoppingBag size={24} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Inventory Items</p>
            <h3 className="text-3xl font-black mt-1">{stats.totalProducts}</h3>
          </div>
          <div className="bg-amber-100 text-amber-600 p-4 rounded-2xl">
            <Package size={24} />
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-black uppercase flex items-center gap-2">
            <Clock size={18} /> Recent Shop Orders
          </h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recentOrders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-sm">#{order.transactionId}</td>
                <td className="px-6 py-4 font-bold text-sm text-slate-600">{order.shippingAddress.name}</td>
                <td className="px-6 py-4 font-black text-sm">৳{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerDashboard;