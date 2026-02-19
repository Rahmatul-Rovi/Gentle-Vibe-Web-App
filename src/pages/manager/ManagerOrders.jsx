import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ShoppingCart, Eye, PackageCheck, Truck, Clock, Filter } from "lucide-react";

const ManagerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Order load failed", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/admin/orders/${id}`, { status: newStatus });
      if (res.data.success) {
        Swal.fire("Updated!", `Order status is now ${newStatus}`, "success");
        fetchOrders(); // লিস্ট রিফ্রেশ করা
      }
    } catch (err) {
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter(o => o.status === filter);

  if (loading) return <div className="p-10 font-black text-center text-slate-400 tracking-widest">FETCHING ORDERS...</div>;

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
            <ShoppingCart size={32} /> Customer Orders
          </h1>
          <p className="text-slate-500 font-bold">Manage online orders and shipping status.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <Filter size={16} className="ml-2 text-slate-400" />
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-transparent font-black text-xs uppercase outline-none pr-4 cursor-pointer"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[2px]">
              <th className="px-6 py-5">Order Info</th>
              <th className="px-6 py-5">Customer</th>
              <th className="px-6 py-5">Total Amount</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5 text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-black text-sm text-slate-800 uppercase">#{order.transactionId?.slice(-8)}</div>
                  <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                    <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-sm">{order.shippingAddress.name}</div>
                  <div className="text-xs text-slate-500">{order.shippingAddress.phone}</div>
                </td>
                <td className="px-6 py-4 font-black text-slate-900">৳{order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center items-center gap-2">
                    <select 
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="text-[10px] font-black bg-slate-100 border-none rounded-lg px-2 py-1 outline-none"
                    >
                      <option value="">Update Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <button className="p-2 text-slate-400 hover:text-black hover:bg-white rounded-lg transition-all shadow-sm">
                      <Eye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="p-20 text-center font-black text-slate-300 uppercase tracking-[5px]">
            No Orders Found
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerOrders;