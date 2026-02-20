import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag, Truck, ShieldCheck, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [mainImage, setMainImage] = useState(""); 
    
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
                
                // Initial settings
                setMainImage(res.data.images[0]); 
                if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0]);
                if (res.data.colors?.length > 0) setSelectedColor(res.data.colors[0]);
                
                window.scrollTo(0, 0);
            } catch (err) {
                console.error("Error fetching product:", err);
            }
        };
        fetchProduct();
    }, [id]);

    const handleColorClick = (color, index) => {
        setSelectedColor(color);
        if (product.images[index]) {
            setMainImage(product.images[index]);
        }
    };

    const handleAddToBag = () => {
        if (product.stock <= 0) {
            return Swal.fire({
                icon: 'error',
                title: 'Out of Stock',
                text: 'This vibe is currently unavailable!',
                confirmButtonColor: '#000'
            });
        }

        if (!selectedSize || !selectedColor) {
            return Swal.fire({
                icon: 'warning',
                text: 'Please select size and color!',
                confirmButtonColor: '#000'
            });
        }

        addToCart(product, selectedSize, selectedColor);
        
        Swal.fire({
            icon: 'success',
            title: 'Added to Bag',
            text: `${product.name} is ready for checkout!`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    if (!product) return (
        <div className="h-screen flex items-center justify-center uppercase font-black tracking-[0.5em] text-gray-300 animate-pulse">
            Loading Vibe...
        </div>
    );

    // Discount Calculation
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount 
        ? Math.round(product.price - (product.price * product.discount / 100)) 
        : product.price;

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-20">
            {/* Back Button */}
            <Link to="/shop" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-10 hover:ml-2 transition-all">
                <ChevronLeft size={14} /> Back to Collection
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
                
                {/* --- LEFT: IMAGE SECTION --- */}
                <div className="flex flex-col gap-4">
                    <div className="bg-[#f9f9f9] aspect-[3/4] overflow-hidden group relative">
                        <img 
                            src={mainImage} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                            alt={product.name} 
                        />
                        {product.stock <= 0 && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-white text-black px-8 py-3 font-black uppercase tracking-[0.3em] text-xs">Sold Out</span>
                            </div>
                        )}
                        {/* Discount Badge on Image */}
                        {hasDiscount && product.stock > 0 && (
                            <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 font-black text-[10px] uppercase tracking-widest animate-pulse">
                                {product.discount}% OFF
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {product.images.map((img, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setMainImage(img)}
                                className={`w-20 h-24 flex-shrink-0 border-2 transition-all ${mainImage === img ? 'border-black' : 'border-transparent opacity-60'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT: INFO SECTION --- */}
                <div className="flex flex-col">
                    <span className="text-gray-400 uppercase text-[10px] font-bold tracking-[0.4em] mb-2">
                        {product.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic leading-none">
                        {product.name}
                    </h1>

                    {/* --- PRICE LOGIC --- */}
                    <div className="mb-8">
                        {hasDiscount ? (
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl font-black text-emerald-600 italic">৳{discountedPrice}</span>
                                    <span className="text-xl text-gray-400 line-through font-bold">৳{product.price}</span>
                                </div>
                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
                                    You save ৳{product.price - discountedPrice}
                                </p>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-black/80 italic">৳{product.price}</p>
                        )}
                    </div>
                    
                    <div className="h-[1px] bg-gray-100 w-full mb-8" />

                    <p className="text-gray-500 mb-10 leading-relaxed text-sm tracking-wide">
                        {product.description}
                    </p>

                    {/* Size Selection */}
                    <div className="mb-8">
                        <div className="flex justify-between mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black">Select Size</p>
                            <button className="text-[10px] font-bold uppercase tracking-widest text-gray-400 underline">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map(size => (
                                <button 
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`min-w-[60px] py-3 border text-[10px] font-black uppercase transition-all ${selectedSize === size ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-black hover:border-black'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-12">
                        <p className="text-[10px] font-black uppercase mb-4 tracking-widest text-black">Available Colors</p>
                        <div className="flex gap-4">
                            {product.colors.map((color, index) => (
                                <button 
                                    key={color}
                                    onClick={() => handleColorClick(color, index)}
                                    className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor === color ? 'border-black scale-110 shadow-md' : 'border-gray-100'}`}
                                    title={color}
                                >
                                    <span 
                                        className="w-8 h-8 rounded-full border border-black/5" 
                                        style={{ backgroundColor: color.toLowerCase() }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        onClick={handleAddToBag}
                        disabled={product.stock <= 0}
                        className={`w-full py-6 font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 ${
                            product.stock <= 0 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-zinc-900 shadow-2xl shadow-black/20'
                        }`}
                    >
                        <ShoppingBag size={18} /> 
                        {product.stock <= 0 ? 'Out of Stock' : 'Add to Bag'}
                    </button>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 gap-4 mt-12 pt-8 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">
                            <Truck size={18} className="text-black" /> 24-48h Delivery
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase text-gray-500 tracking-[0.2em]">
                            <ShieldCheck size={18} className="text-black" /> Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;