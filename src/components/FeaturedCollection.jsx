import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products');
        setProducts(res.data.slice(0, 4)); // Shudhu top 4 products dekhabo
      } catch (err) {
        console.error("Error fetching featured products", err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">Featured Collection</h2>
            <p className="text-gray-500 mt-2">The most wanted pieces of this season.</p>
          </div>
          <Link to="/shop" className="text-black font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-all">
            VIEW ALL
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="group relative">
              <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Hover Icons */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="bg-white p-3 rounded-full hover:bg-black hover:text-white transition-all">
                    <ShoppingCart size={20} />
                  </button>
                  <Link to={`/product/${product._id}`} className="bg-white p-3 rounded-full hover:bg-black hover:text-white transition-all">
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-bold uppercase tracking-tight">{product.name}</h3>
                <p className="text-gray-600 font-medium mt-1">৳{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCollection;