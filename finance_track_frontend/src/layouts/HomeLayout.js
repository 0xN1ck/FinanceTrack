import React from "react";
import {useLocation, Route, Routes, Navigate} from "react-router-dom";

import {Container} from "reactstrap";

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import {isAdmin} from "../actions/authActions";


const HomeLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/home") {
        if (prop.path === "/accounting" && !isAdmin()) {
          return null; // Если пользователь не является администратором, не отображайте компонент Accounting
        }
        return (
          <Route path={prop.path} element={prop.component} key={key} exact/>
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      )
        if (routes[i].path === "/accounting" && !isAdmin()) {
          continue; // Если пользователь не является администратором, пропустите компонент Accounting при определении текста бренда
        }
      {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/home/index",
          imgSrc: require("../assets/img/brand/finance-track.png"),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/home/index" replace/>}/>
        </Routes>
        <Container fluid>
          <AdminFooter/>
        </Container>
      </div>
    </>
  );
};

export default HomeLayout;