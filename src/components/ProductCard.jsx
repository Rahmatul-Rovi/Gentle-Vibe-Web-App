import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Plus, Minus, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const ProductCard = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                const productsWithQty = res.data.map(p => ({ ...p, qty: 1 }));
                setProducts(productsWithQty);
                setFilteredProducts(productsWithQty);
            } catch (err) {
                console.log("Data fetch error");
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        let result = products;
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedCategory !== "All") {
            result = result.filter(p => p.category === selectedCategory);
        }
        setFilteredProducts(result);
    }, [searchTerm, selectedCategory, products]);

    const handleIncrease = (id) => {
        setProducts(prev => prev.map(item => 
            item._id === id ? { ...item, qty: item.qty + 1 } : item
        ));
    };

    const handleDecrease = (id) => {
        setProducts(prev => prev.map(item => 
            item._id === id ? { ...item, qty: item.qty > 1 ? item.qty - 1 : 1 } : item
        ));
    };

    const onAddToCart = (item) => {
        const size = item.sizes?.[0] || "M";
        const color = item.colors?.[0] || "Default";

        for(let i = 0; i < item.qty; i++){
            addToCart(item, size, color);
        }

        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `${item.qty} ${item.name} added to bag.`,
            showConfirmButton: false,
            timer: 1000,
            toast: true,
            position: 'top-end'
        });
    };

    const categories = ["All", ...new Set(products.map(p => p.category))];

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* SEARCH & FILTER UI */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <h2 className="text-4xl font-black uppercase tracking-tighter italic">The Collection</h2>
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search vibes..." 
                            className="pl-10 pr-4 py-2 bg-gray-50 border-none text-xs font-bold uppercase tracking-widest focus:ring-1 focus:ring-black w-full"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select 
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-gray-50 border-none text-[10px] font-bold uppercase tracking-widest py-2 px-4 focus:ring-1 focus:ring-black"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((item) => (
                    <div key={item._id} className="group relative border border-gray-100 p-2 hover:shadow-xl transition-all duration-300 bg-white">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                            <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${item.stock <= 0 ? 'grayscale opacity-50' : ''}`}
                            />
                            {item.stock <= 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <span className="bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-widest">Sold Out</span>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => onAddToCart(item)}
                                    className="absolute bottom-0 left-0 w-full bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs font-bold"
                                >
                                    <ShoppingBag size={16} /> Add {item.qty} to Cart
                                </button>
                            )}
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                            <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                            
                            {/* ✅ ডিসকাউন্ট প্রাইস সেকশন এখানে বসানো হয়েছে */}
                            <div className="mt-2 flex flex-col items-center">
                                {item.discount > 0 ? (
                                    <>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-emerald-600">
                                                ৳{Math.round(item.price * (1 - item.discount / 100))}
                                            </span>
                                            <span className="text-xs text-gray-400 line-through">
                                                ৳{item.price}
                                            </span>
                                        </div>
                                        <span className="text-[9px] font-bold bg-rose-500 text-white px-2 py-0.5 rounded-full mt-1">
                                            {item.discount}% OFF
                                        </span>
                                    </>
                                ) : (
                                    <p className="text-gray-600 font-black tracking-tighter italic">৳{item.price}</p>
                                )}
                            </div>
                            
                            {item.stock > 0 && (
                                <div className="flex items-center justify-center gap-4 mt-3 border-t pt-3">
                                    <button onClick={() => handleDecrease(item._id)} className="p-2 hover:bg-black hover:text-white rounded-full transition-all border border-gray-100"><Minus size={14} /></button>
                                    <span className="font-black text-sm w-6">{item.qty}</span>
                                    <button onClick={() => handleIncrease(item._id)} className="p-2 hover:bg-black hover:text-white rounded-full transition-all border border-gray-100"><Plus size={14} /></button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductCard;