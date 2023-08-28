import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Table,
  Container,
  Row,
  UncontrolledTooltip,
  Dropdown,
  Form,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Button,
  Col,
} from "reactstrap";
// core components
import Header from "components/Headers/Header.js";
import { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import axios from "axios";

import 'react-bootstrap-typeahead/css/Typeahead.css';


const Accounting = () => {

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/worker/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setOptions(response.data.map(item => item.username));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  }

  return (
    <>
      <Header />

      {/* Page content */}
      <div style={{ marginTop: "130px" }}>
        {/* <Row>
          <Col > */}
            <Container className="mt--7 col-lg-6">
              <Typeahead
                clearButton
                id="selections-example"
                labelKey="name"
                options={options}
                onChange={handleChange}
                placeholder="Выберите сотрудника..."
              />
            </Container>
          {/* </Col>
        </Row> */}
      </div>


      {/* Table */}
    </>
  );
};

export default Accounting;
