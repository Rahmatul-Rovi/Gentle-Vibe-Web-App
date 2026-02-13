import React, { useState, useEffect } from 'react';
import { User, Mail, Camera, Edit2, Save, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({ name: '', photoURL: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false); 
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (!storedUser || !storedUser.email) return;

            const res = await axios.get(`http://localhost:5000/api/user/profile/${storedUser.email}`);
            setUserData(res.data);
            setFormData({
                name: res.data.name || '',
                photoURL: res.data.photoURL || ''
            });
        } catch (err) {
            console.error("Profile load failed", err);
        } finally {
            setLoading(false);
        }
    };

    // --- CLOUDINARY UPLOAD LOGIC ---
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const imageData = new FormData();
        imageData.append('file', file);
        imageData.append('upload_preset', 'your_preset_name'); 

        setUploading(true);
        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`, 
                imageData
            );
            setFormData({ ...formData, photoURL: res.data.secure_url });
            Swal.fire({ icon: 'success', title: 'Image Uploaded', timer: 1000, showConfirmButton: false });
        } catch (err) {
            console.error("Upload failed", err);
            Swal.fire({ icon: 'error', title: 'Upload Failed' });
        } finally {
            setUploading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const res = await axios.put(`http://localhost:5000/api/user/profile-update/${storedUser.email}`, formData);
            
            setUserData(res.data);
            setIsEditing(false);

            // LocalStorage update
            const updatedStorage = { ...storedUser, name: res.data.name, photoURL: res.data.photoURL };
            localStorage.setItem('user', JSON.stringify(updatedStorage));

            Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed' });
        } finally {
            setBtnLoading(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-black" size={40} />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-4 pt-10">
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
                <div>
                    <h2 className="text-5xl font-black uppercase tracking-tighter italic">Profile</h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Identity / {userData?.email}</p>
                </div>
                
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest"
                >
                    {isEditing ? <><X size={14}/> Cancel</> : <><Edit2 size={14}/> Edit</>}
                </button>
            </div>

            <div className="bg-white p-8 md:p-12 shadow-2xl rounded-[40px] border border-gray-50">
                <form onSubmit={handleUpdate} className="flex flex-col md:flex-row gap-16 items-start">
                    
                    {/* PROFILE IMAGE WITH CLOUDINARY */}
                    <div className="relative group mx-auto md:mx-0">
                        <div className="w-56 h-56 rounded-full overflow-hidden border-8 border-gray-50 bg-gray-100 relative">
                            {uploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                    <Loader2 className="animate-spin text-white" size={30} />
                                </div>
                            )}
                            <img 
                                src={formData.photoURL || 'https://via.placeholder.com/150'} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        
                        {isEditing && (
                            <label className="absolute bottom-4 right-4 bg-black text-white p-4 rounded-full cursor-pointer hover:scale-110 transition-all shadow-xl">
                                <Camera size={20} />
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        )}
                    </div>

                    {/* INFO SECTION */}
                    <div className="flex-1 w-full space-y-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <User size={12} /> Full Name
                            </label>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    required
                                    className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 font-black text-2xl"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            ) : (
                                <p className="font-black text-4xl tracking-tight">{userData?.name}</p>
                            )}
                        </div>

                        <div className="space-y-3 opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Mail size={12} /> Email
                            </label>
                            <p className="font-bold text-xl text-gray-600">{userData?.email}</p>
                        </div>

                        {isEditing && (
                            <button 
                                type="submit"
                                disabled={btnLoading || uploading}
                                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl disabled:bg-gray-400 mt-6"
                            >
                                {btnLoading ? <Loader2 className="animate-spin mx-auto" size={18}/> : "Save Profile Details"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;