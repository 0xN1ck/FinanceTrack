// tagsActions.js
import { api } from "./authActions";
import { toast } from 'react-toastify';

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

export const getTagsList = () => {
  return api.get("http://localhost:8000/api/tags/")
    .then(response => response.data)
    .catch(error => {
      console.error("Ошибка загрузки списка тегов:", error);
      throw error;
    });
};

export const editTag = (tagId, newName) => {
  return api.put(`http://localhost:8000/api/tag/${tagId}/`, { name: newName })
    .then(response => {
      console.log("Тег успешно изменен:", response.data);
      notifySuccess("Тег успешно изменен");
      return response.data;
    })
    .catch(error => {
      console.error("Ошибка при изменении тега:", error);
      notifyError("Ошибка при изменении тега");
      throw error;
    });
};

export const deleteTag = (tagId) => {
  return api.delete(`http://localhost:8000/api/tag/${tagId}/`)
    .then(response => {
      console.log("Тег успешно удален:", response.data);
      notifySuccess("Тег успешно удален");
      return tagId;
    })
    .catch(error => {
      console.error("Ошибка при удалении тега:", error);
      notifyError("Ошибка при удалении тега");
      throw error;
    });
};

export const createTag = (newTagName) => {
  return api.post("http://localhost:8000/api/tags/", { name: newTagName })
    .then(response => {
      console.log("Новый тег успешно создан:", response.data);
      notifySuccess("Новый тег успешно создан");
      return response.data;
    })
    .catch(error => {
      console.error("Ошибка при создании тега:", error);
      notifyError("Ошибка при создании тега");
      throw error;
    });
};
