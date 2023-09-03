import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { isTokenValid } from 'actions/authActions';

const PrivateRoutes = ({ ...rest }) => {

  const token = localStorage.getItem('token');
  if (!isTokenValid(token)) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;

  // const token = localStorage.getItem('token');
  // return token ? <Outlet /> : <Navigate to="/auth/login"/>

}

export default PrivateRoutes;