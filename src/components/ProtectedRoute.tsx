import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import Splash from './Splash';

function ProtectedRoute() {
  const { status } = useAppSelector((state) => state.user);
  if (status === 'loading') return <Splash />;
  return status === 'authenticated' ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
