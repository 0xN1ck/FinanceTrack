import axios from "axios";
import { api } from "./authActions";

// export const getWorkers = () => {
//   return api.get("/worker/")
//     .then(response => response.data)
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// };
//
// export const getExtractsByWorkerId = (workerId) => {
//   return api.get(`/deduction/worker/${workerId}`)
//     .then(response => response.data)
//     .catch(error => {
//       console.log(error);
//       throw error;
//     });
// };

export const getExtracts = () => {
  return api.get("/extracts/")
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const deleteExtracts = (extractId) => {
  return api.delete(`/extract/${extractId}/`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const updateExtracts = (extractId, formData) => {
  return api.put(`/extract/${extractId}/`, formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const createExtracts = (formData) => {
  return api.post("/extracts/", formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};