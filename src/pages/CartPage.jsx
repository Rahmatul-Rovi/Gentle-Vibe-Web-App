import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cart, addToCart, removeFromCart, clearCart } = useCart();

    const isStockExceeded = cart.some(item => item.quantity > item.stock);

    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 70 : 0;

    if (cart.length === 0) {
        return (
            <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
                <div className="bg-gray-50 p-10 rounded-full">
                    <ShoppingBag size={80} className="text-gray-200" />
                </div>
                <h2 className="text-4xl font-black uppercase italic text-gray-300 tracking-tighter">Your Bag is Empty</h2>
                <p className="text-gray-400 font-medium tracking-wide">Looks like you haven't added any vibes yet.</p>
                <Link to="/shop" className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all active:scale-95 shadow-xl">
                    Back to Collection
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <div className="flex justify-between items-end mb-12 border-b pb-8 border-gray-100">
                <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-black">
                    Your <br /> Bag
                </h1>
                <button 
                    onClick={clearCart}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline mb-2"
                >
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
                
                {/* --- LEFT: ITEM LIST --- */}
                <div className="lg:col-span-2 space-y-10">
                    {cart.map((item) => (
                        <div 
                            key={`${item._id}-${item.size}-${item.color}`} 
                            className={`flex gap-6 md:gap-8 group border-b pb-10 transition-all ${item.quantity > item.stock ? 'border-red-100 bg-red-50/30 p-4 -m-4' : 'border-gray-50'}`}
                        >
                            <div className="w-28 h-36 md:w-40 md:h-52 bg-[#f9f9f9] overflow-hidden flex-shrink-0">
                                <img 
                                    src={item.images[0]} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                            
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-black uppercase text-base md:text-lg tracking-tight leading-none mb-2">{item.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">
                                                {item.size} / {item.color}
                                            </p>
                                            
                                            {/* Stock warning message */}
                                            {item.quantity >= item.stock && (
                                                <p className="text-[9px] text-orange-600 font-bold mt-2 flex items-center gap-1 uppercase">
                                                    <AlertCircle size={10} /> 
                                                    {item.quantity > item.stock ? "Exceeds available stock!" : `Only ${item.stock} left in stock`}
                                                </p>
                                            )}
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item._id, item.size, item.color, true)} 
                                            className="text-gray-300 hover:text-black transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="flex items-center border border-black h-10 px-4 gap-6">
                                        <button 
                                            className="hover:scale-125 transition-transform"
                                            onClick={() => removeFromCart(item._id, item.size, item.color)}
                                        >
                                            <Minus size={14}/>
                                        </button>
                                        <span className={`text-sm font-black w-4 text-center ${item.quantity > item.stock ? 'text-red-600' : ''}`}>
                                            {item.quantity}
                                        </span>
                                        <button 
                                            // Plus button disabel after stcok clear
                                            disabled={item.quantity >= item.stock}
                                            className={`transition-transform ${item.quantity >= item.stock ? 'opacity-20 cursor-not-allowed' : 'hover:scale-125'}`}
                                            onClick={() => addToCart(item, item.size, item.color)}
                                        >
                                            <Plus size={14}/>
                                        </button>
                                    </div>
                                    <p className="font-black text-lg md:text-xl">৳{item.price * item.quantity}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- RIGHT: ORDER SUMMARY --- */}
                <div className="relative">
                    <div className="bg-gray-50 p-8 sticky top-24 space-y-8">
                        <h3 className="font-black uppercase tracking-[0.2em] text-[10px] text-gray-400">Order Summary</h3>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                                <span className="font-black">৳{subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Shipping</span>
                                <span className="font-black">৳{shipping}</span>
                            </div>
                            <div className="h-[1px] bg-gray-200 my-4" />
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-black uppercase italic text-lg tracking-tighter">Total</span>
                                <span className="text-3xl font-black">৳{subtotal + shipping}</span>
                            </div>
                        </div>

                        <div className="pt-4 space-y-4">
                            {/* ৪. চেকআউট বাটন ডিজেবল হবে যদি কোনো আইটেম স্টকের বেশি থাকে */}
                            <Link 
                                to={isStockExceeded ? "#" : "/checkout"} 
                                onClick={(e) => isStockExceeded && e.preventDefault()}
                                className={`w-full py-5 flex items-center justify-center gap-3 font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl shadow-black/10 active:scale-95 ${
                                    isStockExceeded 
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                                    : 'bg-black text-white hover:bg-zinc-800'
                                }`}
                            >
                                {isStockExceeded ? "Update Cart to Checkout" : "Checkout"} <ArrowRight size={16} />
                            </Link>
                            
                            {isStockExceeded && (
                                <p className="text-red-500 text-[10px] font-bold text-center animate-pulse">
                                    Some items are out of stock or exceed limit!
                                </p>
                            )}
                            
                            <p className="text-[9px] text-gray-400 font-medium text-center leading-relaxed">
                                Shipping, duties and taxes calculated at checkout.<br />
                                100% Secure payment via SSLCommerz.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;