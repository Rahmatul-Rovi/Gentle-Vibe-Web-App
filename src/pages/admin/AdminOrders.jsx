import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, CheckCircle, Smartphone, CreditCard, ShoppingBag } from "lucide-react";
import Swal from 'sweetalert2';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders/recent"); 
      setOrders(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Orders fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const viewOrderDetails = (order) => {
    const discountAmount = order.manualDiscount || 0;
    
    const productList = order.products.map(p => {
      return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:8px;">
        <div style="text-align:left;">
          <p style="margin:0; font-weight:bold; color:#333;">${p.name} x ${p.quantity || 1}</p>
          ${p.originalPrice && p.originalPrice > p.price ? 
            `<span style="font-size:10px; color:#999; text-decoration:line-through;">৳${p.originalPrice}</span>` : ''}
        </div>
        <div style="text-align:right;">
          <span style="font-weight:900; color:#000;">৳${p.price * (p.quantity || 1)}</span>
        </div>
      </div>`;
    }).join('');

    Swal.fire({
      title: `<span style="text-transform: uppercase; font-weight:900;">Order Details</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <div style="background: #f8fafc; padding: 15px; border-radius: 15px; margin-bottom: 20px; border: 1px solid #e2e8f0;">
            <p style="margin:2px 0;"><strong>Customer:</strong> ${order.customerName || order.shippingAddress?.name || "Walk-in Guest"}</p>
            <p style="margin:2px 0;"><strong>Phone:</strong> ${order.customerPhone || order.shippingAddress?.phone}</p>
            <p style="margin:2px 0;"><strong>Method:</strong> ${order.isPOS ? "POS / Offline Sale" : "Online Order"}</p>
          </div>
          
          <h4 style="margin-bottom:10px; text-transform:uppercase; font-size:11px; color:#64748b; font-weight:bold;">Items:</h4>
          <div style="max-height: 200px; overflow-y: auto;">${productList}</div>

          <div style="margin-top:20px; padding-top:15px; border-top: 2px dashed #cbd5e1;">
            ${discountAmount > 0 ? `
            <div style="display:flex; justify-content:space-between; font-size:14px; color:#e11d48; margin-bottom:5px; font-weight:bold;">
              <span>Manual Discount:</span>
              <span>-৳${discountAmount}</span>
            </div>` : ''}
            <div style="display:flex; justify-content:space-between; font-size:22px; font-weight:900; color:#059669;">
              <span>NET PAID:</span>
              <span>৳${order.totalAmount}</span>
            </div>
          </div>
        </div>
      `,
      confirmButtonText: 'CLOSE',
      confirmButtonColor: '#000',
    });
  };

  if (loading) return <div className="flex justify-center items-center min-h-[400px]"><span className="loading loading-spinner loading-lg"></span></div>;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Sales & Orders</h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Tracking revenue from POS & Online</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[2px] font-black">
              <th className="px-8 py-5">Customer Type</th>
              <th className="px-6 py-5">Payment Method</th>
              <th className="px-6 py-5">Net Amount</th>
              <th className="px-8 py-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const isPOS = order.isPOS || order.customerName === "Walk-in Guest";
              
              return (
                <tr key={order._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${isPOS ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'}`}>
                        {isPOS ? <ShoppingBag size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {order.customerName || order.shippingAddress?.name || "Walk-in Guest"}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">
                          {isPOS ? "POS Sale" : "Online Order"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-lg w-fit ${isPOS ? 'bg-slate-100 text-slate-600' : 'bg-blue-50 text-blue-600'}`}>
                      <CheckCircle size={10} />
                      {isPOS ? "Offline Paid" : "Online Paid"}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-emerald-600 text-lg">৳{order.totalAmount}</span>
                      {order.manualDiscount > 0 && (
                        <span className="text-[9px] text-rose-500 font-bold italic">৳{order.manualDiscount} Discount Applied</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => viewOrderDetails(order)} className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;