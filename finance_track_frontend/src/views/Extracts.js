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
  DropdownMenu,
  DropdownItem,
  CardBody,
  CardTitle,
  CardText,
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import Header from "components/Headers/Header.js";
import PaginationForTable from "components/Pagination/PaginationForTable";
import DetailsReportForm from "components/Forms/DetailsReportForm";


import {isAdmin} from "../actions/authActions";
import {
  getExtracts,
  getTotalPagesForExtracts,
  getExtractsByWorkerId,
  deleteExtracts,
  createExtracts,
  updateExtracts
} from "../actions/extractActions";
import {getDataOfUser} from "../actions/authActions";
// import {getStatsForUser, getStatsForAllUsers} from "../actions/getStatsActions";

import ReportForm from "components/Forms/ReportForm";
import moment from "moment/moment";


const Extracts = () => {
  const [data, setData] = useState([]);
  const [dataForUser, setDataForUser] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
  const [modalData, setModalData] = useState(null); // Данные для модального окна
  const [updateHeader, setUpdateHeader] = useState(false);

  useEffect(() => {
    if (isAdmin()) {
      getTotalPagesForExtracts()
        .then((response) => {
          setTotalPages(response.total_pages);
        })
        .catch((error) => {
          console.log(error);
        });
      getExtracts(1, pageSize)
        .then(response => {
          setData(response.results);
          setUpdateHeader(prevState => !prevState);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  useEffect(() => {
    if (!isAdmin()) {
      const dataUser = getDataOfUser();
      getExtractsByWorkerId(dataUser.id)
        .then(response => {
          setDataForUser(response);
          setUpdateHeader(prevState => !prevState);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);


  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId) => {
    deleteExtracts(itemId)
      .then(() => {
        getExtracts(currentPage + 1, pageSize)
          .then(response => {
            setData(response.results);
            setUpdateHeader(prevState => !prevState);
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
    setUpdateHeader(prevState => !prevState);
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formData) => {
    updateExtracts(formData.id, formData)
      .then(response => {
        getExtracts(currentPage + 1, pageSize)
          .then(response => {
            setData(response.results);
            setUpdateHeader(prevState => !prevState);
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
        setSelectedItem(response);
        setIsFormOpen(true);
      })
      .then(response => {
        getExtracts(currentPage + 1, pageSize)
          .then(response => {
            setData(response.results);
            setUpdateHeader(prevState => !prevState);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getExtracts(page + 1, pageSize)
      .then((response) => {
        console.log(response);
        setData(response.results);
        setUpdateHeader(prevState => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleModalOpen = (item) => {
    setModalData(item);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setUpdateHeader(prevState => !prevState);
    setModalOpen(false);
  };

  return (
    <>
      <Header update={updateHeader}/>
      {isAdmin() ? (
        /* Table */
        <Container className="mt-3" fluid>
          <Row className="mt-5">
            <div className="col">
              <Card className="shadow">
                <CardHeader className="bg-transparent border-0">
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
                    <th scope="col">Username</th>
                    <th scope="col">Начальная дата</th>
                    <th scope="col">Конечная дата</th>
                    <th scope="col"/>
                  </tr>
                  </thead>
                  <tbody>
                  {data && data.length > 0 ? (
                    data
                      .sort((a, b) => b.id - a.id)
                      .map((item) => (
                        <tr key={item.id}>
                          <td>{item.user.username}</td>
                          <td>
                            {moment(item.date_start)
                              .locale("ru")
                              .format("D MMMM YYYY [г.]")}
                          </td>
                          <td>
                            {moment(item.date_end)
                              .locale("ru")
                              .format("D MMMM YYYY [г.]")}
                          </td>
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
                              <DropdownMenu
                                className="dropdown-menu-arrow"
                                right
                              >
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
                <PaginationForTable
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </Card>
            </div>
          </Row>
        </Container>
      ) : (
        <Container className="mt-3" fluid>
          <Row className="mt-5">
            {dataForUser && dataForUser.length > 0 ? (
              dataForUser.map((item) => (
                <Col key={item.id} xs={12} sm={6} md={3} className="mb-3">
                  <Card style={{width: "100%"}}>
                    <CardBody>
                      <CardTitle tag="h5">{item.user.username}</CardTitle>
                      <CardText>
                        Начальная дата:{" "}
                        {moment(item.date_start).locale("ru").format("D MMMM YYYY [г.]")}
                      </CardText>
                      <CardText>
                        Конечная дата:{" "}
                        {moment(item.date_end).locale("ru").format("D MMMM YYYY [г.]")}
                      </CardText>
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={() => handleModalOpen(item)} // Открытие модального окна при нажатии на кнопку
                      >
                        Детали
                      </Button>
                    </CardBody>
                  </Card>
                </Col>
              ))
            ) : (
              <p>Нет данных для отображения</p>
            )}
          </Row>
        </Container>
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
            id: null,
            user: null,
            date_start: null,
            date_end: null,
            payment: null,
            income: null,
            expense: null,
            amount_of_consumables: null,
            amount_commission_for_deposits: null,
            debt: null,
            total: null,
            user_id: null
          }}
          onClose={() => setIsAddFormOpen(false)}
          onSubmit={handleAddFormSubmit}
          isCreateMode={true}
        />
      )}

      {/* Модальное окно */}
      <DetailsReportForm
        isOpen={modalOpen}
        toggle={handleModalClose}
        modalData={modalData}
      />
    </>
  );
};

export default Extracts;