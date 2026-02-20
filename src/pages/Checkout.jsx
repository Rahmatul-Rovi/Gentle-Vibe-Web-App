import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import axios from 'axios';
import { AuthContext } from '../providers/AuthProvider';
import { CreditCard, Truck, Loader2 } from 'lucide-react';

const Checkout = () => {
    const { user } = React.useContext(AuthContext);
    const { cart } = useCart();
    const [loading, setLoading] = useState(false); 
    const [address, setAddress] = useState({ name: '', phone: '', city: '', address: '' });

    // ১. ডিসকাউন্ট সহ সাবটোটাল ক্যালকুলেশন (Cart Page এর সাথে মিল রেখে)
    const subtotal = cart.reduce((total, item) => {
        const hasDiscount = item.discount && item.discount > 0;
        const currentPrice = hasDiscount 
            ? Math.round(item.price - (item.price * item.discount / 100)) 
            : item.price;
        const itemQty = Number(item.quantity) || 1;
        return total + (currentPrice * itemQty);
    }, 0);
    
    const shipping = 70;
    const finalAmount = subtotal + shipping;

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true); 

        if (!address.city.trim() || !address.phone.trim()) {
            alert("Please fill in City and Phone Number!");
            setLoading(false);
            return;
        }

        // ২. অর্ডার ডেটাতে ডিসকাউন্টেড প্রাইস ম্যাপ করে পাঠানো
        const orderData = {
            cart: cart.map(item => {
                const hasDiscount = item.discount && item.discount > 0;
                const finalUnitPrice = hasDiscount 
                    ? Math.round(item.price - (item.price * item.discount / 100)) 
                    : item.price;
                return {
                    ...item,
                    price: finalUnitPrice // ব্যাকএন্ডে ডিসকাউন্টেড প্রাইস পাঠাচ্ছি
                };
            }),
            address: address,
            totalAmount: Number(finalAmount), 
            userId: user?.id || user?._id || "Guest"
        };

        try {
            const res = await axios.post('http://localhost:5000/api/order/init', orderData);
            if (res.data?.url) {
                window.location.replace(res.data.url);
            }
        } catch (err) {
            console.error("Payment Error:", err?.response?.data || err.message);
            alert("Payment Initiation Failed: " + (err?.response?.data?.message || "Server Error"));
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-16 px-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-12 border-b pb-6">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                
                {/* --- LEFT: SHIPPING FORM --- */}
                <div>
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                        <Truck size={18} /> Shipping Information
                    </h2>
                    <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            required
                            className="border border-gray-200 p-4 text-[11px] font-bold uppercase tracking-widest focus:border-black outline-none transition-all"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                        />

                        <input
                            required
                            className="border border-gray-200 p-4 text-[11px] font-bold uppercase tracking-widest focus:border-black outline-none transition-all"
                            placeholder="Phone Number"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        />

                        <input
                            required
                            className="border border-gray-200 p-4 text-[11px] font-bold uppercase tracking-widest md:col-span-2 focus:border-black outline-none transition-all"
                            placeholder="City (e.g. Dhaka)"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        />

                        <textarea
                            required
                            rows="3"
                            className="border border-gray-200 p-4 text-[11px] font-bold uppercase tracking-widest md:col-span-2 focus:border-black outline-none transition-all"
                            placeholder="Full Address (House, Road, Area...)"
                            value={address.address}
                            onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        />

                        <button
                            type="submit"
                            disabled={loading || cart.length === 0}
                            className="md:col-span-2 bg-black text-white py-5 font-black uppercase tracking-[0.3em] text-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:bg-gray-400"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    <CreditCard size={18} /> Confirm Order & Pay ৳{finalAmount}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* --- RIGHT: ORDER SUMMARY --- */}
                <div className="bg-gray-50 p-8 h-fit">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em] mb-8">Order Summary</h2>
                    <div className="space-y-6 max-h-[400px] overflow-y-auto mb-8 pr-2">
                        {cart.map((item, idx) => {
                            const hasDiscount = item.discount && item.discount > 0;
                            const currentUnitPrice = hasDiscount 
                                ? Math.round(item.price - (item.price * item.discount / 100)) 
                                : item.price;

                            return (
                                <div key={idx} className="flex gap-4 items-center">
                                    <div className="w-16 h-20 bg-white border flex-shrink-0 relative">
                                        <img src={item.images[0]} className="w-full h-full object-cover" alt="" />
                                        {hasDiscount && (
                                            <div className="absolute top-0 left-0 bg-rose-500 text-white text-[7px] font-black px-1 uppercase">
                                                -{item.discount}%
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-[10px] font-black uppercase tracking-tight">{item.name}</h4>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase">Size: {item.size} | Qty: {item.quantity}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[11px] font-black italic">৳{currentUnitPrice * item.quantity}</p>
                                            {hasDiscount && (
                                                <p className="text-[9px] text-gray-400 line-through font-bold">৳{item.price * item.quantity}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>Subtotal</span>
                            <span>৳{subtotal}</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                            <span>Shipping</span>
                            <span>৳{shipping}</span>
                        </div>
                        <div className="flex justify-between text-base font-black uppercase italic pt-4 border-t border-gray-200 mt-4">
                            <span>Total</span>
                            <span className="text-black">৳{finalAmount}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;