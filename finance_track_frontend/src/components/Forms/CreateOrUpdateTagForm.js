// CreateOrUpdateTagForm.js

import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const CreateOrUpdateTagForm = ({ tag, onClose, onSubmit }) => {
  const [tagName, setTagName] = useState("");

  useEffect(() => {
    if (tag) {
      setTagName(tag.name);
    }
  }, [tag]);

  const handleSubmit = () => {
    const formData = {
      name: tagName,
      // Другие поля тега, если необходимо
    };

    onSubmit(formData);
  };

  return (
    <Modal isOpen={true} centered>
      <ModalHeader toggle={onClose}>Изменение тега</ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label for="tagName">Название тега</Label>
            <Input
              type="text"
              id="tagName"
              placeholder="Введите новое имя тега"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
          </FormGroup>
          {/* Другие поля тега, если необходимо */}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>
          Сохранить
        </Button>{" "}
        <Button color="secondary" onClick={onClose}>
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CreateOrUpdateTagForm;
