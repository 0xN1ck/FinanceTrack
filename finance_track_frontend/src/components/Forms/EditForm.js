import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import 'moment/locale/ru';

import "react-datepicker/dist/react-datepicker.module.css";
import { registerLocale } from "react-datepicker";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)

const CustomDatePicker = ({ selected, onChange }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale="ru"
      dateFormat="d MMMM yyyy г., HH:mm:ss"
      showTimeSelect
      timeFormat="HH:mm:ss"
      timeIntervals={1}
      timeCaption="Время"
      className="form-control"
    />
  );
};


const EditForm = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    user_username: item.user.username,
    tag_name: item.tag.name,
    cost_of_consumables: item.cost_of_consumables,
    amount_of_deposits: item.amount_of_deposits,
    commission_for_deposits: item.commission_for_deposits,
    assignee_user_username: item.assignee.user.username,
    date: moment(item.date).toDate()
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={true} toggle={onClose}>
      <ModalHeader toggle={onClose}>Изменение данных</ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="user_username">Username</Label>
                <Input
                  type="text"
                  name="user_username"
                  id="user_username"
                  value={formData.user_username}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="tag_name">Tag</Label>
                <Input
                  type="text"
                  name="tag_name"
                  id="tag_name"
                  value={formData.tag_name}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="cost_of_consumables">Cost of consumables</Label>
                <Input
                  type="number"
                  name="cost_of_consumables"
                  id="cost_of_consumables"
                  value={formData.cost_of_consumables}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="amount_of_deposits">Amount of deposits</Label>
                <Input
                  type="number"
                  name="amount_of_deposits"
                  id="amount_of_deposits"
                  value={formData.amount_of_deposits}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="commission_for_deposits">Commission for deposits</Label>
                <Input
                  type="number"
                  name="commission_for_deposits"
                  id="commission_for_deposits"
                  value={formData.commission_for_deposits}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="assignee_user_username">Assignee</Label>
                <Input
                  type="text"
                  name="assignee_user_username"
                  id="assignee_user_username"
                  value={formData.assignee_user_username}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="date">Date</Label>
            <div>
              <CustomDatePicker
                selected={formData.date}
                onChange={handleDateChange}
              />
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit">
          Сохранить
        </Button>
        <Button color="secondary" onClick={onClose}>
          Закрыть
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditForm;