import React, { useEffect, useState } from "react";
import axios from "axios";
import { User, Mail, ShieldCheck, Calendar, Trash2 } from "lucide-react";
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch All Users ---
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users"); 
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Users fetch error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- Delete User (Optional Security) ---
  const deleteUser = (id) => {
    Swal.fire({
      title: 'Remove User?',
      text: "This user will lose access to the panel!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#000',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
          setUsers(users.filter(u => u._id !== id));
          Swal.fire('Removed!', 'User has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error!', 'Failed to remove user.', 'error');
        }
      }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[400px]">
      <span className="loading loading-spinner loading-lg text-black"></span>
    </div>
  );

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">User Directory</h1>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Manage community and staff members</p>
      </div>

      <div className="bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase tracking-[2px] font-black">
              <th className="px-8 py-5">Profile</th>
              <th className="px-6 py-5">Role</th>
              <th className="px-6 py-5">Joined</th>
              <th className="px-8 py-5 text-right">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    {/* User Photo or Avatar */}
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                        alt="Profile"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center font-black border border-slate-200 uppercase">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{user.name}</h4>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                        <Mail size={10} /> {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`flex items-center gap-1 text-[10px] font-black uppercase px-3 py-1 rounded-lg w-fit ${
                    user.role === 'admin' 
                    ? 'bg-rose-100 text-rose-600' 
                    : user.role === 'manager' 
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-slate-100 text-slate-600'
                  }`}>
                    <ShieldCheck size={12} />
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="text-xs text-slate-600 flex items-center gap-1 font-medium">
                    <Calendar size={12} />
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={() => deleteUser(user._id)}
                    className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;