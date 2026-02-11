import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerOrders from "./pages/manager/ManagerOrders";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* 1. User & Public Routes (Normal Navbar thakbe) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <>
              <Hero />
              <Categories />
            </>
          } />
          <Route path="login" element={<Login />} />
          {/* Pore eikhane Shop, Cart, Profile route add hobe */}
        </Route>

        {/* 2. Admin Routes (Sidebar thakbe) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<div className="p-4 font-bold">User Management coming soon...</div>} />
          <Route path="settings" element={<div className="p-4 font-bold">Admin Settings coming soon...</div>} />
        </Route>

        {/* 3. Manager Routes (Sidebar thakbe) */}
        <Route path="/manager" element={<AdminLayout />}>
          <Route index element={<ManagerOrders />} />
          {/* Manager-er aro dorkari page thakle eikhane add hobe */}
        </Route>

        {/* 4. 404 Route */}
        <Route path="*" element={<div className="h-screen flex items-center justify-center font-bold">404 - Page Not Found</div>} />

      </Routes>
    </Router>
  );
}

export default App;