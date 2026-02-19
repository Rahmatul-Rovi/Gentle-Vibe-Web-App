import React, { useState, useEffect } from "react";
import { User, Mail, ShieldCheck, Calendar, Camera, Save } from "lucide-react";
import Swal from "sweetalert2";

const ManagerProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ডাটা নেওয়া
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    // এখানে আপডেট এপিআই কল করতে পারো
    Swal.fire("Profile Updated", "Your information has been saved.", "success");
  };

  if (!user) return <div className="p-10 font-black text-center text-slate-400">LOADING PROFILE...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-black uppercase tracking-tighter">My Profile</h1>
        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Manage your personal account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* বাম পাশ: প্রোফাইল কার্ড */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-slate-900"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-full mx-auto p-1 mb-4 shadow-xl">
                <div className="w-full h-full bg-slate-100 rounded-full flex items-center justify-center text-slate-300 relative group cursor-pointer">
                  <User size={60} />
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera size={20} />
                  </div>
                </div>
              </div>
              <h2 className="text-xl font-black uppercase tracking-tight">{user.name}</h2>
              <div className="mt-2 inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">
                Official Manager
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
               <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <ShieldCheck size={18} className="text-slate-400" />
                  <span>Role: {user.role}</span>
               </div>
               <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                  <Calendar size={18} className="text-slate-400" />
                  <span>Joined: Feb 2026</span>
               </div>
            </div>
          </div>
        </div>

        {/* ডান পাশ: এডিট ফর্ম */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                  <input
                    disabled
                    type="email"
                    defaultValue={user.email}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-black uppercase mb-4 text-rose-500 border-b pb-2 border-rose-50 flex items-center gap-2">
                 Security Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-black font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Confirm Password</label>
                  <input
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
                className="w-full md:w-auto px-10 bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[2px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10"
              >
                <Save size={18} /> Update My Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;