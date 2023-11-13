import React, {useState, useEffect} from "react";

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardHeader,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu, DropdownItem
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import Header from "components/Headers/Header.js";


import {isAdmin} from "../actions/authActions";
import {getExtracts, deleteExtracts, createExtracts, updateExtracts} from "../actions/extractActions";

import ReportForm from "components/Forms/ReportForm";
import moment from "moment/moment";
import {
  createDeduction,
  deleteDeduction,
  getDeductionsByWorkerId,
  getWorkers,
  updateDeduction
} from "../actions/accountingActions";
import EditForm from "../components/Forms/EditForm";


const Extracts = () => {
  // const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    getExtracts()
      .then(response => {
        setData(response);
        console.log(data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // const toggleModal = () => {
  //   setModalOpen(!modalOpen);
  // };

  const handleEdit = (item) => {
    setSelectedItem(item);
    console.log(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId) => {
    deleteExtracts(itemId)
      .then(() => {
        getExtracts()
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
    updateExtracts(formData.id, formData)
      .then(response => {
        // const workerId = selectedOption && selectedOption.length > 0
        //   ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
        //   : null;
        // if (!workerId) {
        //   console.log("Работник не найден");
        //   return;
        // }
        getExtracts()
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
    createExtracts(formData)
      .then(response => {
        getExtracts()
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
      <Header/>
      {isAdmin() ? (
        /* Table */
        <Container className="mt-3" fluid>
          <Row className="mt-5">
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent border-0">
                  {/* <h3 className="mb-0">Вычеты {selectedOption}</h3> */}
                  <Row>
                    <Col>
                      <h3 className="mb-0">Выписки</h3>
                    </Col>
                    <Col className="text-right">
                      <Button color="primary" onClick={handleAdd}>
                        Создать отчет
                      </Button>
                    </Col>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                  <tr>
                    {/* <th>ID</th> */}
                    <th scope="col">Username</th>
                    <th scope="col">Начальная дата</th>
                    <th scope="col">Конечная дата</th>
                    <th scope="col"/>
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
                          <td>{moment(item.date_start).locale('ru').format('D MMMM YYYY [г.], HH:mm:ss')}</td>
                          <td>{moment(item.date_end).locale('ru').format('D MMMM YYYY [г.], HH:mm:ss')}</td>
                          <td className="text-right">
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v"/>
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem onClick={() => handleEdit(item)}>
                                  Просмотр
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
      ) : (
        <h1>Недостаточно прав</h1>
      )}

      {isFormOpen && (
        <ReportForm
          item={selectedItem}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
          isCreateMode={false}
        />
      )}
      {isAddFormOpen && (
        <ReportForm
          item={{
              "id": null,
              "user": {
                "id": null,
                "username": null
              },
              "date_start": null,
              "date_end": null,
              "payment": null,
              "income": null,
              "expense": null,
              "amount_of_consumables": null,
              "amount_commission_for_deposits": null,
              "debt": null,
              "total": null,
              "user_id": null,
            }}
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddFormSubmit}
          isCreateMode={true}
        />
      )}


    </>
  );
};

export default Extracts;