import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye } from 'lucide-react'; // Tailwind & Lucide icons

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                // Tomar backend API route
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Data fetch korte error:", err);
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    if (loading) return <div className="text-center py-20 uppercase font-bold tracking-widest">Loading Collection...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">New Arrivals</h2>
                    <p className="text-gray-500 text-sm uppercase tracking-widest">Gentle Vibe Premium Quality</p>
                </div>
                <button className="text-xs font-bold border-b-2 border-black pb-1 uppercase tracking-widest hover:text-gray-500 transition-all">View All</button>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
                {products.map((product) => (
                    <div key={product._id} className="group cursor-pointer">
                        {/* Image Wrapper */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                            <img 
                                src={product.images[0]} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            {/* Overlay Buttons */}
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <button className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
                                    <ShoppingCart size={20} />
                                </button>
                                <button className="bg-white p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-1">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
                            <h3 className="text-sm font-bold uppercase tracking-tight group-hover:underline">{product.name}</h3>
                            <div className="flex gap-3 items-center">
                                <span className="font-bold text-black">${product.price}</span>
                                {product.discountPrice && (
                                    <span className="text-xs text-gray-400 line-through">${product.discountPrice}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;