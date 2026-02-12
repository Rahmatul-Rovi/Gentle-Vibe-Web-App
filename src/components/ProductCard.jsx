import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingBag, Plus, Minus } from 'lucide-react';

const Home = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                const productsWithQty = res.data.map(p => ({ ...p, qty: 1 }));
                setProducts(productsWithQty);
            } catch (err) {
                console.log("Data fetch error");
            }
        };
        fetchProducts();
    }, []);

    // Increase function
    const handleIncrease = (id, e) => {
        e.stopPropagation(); // Card-er onno click off rakhar jonno
        setProducts(prev => prev.map(item => 
            item._id === id ? { ...item, qty: item.qty + 1 } : item
        ));
    };

    // Decrease function (Fixing the delete issue)
   const handleDecrease = (id, e) => {
  e.stopPropagation();
  setProducts(prev =>
    prev.map(item => {
      if (item._id === id) {
        const newQty = item.qty - 1;
        return { ...item, qty: newQty < 1 ? 1 : newQty };
      }
      return item;
    })
  );
};

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 text-center italic">
                The Gentle Collection
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map((item) => (
                    <div key={item._id} className="group relative border border-gray-100 p-2 hover:shadow-xl transition-all duration-300 bg-white">
                        <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                            <img 
                                src={item.images[0]} 
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <button className="absolute bottom-0 left-0 w-full bg-black text-white py-3 translate-y-full group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 uppercase text-xs font-bold">
                                <ShoppingBag size={16} /> Add {item.qty} to Cart
                            </button>
                        </div>

                        <div className="mt-4 text-center">
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">{item.category}</p>
                            <h3 className="font-bold uppercase text-sm tracking-tight">{item.name}</h3>
                            <p className="text-gray-600 font-medium mt-1">৳{item.price}</p>

                            <div className="flex items-center justify-center gap-4 mt-3 border-t pt-3">
                                {/* MINUS BUTTON */}
                                <button 
                                    type="button"
                                    onClick={(e) => handleDecrease(item._id, e)}
                                    className="p-2 hover:bg-black hover:text-white rounded-full transition-all border border-gray-100 shadow-sm"
                                >
                                    <Minus size={14} />
                                </button>
                                
                                <span className="font-black text-sm w-6 text-black">{item.qty}</span>
                                
                                {/* PLUS BUTTON */}
                                <button 
                                    type="button"
                                    onClick={(e) => handleIncrease(item._id, e)}
                                    className="p-2 hover:bg-black hover:text-white rounded-full transition-all border border-gray-100 shadow-sm"
                                >
                                    <Plus size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;