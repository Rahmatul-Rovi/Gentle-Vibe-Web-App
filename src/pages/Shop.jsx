import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Search, Filter, Loader2 } from 'lucide-react';

const Shop = () => {
    const { category } = useParams(); // URL theke 'mens' ba 'womens' nibe
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Backend API-te category pathano
                const url = category 
                    ? `http://localhost:5000/api/products?category=${category}` 
                    : `http://localhost:5000/api/products`;
                const res = await axios.get(url);
                setProducts(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]); // Category change hoile abar call hobe

    // --- Filtering Logic ---
    const filteredProducts = products
        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) // Search filter
        .sort((a, b) => {
            if (sortOrder === 'lowToHigh') return a.price - b.price;
            if (sortOrder === 'highToLow') return b.price - a.price;
            return new Date(b.createdAt) - new Date(a.createdAt); // Newest first
        });

    if (loading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin" size={40}/></div>;

    return (
        <div className="container mx-auto px-4 py-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter">
                        {category ? category : "All Collections"}
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
                        Showing {filteredProducts.length} items
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                        <input 
                            type="text" 
                            placeholder="SEARCH ITEMS..." 
                            className="w-full bg-gray-50 border-none py-3 pl-10 pr-4 text-xs font-bold focus:ring-1 focus:ring-black outline-none"
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Sort Filter */}
                    <select 
                        className="bg-gray-50 border-none py-3 px-4 text-xs font-bold focus:ring-1 focus:ring-black outline-none"
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        <option value="newest">NEWEST ARRIVALS</option>
                        <option value="lowToHigh">PRICE: LOW TO HIGH</option>
                        <option value="highToLow">PRICE: HIGH TO LOW</option>
                    </select>
                </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map(product => (
                        <div key={product._id} className="group cursor-pointer">
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {product.isNew && (
                                    <span className="absolute top-4 left-4 bg-black text-white text-[8px] font-black px-3 py-1 uppercase italic tracking-widest">New</span>
                                )}
                            </div>
                            <h3 className="text-sm font-black uppercase tracking-tight truncate">{product.name}</h3>
                            <p className="text-gray-500 text-xs font-bold mt-1">৳{product.price}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl">
                    <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No products found</p>
                </div>
            )}
        </div>
    );
};

export default Shop;