import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem("accessToken");
  console.log(token)

  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute
