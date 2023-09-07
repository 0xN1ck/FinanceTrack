import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import { Typeahead } from "react-bootstrap-typeahead";
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
      selected={selected || ''}
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
    id: item.id,
    user: item.user || '',
    tag: item.tag || '',
    cost_of_consumables: item.cost_of_consumables || '',
    amount_of_deposits: item.amount_of_deposits || '',
    commission_for_deposits: item.commission_for_deposits || '',
    assignee: item.assignee || '',
    date: item.date || null,
    user_id: item.user_id,
    tag_id: item.tag_id,
    assignee_id: item.assignee_id,
  });
  const [workers, setWorkers] = useState([]);
  const [tags, setTags] = useState([]);
  const [assignee, setAssignee] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workerResponse = await axios.get('http://localhost:8000/api/worker/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setWorkers(workerResponse.data);

        const tagsResponse = await axios.get('http://localhost:8000/api/tags/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTags(tagsResponse.data);

        const assigneeResponse = await axios.get('http://localhost:8000/api/assignee/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAssignee(assigneeResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // const handleChangeDefault = (e) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  // const handleUserChange = (e) => {
  //   const selectedWorker = workers.find(item => item.username === e[0]);
  //   selectedWorker && setFormData({ ...formData, user_id: selectedWorker.id, user: selectedWorker });
  // };

  // const handleTagChange = (e) => {
  //   const selectedTag = tags.find(item => item.name === e[0]);
  //   selectedTag && setFormData({ ...formData, tag_id: selectedTag.id, tag: selectedTag });
  // };

  // const handleAssigneeChange = (e) => {
  //   const selectedAssignee = assignee.find(item => item.user.username === e[0]);
  //   console.log(selectedAssignee)
  //   selectedAssignee && setFormData({ ...formData, assignee_id: selectedAssignee.id, assignee: selectedAssignee });
  // };

  // const handleDateChange = (date) => {
  //   setFormData({ ...formData, date: date });
  // };

  const handleChange = (e, name) => {
    const value = e ? e[0] : ''; // Проверка на undefined
    let updatedData = { ...formData };
  
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
      case 'tag':
        const selectedTag = tags.find(item => item.name === value);
        if (selectedTag) {
          updatedData = {
            ...updatedData,
            tag_id: selectedTag.id,
            tag: selectedTag,
          };
        }
        break;
      case 'assignee':
        const selectedAssignee = assignee.find(item => item.user.username === value);
        if (selectedAssignee) {
          updatedData = {
            ...updatedData,
            assignee_id: selectedAssignee.id,
            assignee: selectedAssignee,
          };
        }
        break;
      case 'date':
        updatedData = { ...updatedData, date: e };
        break;
      default:
        updatedData = { ...updatedData, [e.target.name]: e.target.value };
        break;
    }
  
    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData });
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
                <Typeahead
                  clearButton
                  id="user_username"
                  labelKey="worker"
                  options={workers.map(item => item.username)}
                  onChange={(e) => handleChange(e, 'worker')}
                  placeholder="Выберите сотрудника..."
                  defaultSelected={[formData.user.username]}
                />
              </FormGroup>
              <FormGroup>
                <Label for="tag_name">Tag</Label>
                <Typeahead
                  clearButton
                  id="tag_name"
                  labelKey="tag"
                  options={tags.map(item => item.name)}
                  onChange={(e) => handleChange(e, 'tag')}
                  placeholder="Выберите tag..."
                  defaultSelected={[formData.tag.name]}
                />
              </FormGroup>
              <FormGroup>
                <Label for="cost_of_consumables">Сумма расходников</Label>
                <Input
                  type="number"
                  name="cost_of_consumables"
                  id="cost_of_consumables"
                  value={formData.cost_of_consumables}
                  onChange={(e) => handleChange(e, 'default')}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="amount_of_deposits">Сумма пополнения</Label>
                <Input
                  type="number"
                  name="amount_of_deposits"
                  id="amount_of_deposits"
                  value={formData.amount_of_deposits}
                  onChange={(e) => handleChange(e, 'default')}
                />
              </FormGroup>
              <FormGroup>
                <Label for="commission_for_deposits">Коммисия за пополнения</Label>
                <Input
                  type="number"
                  name="commission_for_deposits"
                  id="commission_for_deposits"
                  value={formData.commission_for_deposits}
                  onChange={(e) => handleChange(e, 'default')}
                />
              </FormGroup>
              <FormGroup>
                <Label for="assignee_user_username">Assignee</Label>
                <Typeahead
                  clearButton
                  id="assignee_user_username"
                  labelKey="assignee"
                  options={assignee.map(item => item.user.username)}
                  onChange={(e) => handleChange(e, 'assignee')}
                  placeholder="Выберите assignee..."
                  defaultSelected={[formData.assignee.user.username]}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="date">Date</Label>
            <div>
              <CustomDatePicker
                selected={moment(formData.date).toDate()}
                onChange={(e) => handleChange(e, 'date')}
              />
            </div>
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" type="submit" onClick={handleSubmit}>
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