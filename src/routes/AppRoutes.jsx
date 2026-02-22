import { createBrowserRouter } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout"; 
import UserLayout from "../layouts/UserLayout";

// Pages
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import Shop from "../pages/Shop.jsx";
import ProductList from "../components/ProductList";
import ProductDetails from "../components/ProductDetails";
import CartPage from "../pages/CartPage";
import Checkout from "../pages/Checkout";
import PaymentSuccess from "../pages/PaymentSuccess.jsx";
import Testimonials from "../pages/Testimonials.jsx";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AddProduct from "../pages/admin/AddProduct";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminUsers from "../pages/admin/AdminUsers";
import MakeAdmin from "../pages/admin/MakeAdmin";
import AdminProfile from "../pages/admin/AdminProfile";
import AdminReviews from "../pages/admin/AdminReviews.jsx";
import POS from "../pages/admin/Pos.jsx";

// Manager Pages
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerAddProduct from "../pages/manager/ManagerAddProduct";
import ManagerProducts from "../pages/manager/ManagerProducts";
import ManagerOrders from "../pages/manager/ManagerOrders";
import ManagerPOS from "../pages/manager/ManagerPOS";
import ManagerProfile from "../pages/manager/ManagerProfile";

// User Pages
import UserDashboard from "../pages/user/UserDashboard";
import UserProfile from "../pages/user/UserProfile";
import UserOrder from "../pages/user/UserOrder.jsx";
import MyReview from "../pages/user/MyReview.jsx";

// Route Protectors
import UserRoute from "../routes/UserRoute"; 
import AdminRoute from "../routes/AdminRoute";
import ManagerRoute from "../routes/ManagerRoute";

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
      { path: "checkout", element: <UserRoute><Checkout /></UserRoute> },
      { path: "collections/:category", element: <Shop /> },
      { path: "testimonials", element: <Testimonials /> }
    ],
  },
  {
    path: "/admin",
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "all-products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "users", element: <AdminUsers /> },
      { path: "make-admin", element: <MakeAdmin /> },
      { path: "profile", element: <AdminProfile /> },
      { path: "reviews", element: <AdminReviews /> },
      { path: "pos", element: <POS /> }
    ],
  },
  {
    path: "/manager",
    element: <ManagerRoute><ManagerLayout /></ManagerRoute>,
    children: [
      { index: true, element: <ManagerDashboard /> },
      { path: "dashboard", element: <ManagerDashboard /> },
      { path: "pos", element: <ManagerPOS /> },
      { path: "add-product", element: <ManagerAddProduct /> },
      { path: "products", element: <ManagerProducts /> },
      { path: "orders", element: <ManagerOrders /> },
      { path: "profile", element: <ManagerProfile /> },
    ],
  },
  {
    path: "/user",
    element: <UserRoute><UserLayout /></UserRoute>,
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "profile", element: <UserProfile /> },
      { path: "orders", element: <UserOrder /> },
      { path: "my-reviews", element: <MyReview /> }
    ] 
  },
  { path: "/payment/success/:tranId", element: <PaymentSuccess /> },
  {
    path: "*",
    element: <div className="h-screen flex items-center justify-center font-black">404 - NOT FOUND</div>,
  },
]);

export default router;