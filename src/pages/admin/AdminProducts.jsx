import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, Plus, Package, Eye, Tag } from "lucide-react"; 
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleView = (product) => {
    const finalPrice = product.discount > 0 
      ? Math.round(product.price - (product.price * product.discount / 100)) 
      : product.price;

    Swal.fire({
      title: `<span style="text-transform: uppercase; font-weight: 900;">${product.name}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <img src="${product.images[0]}" style="width: 100%; border-radius: 15px; margin-bottom: 15px; border: 1px solid #eee;" />
          <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
             <span><strong>Category:</strong> ${product.category.toUpperCase()}</span>
             <span style="color: #e11d48; font-weight: bold;">${product.discount}% OFF</span>
          </div>
          <p><strong>Original Price:</strong> ৳${product.price}</p>
          <p><strong>Final Sale Price:</strong> ৳${finalPrice}</p>
          <p style="font-size: 1.2rem; margin-bottom: 10px;">
            <strong>Current Stock:</strong> 
            <span class="${product.stock < 5 ? 'text-danger' : 'text-success'}" style="font-weight: bold;">
              ${product.stock} pcs
            </span>
          </p>
          <hr />
          <div style="margin-top: 15px; background: #f9f9f9; padding: 10px; border-radius: 10px;">
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">ADD NEW STOCK (Quantity):</label>
            <input type="number" id="new-stock" class="swal2-input" placeholder="Enter amount to add" style="width: 80%; margin: 5px auto;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'UPDATE STOCK',
      cancelButtonText: 'CLOSE',
      confirmButtonColor: '#000',
      preConfirm: () => {
        const addedQuantity = Swal.getPopup().querySelector('#new-stock').value;
        if (!addedQuantity || addedQuantity <= 0) return null; 
        return { addedQuantity: parseInt(addedQuantity) };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          const updateAmount = -result.value.addedQuantity; 
          const res = await axios.patch(`http://localhost:5000/api/products/${product._id}/stock`, {
            quantity: updateAmount
          });
          if (res.data.success) {
            Swal.fire('Updated!', 'Stock has been increased.', 'success');
            fetchProducts();
          }
        } catch (err) {
          Swal.fire('Error!', 'Failed to update stock.', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`http://localhost:5000/api/products/${id}`);
          if (res.data.success) {
            setProducts(products.filter((p) => p._id !== id));
            Swal.fire('Deleted!', 'Product has been removed.', 'success');
          }
        } catch (err) {
          Swal.fire('Error!', 'Failed to delete product.', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your {products.length} products</p>
        </div>
        <Link to="/admin/add-product">
          <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <Plus size={20} /> Add New Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[2px] font-black">
              <th className="px-8 py-5">Product</th>
              <th className="px-6 py-5">Category</th>
              <th className="px-6 py-5">Price & Discount</th>
              <th className="px-6 py-5">Stock</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const finalPrice = product.discount > 0 
                ? Math.round(product.price - (product.price * product.discount / 100)) 
                : product.price;

              return (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{product.subCategory || 'General'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[11px] font-black uppercase tracking-tighter">
                      {product.category}
                    </span>
                  </td>
                  
                  {/* --- Price & Discount Section --- */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 italic text-lg">৳{finalPrice}</span>
                      {product.discount > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 line-through font-bold">৳{product.price}</span>
                          <span className="text-[10px] bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-0.5">
                            <Tag size={10} /> {product.discount}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-bold italic">No Discount</span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className={`flex items-center gap-2 text-sm font-bold ${product.stock < 5 ? 'text-rose-500 animate-pulse' : 'text-slate-600'}`}>
                      <Package size={14} />
                      {product.stock} pcs
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleView(product)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                        title="View & Update Stock"
                      >
                        <Eye size={18} />
                        <span className="text-[10px] font-bold">STOCK</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
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
  );
};

export default AdminProducts;