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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home></Home>
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "product/:id",
        element: <ProductDetails></ProductDetails>,
      },
      {
  path: "shop", 
  element: <ProductList></ProductList>
},
      {
        path: "cart",
        element: <CartPage></CartPage>,
      },
      {
        path: "checkout",
        element: <Checkout></Checkout>
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true, // Mane /admin e thakle eta dekhabe
        element: <AdminDashboard />,
      },
      { path: "add-product", element: <AddProduct></AddProduct> },
     
      {
       path: "all-products",
       element: <AdminProducts></AdminProducts>
      },
      {
        path: "orders",
        element: <AdminOrders></AdminOrders>
      },
      {
        path: "users",
        element: <AdminUsers></AdminUsers>
      },
      {
        path: "make-admin",
        element: <MakeAdmin></MakeAdmin>
      },
      {
        path: "profile",
        element: <AdminProfile></AdminProfile>
      }
    ],
  },
  {
    path: "/manager",
    element: <AdminLayout />, // Manager-o Sidebar layout use korbe
    children: [
      {
        index: true,
        element: <ManagerOrders />,
      },
    ],
  },

  // User Dashboard
  {
    path: "/user",
    element: <UserLayout></UserLayout>,
    children: [
      {
        index: true, 
        element: <UserDashboard></UserDashboard>,
      },
      {
        path: "profile",
        element: <UserProfile></UserProfile>
      },
      {
        path: "orders",
        element: <UserOrder></UserOrder>
      }
 ] 
},
  {
    path: "*",
    element: (
      <div className="h-screen flex items-center justify-center">
        404 - Not Found
      </div>
    ),
  },
]);

export default router;
