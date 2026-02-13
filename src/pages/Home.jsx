import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandStory from '../components/BrandStory'; 
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import Swal from 'sweetalert2'; 
import { useCart } from '../context/CartContext'; 
import Testimonials from './Testimonials';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Context theke function ta nilam

    useEffect(() => {
        const getProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                if (res.data) {
                    setProducts(res.data.slice(0, 8)); 
                }
                setLoading(false);
            } catch (err) {
                console.error("Data fetch error:", err);
                setLoading(false);
            }
        };
        getProducts();
    }, []);

    // Home page theke quick add korar logic (Jodi keu details page-e na niye sorasori add korte chay)
    const handleQuickAdd = (product, e) => {
        e.stopPropagation(); // Image click jate trigger na hoy
        
        // Size/Color thakle prothomta default dhore nibe
        const selectedSize = product.sizes?.[0] || "M";
        const selectedColor = product.colors?.[0] || "Default";

        addToCart(product, selectedSize, selectedColor);

        Swal.fire({
            icon: 'success',
            title: 'Added to Bag',
            text: `${product.name} is ready for checkout!`,
            showConfirmButton: false,
            timer: 1500,
            background: '#fff',
        });
    };

    return (
        <div className="bg-white">
            <Hero />
            <Categories />

            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                             <span className="w-8 h-[2px] bg-black"></span>
                             <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em]">Premium Quality</p>
                        </div>
                        <h2 className="text-5xl font-black uppercase tracking-tighter italic leading-none">New Arrivals</h2>
                    </div>
                    <button onClick={() => navigate('/shop')} className="flex items-center gap-2 text-xs font-black border-b-2 border-black pb-1 uppercase tracking-widest hover:translate-x-2 transition-all">
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
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} className="group cursor-pointer">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f3f3f3] mb-6">
                                        <img 
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x500?text=No+Image'} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-6 left-0 right-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3">
                                            
                                            {/* Cart Button: Quick Add logic use korsi */}
                                            <button 
                                                onClick={(e) => handleQuickAdd(product, e)} 
                                                className="bg-white text-black p-4 shadow-xl hover:bg-black hover:text-white transition-all"
                                            >
                                                <ShoppingCart size={18} />
                                            </button>
                                            
                                            {/* Eye Button: Details page-e niye jabe */}
                                            <button 
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="bg-white text-black p-4 shadow-xl hover:bg-black hover:text-white transition-all"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{product.category}</p>
                                        <h3 
                                            onClick={() => navigate(`/product/${product._id}`)}
                                            className="text-sm font-black uppercase tracking-tight leading-none group-hover:text-gray-600 transition-colors"
                                        >
                                            {product.name}
                                        </h3>
                                        <div className="flex gap-3 items-center justify-center font-bold">
                                            <span className="text-lg text-black">৳{product.price}</span>
                                            {product.discountPrice && (
                                                <span className="text-xs text-gray-400 line-through font-normal">৳{product.discountPrice}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-gray-400 uppercase font-black">No products found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Testimonials></Testimonials>

            <BrandStory />

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