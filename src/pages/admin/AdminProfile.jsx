import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Camera, Save, Loader2, X, CheckCircle, Edit2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminProfile = () => {
  // Local storage theke fresh data load kora
  const getStoredUser = () => JSON.parse(localStorage.getItem("user")) || {};
  
  const [userData, setUserData] = useState(getStoredUser());
  const [formData, setFormData] = useState({ name: "", photoURL: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Edit mode on korle current data form-e set kora
  const toggleEdit = () => {
    if (!isEditing) {
      setFormData({
        name: userData.name || "",
        photoURL: userData.photoURL || ""
      });
    }
    setIsEditing(!isEditing);
    setSelectedImage(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = formData.photoURL;

      // 1. Cloudinary Upload Logic
      if (selectedImage) {
        const data = new FormData();
        data.append("file", selectedImage);
        data.append("upload_preset", "gentle_preset"); 

        const cloudRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dirwt3ijn/image/upload",
          data
        );
        finalImageUrl = cloudRes.data.secure_url;
      }

      // 2. Backend Call - Make sure ID exists
      const userId = userData._id || userData.id;
      const res = await axios.patch(`http://localhost:5000/api/admin/profile-update/${userId}`, {
        name: formData.name,
        photoURL: finalImageUrl
      });

      if (res.data.success) {
        // 3. Update state and LocalStorage with Backend Response
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          background: '#000',
          color: '#fff'
        });
        setIsEditing(false);
        setSelectedImage(null);
      }
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      Swal.fire("Error", "Server sync failed! Please check backend.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-12 bg-[#fafafa] min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-black tracking-tighter uppercase italic leading-none">Settings</h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Administrative Identity / System Root</p>
        </div>

        <div className="bg-white rounded-[50px] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            
            {/* Left Side: Identity Card */}
            <div className="md:w-2/5 bg-gray-50 p-12 flex flex-col items-center justify-center border-r border-gray-100">
              <div className="relative">
                <div className="w-48 h-48 rounded-[60px] bg-black overflow-hidden border-[10px] border-white shadow-2xl relative rotate-3 group-hover:rotate-0 transition-all duration-500">
                  <img 
                    src={selectedImage ? URL.createObjectURL(selectedImage) : (isEditing ? formData.photoURL : userData.photoURL) || `https://ui-avatars.com/api/?name=${userData.name}&background=000&color=fff`} 
                    alt="Admin" 
                    className="w-full h-full object-cover scale-110" 
                  />
                </div>
                
                {isEditing && (
                  <label className="absolute -bottom-4 -right-4 p-4 bg-black text-white rounded-3xl shadow-2xl cursor-pointer hover:scale-110 transition-all z-20">
                    <Camera size={24} />
                    <input type="file" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
                  </label>
                )}
              </div>
              
              <div className="text-center mt-10">
                <h2 className="font-black text-3xl text-black uppercase tracking-tighter italic">{userData.name}</h2>
                <div className="mt-4 flex items-center justify-center gap-2">
                    <span className="px-5 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-[3px] rounded-full">
                    {userData.role || 'Admin'}
                    </span>
                    <Shield size={14} className="text-gray-300" />
                </div>
              </div>
            </div>

            {/* Right Side: Form Details */}
            <div className="md:w-3/5 p-12 md:p-16">
              <form onSubmit={handleUpdate} className="space-y-10">
                <div className="grid grid-cols-1 gap-8">
                  {/* Name Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group">
                      <User className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-black' : 'text-gray-300'}`} size={18} />
                      <input 
                        type="text" 
                        name="name"
                        value={isEditing ? formData.name : userData.name}
                        onChange={handleChange}
                        readOnly={!isEditing}
                        className={`w-full pl-8 pr-4 py-4 bg-transparent border-b-2 outline-none font-bold text-xl transition-all ${isEditing ? 'border-black text-black' : 'border-gray-100 text-gray-400 cursor-not-allowed'}`}
                      />
                    </div>
                  </div>

                  {/* Email Input (Always Read Only) */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-200" size={18} />
                      <input 
                        type="email" 
                        value={userData.email}
                        disabled
                        className="w-full pl-8 pr-4 py-4 bg-transparent border-b-2 border-gray-50 font-bold text-xl text-gray-300 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-10 flex flex-col gap-4">
                  {isEditing ? (
                    <div className="flex gap-4">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 bg-black text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all shadow-xl disabled:bg-gray-400"
                      >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Changes</>}
                      </button>
                      <button 
                        type="button" 
                        onClick={toggleEdit}
                        className="px-10 bg-gray-100 text-gray-500 py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={toggleEdit}
                      className="w-full bg-gray-100 text-black py-5 rounded-3xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm border border-gray-200"
                    >
                      <Edit2 size={18} /> Edit Administrative Profile
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;