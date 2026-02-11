import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Eikhane shob page load hobe */}
      </main>
      {/* Footer pore add korbo */}
    </div>
  );
};

export default MainLayout;