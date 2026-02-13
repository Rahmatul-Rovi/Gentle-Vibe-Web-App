import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti'; 

const PaymentSuccess = () => {
    const { tranId } = useParams();

    useEffect(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

    return (
        <div className="h-screen flex flex-col items-center justify-center space-y-6">
            <CheckCircle size={80} className="text-emerald-500 animate-bounce" />
            <h1 className="text-4xl font-black uppercase italic tracking-tighter">Payment Successful!</h1>
            <p className="text-gray-500 font-medium">Your transaction ID: <span className="text-black font-bold">{tranId}</span></p>
            
            <div className="flex gap-4 mt-8">
                <Link to="/user/profile" className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Go to Dashboard
                </Link>
                <Link to="/" className="border border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-all">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;