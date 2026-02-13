import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';

const Checkout = () => {
    const { user } = React.useContext(AuthContext);
    const { cart } = useCart();
    const [address, setAddress] = useState({ name: '', phone: '', city: '', address: '' });

    // ✅ Calculation-ke Number() diye safe kora holo jate 'null' na hoy
    const subtotal = cart.reduce((total, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 1;
        return total + (itemPrice * itemQty);
    }, 0);
    
    const shipping = 70;
    const finalAmount = subtotal + shipping;

    const handlePayment = async (e) => {
        e.preventDefault();

        // 🛑 Final validation: City ba onno field empty thakle backend-e pathabo na
        if (!address.city.trim() || !address.phone.trim()) {
            alert("Please fill in City and Phone Number!");
            return;
        }

        const orderData = {
            cart: cart,
            address: address, // state theke city auto jabe ekhon
            totalAmount: Number(finalAmount), 
            userId: user?.id || user?._id || "Guest"
        };

        console.log("Sending to Backend:", orderData);

        try {
            const res = await axios.post('http://localhost:5000/api/order/init', orderData);

            if (res.data?.url) {
                window.location.replace(res.data.url);
            }
        } catch (err) {
            console.error("Payment Error:", err?.response?.data || err.message);
            alert("Payment Initiation Failed: " + (err?.response?.data?.message || "Server Error"));
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
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                />

                <input
                    required
                    type="text"
                    className="border p-4 uppercase text-xs font-bold tracking-widest"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />

                {/* ✅ City field - value={address.city} add kora hoyeche mapping thik korar jonno */}
                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest md:col-span-2"
                    placeholder="City (e.g. Dhaka)"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />

                <input
                    required
                    className="border p-4 uppercase text-xs font-bold tracking-widest md:col-span-2"
                    placeholder="Full Address"
                    value={address.address}
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