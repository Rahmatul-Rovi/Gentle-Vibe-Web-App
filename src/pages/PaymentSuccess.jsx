import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const PaymentSuccess = () => {
    const { tranId } = useParams();

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="bg-green-50 p-10 text-center space-y-6 max-w-lg w-full">
                <div className="flex justify-center">
                    <CheckCircle size={80} className="text-green-500 animate-bounce" />
                </div>
                <h1 className="text-4xl font-black uppercase italic tracking-tighter">Order Confirmed</h1>
                <p className="text-gray-600 text-sm font-medium">
                    Your payment was successful. We’ve received your order and started preparing it.
                </p>
                <div className="bg-white py-3 border border-dashed border-gray-300">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Transaction ID</span>
                    <p className="font-mono font-bold text-black">{tranId}</p>
                </div>
                <Link to="/" className="block w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;