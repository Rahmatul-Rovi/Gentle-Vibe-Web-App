import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react'; // Ekta sleek icon-er jonno

const Categories = () => {
  const cats = [
    { 
      name: 'Mens Wear', 
      path: '/collections/mens',
      img: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=1964&auto=format&fit=crop' 
    },
   { 
  name: 'Womens Wear', 
  path: '/collections/womens',
  // Hijab pora elegant ar marjito chobi
  img: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1935&auto=format&fit=crop' 
},
    { 
      name: 'All Collections', 
      path: '/shop',
      img: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop' 
    }
  ];

  return (
    <div className="py-32 bg-[#fafafa]"> {/* Background-ta aktu off-white rakhlam premium look-er jonno */}
      <div className="container mx-auto px-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16">
          <div className="max-w-xl">
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-[ -0.05em] leading-none mb-4 italic">
              The Vibe <br /> <span className="text-gray-300">Vault</span>
            </h2>
            <p className="text-gray-500 font-medium tracking-tight">Curated selections for the modern lifestyle. Quality over quantity, always.</p>
          </div>
          <div className="hidden md:block h-[1px] flex-1 bg-black/5 mx-12 mb-4"></div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
            Selected / 026
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cats.map((cat, index) => (
            <Link 
              to={cat.path} 
              key={index} 
              className="relative group overflow-hidden h-[750px] bg-gray-200"
            >
              {/* Subtle Overlay with Image */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-700 z-10"></div>
              
              <img 
                src={cat.img} 
                className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105 ease-out" 
                alt={cat.name} 
              />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-10 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <div className="overflow-hidden">
                  <span className="inline-block text-white/60 text-[10px] font-bold tracking-[0.4em] uppercase mb-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    Discover
                  </span>
                </div>
                
                <h3 className="text-white text-4xl font-black uppercase tracking-tighter italic leading-tight flex items-center justify-between">
                  {cat.name}
                  <ArrowUpRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500 text-white" size={32} />
                </h3>

                {/* Bottom line and button */}
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-white group-hover:w-full transition-all duration-700 origin-left"></div>
                  <span className="whitespace-nowrap text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                    Explore Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;