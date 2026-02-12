import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import BrandStory from '../components/BrandStory'; 
import Hero from '../components/Hero';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                // Home page e shob na dekhiye top 8 products dekhale bhalo hoy
                setProducts(res.data.slice(0, 8)); 
                setLoading(false);
            } catch (err) {
                console.error("Data fetch korte error:", err);
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    return (
        <div className="bg-white">
            {/* 1. HERO SECTION */}
            <Hero></Hero>

            {/* 2. PRODUCT SECTION (New Arrivals) */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="w-8 h-[2px] bg-black"></span>
                             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Premium Quality</p>
                        </div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">New Arrivals</h2>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-black border-b-2 border-black pb-1 uppercase tracking-widest hover:translate-x-2 transition-all">
                        View All <ArrowRight size={14}/>
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-none"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
                        {products.map((product) => (
                            <div key={product._id} className="group">
                                {/* Image Wrapper */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f3] mb-6">
                                    <img 
                                        src={product.images[0]} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                    />
                                    {/* Overlay Buttons */}
                                    <div className="absolute bottom-6 left-0 right-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3">
                                        <button className="bg-white text-black p-4 shadow-xl hover:bg-black hover:text-white transition-all">
                                            <ShoppingCart size={18} />
                                        </button>
                                        <button className="bg-white text-black p-4 shadow-xl hover:bg-black hover:text-white transition-all">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="space-y-2 text-center">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
                                    <h3 className="text-sm font-black uppercase tracking-tight leading-none group-hover:text-gray-600 transition-colors">
                                        {product.name}
                                    </h3>
                                    <div className="flex gap-3 items-center justify-center">
                                        <span className="font-bold text-lg text-black">৳{product.price}</span>
                                        {product.discountPrice && (
                                            <span className="text-xs text-gray-400 line-through">৳{product.discountPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 3. BRAND STORY SECTION */}
            <BrandStory />

            {/* 4. NEWSLETTER (Extra Premium Touch) */}
            <div className="bg-slate-50 py-20 border-t border-slate-100">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Don't miss a drop</h3>
                    <p className="text-slate-500 text-sm font-medium mb-8">Sign up for exclusive early access to new collections.</p>
                    <div className="flex bg-white p-2 border border-slate-200">
                        <input type="email" placeholder="ENTER YOUR EMAIL" className="flex-1 px-4 outline-none font-bold text-xs" />
                        <button className="bg-black text-white px-8 py-3 text-xs font-black uppercase hover:bg-slate-800 transition-all">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;