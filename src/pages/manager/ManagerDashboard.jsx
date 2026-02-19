import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { TrendingUp, Clock, Eye, X, ReceiptText, RefreshCcw, User, Phone } from "lucide-react";

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

  const fetchOfflineData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setIsRefreshing(true);

      const res = await axios.get("http://localhost:5000/api/admin/orders");

      const offlineOnly = res.data.filter(order => order.isPOS === true);

      const revenue = offlineOnly.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0
      );

      setStats({
        totalOrders: offlineOnly.length,
        totalRevenue: revenue,
      });

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

  // 🔥 Auto Refresh Every 5 Seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOfflineData(false);
    }, 5000); // 5 sec

    return () => clearInterval(interval);
  }, [fetchOfflineData]);

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin mb-4 text-blue-600">
          <RefreshCcw size={40} />
        </div>
        <div className="font-black text-slate-400 uppercase tracking-widest">
          Loading POS Sales...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-2">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black uppercase">
            POS Sales Overview
          </h1>
        </div>

        <button
          onClick={() => fetchOfflineData(true)}
          className={`p-3 bg-white border rounded-2xl hover:bg-slate-50 ${
            isRefreshing ? "animate-spin" : ""
          }`}
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm flex justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Revenue (Offline)
            </p>
            <h3 className="text-4xl font-black text-emerald-600">
              ৳{stats.totalRevenue.toLocaleString()}
            </h3>
          </div>
          <TrendingUp size={28} />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm flex justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">
              Bills Cleared
            </p>
            <h3 className="text-4xl font-black text-blue-600">
              {stats.totalOrders}
            </h3>
          </div>
          <ReceiptText size={28} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="font-bold uppercase flex items-center gap-2 text-sm">
            <Clock size={16} /> Transaction Logs
          </h3>
        </div>

        <table className="w-full text-left">
          <tbody>
            {posOrders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-4">
                  <div>
                    <p className="font-bold flex items-center gap-2">
                      <User size={14} />
                      {order.customerName || "Walk-in Guest"}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-2">
                      <Phone size={12} />
                      {order.customerPhone || "N/A"}
                    </p>
                  </div>
                </td>

                <td className="p-4">
                  ৳{order.totalAmount}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Bill Receipt</h2>

            {(selectedOrder.items || []).map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>{item.name}</span>
                <span>
                  {item.quantity} × ৳{item.price}
                </span>
              </div>
            ))}

            <div className="mt-4 font-bold text-lg">
              Total: ৳{selectedOrder.totalAmount}
            </div>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;
