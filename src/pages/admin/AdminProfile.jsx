import React, { useState } from "react";
import { User, Mail, Shield, Calendar, Camera, Save, Loader2 } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminProfile = () => {
  // Local storage theke data nawa
  const initialUser = JSON.parse(localStorage.getItem("user")) || {};
  const [userData, setUserData] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Input Change Handler ---
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // --- Profile Update Logic ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = userData.photoURL;

      // 1. Jodi notun image select kora hoy, age Cloudinary-te upload hobe
      if (selectedImage) {
        const formData = new FormData();
        formData.append("file", selectedImage);
        formData.append("upload_preset", "gentle_preset"); // Tomar preset name use koro

        const cloudRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dirwt3ijn/image/upload",
          formData
        );
        finalImageUrl = cloudRes.data.secure_url;
      }

      // 2. Backend-e data pathano (User update API)
      const updateData = {
        name: userData.name,
        photoURL: finalImageUrl,
      };

      // Note: Backend-e /api/users/update/:id nam-e ekta route thaka lagbe
      const res = await axios.patch(`http://localhost:5000/api/admin/users/${userData.id || userData._id}/role`, {
        name: updateData.name,
        photoURL: updateData.photoURL
      });

      if (res.data.success) {
        // Local storage update koro jate refresh korle thake
        const updatedUser = { ...userData, ...updateData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);

        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          confirmButtonColor: "#000",
        });
        setIsEditing(false);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Update failed! Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Account Settings</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Manage your administrative identity</p>
      </div>

      <div className="max-w-4xl bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="flex flex-col md:flex-row">
          
          {/* Left Side: Avatar & Role */}
          <div className="md:w-1/3 bg-slate-50 p-10 flex flex-col items-center justify-center border-r border-slate-100">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-black overflow-hidden border-4 border-white shadow-2xl relative">
                {/* Image Preview logic */}
                <img 
                  src={selectedImage ? URL.createObjectURL(selectedImage) : userData.photoURL || `https://ui-avatars.com/api/?name=${userData.name}`} 
                  alt="Admin" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 p-3 bg-white rounded-2xl shadow-lg text-black hover:bg-black hover:text-white transition-all cursor-pointer">
                  <Camera size={18} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={(e) => setSelectedImage(e.target.files[0])} 
                  />
                </label>
              )}
            </div>
            
            <h2 className="mt-6 font-black text-xl text-slate-800 uppercase tracking-tight">{userData.name}</h2>
            <span className="mt-2 px-4 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[2px] rounded-full">
              {userData.role}
            </span>
          </div>

          {/* Right Side: Form Details */}
          <div className="md:w-2/3 p-10">
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-black outline-none font-bold text-slate-700 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                      type="email" 
                      value={userData.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
                {/* ... (Permission and Member Since stay the same) */}
              </div>

              <div className="pt-6 flex gap-4">
                {isEditing ? (
                  <>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg disabled:bg-slate-400"
                    >
                      {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Changes</>}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {setIsEditing(false); setSelectedImage(null);}}
                      className="px-8 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-slate-100 text-slate-800 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;