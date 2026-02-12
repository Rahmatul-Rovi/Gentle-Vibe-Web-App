import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const UserRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    // Data load hobar somoy loader dekhabe
    if (loading) {
        return <div className="h-screen flex items-center justify-center font-black italic">LOADING...</div>;
    }

    // User login kora thakle component dekhate dibe
    if (user) {
        return children;
    }

    // Login na thakle login page-e pathiye dibe
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default UserRoute;