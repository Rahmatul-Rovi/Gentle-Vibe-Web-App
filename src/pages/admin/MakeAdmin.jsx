import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShieldCheck, UserCog, UserCheck, RefreshCw } from "lucide-react";
import Swal from 'sweetalert2';

const MakeAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Role Update Function ---
  const handleRoleChange = async (userId, newRole) => {
    Swal.fire({
      title: 'Update Role?',
      text: `Change this user's role to ${newRole.toUpperCase()}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#000',
      confirmButtonText: 'Yes, Update'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.patch(`http://localhost:5000/api/admin/users/${userId}/role`, { role: newRole });
          if (res.data.success) {
            // Update local state
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            Swal.fire('Success!', `User is now an ${newRole}`, 'success');
          }
        } catch (err) {
          Swal.fire('Error!', 'Failed to update role.', 'error');
        }
      }
    });
  };

  if (loading) return <div className="p-10 text-center font-black">ACCESSING DIRECTORY...</div>;

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Role Management</h1>
        <p className="text-slate-500 text-sm font-medium">Assign Admin or Manager permissions to users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-50">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-black text-xl text-slate-300">
                      {user.name.charAt(0)}
                    </div>
                  )}
               </div>
               <div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight leading-none mb-1">{user.name}</h3>
                  <p className="text-[11px] text-slate-400 font-bold">{user.email}</p>
               </div>
            </div>

            <div className="space-y-4">
               <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-black uppercase text-slate-400">Current Role</span>
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                    user.role === 'admin' ? 'bg-black text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}>
                    {user.role}
                  </span>
               </div>

               <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Change Permissions</label>
                  <select 
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="w-full bg-white border-2 border-slate-100 p-3 rounded-2xl text-xs font-bold focus:border-black outline-none transition-all cursor-pointer"
                  >
                    <option value="user">USER (Standard)</option>
                    <option value="manager">MANAGER (Restricted)</option>
                    <option value="admin">ADMIN (Full Control)</option>
                  </select>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MakeAdmin;