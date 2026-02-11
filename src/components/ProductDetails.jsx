import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext'; // Import your Cart Hook
import Swal from 'sweetalert2'; // Import SweetAlert

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    
    // 1. Get the addToCart function from our Global Context
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
                
                // Auto-select first size and color if they exist
                if (res.data.sizes.length > 0) setSelectedSize(res.data.sizes[0]);
                if (res.data.colors.length > 0) setSelectedColor(res.data.colors[0]);
                
                // Scroll to top when product loads
                window.scrollTo(0, 0);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    // 2. The Logic to handle "Add to Bag" click
    const handleAddToBag = () => {
        if (!selectedSize || !selectedColor) {
            return Swal.fire({
                icon: 'warning',
                text: 'Please select size and color first!',
                confirmButtonColor: '#000'
            });
        }

        // Add to global state
        addToCart(product, selectedSize, selectedColor);

        // Professional success notification
        Swal.fire({
            icon: 'success',
            title: 'Added to Bag',
            text: `${product.name} is ready for checkout!`,
            showConfirmButton: false,
            timer: 1500,
            background: '#fff',
        });
    };

    if (!product) return <div className="h-screen flex items-center justify-center uppercase font-black tracking-widest text-gray-400 animate-pulse">Loading Vibe...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Left: Image Section */}
            <div className="bg-[#f5f5f5] aspect-[3/4] overflow-hidden group">
                <img 
                    src={product.images[0]} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    alt={product.name} 
                />
            </div>

            {/* Right: Info Section */}
            <div className="flex flex-col">
                <span className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.4em] mb-2">{product.category}</span>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 italic leading-none">{product.name}</h1>
                <p className="text-2xl font-bold mb-6">${product.price}</p>
                <p className="text-gray-600 mb-8 leading-relaxed text-sm">{product.description}</p>

                {/* Size Selection */}
                <div className="mb-6">
                    <p className="text-[10px] font-black uppercase mb-3 tracking-widest text-gray-400">Select Size</p>
                    <div className="flex gap-3">
                        {product.sizes.map(size => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-6 py-2 border text-[10px] font-black uppercase transition-all duration-300 ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black hover:border-black'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div className="mb-10">
                    <p className="text-[10px] font-black uppercase mb-3 tracking-widest text-gray-400">Available Colors</p>
                    <div className="flex gap-4">
                        {product.colors.map(color => (
                            <button 
                                key={color}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${selectedColor === color ? 'border-black scale-125 shadow-lg' : 'border-transparent'}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-4">
                    {/* Updated Button with handleAddToBag */}
                    <button 
                        onClick={handleAddToBag}
                        className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-3 active:scale-95"
                    >
                        <ShoppingBag size={18} /> Add to Bag
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4 mt-10 border-t pt-8">
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            <Truck size={16} className="text-black" /> Fast Delivery
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                            <ShieldCheck size={16} className="text-black" /> 100% Authentic
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;