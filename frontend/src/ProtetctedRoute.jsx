import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("taskToken");
    return token ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;