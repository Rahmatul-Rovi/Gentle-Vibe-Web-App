import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // ১. লোকাল স্টোরেজ থেকে ডেটা লোড করা
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('gentle_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // ২. কার্টে যখনই পরিবর্তন হবে, লোকাল স্টোরেজ আপডেট হবে
    useEffect(() => {
        localStorage.setItem('gentle_cart', JSON.stringify(cart));
    }, [cart]);

    // ৩. কার্টে প্রোডাক্ট যোগ করার লজিক
    const addToCart = (product, selectedSize, selectedColor) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                item => item._id === product._id && 
                        item.size === selectedSize && 
                        item.color === selectedColor
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item === existingItem 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            }

            return [...prevCart, { ...product, size: selectedSize, color: selectedColor, quantity: 1 }];
        });
    };

    // ৪. কার্ট থেকে প্রোডাক্ট কমানোর লজিক (কোয়ান্টিটি ১ করে কমবে)
    const removeFromCart = (id, size, color, forceDelete = false) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                item => item._id === id && item.size === size && item.color === color
            );

            // যদি forceDelete ট্রু হয় অথবা কোয়ান্টিটি ১ থাকে, তবে আইটেমটা রিমুভ করে দাও
            if (forceDelete || (existingItem && existingItem.quantity === 1)) {
                return prevCart.filter(item => 
                    !(item._id === id && item.size === size && item.color === color)
                );
            }

            // নাহলে শুধু কোয়ান্টিটি ১ কমাও
            return prevCart.map(item =>
                (item._id === id && item.size === size && item.color === color)
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
        });
    };

    // ৫. পুরো কার্ট একবারে পরিষ্কার করা (পেমেন্ট সাকসেস হলে এটা ব্যবহার করবেন)
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('gentle_cart');
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);