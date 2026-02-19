import React from 'react';

const BrandStory = () => {
  return (
    <div className="py-24 bg-black text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
             <div className="absolute -top-10 -left-10 text-[150px] font-black opacity-10 leading-none select-none">GV</div>
             <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter italic leading-none mb-8">
                ONE POINT PLUS <br /> Philosophy
             </h2>
             <p className="text-gray-400 text-lg leading-relaxed mb-6">
                We believe that fashion is more than just clothing; it's an expression of identity. 
                Our pieces are designed for those who find beauty in minimalism and strength in subtlety.
             </p>
             <p className="text-gray-400 text-lg leading-relaxed italic border-l-4 border-yellow-400 pl-6">
                "Quality over quantity, always. Designed in Dhaka, built for the world."
             </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop" className="w-full h-80 object-cover grayscale hover:grayscale-0 transition-all duration-700" alt="Vibe 1" />
            <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" className="w-full h-80 object-cover mt-12 grayscale hover:grayscale-0 transition-all duration-700" alt="Vibe 2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStory;