import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, Image as ImageIcon, Tag, Hash, DollarSign, Palette, Ruler, AlignLeft } from "lucide-react";

const ManagerAddProduct = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    // --- SweetAlert Loading State ---
    Swal.fire({
      title: 'Uploading Product...',
      text: 'Please wait while we process the image and data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const imageFile = form.image.files[0];
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "gentle_preset");

    try {
    
      const cloudinaryRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dirwt3ijn/image/upload", 
        formData
      );
      
      const imageUrl = cloudinaryRes.data.secure_url;

      const productData = {
        name: form.name.value,
        description: form.description.value,
        price: parseFloat(form.price.value),
        category: form.category.value,
        stock: parseInt(form.stock.value),
        sizes: form.sizes.value.split(',').map(s => s.trim()),
        colors: form.colors.value.split(',').map(c => c.trim()),
        images: [imageUrl] 
      };

      const res = await axios.post('http://localhost:5000/api/products/add', productData);
      
      if(res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Published!',
          text: 'Product successfully added to inventory.',
          confirmButtonColor: '#000',
        });
        form.reset();
      }
    } catch (err) {
      console.error("Error Detail:", err);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Check your internet connection or Cloudinary preset.',
        confirmButtonColor: '#000',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 italic">
          <PlusCircle size={32} /> Add New Product
        </h1>
        <p className="text-slate-500 font-bold">Fill in the details to list a new item in the shop.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Product Name</label>
            <div className="relative">
              <Tag className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input required name="name" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="Premium T-Shirt" />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Price (BDT)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input required type="number" name="price" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="1200" />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Category</label>
            <select name="category" className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold appearance-none">
              <option value="mens">MENS</option>
              <option value="womens">WOMENS</option>
              <option value="kids">KIDS</option>
            </select>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Stock Quantity</label>
            <div className="relative">
              <Hash className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input required type="number" name="stock" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="50" />
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Available Sizes</label>
            <div className="relative">
              <Ruler className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input name="sizes" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="S, M, L, XL" />
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Colors</label>
            <div className="relative">
              <Palette className="absolute left-4 top-3.5 text-slate-400" size={18} />
              <input name="colors" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="Black, White, Navy" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Product Description</label>
          <div className="relative">
            <AlignLeft className="absolute left-4 top-4 text-slate-400" size={18} />
            <textarea required name="description" rows="3" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold" placeholder="Write something about the quality..." />
          </div>
        </div>

        {/* Image Upload Field */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Upload Product Image</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:bg-slate-50 transition-all">
            <input required type="file" name="image" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            <div className="flex flex-col items-center justify-center py-2">
              <ImageIcon className="text-slate-400 mb-2" size={32} />
              <p className="text-xs font-bold text-slate-500">Click or Drag to Upload Image</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2 italic"><RefreshCcw className="animate-spin" size={20}/> Processing...</span>
          ) : "Publish Product to Inventory"}
        </button>
      </form>
    </div>
  );
};

// Lucide icon import fix for RefreshCcw
import { RefreshCcw } from "lucide-react";

export default ManagerAddProduct;