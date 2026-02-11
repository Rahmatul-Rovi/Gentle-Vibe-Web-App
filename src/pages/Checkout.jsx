import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';

const Checkout = () => {
    const { cart, totalAmount } = useCart(); // Assume totalAmount logic is in Context
    const [address, setAddress] = useState({ name: '', phone: '', city: '', address: '' });

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/order/init', {
                cart,
                address,
                totalAmount: totalAmount + 70, // Price + Shipping
                userId: "USER_ID_FROM_AUTH"
            });
            
            if (res.data?.url) {
                window.location.replace(res.data.url); // SSL-er gateway-te niye jabe
            }
        } catch (err) {
            console.error("Payment Error:", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-20 px-4">
            <h2 className="text-3xl font-black uppercase italic mb-10">Shipping Details</h2>
            <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input required className="border p-4 uppercase text-xs font-bold tracking-widest" placeholder="Full Name" onChange={(e) => setAddress({...address, name: e.target.value})} />
                <input required className="border p-4 uppercase text-xs font-bold tracking-widest" placeholder="Phone Number" onChange={(e) => setAddress({...address, phone: e.target.value})} />
                <input required className="border p-4 uppercase text-xs font-bold tracking-widest md:col-span-2" placeholder="Full Address" onChange={(e) => setAddress({...address, address: e.target.value})} />
                <button type="submit" className="md:col-span-2 bg-black text-white py-5 font-black uppercase tracking-[0.3em] hover:bg-gray-800 transition-all">
                    Pay with SSLCommerz
                </button>
            </form>
        </div>
    );
};

export default Checkout;