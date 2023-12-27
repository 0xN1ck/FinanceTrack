import React, { useState, useEffect } from "react";
import { api } from "../../actions/authActions";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateOrUpdateTagForm = ({ onClose }) => {
  const [newTagName, setNewTagName] = useState("");
  const [tagsList, setTagsList] = useState([]);
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    api.get("http://localhost:8000/api/tags/")
      .then(response => {
        setTagsList(response.data);
      })
      .catch(error => {
        console.error("Ошибка загрузки списка тегов:", error);
      });
  }, []);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleEdit = (tagId, newName) => {
    api.put(`http://localhost:8000/api/tag/${tagId}/`, { name: newName })
      .then(response => {
        console.log("Тег успешно изменен:", response.data);
        setTagsList(prevTags => prevTags.map(t => (t.id === tagId ? { ...t, name: newName } : t)));
        notifySuccess("Тег успешно изменен");
      })
      .catch(error => {
        console.error("Ошибка при изменении тега:", error);
        notifyError("Ошибка при изменении тега");
      });
  };

  const handleDelete = (tagId) => {
    api.delete(`http://localhost:8000/api/tag/${tagId}/`)
      .then(response => {
        console.log("Тег успешно удален:", response.data);
        setTagsList(prevTags => prevTags.filter(t => t.id !== tagId));
        notifySuccess("Тег успешно удален");
      })
      .catch(error => {
        console.error("Ошибка при удалении тега:", error);
        notifyError("Ошибка при удалении тега");
      });
  };

  const handleCreate = () => {
    api.post("http://localhost:8000/api/tags/", { name: newTagName })
      .then(response => {
        console.log("Новый тег успешно создан:", response.data);
        setTagsList(prevTags => [...prevTags, response.data]);
        setNewTagName("");
        notifySuccess("Новый тег успешно создан");
      })
      .catch(error => {
        console.error("Ошибка при создании тега:", error);
        notifyError("Ошибка при создании тега");
      });
  };

  const handleChangeTagInput = (tagId, newValue) => {
    setTagsList(prevTags => prevTags.map(t => (t.id === tagId ? { ...t, name: newValue } : t)));
  };

  return (
    <div>
      <Modal isOpen={true} centered>
        <ModalHeader toggle={onClose}>Управление тегами</ModalHeader>
        <ModalBody>
          <div>
            {tagsList.map((tagItem) => (
              <div key={tagItem.id} style={{ display: 'flex', marginBottom: '10px', alignItems: 'center' }}>
                <Input
                  type="text"
                  value={tagItem.name}
                  onChange={(e) => handleChangeTagInput(tagItem.id, e.target.value)}
                />
                <Button color="info" size="sm" style={{ marginLeft: '10px', height: '38px' }} onClick={() => handleEdit(tagItem.id, tagItem.name)}>
                  Редактировать
                </Button>
                <Button color="danger" size="sm" style={{ marginLeft: '10px', height: '38px' }} onClick={() => handleDelete(tagItem.id)}>
                  Удалить
                </Button>
              </div>
            ))}
          </div>
          <FormGroup style={{ display: 'flex', alignItems: 'center' }}>
            <Input
              type="text"
              id="newTagName"
              placeholder="Введите новое имя тега"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              style={{ marginRight: '10px', flex: 1 }}
            />
            <Button color="primary" size="sm" style={{ height: '38px', flex: '0 0 auto' }} onClick={handleCreate}>
              Создать
            </Button>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </ModalFooter>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateOrUpdateTagForm;
