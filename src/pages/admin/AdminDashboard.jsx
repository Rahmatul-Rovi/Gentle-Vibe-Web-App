import React from 'react';
import { Users, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { title: "Total Users", value: "1,250", icon: <Users />, color: "bg-blue-500" },
    { title: "Total Orders", value: "450", icon: <ShoppingBag />, color: "bg-green-500" },
    { title: "Total Revenue", value: "$12,400", icon: <DollarSign />, color: "bg-purple-500" },
    { title: "Active Visitors", value: "85", icon: <TrendingUp />, color: "bg-orange-500" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Admin Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${item.color} p-4 text-white rounded-lg`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase">{item.title}</p>
              <h3 className="text-2xl font-bold">{item.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-4">Recent Sales Activity</h2>
        <p className="text-gray-400 italic">Chart will be integrated here...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;