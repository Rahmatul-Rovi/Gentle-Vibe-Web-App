import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, DollarSign, Package, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0, totalProducts: 0 });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, chartRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/stats"),
          axios.get("http://localhost:5000/api/admin/sales-report")
        ]);
        setStats(statsRes.data);
        setChartData(chartRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, []);

  const statItems = [
    { title: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign />, color: "from-violet-600 to-indigo-600" },
    { title: "Total Orders", value: stats.totalOrders, icon: <ShoppingBag />, color: "from-blue-500 to-cyan-500" },
    { title: "Total Users", value: stats.totalUsers, icon: <Users />, color: "from-emerald-500 to-teal-500" },
    { title: "Total Products", value: stats.totalProducts, icon: <Package />, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="p-6 md:p-8 bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Overview</h1>
        <p className="text-slate-500 font-medium">Real-time store performance and analytics</p>
      </div>

      {/* Stats Cards - Ager moto colorful kintu aro clean */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statItems.map((item, index) => (
          <div key={index} className={`bg-gradient-to-br ${item.color} rounded-[24px] p-6 text-white shadow-lg shadow-indigo-200/20 relative overflow-hidden group`}>
            <div className="relative z-10">
              <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
                {item.icon}
              </div>
              <p className="text-white/80 text-xs font-bold uppercase tracking-widest mb-1">{item.title}</p>
              <h3 className="text-3xl font-black">{item.value}</h3>
            </div>
            {/* Background Icon Decoration */}
            <div className="absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500">
               {React.cloneElement(item.icon, { size: 80 })}
            </div>
          </div>
        ))}
      </div>

      {/* Full Width Chart Section */}
      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Sales & Orders Trend</h2>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Last 7 Days Activity</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Orders</span>
            </div>
            
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                yAxisId="left" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <YAxis yAxisId="right" orientation="right" hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
              <Area 
                yAxisId="right"
                type="monotone" 
                dataKey="orders" 
                stroke="#22d3ee" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorOrd)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;