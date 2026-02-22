import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (loading) {
        return <div className="h-screen flex items-center justify-center font-black italic">VALIDATING ADMIN...</div>;
    }

    if (user && storedUser?.role === 'admin') {
        return children;
    }

    alert("Access Denied! Admins only.");
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoute;