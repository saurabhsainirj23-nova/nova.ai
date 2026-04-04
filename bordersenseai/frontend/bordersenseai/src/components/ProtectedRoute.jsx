import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children, requiredRoles }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="text-white p-8">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRole = user?.roles?.some(role => requiredRoles.includes(role));
    if (!hasRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}