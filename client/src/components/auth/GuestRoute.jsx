import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDashboardUrl } from '@/utils/navigation';

export default function GuestRoute() {
  const { user } = useSelector((s) => s.auth);
  
  if (user) {
    return <Navigate to={getDashboardUrl(user.role)} replace />;
  }
  
  return <Outlet />;
}
