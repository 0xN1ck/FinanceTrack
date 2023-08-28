import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import authReducer from './reducers/authReducer';

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

root.render(
        <BrowserRouter>
            <Provider store={store}>
            <Routes>
                <Route path="/" element={<PrivateRoutes/>} >
                    <Route path="/home/*" element={<HomeLayout/>}/>
                    <Route path="*" element={<Navigate to="/home/index" replace/>}/>
                </Route>
                <Route path="/auth/*" element={<AuthLayout/>}/>
            </Routes>
            </Provider>
        </BrowserRouter>
);
