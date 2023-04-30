import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router';

function RequireAuth({ role, redirectUrl }) {
  const { userInfo } = useSelector((store) => store);
  const hasAuth = userInfo.role === role;
  const location = useLocation();

  if (!hasAuth) {
    // Redirect to the redirectUrl || /login page,
    return <Navigate to={redirectUrl || '/'} state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
