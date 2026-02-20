import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('gentle_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('gentle_cart', JSON.stringify(cart));
    }, [cart]);

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

    const removeFromCart = (id, size, color, forceDelete = false) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                item => item._id === id && item.size === size && item.color === color
            );

            if (forceDelete || (existingItem && existingItem.quantity === 1)) {
                return prevCart.filter(item => 
                    !(item._id === id && item.size === size && item.color === color)
                );
            }

            return prevCart.map(item =>
                (item._id === id && item.size === size && item.color === color)
                ? { ...item, quantity: item.quantity - 1 }
                : item
            );
        });
    };

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