import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);

    // Step 1: Database theke data niye asha
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (err) {
                console.log("Data fetch korte error hoyeche");
            }
        };
        fetchProducts();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 text-center italic">
                The Gentle Collection
            </h2>

            {/* Step 2: Product Grid mapping */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                    <div key={item._id} className="group relative border border-gray-100 p-2 hover:shadow-xl transition-all duration-300">
                        {/* Image Section */}
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                            <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Hover-e dekhanor jonno Quick Add button */}
                            <button className="absolute bottom-0 left-0 w-full bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs font-bold">
                                <ShoppingBag size={16} /> Add to Cart
                            </button>
                        </div>

                        {/* Text Section */}
                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                            <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                            <p className="text-gray-600 font-medium mt-1">${item.price}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;