import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === "company" ? "/company/dashboard" : "/employee/dashboard"} replace={true} />;
  }

  if (
    user.role === "company" &&
    !user.companyId &&
    location.pathname !== "/company/onboarding"
  ) {
    return <Navigate to="/company/onboarding" replace={true} />;
  }

  if (
    user.role === "company" &&
    user.companyId &&
    location.pathname === "/company/onboarding"
  ) {
    return <Navigate to="/company/dashboard" replace={true} />;
  }

  return children;
};

export default ProtectedRoute;
