import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Pages
import Hero from "../components/Hero";
import Categories from "../components/Categories";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerOrders from "../pages/manager/ManagerOrders";
import AddProduct from "../pages/admin/AddProduct";
import ProductList from "../components/ProductList";
import ProductDetails from "../components/ProductDetails";
import CartPage from "../pages/CartPage";
import Checkout from "../pages/Checkout";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminUsers from "../pages/admin/AdminUsers";
import MakeAdmin from "../pages/admin/MakeAdmin";
import AdminProfile from "../pages/admin/AdminProfile";
import Home from "../pages/Home";
import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserOrder from "../pages/user/UserOrder.jsx";
// Upore baki import gulor niche eigula add koro:
import UserRoute from "../routes/UserRoute"; 
import AdminRoute from "../routes/AdminRoute";
import Shop from "../pages/Shop.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "shop", element: <ProductList /> },
      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <UserRoute><Checkout /></UserRoute> }, // Checkout e UserRoute must
      {path: "collections", element: <Shop></Shop> }
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>, // Ekhon keu manually likhleo dhukte parbe na
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "all-products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "make-admin", element: <MakeAdmin /> },
      { path: "profile", element: <AdminProfile /> }
    ],
  },
  {
    path: "/user",
    element: <UserRoute><UserLayout /></UserRoute>, // Normal logged in user-er dashboard
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "profile", element: <UserProfile /> },
      { path: "orders", element: <UserOrder /> }
    ] 
  },
  {
    path: "*",
    element: <div className="h-screen flex items-center justify-center font-black">404 - NOT FOUND</div>,
  },
]);

export default router;
