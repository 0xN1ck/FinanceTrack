import Login from "views/Login.js";
import Index from "views/Index";
import Extracts from "./views/Extracts";
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
        path: "/extracts",
        name: "Выписки",
        icon: "ni ni-single-copy-04 text-yellow",
        component: <Extracts />,
        layout: "/home",
    },
    // {
    //     path: "/accounting",
    //     name: "Учет",
    //     icon: "ni ni-money-coins text-success",
    //     component: <Accounting />,
    //     layout: "/home",
    // },
    {
        path: "/login",
        name: "Авторизация",
        icon: "ni ni-key-25 text-info",
        component: <Login />,
        layout: "/auth",
    },
];

export default routes;
