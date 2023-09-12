import 
{ 
  Button, 
  Modal, 
  ModalHeader, 
  ModalBody, 
  ModalFooter, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Row,
  Col
} from "reactstrap";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typeahead } from "react-bootstrap-typeahead";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import moment from "moment";

import 'moment/locale/ru';
import "react-datepicker/dist/react-datepicker.module.css";
import ru from 'date-fns/locale/ru';
registerLocale('ru', ru)

const CustomDatePicker = ({ selected, onChange }) => {
  const isValidDate = moment(selected).isValid(); // Проверка на допустимость значения даты
  const inputContainerStyle = {
    textAlign: 'center',
  };

  return (
    <DatePicker
      selected={isValidDate ? selected : null}
      onChange={onChange}
      locale="ru"
      isClearable
      dateFormat="d MMMM yyyy г., HH:mm:ss"
      className="form-control"
      wrapperClassName="form-control"
      calendarClassName="react-datepicker__input-container"
      customInput={<input style={inputContainerStyle} />} // Добавленный стиль
      todayButton="Сегодня"
      showTimeInput
      timeInputLabel="Время:"
    />
  );
};


const EditForm = ({ item, onClose, onSubmit, isCreateMode }) => {
  const headerText = isCreateMode ? "Добавить данные" : "Изменение данных";
  const buttonText = isCreateMode ? "Добавить" : "Сохранить";

  const [formData, setFormData] = useState({
    id: item.id || '',
    user: item.user || '',
    tag: item.tag || '',
    cost_of_consumables: item.cost_of_consumables || '',
    amount_of_deposits: item.amount_of_deposits || '',
    commission_for_deposits: item.commission_for_deposits || '',
    assignee: item.assignee || '',
    date: item.date || '',
    user_id: item.user_id || '',
    tag_id: item.tag_id || '',
    assignee_id: item.assignee_id || '',
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
      <ModalHeader toggle={onClose}>{headerText}</ModalHeader>
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
          {buttonText}
        </Button>
        <Button color="secondary" onClick={onClose}>
          Закрыть
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditForm;