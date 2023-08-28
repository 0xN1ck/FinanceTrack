import Login from "views/Login.js";
import Index from "views/Index";
import Profile from "views/Profile";
import Accounting from "views/Accounting";

var routes = [
    {
        path: "/index",
        name: "Домашняя страница",
        icon: "ni ni-tv-2 text-primary",
        component: <Index />,
        layout: "/home",
    },
    {
        path: "/user-profile",
        name: "Профиль",
        icon: "ni ni-single-02 text-yellow",
        component: <Profile />,
        layout: "/home",
    },
    {
        path: "/accounting",
        name: "Учет",
        icon: "ni ni-money-coins text-success",
        component: <Accounting />,
        layout: "/home",
    },
    {
        path: "/login",
        name: "Авторизация",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
    },
];
export default routes;
