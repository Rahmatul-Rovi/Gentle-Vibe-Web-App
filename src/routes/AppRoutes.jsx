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

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: (
          <>
            <Hero />
            <Categories />
            <ProductList></ProductList>
          </>
        ),
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
        path: "users",
        element: <div className="p-4">User Management</div>,
      },
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
