import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { PlusCircle, Image as ImageIcon, Tag, Hash, DollarSign } from "lucide-react";

const ManagerAddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: "", // কমা দিয়ে আলাদা করে ইমেজ লিঙ্ক বসানোর জন্য
    sizes: "",
  });

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ডাটা ফরম্যাটিং (String থেকে Array তে রূপান্তর)
    const finalProduct = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      images: product.images.split(",").map((img) => img.trim()),
      sizes: product.sizes.split(",").map((s) => s.trim()),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/products/add", finalProduct);
      if (res.data.success) {
        Swal.fire("Success!", "Product added to inventory", "success");
        setProduct({ name: "", description: "", price: "", category: "", stock: "", images: "", sizes: "" });
      }
    } catch (err) {
      Swal.fire("Error", "Could not add product", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
          <PlusCircle size={32} /> New Inventory Item
        </h1>
        <p className="text-slate-500 font-bold">Add new stock items for both online and offline sales.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Product Name</label>
            <div className="relative">
              <Tag className="absolute left-4 top-3.6 text-slate-400" size={18} />
              <input
                required
                name="name"
                value={product.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                placeholder="Ex: Premium Black Tee"
              />
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Price (BDT)</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-3.6 text-slate-400" size={18} />
              <input
                required
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Category</label>
            <select
              required
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold appearance-none"
            >
              <option value="">Select Category</option>
              <option value="mens">Mens</option>
              <option value="womens">Womens</option>
              <option value="kids">Kids</option>
            </select>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Initial Stock</label>
            <div className="relative">
              <Hash className="absolute left-4 top-3.6 text-slate-400" size={18} />
              <input
                required
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                placeholder="Quantity"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Image URLs (Separate with comma)</label>
          <div className="relative">
            <ImageIcon className="absolute left-4 top-3.6 text-slate-400" size={18} />
            <input
              required
              name="images"
              value={product.images}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold text-xs"
              placeholder="http://img1.com, http://img2.com"
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Available Sizes (Ex: M, L, XL)</label>
          <input
            name="sizes"
            value={product.sizes}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
            placeholder="M, L, XL"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-slate-400 ml-1">Product Description</label>
          <textarea
            required
            name="description"
            value={product.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
            placeholder="Tell something about the product..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all uppercase tracking-widest shadow-xl shadow-black/10"
        >
          Add Product to Shop
        </button>
      </form>
    </div>
  );
};

export default ManagerAddProduct;