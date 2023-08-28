import { useState, React } from "react";
import { NavLink as NavLinkRRD, Link, useNavigate } from "react-router-dom";

import { PropTypes } from "prop-types";

import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

import { useDispatch } from "react-redux";
import { logout } from "actions/authActions";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const activeRoute = (routeName) => {
    return props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  const closeCollapse = () => {
    setCollapseOpen(false);
  };
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/home") {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );}
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(auth, token);
  //   if (!token && !auth) {
  //     navigate('/auth/login'); // Redirect to home page when login is successful
  //   }
  // }, [token, auth, navigate]);

  const handleLogout = () => {
    dispatch(logout())
    setTimeout(() => {
      navigate('/auth/login');
    }, 100); 
  }

  return (
    <Navbar
      className="navbar-vertical fixed-left navbar-light bg-white"
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0" {...navbarBrandProps}>
            <img
              alt={logo.imgAlt}
              className="navbar-brand-img"
              src={logo.imgSrc}
            />
          </NavbarBrand>
        ) : null}
        {/* User */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav className="nav-link-icon">
              <i className="ni ni-bell-55" />
            </DropdownToggle>
            <DropdownMenu
              aria-labelledby="navbar-default_dropdown_1"
              className="dropdown-menu-arrow"
              right
            >
              <DropdownItem>Action</DropdownItem>
              <DropdownItem>Another action</DropdownItem>
              <DropdownItem divider />
              <DropdownItem>Something else here</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle">
                  <img
                    alt="..."
                    src={require("../../assets/img/theme/admin.png")}
                  />
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Welcome!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02" />
                <span>My profile</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-settings-gear-65" />
                <span>Settings</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-calendar-grid-58" />
                <span>Activity</span>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-support-16" />
                <span>Support</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem href="#pablo" onClick={handleLogout}>
                <i className="ni ni-user-run" />
                <span>Logout</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header d-md-none">
            <Row>
              {logo ? (
                <Col className="collapse-brand" xs="6">
                  {logo.innerLink ? (
                    <Link to={logo.innerLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </Link>
                  ) : (
                    <a href={logo.outterLink}>
                      <img alt={logo.imgAlt} src={logo.imgSrc} />
                    </a>
                  )}
                </Col>
              ) : null}
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <span />
                  <span />
                </button>
              </Col>
            </Row>
          </div>
          {/* Form */}
          <Form className="mt-4 mb-3 d-md-none">
            <InputGroup className="input-group-rounded input-group-merge">
              <Input
                aria-label="Search"
                className="form-control-rounded form-control-prepended"
                placeholder="Search"
                type="search"
              />
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <span className="fa fa-search" />
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          {/* Navigation */}
          <Nav navbar>{createLinks(routes)}</Nav>
          {/* Divider */}
          {/*<hr className="my-3" />*/}
          {/* Heading */}
          {/*<h6 className="navbar-heading text-muted">Documentation</h6>*/}
          {/* Navigation */}
          {/*<Nav className="mb-md-3" navbar>*/}
          {/*  <NavItem>*/}
          {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/overview?ref=adr-admin-sidebar">*/}
          {/*      <i className="ni ni-spaceship" />*/}
          {/*      Getting started*/}
          {/*    </NavLink>*/}
          {/*  </NavItem>*/}
          {/*  <NavItem>*/}
          {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/colors?ref=adr-admin-sidebar">*/}
          {/*      <i className="ni ni-palette" />*/}
          {/*      Foundation*/}
          {/*    </NavLink>*/}
          {/*  </NavItem>*/}
          {/*  <NavItem>*/}
          {/*    <NavLink href="https://demos.creative-tim.com/argon-dashboard-react/#/documentation/alerts?ref=adr-admin-sidebar">*/}
          {/*      <i className="ni ni-ui-04" />*/}
          {/*      Components*/}
          {/*    </NavLink>*/}
          {/*  </NavItem>*/}
          {/*</Nav>*/}
          {/*<Nav className="mb-md-3" navbar>*/}
          {/*  <NavItem className="active-pro active">*/}
          {/*    <NavLink href="https://www.creative-tim.com/product/argon-dashboard-pro-react?ref=adr-admin-sidebar">*/}
          {/*      <i className="ni ni-spaceship" />*/}
          {/*      Upgrade to PRO*/}
          {/*    </NavLink>*/}
          {/*  </NavItem>*/}
          {/*</Nav>*/}
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {

  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({

    innerLink: PropTypes.string,

    outterLink: PropTypes.string,

    imgSrc: PropTypes.string.isRequired,

    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;