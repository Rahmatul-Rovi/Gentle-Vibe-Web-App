import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Star } from 'lucide-react';
// 1. Import Link from react-router-dom
import { Link } from 'react-router-dom'; 

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.log("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-10 italic">Latest Drops</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                    // 2. Wrap the whole card or specific parts with <Link>
                    <div key={item._id} className="group flex flex-col">
                        
                        {/* The Image is now clickable */}
                        <Link to={`/product/${item._id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                            <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            
                            {/* SHOP NOW Button Overlay */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl">
                                    View Details
                                </span>
                            </div>
                        </Link>

                        {/* Text Info */}
                        <div className="mt-4">
                            <Link to={`/product/${item._id}`}>
                                <h3 className="font-bold uppercase text-sm tracking-tight hover:text-gray-600 transition-colors">
                                    {item.name}
                                </h3>
                            </Link>
                            <p className="text-gray-600 font-medium">${item.price}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductList;