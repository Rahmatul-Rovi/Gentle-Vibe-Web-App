import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Package, Loader2, X } from "lucide-react";

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for Modal

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id || storedUser?.id || storedUser?.uid;

        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/user/my-orders/${userId}`,
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Orders load error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-gray-400" size={32} />
        <p className="font-black uppercase tracking-widest italic text-gray-400">
          Fetching Your Orders...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tighter italic">
          My Order History
        </h2>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">
          Track your style journey
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
                  <th className="p-5">Order ID</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Total Amount</th>
                  <th className="p-5">Payment</th>
                  <th className="p-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="text-sm font-bold hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="p-5 font-mono text-xs text-gray-400 group-hover:text-black">
                      #
                      {order.transactionId?.substring(0, 8).toUpperCase() ||
                        order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-5 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-5 text-black font-black">
                      ৳{order.totalAmount}
                    </td>
                    <td className="p-5 text-xs font-black uppercase">
                      <span
                        className={
                          order.paymentStatus === "Paid"
                            ? "text-green-600"
                            : "text-amber-600"
                        }
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 hover:bg-black hover:text-white rounded-lg transition-all"
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
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Package size={40} className="text-gray-200 mb-4" />
          <p className="text-gray-400 font-black uppercase tracking-widest text-sm">
            No orders found
          </p>
        </div>
      )}

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="font-black uppercase italic text-xl">
                  Order Details
                </h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Transaction: {selectedOrder.transactionId}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Products List */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">
                    Items Purchased
                  </p>
                  {selectedOrder.products.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.images?.[0] || item.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black uppercase leading-tight">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500 font-bold">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <p className="text-xs font-black mt-1">
                          Qty: {item.quantity} × ৳{item.price}
                        </p>
                      </div>
                      <p className="text-sm font-black">
                        ৳{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping & Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Delivery Address
                    </p>
                    <div className="text-xs font-bold space-y-1">
                      <p className="uppercase">
                        {selectedOrder.shippingAddress.name}
                      </p>
                      <p className="text-gray-500">
                        {selectedOrder.shippingAddress.address}
                      </p>
                      <p className="text-gray-500">
                        {selectedOrder.shippingAddress.city}, Bangladesh
                      </p>
                      <p className="text-gray-500">
                        Phone: {selectedOrder.shippingAddress.phone}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-2xl">
                    <div className="flex justify-between text-xs font-bold mb-2 text-gray-400 uppercase tracking-widest">
                      <span>Subtotal</span>
                      <span>৳{selectedOrder.totalAmount}</span>
                    </div>

                    {/* Updated Delivery Section */}
                    <div className="flex justify-between text-xs font-bold mb-4 uppercase tracking-widest">
                      <span>Delivery</span>
                      <div className="flex flex-col items-end">
                        <span className="text-black">PAID</span>
                        <span
                          className={`text-[9px] mt-1 px-2 py-0.5 rounded ${
                            new Date() - new Date(selectedOrder.createdAt) >
                            24 * 60 * 60 * 1000
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {new Date() - new Date(selectedOrder.createdAt) >
                          24 * 60 * 60 * 1000
                            ? "• DELIVERED"
                            : "• SHIPPING"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between text-lg font-black border-t border-gray-200 pt-3">
                      <span>Total</span>
                      <span>৳{selectedOrder.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">
                Thank you for choosing ONE POINT PLUS
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrder;
