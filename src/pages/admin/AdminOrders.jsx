import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Clock, CheckCircle, Smartphone, User } from "lucide-react";
import Swal from 'sweetalert2';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch All Orders ---
  const fetchOrders = async () => {
    try {
      // Backend theke shob order niye asha
      const res = await axios.get("http://localhost:5000/api/admin/orders/recent"); 
      // Note: Backend-e tumi limit(5) diye rakha asle oita kete nile shob paba
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // --- View Order Details (SweetAlert) ---
  const viewOrderDetails = (order) => {
    const productList = order.products.map(p => 
      `<div style="display:flex; justify-content:space-between; margin-bottom:10px; border-bottom:1px solid #eee; padding-bottom:5px;">
        <span>${p.name} x ${p.quantity || 1}</span>
        <span style="font-weight:bold;">৳${p.price}</span>
      </div>`
    ).join('');

    Swal.fire({
      title: `<span style="text-transform: uppercase;">Order Details</span>`,
      html: `
        <div style="text-align: left; font-size: 14px;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 15px;">
            <p><strong>Customer:</strong> ${order.shippingAddress?.name || "Guest"}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress?.phone}</p>
            <p><strong>Address:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}</p>
            <p><strong>Transaction ID:</strong> <span style="color:blue;">${order.transactionId}</span></p>
          </div>
          <h4 style="margin-bottom:10px; text-transform:uppercase; font-size:12px; color:#666;">Products:</h4>
          ${productList}
          <div style="display:flex; justify-content:space-between; margin-top:15px; font-size:18px; font-weight:900;">
            <span>Total:</span>
            <span>৳${order.totalAmount}</span>
          </div>
        </div>
      `,
      confirmButtonText: 'DONE',
      confirmButtonColor: '#000',
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Customer Orders</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Manage sales and transactions</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[2px] font-black">
              <th className="px-8 py-5">Customer</th>
              <th className="px-6 py-5">Date</th>
              <th className="px-6 py-5">Amount</th>
              <th className="px-6 py-5">Payment</th>
              <th className="px-8 py-5 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">
                      {order.shippingAddress?.name?.charAt(0) || "G"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{order.shippingAddress?.name || "Guest User"}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Smartphone size={10} /> {order.shippingAddress?.phone}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-600 font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-5 font-black text-slate-900 text-sm">
                  ৳{order.totalAmount}
                </td>
                <td className="px-6 py-5">
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-full w-fit ${
                    order.paymentStatus === 'Paid' 
                    ? 'bg-emerald-100 text-emerald-600' 
                    : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.paymentStatus === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => viewOrderDetails(order)}
                    className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
            No orders found yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;