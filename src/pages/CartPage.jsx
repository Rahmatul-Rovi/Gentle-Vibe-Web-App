import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, addToCart, removeFromCart, clearCart } = useCart();

    // Calculate Subtotal
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 70; // Fixed shipping for premium feel

    if (cart.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-4xl font-black uppercase italic text-gray-200">Your Bag is Empty</h2>
                <Link to="/" className="bg-black text-white px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-20">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic mb-12">Your Bag</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                {/* Left: Item List */}
                <div className="lg:col-span-2 space-y-8">
                    {cart.map((item) => (
                        <div key={`${item._id}-${item.size}-${item.color}`} className="flex gap-6 border-b pb-8 border-gray-100">
                            <div className="w-32 h-40 bg-gray-100 overflow-hidden">
                                <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between">
                                        <h3 className="font-bold uppercase text-sm">{item.name}</h3>
                                        <button onClick={() => removeFromCart(item._id, item.size, item.color)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest">
                                        Size: {item.size} | Color: {item.color}
                                    </p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex items-center border border-black px-3 py-1 gap-4">
                                        <button onClick={() => removeFromCart(item._id, item.size, item.color)}><Minus size={14}/></button>
                                        <span className="text-sm font-bold">{item.quantity}</span>
                                        <button onClick={() => addToCart(item, item.size, item.color)}><Plus size={14}/></button>
                                    </div>
                                    <p className="font-black">${item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right: Order Summary */}
                <div className="bg-gray-50 p-8 h-fit space-y-6">
                    <h3 className="font-black uppercase tracking-widest text-sm">Order Summary</h3>
                    <div className="space-y-4 border-b pb-6">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 uppercase font-bold text-[10px]">Subtotal</span>
                            <span className="font-bold">${subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500 uppercase font-bold text-[10px]">Shipping</span>
                            <span className="font-bold">${shipping}</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="font-black uppercase italic">Total</span>
                        <span className="text-2xl font-black">${subtotal + shipping}</span>
                    </div>
                    <Link to="/checkout" className="w-full bg-black text-white py-5 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest hover:bg-gray-800 transition-all">
                        Checkout <ArrowRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartPage;