import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* User & Public Routes (Navbar thakbe) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={
            <>
              <Hero />
              <Categories />
            </>
          } />
          <Route path="login" element={<Login />} />
        </Route>

        {/* Manager/Admin Routes (Sidebar thakbe) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<div>Manager Order List coming soon...</div>} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;