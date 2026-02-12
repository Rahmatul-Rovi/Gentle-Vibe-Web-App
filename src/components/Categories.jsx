const Categories = () => {
  const cats = [
    { name: 'Mens Wear', img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop' },
    { name: 'Womens Wear', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop' },
    { name: 'New Drops', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
           <h2 className="text-4xl font-black uppercase tracking-tighter italic">Explore</h2>
           <div className="h-[2px] flex-1 bg-black/10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cats.map((cat, index) => (
            <div key={index} className="relative group overflow-hidden cursor-pointer h-[600px] bg-gray-100">
              {/* Image with subtle zoom and grayscale effect */}
              <img 
                src={cat.img} 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0" 
                alt={cat.name} 
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                <span className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-2">Collection</span>
                <h3 className="text-white text-3xl font-black uppercase tracking-tighter italic mb-4">{cat.name}</h3>
                
                {/* Minimal Button that appears on hover */}
                <div className="h-[2px] w-0 bg-white group-hover:w-full transition-all duration-500"></div>
                <button className="text-white text-left mt-4 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Shop Now +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;