import { Navigate } from "react-router-dom";

const ManagerRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (token && user?.role === "manager") {
        return children;
    }
    return <Navigate to="/login" replace />;
};
export default ManagerRoute;