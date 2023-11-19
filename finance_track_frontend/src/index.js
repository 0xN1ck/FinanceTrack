import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import authReducer from './reducers/authReducer';
import { isTokenValid } from './actions/authActions';

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "layouts/AuthLayout";

import PrivateRoutes from "PrivateRoutes";

const root = ReactDOM.createRoot(document.getElementById('root'));

const store = createStore(
  authReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

const PrivateRouteWrapper = () => {
  const location = useLocation();
  const [isTokenValidated, setTokenValidated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const isValid = await isTokenValid(token);
      if (!isValid && location.pathname !== '/auth/login') {
        // Токен недействителен, перенаправление на страницу входа
        window.location.href = '/auth/login';
      } else {
        setTokenValidated(true);
      }
    };

    validateToken();
  }, [location.pathname]);

  if (!isTokenValidated) {
    return null;
  }

  return isTokenValid(localStorage.getItem('token')) ? <PrivateRoutes /> : <Navigate to="/auth/login" replace />

};

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<PrivateRouteWrapper />} >
          <Route path="/home/*" element={<HomeLayout />} />
          <Route path="*" element={<Navigate to="/home/index" replace />} />
        </Route>
        <Route path="/auth/*" element={<AuthLayout />} />
      </Routes>
    </Provider>
  </BrowserRouter>
);
