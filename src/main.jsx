import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/APPRoutes' 
import AuthProvider from './providers/AuthProvider' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Pura app ekhon AuthProvider er bhetore */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)