import React, { useState, useEffect } from "react";

import { Container, Row, Col, Button } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import Header from "components/Headers/Header.js";


import { isAdmin } from "../actions/authActions";
import ReportForm from "components/Forms/ReportForm";


const Extracts = () => {
  const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна

  const inputContainerStyle = {
    textAlign: 'center',
  };

    const toggleModal = () => {
    setModalOpen(!modalOpen);
  };


  return (
    <>
      <Header />
      {isAdmin() ? (
        <div style={{ marginTop: "130px" }}>
          <Container className="mt--7 col-lg-6">
            <Row>
              <Col>
                <Button color="primary" onClick={toggleModal}>Создать отчет</Button>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <h1>Недостаточно прав</h1>
      )}

       <ReportForm isOpen={modalOpen} toggleModal={toggleModal} />
    </>
  );
};

export default Extracts;