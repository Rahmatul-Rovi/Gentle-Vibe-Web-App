import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Calendar, Camera, Save, RefreshCcw } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";

const ManagerProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // --- ইমেজ আপলোড এবং প্রোফাইল আপডেট লজিক ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    const imageFile = form.profilePic.files[0];

    // পাসওয়ার্ড ম্যাচিং চেক
    if (password && password !== confirmPassword) {
      setLoading(false);
      return Swal.fire("Error", "Passwords do not match!", "error");
    }

    Swal.fire({
      title: 'Updating Profile...',
      text: 'Please wait while we process your data.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      let imageUrl = user.image || "";

      // ১. যদি নতুন ইমেজ সিলেক্ট করা হয়, তবে ক্লাউডিনারিতে আপলোড হবে
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "gentle_preset"); 

        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dirwt3ijn/image/upload",
          formData
        );
        imageUrl = cloudinaryRes.data.secure_url;
      }

      // ২. ব্যাকেন্ডে ডাটা পাঠানো (আপনার API অনুযায়ী)
      const updateData = {
        name,
        image: imageUrl,
        ...(password && { password }) // পাসওয়ার্ড দিলে তবেই পাঠাবে
      };

      const res = await axios.put(`http://localhost:5000/api/users/update/${user._id}`, updateData);

      if (res.data.success) {
        // লোকাল স্টোরেজ আপডেট করা যাতে রিফ্রেশ করলে নতুন নাম/ছবি থাকে
        const updatedUser = { ...user, ...updateData };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        Swal.fire("Success!", "Profile updated successfully", "success");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update profile", "error");
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ প্রিভিউ দেখানোর জন্য
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  if (!user) return <div className="p-10 font-black text-center text-slate-400">LOADING PROFILE...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-0">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">My Profile</h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Personalize your identity</p>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full mx-auto p-1 mb-4 shadow-xl relative">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage || user.image ? (
                    <img src={previewImage || user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={60} className="text-slate-300" />
                  )}
                </div>
                
                <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                  <Camera size={24} />
                  <input 
                    type="file" 
                    name="profilePic" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
              <div className="mt-2 inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                {user.role}
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
               <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <ShieldCheck size={18} className="text-slate-400" />
                  <span>ID: #{user._id?.slice(-6)}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <Calendar size={18} className="text-slate-400" />
                  <span>Verified User</span>
               </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address (Fixed)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input
                    disabled
                    type="email"
                    defaultValue={user.email}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-[10px] font-black uppercase mb-6 text-slate-400 tracking-widest flex items-center gap-2">
                Change Password (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-10 bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[2px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />} 
                {loading ? "Updating..." : "Save Profile Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ManagerProfile;