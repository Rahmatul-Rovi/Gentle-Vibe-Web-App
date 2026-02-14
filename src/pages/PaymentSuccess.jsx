import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti'; 
import { useCart } from '../context/CartContext'; 

const PaymentSuccess = () => {
    const { tranId } = useParams();
    const { clearCart } = useCart(); // Direct clearCart function-ta nilam

    useEffect(() => {
        // Page load hobar sathe sathe cart faka korbe
        clearCart(); 

        // Confetti celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []); // dependency array empty rakhlam jate bar bar run na hoy

    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-8 bg-white px-4">
            <div className="relative">
                <div className="absolute inset-0 bg-emerald-100 blur-2xl rounded-full scale-150 opacity-50"></div>
                <CheckCircle size={100} className="text-emerald-500 relative animate-in zoom-in duration-500" />
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                    Payment <br /> Successful
                </h1>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-widest pt-4">
                    Transaction ID: <span className="text-black font-bold">{tranId}</span>
                </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
                <Link to="/user/orders" className="flex-1 bg-black text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all text-center flex items-center justify-center gap-2">
                    Order History <ShoppingBag size={14} />
                </Link>
                <Link to="/" className="flex-1 border border-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all text-center flex items-center justify-center gap-2">
                    Keep Shopping <ArrowRight size={14} />
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;