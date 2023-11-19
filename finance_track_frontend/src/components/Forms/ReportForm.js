import React, {useEffect, useState} from "react";
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

import DatePicker, {registerLocale} from "react-datepicker";
import {Typeahead} from "react-bootstrap-typeahead";
import moment from "moment";
import "moment/locale/ru";
import "react-datepicker/dist/react-datepicker.css";
import ru from "date-fns/locale/ru";

import {getWorkers} from "../../actions/accountingActions";

registerLocale("ru", ru);

const ReportForm = ({item, isCreateMode, onClose, onSubmit}) => {
  const headerText = isCreateMode ? "Добавить данные" : "Изменение данных";
  const buttonText = isCreateMode ? "Добавить" : "Сохранить";

  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [workers, setWorkers] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const [formData, setFormData] = useState({
    id: item.id || '',
    user: item.user || '',
    date_start: item.date_start || '',
    date_end: item.date_end || '',
    payment: item.payment || '',
    income: item.income || '',
    expense: item.expense || '',
    amount_of_consumables: item.amount_of_consumables || '',
    amount_commission_for_deposits: item.amount_commission_for_deposits || '',
    debt: item.debt || '',
    total: item.total || '',
    user_id: item.user_id || '',
  })

  useEffect(() => {
    getWorkers()
      .then((response) => {
        setWorkers(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleChange = (e, name) => {
    const value = e ? e[0] : ''; // Проверка на undefined
    let updatedData = {...formData};

    switch (name) {
      case 'worker':
        const selectedUser = workers.find(item => item.username === value);
        if (selectedUser) {
          updatedData = {
            ...updatedData,
            user_id: selectedUser.id,
            user: selectedUser,
          };
        }
        break;
      case 'date':
        setDateRange(e)
        updatedData = {
          ...updatedData,
          date_start: e[0] ? moment(e[0]).toDate() : null,
          date_end: e[1] ? moment(e[1]).toDate() : null,
        };
        break;
      default:
        updatedData = {...updatedData, [e.target.name]: e.target.value};
        break;
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({...formData});
  };

  const handleCreateReport = () => {
    // Логика создания отчета
    // toggleModal(); // Закрытие модального окна после создания отчета
  };

  let size_head = 8
  let size_body = 4
  if (!isCreateMode) {
    size_head = 12
    size_body = 6
  }

  return (
    <>
      <Modal isOpen={true} toggle={onClose} centered>
        <ModalHeader toggle={onClose}>{headerText}</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Container>
              <Row>
                <Col sm={size_head}>
                  <FormGroup>
                    <Label for="worker">Выберите сотрудника</Label>
                    <Typeahead
                      clearButton
                      id="worker"
                      labelKey="name"
                      options={workers.map((item) => {
                        return item.username;
                      })}
                      defaultSelected={formData.user ? [formData.user.username] : []}
                      onChange={(e) => handleChange(e, 'worker')}
                      placeholder="Выберите сотрудника..."
                      inputProps={{style: {textAlign: "center"}}}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="dateRange">Выберите период</Label>
                    <DatePicker
                      locale="ru"
                      className="form-control"
                      wrapperClassName="form-control"
                      calendarClassName="react-datepicker__input-container"
                      customInput={<input style={{textAlign: "center"}}/>}
                      dateFormat="d MMMM yyyy г."
                      selectsRange={true}
                      startDate={formData.date_start ? new Date(formData.date_start) : startDate}
                      endDate={formData.date_end ? new Date(formData.date_end) : endDate}
                      onChange={(e) => handleChange(e, 'date')}
                      isClearable={true}
                      placeholderText="Выберите период..."
                    />
                  </FormGroup>
                </Col>
                {isCreateMode && (
                <Col sm={size_body}>
                    <FormGroup>
                      <Label for="income">Доход</Label>
                      <Input
                        type="number"
                        id="income"
                        name="income"
                        value={formData.income}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="expense">Расход</Label>
                      <Input
                        type="number"
                        id="expense"
                        name="expense"
                        value={formData.expense}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="debt">Долг</Label>
                      <Input
                        type="number"
                        id="debt"
                        name="debt"
                        value={formData.debt}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                  </Col>
                )}
              </Row>
              {!isCreateMode && (
                <Row>
                  <Col sm={size_body}>
                    <FormGroup>
                      <Label for="income">Доход</Label>
                      <Input
                        type="number"
                        id="income"
                        name="income"
                        value={formData.income}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="expense">Расход</Label>
                      <Input
                        type="number"
                        id="expense"
                        name="expense"
                        value={formData.expense}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="debt">Долг</Label>
                      <Input
                        type="number"
                        id="debt"
                        name="debt"
                        value={formData.debt}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm={size_body}>
                    <FormGroup>
                      <Label for="payment">Выплата</Label>
                      <Input
                        type="number"
                        id="payment"
                        name="payment"
                        value={formData.payment}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="amount_of_consumables">Сумма расходников</Label>
                      <Input
                        type="number"
                        id="amount_of_consumables"
                        name="amount_of_consumables"
                        value={formData.amount_of_consumables}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="amount_commission_for_deposits">Комиссия за пополнения</Label>
                      <Input
                        type="number"
                        id="amount_commission_for_deposits"
                        name="amount_commission_for_deposits"
                        value={formData.amount_commission_for_deposits}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="total">Итого</Label>
                      <Input
                        type="number"
                        id="total"
                        name="total"
                        value={formData.total}
                        onChange={(e) => handleChange(e, 'default')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              )}
            </Container>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            {buttonText}
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