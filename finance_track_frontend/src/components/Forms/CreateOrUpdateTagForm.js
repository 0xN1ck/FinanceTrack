import React, { useState, useEffect } from "react";
import { Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  getTagsList,
  editTag,
  deleteTag,
  createTag
} from "../../actions/tagsActions";

const CreateOrUpdateTagForm = ({ onClose }) => {
  const [newTagName, setNewTagName] = useState("");
  const [tagsList, setTagsList] = useState([]);

useEffect(() => {
    getTagsList()
      .then(response => {
        setTagsList(response);
      })
      .catch(error => {
        console.error("Ошибка загрузки списка тегов:", error);
      });
  }, []);

  const handleEdit = (tagId, newName) => {
    editTag(tagId, newName)
      .then(updatedTag => {
        setTagsList(prevTags => prevTags.map(t => (t.id === tagId ? { ...t, name: updatedTag.name } : t)));
      })
      .catch(error => {
        // Handle error
      });
  };

  const handleDelete = (tagId) => {
    deleteTag(tagId)
      .then(deletedTagId => {
        setTagsList(prevTags => prevTags.filter(t => t.id !== deletedTagId));
      })
      .catch(error => {
        // Handle error
      });
  };

  const handleCreate = () => {
    createTag(newTagName)
      .then(createdTag => {
        setTagsList(prevTags => [...prevTags, createdTag]);
        setNewTagName("");
      })
      .catch(error => {
        // Handle error
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
