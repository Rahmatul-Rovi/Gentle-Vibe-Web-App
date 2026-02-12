import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // LocalStorage theke user data parse kora
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            if (!storedUser || !storedUser.email) {
                console.error("User not logged in");
                return;
            }

            // Backend route: /api/user/profile/:email
            const res = await axios.get(`http://localhost:5000/api/user/profile/${storedUser.email}`);
            
            setUserData(res.data);
            setFormData({
                name: res.data.name || '',
                phone: res.data.phone || '',
                address: res.data.address || ''
            });
        } catch (err) {
            console.error("Profile load failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setBtnLoading(true);
        try {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            
            // Backend route: /api/user/profile-update/:email
            const res = await axios.put(`http://localhost:5000/api/user/profile-update/${storedUser.email}`, formData);
            
            setUserData(res.data);
            setIsEditing(false);
            
            // LocalStorage update (optional kintu bhalo practice)
            const updatedStorage = { ...storedUser, name: res.data.name };
            localStorage.setItem('user', JSON.stringify(updatedStorage));

            Swal.fire({ 
                icon: 'success', 
                title: 'Profile Updated', 
                timer: 1500, 
                showConfirmButton: false,
                background: '#fff',
                color: '#000'
            });
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
        <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500 p-4">
            {/* Header Section */}
            <div className="flex justify-between items-end mb-10 border-b border-gray-100 pb-6">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">My Account</h2>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Profile Identity</p>
                </div>
                
                <button 
                    onClick={() => { 
                        setIsEditing(!isEditing); 
                        if(!isEditing) setFormData({
                            name: userData.name,
                            phone: userData.phone || '',
                            address: userData.address || ''
                        }); 
                    }}
                    className="flex items-center gap-2 bg-black text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                    {isEditing ? <><X size={14}/> Cancel</> : <><Edit2 size={14}/> Edit Profile</>}
                </button>
            </div>

            <div className="bg-white p-6 md:p-10 shadow-2xl shadow-gray-200/50 rounded-3xl border border-gray-50">
                <form onSubmit={handleUpdate} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <User size={12} /> Account Name
                            </label>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    required
                                    className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 font-bold text-lg transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            ) : (
                                <p className="font-black text-xl">{userData?.name}</p>
                            )}
                        </div>

                        {/* Email Field (READ ONLY) */}
                        <div className="space-y-3 opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Mail size={12} /> Login Email
                            </label>
                            <p className="font-black text-xl">{userData?.email}</p>
                        </div>

                        {/* Phone Field */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Phone size={12} /> Contact Number
                            </label>
                            {isEditing ? (
                                <input 
                                    type="text"
                                    className="w-full border-b-2 border-black/10 focus:border-black outline-none py-2 font-bold text-lg transition-all"
                                    value={formData.phone}
                                    placeholder="Enter phone number"
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            ) : (
                                <p className="font-black text-xl">{userData?.phone || 'Not Provided'}</p>
                            )}
                        </div>
                    </div>

                    {/* Address Field */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <MapPin size={12} /> Default Shipping Address
                        </label>
                        {isEditing ? (
                            <textarea 
                                className="w-full border-2 border-gray-100 rounded-2xl focus:border-black outline-none p-5 font-bold text-sm transition-all h-32"
                                value={formData.address}
                                placeholder="Enter your full address"
                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                            />
                        ) : (
                            <p className="font-black text-xl leading-relaxed">{userData?.address || 'No address saved yet'}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className="pt-6">
                            <button 
                                type="submit"
                                disabled={btnLoading}
                                className="w-full bg-black text-white py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/20 disabled:bg-gray-400"
                            >
                                {btnLoading ? (
                                    <><Loader2 className="animate-spin" size={18}/> Saving Info...</>
                                ) : (
                                    <><Save size={18} /> Update Profile</>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default UserProfile;