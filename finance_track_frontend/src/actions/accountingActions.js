import { api } from "./authActions";

export const getWorkers = () => {
  return api.get("/worker/")
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const getDeductionsByWorkerId = (workerId, page, pageSize) => {
  return api.get(`/deduction/worker/${workerId}?page=${page}&page_size=${pageSize}`)
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
  console.log(formData)
  return api.post("/deductions/", formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};