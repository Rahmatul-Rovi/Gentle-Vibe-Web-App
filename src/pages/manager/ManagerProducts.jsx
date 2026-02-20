import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Edit, Package, Search, AlertCircle, Eye } from "lucide-react";

const ManagerProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // প্রোডাক্ট লোড করা
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

  // --- View & Update Stock SweetAlert (Edit Button Logic) ---
  const handleEditStock = (product) => {
    Swal.fire({
      title: `<span style="text-transform: uppercase; font-weight: 900;">${product.name}</span>`,
      html: `
        <div style="text-align: left; font-family: sans-serif;">
          <img src="${product.images[0]}" style="width: 100%; border-radius: 15px; margin-bottom: 15px; border: 1px solid #eee; height: 200px; object-fit: contain;" />
          <p><strong>Category:</strong> ${product.category.toUpperCase()}</p>
          <p><strong>Price:</strong> ৳${product.price}</p>
          <p style="font-size: 1.2rem; margin-bottom: 10px;">
            <strong>Current Stock:</strong> 
            <span style="font-weight: bold; color: ${product.stock < 5 ? '#f43f5e' : '#10b981'};">
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
        if (!addedQuantity || addedQuantity <= 0) {
          Swal.showValidationMessage(`Please enter a valid quantity`);
          return null;
        }
        return { addedQuantity: parseInt(addedQuantity) };
      }
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          // আপনার ব্যাকএন্ডের PATCH লজিক অনুযায়ী (যদি মাইনাস দিলে প্লাস হয় তবে মাইনাস দেবেন)
          // সাধারণত: নতুন স্টক যোগ করতে পজিটিভ ভ্যালুই লাগে। 
          // আপনার Admin code অনুযায়ী এখানে -result.value.addedQuantity দিচ্ছি।
          const updateAmount = -result.value.addedQuantity; 

          const res = await axios.patch(`http://localhost:5000/api/products/${product._id}/stock`, {
            quantity: updateAmount
          });

          if (res.data.success || res.status === 200) {
            Swal.fire('Updated!', 'Stock has been successfully increased.', 'success');
            fetchProducts(); // টেবিল রিফ্রেশ
          }
        } catch (err) {
          console.error(err);
          Swal.fire('Error!', 'Failed to update stock.', 'error');
        }
      }
    });
  };

  // প্রোডাক্ট ডিলিট করা
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
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
          Swal.fire("Deleted!", "Product has been removed.", "success");
        } catch (err) {
          Swal.fire("Error", "Delete failed", "error");
        }
      }
    });
  };

  // সার্চ ফিল্টারিং
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p._id.includes(searchTerm)
  );

  if (loading) return <div className="p-10 font-black text-center flex justify-center items-center min-h-[400px]"> <span className="loading loading-spinner loading-lg"></span> </div>;

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2 italic">
            <Package size={30} /> Inventory List
          </h1>
          <p className="text-slate-500 font-bold">Manage your shop stock and product details.</p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-[2px]">
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5">Stock Status</th>
                <th className="px-6 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-xl border border-slate-100 group-hover:scale-110 transition-transform"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-slate-800">{product.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono italic">ID: {product._id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">৳{product.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${product.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                      <span className={`font-bold text-sm ${product.stock <= 5 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {product.stock} pcs {product.stock <= 5 && "(Low)"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-2">
                      <button 
                        onClick={() => handleEditStock(product)}
                        title="Edit Stock"
                        className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm flex items-center gap-1"
                      >
                        <Edit size={18} />
                        <span className="text-[10px] font-black uppercase">Stock</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-20 text-center space-y-3">
             <AlertCircle className="mx-auto text-slate-200" size={48} />
             <p className="font-black text-slate-400 uppercase tracking-widest">No products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerProducts;