const Categories = () => {
  const cats = [
    { name: 'Mens Wear', img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1964&auto=format&fit=crop' },
    { name: 'Womens Wear', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop' },
    { name: 'Accessories', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop' }
  ];

  return (
    <div className="py-16 container mx-auto px-4 md:px-8">
      <h2 className="text-center text-3xl font-bold mb-12 uppercase tracking-widest">Shop By Category</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cats.map((cat, index) => (
          <div key={index} className="relative group overflow-hidden cursor-pointer h-[500px]">
            <img src={cat.img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-all">
              <h3 className="text-white text-2xl font-bold border-2 border-white px-6 py-2 uppercase tracking-tighter">{cat.name}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;