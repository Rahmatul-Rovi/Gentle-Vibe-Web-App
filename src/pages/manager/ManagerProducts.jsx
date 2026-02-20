import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Edit, Package, Search, AlertCircle, Tag } from "lucide-react";

const ManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditStock = (product) => {
    const currentDiscount = product.discount || 0;
    const discountedPrice = product.price - (product.price * currentDiscount / 100);

    Swal.fire({
      title: `<span style="text-transform: uppercase; font-weight: 900;">${product.name}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <img src="${product.images[0]}" style="width: 100%; border-radius: 15px; margin-bottom: 15px; border: 1px solid #eee; height: 180px; object-fit: contain;" />
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold;">
            <span>MRP: ৳${product.price}</span>
            <span style="color: #ef4444;">Current Sale: ৳${discountedPrice.toFixed(0)}</span>
          </div>

          <div style="margin-top: 15px; background: #fff1f2; padding: 12px; border-radius: 12px; border: 1px solid #fecdd3;">
            <label style="font-weight: bold; display: block; color: #be123c; margin-bottom: 5px;">UPDATE DISCOUNT PERCENTAGE (%):</label>
            <input type="number" id="discount" class="swal2-input" placeholder="e.g. 10" value="${currentDiscount}" style="width: 85%; margin: 5px auto; border-color: #fecdd3;">
          </div>

          <div style="margin-top: 15px; background: #f9f9f9; padding: 12px; border-radius: 12px;">
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">ADD NEW STOCK (Quantity):</label>
            <input type="number" id="new-stock" class="swal2-input" placeholder="Enter amount to add" style="width: 85%; margin: 5px auto;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'SAVE CHANGES',
      confirmButtonColor: '#000',
      preConfirm: () => {
        const discount = document.getElementById('discount').value;
        const addedQuantity = document.getElementById('new-stock').value || 0;
        return { 
          discount: parseInt(discount), 
          addedQuantity: parseInt(addedQuantity) 
        };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`http://localhost:5000/api/products/${product._id}`, {
            discount: result.value.discount
          });

          if (result.value.addedQuantity !== 0) {
            await axios.patch(`http://localhost:5000/api/products/${product._id}/stock`, {
              quantity: -result.value.addedQuantity 
            });
          }

          Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
          fetchProducts();
        } catch (err) {
          Swal.fire('Error!', 'Update failed.', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/products/${id}`);
          setProducts(products.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Success", "success");
        } catch (err) {
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p._id.includes(searchTerm)
  );

  if (loading) return <div className="p-10 text-center min-h-[400px] flex items-center justify-center"> <span className="loading loading-spinner loading-lg"></span> </div>;

  return (
    <div className="space-y-6 p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2 italic text-slate-900">
            <Package size={30} /> Inventory List
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Live Stock Management</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-blue-500 font-bold shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[2px]">
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price & Offer</th>
                <th className="px-6 py-5">Stock</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => {
                const hasDiscount = product.discount > 0;
                const finalPrice = product.price - (product.price * (product.discount || 0) / 100);

                return (
                  <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="relative w-14 h-14">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl border border-slate-100 group-hover:scale-105 transition-transform"
                        />
                        {hasDiscount && (
                          <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg animate-bounce">
                            {product.discount}% OFF
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-slate-800 text-sm uppercase">{product.name}</div>
                      <div className="text-[9px] text-slate-400 font-mono tracking-tighter">ID: {product._id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-lg text-slate-500">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-black ${hasDiscount ? 'text-slate-400 line-through text-xs' : 'text-slate-900 text-base'}`}>
                          ৳{product.price}
                        </span>
                        {hasDiscount && (
                          <span className="text-rose-600 font-black text-base italic flex items-center gap-1">
                            <Tag size={12} /> ৳{finalPrice.toFixed(0)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`font-black text-sm ${product.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                          {product.stock} PCS
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(product.stock * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button 
                          onClick={() => handleEditStock(product)}
                          className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1 group/btn"
                        >
                          <Edit size={16} />
                          <span className="text-[10px] font-black uppercase">Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerProducts;