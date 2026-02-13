import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Eye, Package, Loader2 } from 'lucide-react';

const UserOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // 1. LocalStorage theke data nilam
                const storedUser = JSON.parse(localStorage.getItem('user'));
                
                // 2. ID khuje ber korar safe way (Different auth provider-er jonno)
                const userId = storedUser?._id || storedUser?.id || storedUser?.uid;

                if (!userId) {
                    console.error("User ID khuje paoya jayni. User hoyto logged in na.");
                    setLoading(false);
                    return;
                }

                console.log("Fetching orders for User ID:", userId);

                // 3. Backend-e call korchi
                const res = await axios.get(`http://localhost:5000/api/user/my-orders/${userId}`);
                setOrders(res.data);
            } catch (err) {
                console.error("Orders load korte error hoyeche:", err.response?.data || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // ... Loading and Table UI (Ager motoi thakbe) ...

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-gray-400" size={32} />
            <p className="font-black uppercase tracking-widest italic text-gray-400">Fetching Your Orders...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic">My Order History</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mt-2">Track your style journey</p>
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
                                    <tr key={order._id} className="text-sm font-bold hover:bg-gray-50/50 transition-colors group">
                                        <td className="p-5 font-mono text-xs text-gray-400 group-hover:text-black">
                                            #{order.transactionId || order._id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className="p-5 text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-5 text-black font-black">৳{order.totalAmount}</td>
                                        <td className="p-5">
                                            <span className={`px-4 py-1 text-[9px] font-black uppercase rounded-full tracking-wider ${
                                                order.paymentStatus === 'Paid' 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-amber-50 text-amber-600'
                                            }`}>
                                                {order.paymentStatus || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            <button className="p-2 hover:bg-black hover:text-white rounded-lg transition-all duration-300">
                                                <Eye size={18}/>
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
                    <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                        <Package size={40} className="text-gray-200" />
                    </div>
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No orders found in your history</p>
                    <button 
                        onClick={() => window.location.href = '/shop'}
                        className="mt-6 text-[10px] font-black uppercase underline tracking-widest hover:text-black transition-colors"
                    >
                        Start Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserOrder;