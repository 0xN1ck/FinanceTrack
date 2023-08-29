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
import moment from "moment";
import 'moment/locale/ru';

import 'react-bootstrap-typeahead/css/Typeahead.css';


const Accounting = () => {

  const [workers, setWorkers] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/worker/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        // setWorkers(response.data.map(item => item.username));
        setWorkers(response.data);
        console.log(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const workerId = selectedOption && selectedOption.length > 0
      ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
      : null;
    if (!workerId) {
      console.log("Работник не найден");
      return; // Выход из функции
    }
    console.log(workerId);
    axios.get(`http://localhost:8000/api/deduction/worker/${workerId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        setData(response.data);
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
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
            options={workers.map(item => item.username)}
            onChange={handleChange}
            placeholder="Выберите сотрудника..."
          />
        </Container>
        {/* </Col>
        </Row> */}
      </div>

      {/* Table */}
      <Container className="mt-3" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent border-0">
                <h3 className="mb-0">Вычеты {selectedOption}</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th>ID</th> */}
                    <th scope="col">Username</th>
                    <th scope="col">Tag</th>
                    <th scope="col">Cost of Consumables</th>
                    <th scope="col">Amount of Deposits</th>
                    <th scope="col">Commission for Deposits</th>
                    <th scope="col">Assignee</th>
                    <th scope="col">Date</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data.map((item) => (
                      <tr key={item.id}>
                        {/* <td>{item.id}</td> */}
                        <td>{item.user.username}</td>
                        <td>{item.tag.name}</td>
                        <td>{item.cost_of_consumables}</td>
                        <td>{item.amount_of_deposits}</td>
                        <td>{item.commission_for_deposits}</td>
                        <td>{item.assignee.user.username}</td>
                        <td>{moment(item.date).locale('ru').format('D MMMM YYYY [г.], HH:mm:ss')}</td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                onClick={(e) => e.preventDefault()}
                              >
                                Изменить
                              </DropdownItem>
                              <DropdownItem
                                onClick={(e) => e.preventDefault()}
                              >
                                Удалить
                              </DropdownItem>
                              {/* <DropdownItem
                                onClick={(e) => e.preventDefault()}
                              >
                                Something else here
                              </DropdownItem> */}
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">Нет данных для отображения</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

    </>
  );
};

export default Accounting;
