import React, {useState, useEffect} from "react";
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
import {Typeahead} from "react-bootstrap-typeahead";
import moment from "moment";
import "moment/locale/ru";
import "react-bootstrap-typeahead/css/Typeahead.css";

import Header from "components/Headers/Header.js";
import EditForm from "components/Forms/EditForm";
import CreateOrUpdateTagForm from "components/Forms/CreateOrUpdateTagForm";
import PaginationForTable from "components/Pagination/PaginationForTable";
import {
  getWorkers,
  getDeductionsByWorkerId,
  deleteDeduction,
  updateDeduction,
  createDeduction,
  getTotalPagesForDeductions,
} from "actions/accountingActions";

const Accounting = () => {
  const [workers, setWorkers] = useState([]);
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(0);

  const [isTagFormOpen, setIsTagFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const dataWithWeekNumbers = data.map(item => ({
    ...item,
    weekNumber: moment(item.date).isoWeek(), // используем moment для определения номера недели
  }));


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
    setIsTableVisible(data && data.length > 0);
  }, [data]);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const workerId =
      selectedOption && selectedOption.length > 0
        ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
        : null;
    if (!workerId) {
      console.log("Работник не найден");
      return;
    }
    getTotalPagesForDeductions(workerId)
      .then((response) => {
        setTotalPages(response.total_pages);
      })
      .catch((error) => {
        console.log(error);
        console.log(error);
      })
    getDeductionsByWorkerId(workerId, 1, pageSize)
      .then((response) => {
        setData(response.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = (itemId) => {
    deleteDeduction(itemId)
      .then((response) => {
        const workerId =
          selectedOption && selectedOption.length > 0
            ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
            : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId, currentPage + 1, pageSize)
          .then((response) => {
            setData(response.results);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleFormSubmit = (formData) => {
    updateDeduction(formData.id, formData)
      .then((response) => {
        const workerId =
          selectedOption && selectedOption.length > 0
            ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
            : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId, currentPage + 1, pageSize)
          .then((response) => {
            setData(response.results);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    setIsFormOpen(false);
  };

  const handleAdd = () => {
    setIsAddFormOpen(true);
  };

  const handleAddFormSubmit = (formData) => {
    createDeduction(formData)
      .then((response) => {
        const workerId =
          selectedOption && selectedOption.length > 0
            ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
            : null;
        if (!workerId) {
          console.log("Работник не найден");
          return;
        }
        getDeductionsByWorkerId(workerId, currentPage + 1, pageSize)
          .then((response) => {
            setData(response.results);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
    setIsAddFormOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const workerId =
      selectedOption && selectedOption.length > 0
        ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
        : null;
    if (!workerId) {
      console.log("Работник не найден");
      return;
    }
    getDeductionsByWorkerId(workerId, page + 1, pageSize)
      .then((response) => {
        setData(response.results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEditTag = () => {
    setIsTagFormOpen(true);
  };

  const handleTagFormSubmit = (formData) => {
    // Ваша логика для отправки запроса на изменение или создание тега
    // Обновление данных и закрытие формы

    setIsTagFormOpen(false);
  };


  return (
    <>
      <Header/>
      {/* Page content */}
      <div style={{marginTop: "130px"}}>
        <Container className="mt--7 col-lg-6">
          <Typeahead
            clearButton
            id="selections-example"
            labelKey="name"
            options={workers.map((item) => item.username)}
            onChange={handleChange}
            placeholder="Выберите сотрудника..."
          />
        </Container>
      </div>

      {/* Table */}
      <Container className="mt-3" fluid>
        <Row className="mt-5">
          <Col>
            <Card className="shadow">
              <CardHeader className="bg-transparent border-0">
                <Row className="d-flex justify-content-between align-items-center flex-nowrap">
                  <Col xs="6" md="6" className="d-flex align-items-center">
                    <h3 className="mb-0 w-100">Вычеты {selectedOption}</h3>
                  </Col>
                  <Col xs="6" md="6" className="d-flex justify-content-end align-items-center">
                    <Button
                      color="info"
                      onClick={() => handleEditTag(selectedTag)}
                      size={window.innerWidth <= 576 ? "sm" : null}
                      className="mr-2 mr-md-0" // Margin on mobile
                      style={{whiteSpace: 'nowrap'}}
                    >
                      Изменить Tag
                    </Button>
                    <Button
                      color="primary"
                      onClick={handleAdd}
                      disabled={selectedOption.length === 0}
                      size={window.innerWidth <= 576 ? "sm" : null}
                    >
                      Добавить
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                <tr>
                  <th scope="col">№</th>
                  <th scope="col">Username</th>
                  <th scope="col">Tag</th>
                  <th scope="col">Сумма расходников</th>
                  <th scope="col">Сумма пополнения</th>
                  <th scope="col">Коммисия за пополнения</th>
                  <th scope="col">Assignee</th>
                  <th scope="col">Date</th>
                  <th scope="col"/>
                </tr>
                </thead>
                <tbody>
                {/* Table body rendering */}
                {dataWithWeekNumbers && dataWithWeekNumbers.length > 0 ? (
                  dataWithWeekNumbers
                    .sort((a, b) => b.id - a.id)
                    .map((item, index, array) => {
                      const rowNumber = index + 1;

                      // Проверка изменения номера недели
                      const isWeekChange = index === 0 || item.weekNumber !== array[index - 1].weekNumber;


                      return (
                        <React.Fragment key={item.id}>
                        {isWeekChange && (
                          <tr key={`week-separator-${item.id}`}>
                            <td colSpan="9" className="text-center text-dark font-weight-bold">
                              {item.weekNumber} неделя {moment(item.date).format("YYYY")} года
                            </td>
                          </tr>
                        )}
                        <tr key={item.id}>
                          <td>{rowNumber}</td>
                          <td>{item.user.username}</td>
                          <td>{item.tag.name}</td>
                          <td>{item.cost_of_consumables}</td>
                          <td>{item.amount_of_deposits}</td>
                          <td>{item.commission_for_deposits}</td>
                          <td>{item.assignee.user.username}</td>
                          <td>
                            {moment(item.date)
                              .locale("ru")
                              .format("D MMMM YYYY [г.], HH:mm:ss")}
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
                        </React.Fragment>
                        );
                        })
                        ) : (
                        <tr>
                          <td colSpan="9">Нет данных для отображения</td>
                        </tr>
                        )}
                        </tbody>
                    </Table>

                      {/* Pagination */
                      }
                      <PaginationForTable
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </Card>
                    </Col>
                    </Row>
                    </Container>
                      {
                        isFormOpen && (
                          <EditForm
                            item={selectedItem}
                            onClose={handleFormClose}
                            onSubmit={handleFormSubmit}
                            isCreateMode={false}
                          />
                        )
                      }
                      {
                        isAddFormOpen && (
                          <EditForm
                            item={{
                              id: null,
                              user: workers.filter((user) => user.username === selectedOption[0])[0],
                              tag: {
                                id: 3,
                                name: "bm",
                              },
                              cost_of_consumables: null,
                              amount_of_deposits: null,
                              commission_for_deposits: null,
                              assignee: {
                                id: 1,
                                user: {
                                  id: 1,
                                  username: "maxim",
                                },
                              },
                              date: new Date().toISOString(),
                              user_id: workers.filter((user) => user.username === selectedOption[0])[0].id,
                              assignee_id: 1,
                              tag_id: 3,
                            }}
                            onClose={() => setIsAddFormOpen(false)}
                            onSubmit={handleAddFormSubmit}
                            isCreateMode={true}
                          />
                        )
                      }
                      {
                        isTagFormOpen && (
                          <CreateOrUpdateTagForm
                            onClose={() => setIsTagFormOpen(false)}
                          />
                        )
                      }
                    </>
                    )
                      ;
                    };

                  export default Accounting;