import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom'; 

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
                setFilteredProducts(res.data);
            } catch (err) {
                console.log("Error fetching products:", err);
            }
        };
        fetchProducts();
    }, []);

    // Real-time Filtering Logic
    useEffect(() => {
        let result = products;

        // Search Filter
        if (searchTerm) {
            result = result.filter(p => 
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Category Filter
        if (activeCategory !== "All") {
            result = result.filter(p => p.category === activeCategory);
        }

        setFilteredProducts(result);
    }, [searchTerm, activeCategory, products]);

    const categories = ["All", ...new Set(products.map(p => p.category))];

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Collection</h2>
                    <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-bold">{filteredProducts.length} Items Found</p>
                </div>

                {/* SEARCH & FILTER CONTROLS */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text"
                            placeholder="SEARCH VIBE..."
                            className="pl-10 pr-4 py-3 bg-gray-50 border-none text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-black w-full sm:w-64"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className="bg-gray-50 border-none text-[10px] font-bold tracking-widest py-3 px-4 focus:ring-1 focus:ring-black uppercase"
                        onChange={(e) => setActiveCategory(e.target.value)}
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((item) => (
                    <div key={item._id} className="group flex flex-col">
                        <Link to={`/product/${item._id}`} className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                            <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${item.stock <= 0 ? 'grayscale opacity-50' : ''}`}
                            />
                            {item.stock <= 0 && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                                    <span className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl">View Details</span>
                            </div>
                        </Link>

                        <div className="mt-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <Link to={`/product/${item._id}`}>
                                        <h3 className="font-bold uppercase text-sm tracking-tight hover:text-gray-500 transition-colors">{item.name}</h3>
                                    </Link>
                                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{item.category}</p>
                                </div>
                                <p className="font-black text-sm">৳{item.price}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <div className="py-20 text-center uppercase font-black text-gray-300 tracking-[0.5em]">No Product Found</div>
            )}
        </div>
    );
};

export default ProductList;