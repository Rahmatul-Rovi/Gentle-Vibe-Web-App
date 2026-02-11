import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
    const { cart } = useCart(); // ❌ totalAmount নিলাম না
    const [address, setAddress] = useState({ name: '', phone: '', city: '', address: '' });

    // ✅ Calculate total here (safe way)
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 70;
    const finalAmount = subtotal + shipping;

    const handlePayment = async (e) => {
        e.preventDefault();

        console.log("Final Amount Sent:", finalAmount); // 🧪 debug

        try {
            const res = await axios.post('http://localhost:5000/api/order/init', {
                cart,
                address,
                totalAmount: finalAmount, // ✅ always number
                userId: "USER_ID_FROM_AUTH"
            });

            if (res.data?.url) {
                window.location.replace(res.data.url); // SSL gateway redirect
            }
        } catch (err) {
            console.error("Payment Error:", err?.response?.data || err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <h2 className="text-3xl font-black uppercase italic mb-10">Shipping Details</h2>

            <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest"
                    placeholder="Full Name"
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />

                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest"
                    placeholder="Phone Number"
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />

                {/* ✅ City field add করা হলো */}
                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest md:col-span-2"
                    placeholder="City"
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />

                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest md:col-span-2"
                    placeholder="Full Address"
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                />

                <button
                    type="submit"
                    className="md:col-span-2 bg-black text-white py-5 font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all"
                >
                    Pay with SSLCommerz (৳ {finalAmount})
                </button>
            </form>
        </div>
    );
};

export default Checkout;
