import React, { useEffect, useState } from "react";
import { Package, Heart, CreditCard, Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import axios from "axios";
import { useCart } from "../../context/CartContext";


const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { cart } = useCart();
  
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser || !storedUser.id) {
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/user/dashboard-summary/${storedUser.id}`);
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard API error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="animate-spin text-black/20" size={40} />
      </div>
    );

  return (
    <div className="animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-[#0F172A] mb-2 leading-none">
          User Dashboard
        </h1>
        <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">
          Real-time overview of your account activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            label: "Active Orders",
            val: stats?.activeOrders || "0",
            icon: <Package className="text-blue-500" size={24} />,
            bg: "bg-blue-50",
          },
          {
            label: "Total Spent",
            val: `৳${stats?.totalSpent || "0"}`,
            icon: <CreditCard className="text-emerald-500" size={24} />,
            bg: "bg-emerald-50",
          },
          {
            label: "Items in Cart",
            val: totalCartItems || "0", 
            icon: <ShoppingBag className="text-rose-500" size={24} />, 
            bg: "bg-rose-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-8 border border-gray-100 shadow-sm rounded-3xl flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h2 className="text-4xl font-black">{stat.val}</h2>
            </div>
            <div
              className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center`}
            >
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Last Order Status
            </p>
            <h3 className="font-black text-lg uppercase italic tracking-tight">
              Recent Activity
            </h3>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
            View All <ArrowRight size={14} />
          </button>
        </div>

        <div className="p-8">
          {stats?.recentOrder ? (
            <div className="flex items-center justify-between p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-black text-white rounded-xl flex flex-col items-center justify-center font-black">
                  <span className="text-[10px] uppercase opacity-50">ID</span>
                  <span className="text-lg">
                    #{stats.recentOrder._id.slice(-4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase mb-1">
                    Order: {stats.recentOrder.transactionId || "Processing"}
                  </h4>
                  <p className="text-xs text-gray-400 font-bold tracking-tight">
                    Placed on{" "}
                    {new Date(stats.recentOrder.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-5 py-2 text-[10px] font-black rounded-full uppercase italic tracking-widest ${
                    stats.recentOrder.paymentStatus === "Paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {stats.recentOrder.paymentStatus || "Pending"}
                </span>
                <p className="text-xs font-black">
                  ৳{stats.recentOrder.totalAmount}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-300 font-black uppercase tracking-widest text-sm">
                No recent orders to show
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;