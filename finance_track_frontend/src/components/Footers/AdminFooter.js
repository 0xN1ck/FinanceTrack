import {Row, Col} from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-muted">
            © {new Date().getFullYear()}{" "}
            0xN1ck
          </div>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
