import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RoleRoute({ roles }) {
  const { user } = useSelector((s) => s.auth);
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
