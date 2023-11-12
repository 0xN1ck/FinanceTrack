import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
  Container,
  Row,
  Col,
} from "reactstrap";

import DatePicker, { registerLocale } from "react-datepicker";
import { Typeahead } from "react-bootstrap-typeahead";
import "moment/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";

import { getWorkers } from "../../actions/accountingActions";

registerLocale("ru", ru);

const ReportForm = ({ item, isCreateMode, onClose, onSubmit }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [workers, setWorkers] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [debt, setDebt] = useState(0);

  const inputContainerStyle = {
    textAlign: "center",
  };

  useEffect(() => {
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    getWorkers()
      .then((response) => {
        setWorkers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    const workerId =
      selectedOption && selectedOption.length > 0
        ? workers.filter((user) => user.username === selectedOption[0])[0]?.id
        : null;
    if (!workerId) {
      console.log("Работник не найден");
    }
  };

  const handleCreateReport = () => {
    // Логика создания отчета
    // toggleModal(); // Закрытие модального окна после создания отчета
  };

  return (
    <>
      <Modal isOpen={true} toggle={onClose} centered>
        <ModalHeader toggle={onClose}>Создание отчета</ModalHeader>
        <ModalBody>
          <Form>
            <Container>
              <Row>
                <Col sm={8}>
                  <FormGroup>
                    <Label for="worker">Выберите сотрудника</Label>
                    <Typeahead
                      clearButton
                      id="worker"
                      labelKey="name"
                      options={workers.map((item) => item.username)}
                      onChange={handleChange}
                      placeholder="Выберите сотрудника..."
                      inputProps={{ style: { textAlign: "center" } }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="dateRange">Выберите период</Label>
                    <DatePicker
                      locale="ru"
                      className="form-control"
                      wrapperClassName="form-control"
                      calendarClassName="react-datepicker__input-container"
                      customInput={<input style={inputContainerStyle} />}
                      dateFormat="d MMMM yyyy г."
                      selectsRange={true}
                      startDate={startDate}
                      endDate={endDate}
                      onChange={(update) => {
                        setDateRange(update);
                      }}
                      isClearable={true}
                      placeholderText="Выберите период..."
                    />
                  </FormGroup>
                </Col>
                <Col sm={4}>
                  <FormGroup>
                    <Label for="income">Доход</Label>
                    <Input
                      type="number"
                      id="income"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="expense">Расход</Label>
                    <Input
                      type="number"
                      id="expense"
                      value={expense}
                      onChange={(e) => setExpense(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="debt">Долг</Label>
                    <Input
                      type="number"
                      id="debt"
                      value={debt}
                      onChange={(e) => setDebt(e.target.value)}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCreateReport}>
            Создать
          </Button>{" "}
          <Button color="secondary" onClick={onClose}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ReportForm;