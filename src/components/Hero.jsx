import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';

const Hero = () => {
  return (
    <div className="relative w-full h-[80vh] bg-gray-100 flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop" 
          alt="Fashion Collection" 
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/20"></div> 
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl text-white">
          <span className="uppercase tracking-widest text-sm mb-4 block font-semibold">
            New Arrival 2026
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Elevate Your <br /> 
            <span className="text-yellow-400">Personal Style.</span>
          </h1>
          <p className="text-lg mb-8 text-gray-100">
            Discover the latest trends in premium fashion. Quality materials meets 
            modern design for your everyday wardrobe.
          </p>
          
          <div className="flex gap-4">
          <Link to="collections/mens">
            <button className="btn btn-lg bg-white text-black border-none hover:bg-gray-200 rounded-none px-8">
              Shop Men
            </button>
          </Link>
          <Link to="collections/womens">
            <button className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-black rounded-none px-8">
              Shop Women
            </button>
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;