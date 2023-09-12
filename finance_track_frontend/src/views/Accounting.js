import {
  Card,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  Button,
  Col,
} from "reactstrap";

import {
getWorkers,
getDeductionsByWorkerId,
deleteDeduction,
updateDeduction,
createDeduction
} from "actions/accountingActions";

import Header from "components/Headers/Header.js";
import EditForm from "components/Forms/EditForm";

import { useState, useEffect } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import moment from "moment";
import 'moment/locale/ru';

import 'react-bootstrap-typeahead/css/Typeahead.css';


const Accounting = () => {
  const [workers, setWorkers] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    getWorkers()
      .then(response => {
        setWorkers(response);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setIsTableVisible(data && data.length > 0);
  }, [data]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const workerId = selectedOption && selectedOption.length > 0
      ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
      : null;
    if (!workerId) {
      console.log("Работник не найден");
      return;
    }
    getDeductionsByWorkerId(workerId)
      .then(response => {
        setData(response);
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId) => {
    deleteDeduction(itemId)
      .then(response => {
        const workerId = selectedOption && selectedOption.length > 0
          ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
          : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId)
          .then(response => {
            setData(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formData) => {
    updateDeduction(formData.id, formData)
      .then(response => {
        const workerId = selectedOption && selectedOption.length > 0
          ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
          : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId)
          .then(response => {
            setData(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
    setIsFormOpen(false);
  };

  const handleAdd = () => {
    setIsAddFormOpen(true);
  };

  const handleAddFormSubmit = (formData) => {
    createDeduction(formData)
      .then(response => {
        const workerId = selectedOption && selectedOption.length > 0
          ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
          : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId)
          .then(response => {
            setData(response);
          })
          .catch(error => {
            console.log(error);
          });
      })
      .catch(error => {
        console.log(error);
      });
    setIsAddFormOpen(false);
  };

  return (
    <>
      <Header />

      {/* Page content */}
      <div style={{ marginTop: "130px" }}>
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
      </div>

      {/* Table */}
      <Container className="mt-3" fluid>
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent border-0">
                {/* <h3 className="mb-0">Вычеты {selectedOption}</h3> */}
                <Row>
                  <Col>
                    <h3 className="mb-0">Вычеты {selectedOption}</h3>
                  </Col>
                  <Col className="text-right">
                    <Button color="primary" onClick={handleAdd} disabled={!isTableVisible}>
                      Добавить
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    {/* <th>ID</th> */}
                    <th scope="col">Username</th>
                    <th scope="col">Tag</th>
                    <th scope="col">Сумма расходников</th>
                    <th scope="col">Сумма пополнения</th>
                    <th scope="col">Коммисия за пополнения</th>
                    <th scope="col">Assignee</th>
                    <th scope="col">Date</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {data && data.length > 0 ? (
                    data
                      .sort((a, b) => b.id - a.id) // Сортируем данные по полю id в обратном порядке
                      .map((item) => (
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
                                <DropdownItem onClick={() => handleEdit(item)}>
                                  Изменить
                                </DropdownItem>
                                <DropdownItem onClick={() => handleDelete(item.id)}>
                                  Удалить
                                </DropdownItem>
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
      {isFormOpen && (
        <EditForm
          item={selectedItem}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          isCreateMode={false}
        />
      )}
      {isAddFormOpen && (
        <EditForm
          item={{
            "id": null,
            "user": workers.filter((user) => user.username === selectedOption[0])[0],
            "tag": {
              "id": 3,
              "name": "bm"
            },
            "cost_of_consumables": null,
            "amount_of_deposits": null,
            "commission_for_deposits": null,
            "assignee": {
              "id": 1,
              "user": {
                "id": 1,
                "username": "maxim"
              }
            },
            "date": new Date().toISOString(),
            "user_id": workers.filter((user) => user.username === selectedOption[0])[0].id,
            "assignee_id": 1,
            "tag_id": 3
          }}
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddFormSubmit}
          isCreateMode={true}
        />
      )}
    </>
  );
};

export default Accounting;
