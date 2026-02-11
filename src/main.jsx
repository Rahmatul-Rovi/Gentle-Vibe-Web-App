import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/APPRoutes' 
import AuthProvider from './providers/AuthProvider' 
// 1. Import your new CartProvider
import { CartProvider } from './context/CartContext' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* 2. Wrap the RouterProvider with CartProvider */}
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)