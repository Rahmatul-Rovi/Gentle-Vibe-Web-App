import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Load cart from localStorage on startup
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('gentle_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('gentle_cart', JSON.stringify(cart));
    }, [cart]);

    // LOGIC: Add to Cart
    const addToCart = (product, selectedSize, selectedColor) => {
        setCart((prevCart) => {
            // Check if same product with same size/color exists
            const existingItem = prevCart.find(
                item => item._id === product._id && item.size === selectedSize && item.color === selectedColor
            );

            if (existingItem) {
                // If exists, increase quantity
                return prevCart.map(item =>
                    item === existingItem ? { ...item, quantity: item.quantity + 1 } : item
                );
            }

            // If new, add to array
            return [...prevCart, { ...product, size: selectedSize, color: selectedColor, quantity: 1 }];
        });
    };

    // LOGIC: Remove from Cart
    const removeFromCart = (id, size, color) => {
        setCart(cart.filter(item => !(item._id === id && item.size === size && item.color === color)));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);