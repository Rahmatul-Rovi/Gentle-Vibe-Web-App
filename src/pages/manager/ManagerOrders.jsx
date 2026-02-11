import React from 'react';

const ManagerOrders = () => {
  const orders = [
    { id: "#1001", user: "Rahim Ahmed", total: "2500 TK", status: "Pending" },
    { id: "#1002", user: "Karim Uddin", total: "1200 TK", status: "Processing" },
  ];

  return (
    <div className="p-6 bg-white border border-gray-100 shadow-sm">
      <h2 className="text-2xl font-black uppercase mb-6 tracking-tighter">Order Management</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-50 uppercase text-[12px]">
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50">
                <td className="font-bold">{order.id}</td>
                <td>{order.user}</td>
                <td>{order.total}</td>
                <td><span className="badge badge-ghost rounded-none">{order.status}</span></td>
                <td>
                  <button className="btn btn-xs bg-black text-white rounded-none hover:bg-gray-700">Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerOrders;