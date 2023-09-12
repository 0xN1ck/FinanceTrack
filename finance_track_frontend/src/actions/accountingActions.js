import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api"; // Базовый URL вашего API

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getWorkers = () => {
  return api.get("/worker/")
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const getDeductionsByWorkerId = (workerId) => {
  return api.get(`/deduction/worker/${workerId}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const deleteDeduction = (deductionId) => {
  return api.delete(`/deduction/${deductionId}/`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const updateDeduction = (deductionId, formData) => {
  return api.put(`/deduction/${deductionId}/`, formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const createDeduction = (formData) => {
  return api.post("/deductions/", formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};