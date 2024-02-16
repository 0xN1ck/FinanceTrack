import React, {useState, useEffect} from "react";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

import {isAdmin} from "../../actions/authActions";
import {getStatsForUser, getStatsForAllUsers} from "../../actions/getStatsActions";

const Header = ({ update }) => {
  const [data, setData] = useState({});

  useEffect(() => {
    console.log(update);
    if (!isAdmin()) {
      getStatsForUser()
        .then((response) => {
          setData(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    else {
      getStatsForAllUsers()
        .then((response) => {
          setData(response.total);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [update]);


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
