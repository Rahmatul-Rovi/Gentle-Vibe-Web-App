
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
       <Outlet></Outlet>
      </main>
     <Footer></Footer>
    </div>
  );
};

export default MainLayout;