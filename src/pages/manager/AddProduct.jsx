import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const AddProduct = () => {
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const form = e.target;

        // SweetAlert Loading State
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
            // 1. Image Upload to Cloudinary
            const cloudinaryRes = await axios.post(
                "https://api.cloudinary.com/v1_1/dirwt3ijn/image/upload", 
                formData
            );
            
            const imageUrl = cloudinaryRes.data.secure_url;

            // 2. Data save to MongoDB
            const productData = {
                name: form.name.value,
                description: form.description.value,
                price: parseFloat(form.price.value),
                category: form.category.value,
                sizes: form.sizes.value.split(',').map(s => s.trim()),
                colors: form.colors.value.split(',').map(c => c.trim()),
                stock: parseInt(form.stock.value),
                images: [imageUrl]
            };

            const res = await axios.post('http://localhost:5000/api/products/add', productData);
            
            if(res.data.success) {
                // Success Alert 🚀
                Swal.fire({
                    icon: 'success',
                    title: 'Published!',
                    text: 'Product added to Gentle Vibe collection.',
                    confirmButtonColor: '#000', // Black button to match your theme
                    background: '#fff',
                });
                form.reset();
            }
        } catch (err) {
            console.error("Error Detail:", err.response?.data || err);
            
            // Error Alert ❌
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong! Check your connection or preset.',
                confirmButtonColor: '#000',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-10 bg-white border my-10 shadow-sm">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-8 text-black italic">Add New Product</h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input type="text" name="name" placeholder="PRODUCT NAME" 
                    className="input input-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white p-4" required />
                
                <input type="number" name="price" placeholder="PRICE ($)" 
                    className="input input-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white p-4" required />
                
                <select name="category" 
                    className="select select-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white">
                    <option value="mens">MENS</option>
                    <option value="womens">WOMENS</option>
                    <option value="kids">KIDS</option>
                </select>

                <input type="number" name="stock" placeholder="STOCK QUANTITY" 
                    className="input input-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white p-4" required />
                
                <input type="text" name="sizes" placeholder="SIZES (e.g. S, M, L)" 
                    className="input input-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white p-4" />
                
                <input type="text" name="colors" placeholder="COLORS (e.g. Black, White)" 
                    className="input input-bordered rounded-none border-gray-200 focus:outline-black w-full bg-black text-white p-4" />

                <div className="md:col-span-2">
                    <textarea name="description" placeholder="PRODUCT DESCRIPTION" 
                        className="textarea textarea-bordered rounded-none border-gray-200 focus:outline-black w-full h-32 bg-black text-white p-4" required></textarea>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase mb-2 text-black tracking-widest">Product Image</label>
                    <input type="file" name="image" 
                        className="file-input file-input-bordered rounded-none w-full bg-black text-white" required />
                </div>

                <button type="submit" disabled={loading} 
                    className="md:col-span-2 btn bg-black text-white hover:bg-gray-800 rounded-none border-none uppercase tracking-widest transition-all h-14 shadow-lg">
                    {loading ? (
                        <span className="loading loading-spinner"></span>
                    ) : "Publish Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProduct;