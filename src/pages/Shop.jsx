import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Loader2, ShoppingBag, Eye } from 'lucide-react';

const Shop = () => {
    const { category } = useParams(); 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `http://localhost:5000/api/products`;
                if (category) {
                    url += `?category=${category}`;
                }
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => {
            if (sortOrder === 'lowToHigh') return a.price - b.price;
            if (sortOrder === 'highToLow') return b.price - a.price;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-400" size={40}/>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 md:px-10">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">
                        {category ? category.replace('-', ' ') : "All Collections"}
                    </h1>
                    <div className="h-1 w-20 bg-black mt-2"></div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="SEARCH PRODUCT..." 
                            className="w-full bg-gray-100 border-none py-4 pl-12 pr-4 text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-black outline-none"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select 
                        className="bg-gray-100 border-none py-4 px-6 text-[10px] font-bold tracking-widest focus:ring-1 focus:ring-black outline-none appearance-none cursor-pointer"
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">NEWEST</option>
                        <option value="lowToHigh">PRICE: LOW-HIGH</option>
                        <option value="highToLow">PRICE: HIGH-LOW</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="group cursor-pointer">
                            {/* Product Image Wrapper */}
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-5">
                                <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                
                                {/* Overlay & View Details Button */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <Link 
                                        to={`/product/${product._id}`}
                                        className="bg-white text-black py-3 px-6 text-[10px] font-black uppercase tracking-[3px] shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-black hover:text-white flex items-center gap-2"
                                    >
                                        <Eye size={14} /> View Details
                                    </Link>
                                </div>

                                {product.stock === 0 && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[8px] font-black px-3 py-1 uppercase italic tracking-widest">Sold Out</span>
                                )}
                            </div>

                            {/* Product Info */}
                            <Link to={`/product/${product._id}`}>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                                <h3 className="text-sm font-bold uppercase tracking-tight truncate group-hover:text-gray-600 transition-colors">
                                    {product.name}
                                </h3>
                                <p className="text-black text-sm font-black mt-1 tracking-tighter">৳{product.price}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl">
                    <ShoppingBag className="mx-auto mb-4 text-gray-200" size={48} />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Nothing found in this shelf</p>
                </div>
            )}
        </div>
    );
};

export default Shop;