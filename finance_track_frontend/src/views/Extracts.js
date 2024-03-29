import React, {useState, useEffect} from "react";

import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardHeader,
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
  getTotalPagesForExtractsUser,
  getExtractsByWorkerId,
  deleteExtracts,
  createExtracts,
  updateExtracts
} from "../actions/extractActions";
import {getDataOfUser} from "../actions/authActions";

import ReportForm from "components/Forms/ReportForm";
import moment from "moment/moment";
import {getWorkers} from "../actions/accountingActions";
import {Typeahead} from "react-bootstrap-typeahead";


const Extracts = () => {
  const [workers, setWorkers] = useState([]);
  const [currentWorker, setCurrentWorker] = useState(null);
  const [data, setData] = useState([]);
  const [dataForUser, setDataForUser] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false); // Состояние модального окна
  const [modalData, setModalData] = useState(null); // Данные для модального окна
  const [updateHeader, setUpdateHeader] = useState(false);

  useEffect(() => {
    getWorkers()
      .then((response) => {
        setWorkers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!isAdmin()) {
      const dataUser = getDataOfUser();
      getTotalPagesForExtractsUser(dataUser.id)
        .then((response) => {
          setTotalPages(response.total_pages);
        })
        .catch((error) => {
          console.log(error);
        });
      getExtractsByWorkerId(dataUser.id, 1, pageSize)
        .then(response => {
          setDataForUser(response.results);
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
        getTotalPagesForExtractsUser(currentWorker.id)
          .then((response) => {
            let currentPageUpdate = currentPage
            if (response.total_pages < totalPages && currentPage + 1 === totalPages) {
              setCurrentPage(currentPage - 1);
              currentPageUpdate = currentPage - 1
            }
            setTotalPages(response.total_pages);
            getExtractsByWorkerId(currentWorker.id, currentPageUpdate + 1, pageSize)
              .then(response => {
                setData(response.results);
                setUpdateHeader(prevState => !prevState);
              })
              .catch(error => {
                console.log(error);
              });
          })
          .catch((error) => {
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
        getExtractsByWorkerId(currentWorker.id, currentPage + 1, pageSize)
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
        getTotalPagesForExtractsUser(currentWorker.id)
          .then((response) => {
            let currentPageUpdate = currentPage
            if (response.total_pages > totalPages && currentPage + 1 === totalPages) {
              setCurrentPage(currentPage + 1);
              currentPageUpdate = currentPage + 1
            }
            setTotalPages(response.total_pages);
            getExtractsByWorkerId(currentWorker.id, currentPageUpdate + 1, pageSize)
              .then(response => {
                setData(response.results);
                setUpdateHeader(prevState => !prevState);
              })
              .catch(error => {
                console.log(error);
              });
          })
      })
      .catch(error => {
        console.log(error);
      });
    setIsAddFormOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    getExtractsByWorkerId(currentWorker.id, page + 1, pageSize)
      .then((response) => {
        setData(response.results);
        setUpdateHeader(prevState => !prevState);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePageChangeUser = (page) => {
    setCurrentPage(page);
    getExtractsByWorkerId(getDataOfUser().id, page + 1, pageSize)
      .then((response) => {
        setDataForUser(response.results);
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

  const handleChangeCurrentWorker = (currentWorker) => {
    const worker = workers.find(user => user.username === currentWorker[0])
    if (!worker) {
      console.log("Работник не найден");
      return;
    }
    setCurrentWorker(worker)
    getTotalPagesForExtractsUser(worker.id)
      .then((response) => {
        setTotalPages(response.total_pages);
      })
      .catch((error) => {
        console.log(error);
      });
    getExtractsByWorkerId(worker.id, 1, pageSize)
      .then(response => {
        setData(response.results);
        setUpdateHeader(prevState => !prevState);
      })
      .catch(error => {
        console.log(error);
      });
  }

  return (
    <>
      <Header update={updateHeader}/>
      {isAdmin() ? (
        <div style={{marginTop: "130px"}}>
          <Container className="mt--7 col-lg-6">
            <Typeahead
              clearButton
              id="selections-example"
              labelKey="name"
              options={workers.map((item) => item.username)}
              onChange={handleChangeCurrentWorker}
              placeholder="Выберите сотрудника..."
            />
          </Container>
        </div>
      ) : null}

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
                <Row className="mt-1 pl-3 pr-3">
                  {data && data.length > 0 ? (
                    data.map((item) => (
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
                            <Row className="d-flex justify-content-start">
                              <Col xs="auto">
                                <Button
                                  color="primary"
                                  href="#pablo"
                                  size="sm"
                                  onClick={() => handleEdit(item)}
                                  className="mb-2"
                                >
                                  Просмотр
                                </Button>
                              </Col>
                              <Col xs="auto">
                                <Button
                                  color="warning"
                                  href="#pablo"
                                  size="sm"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Удалить
                                </Button>
                              </Col>
                            </Row>

                          </CardBody>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p className='pl-5'>Выберите сотрудника для отображения информации</p>
                  )}
                </Row>
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
              <p className='pl-5'>Выберите сотрудника для отображения информации</p>
            )}
          </Row>
          <PaginationForTable
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChangeUser}
          />
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