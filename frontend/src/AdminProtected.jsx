import { Navigate } from 'react-router-dom';

function AdminProtected({ children }) {
    const token = JSON.parse(localStorage.getItem("taskUser")).role === 'admin';
    return token ? children : <Navigate to="/logout" />;
}
export default AdminProtected;