import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const token = JSON.parse(localStorage.getItem("taskUser")).role === 'admin';
    return token ? children : <Navigate to="/login" />;
}
export default ProtectedRoute;