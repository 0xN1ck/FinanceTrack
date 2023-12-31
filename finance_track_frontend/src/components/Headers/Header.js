import React, {useState, useEffect} from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import {isAdmin} from "../../actions/authActions";
import {getStatsForUser, getStatsForAllUsers} from "../../actions/getStatsActions";

const Header = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!isAdmin()) {
      getStatsForUser()
        .then((response) => {
          setData(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (isAdmin()) {
      getStatsForAllUsers()
        .then((response) => {
          setData(response.total);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  // console.log(data)


  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Сумма расходников
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {isNaN(parseFloat(data.total_amount_of_consumables)) ? "-" : parseFloat(data.total_amount_of_consumables) * -1}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    {/*<p className="mt-3 mb-0 text-muted text-sm">*/}
                    {/*  <span className="text-success mr-2">*/}
                    {/*    <i className="fa fa-arrow-up" /> 3.48%*/}
                    {/*  </span>{" "}*/}
                    {/*  <span className="text-nowrap">Since last month</span>*/}
                    {/*</p>*/}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Сумма доходов
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {isNaN(parseFloat(data.total_income)) ? "-" : parseFloat(data.total_income)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    {/*<p className="mt-3 mb-0 text-muted text-sm">*/}
                    {/*  <span className="text-danger mr-2">*/}
                    {/*    <i className="fas fa-arrow-down" /> 3.48%*/}
                    {/*  </span>{" "}*/}
                    {/*  <span className="text-nowrap">Since last week</span>*/}
                    {/*</p>*/}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Комиссии за пополнения
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {isNaN(parseFloat(data.total_amount_commission_for_deposits)) ? "-" : parseFloat(data.total_amount_commission_for_deposits) * -1}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                          <i className="fas fa-users" />
                        </div>
                      </Col>
                    </Row>
                    {/*<p className="mt-3 mb-0 text-muted text-sm">*/}
                    {/*  <span className="text-warning mr-2">*/}
                    {/*    <i className="fas fa-arrow-down" /> 1.10%*/}
                    {/*  </span>{" "}*/}
                    {/*  <span className="text-nowrap">Since yesterday</span>*/}
                    {/*</p>*/}
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Итого
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {isNaN(parseFloat(data.total)) ? "-" : parseFloat(data.total)}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-percent" />
                        </div>
                      </Col>
                    </Row>
                    {/*<p className="mt-3 mb-0 text-muted text-sm">*/}
                    {/*  <span className="text-success mr-2">*/}
                    {/*    <i className="fas fa-arrow-up" /> 12%*/}
                    {/*  </span>{" "}*/}
                    {/*  <span className="text-nowrap">Since last month</span>*/}
                    {/*</p>*/}
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
