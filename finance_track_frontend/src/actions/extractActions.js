import {api} from "./authActions";
import moment from "moment/moment";

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
  formData = {
    ...formData,
    date_start: formatDateString(formData.date_start),
    date_end: formatDateString(formData.date_end),
  };

  return api.put(`/extract/${extractId}/`, formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const createExtracts = (formData) => {
    formData = {
    ...formData,
    date_start: formatDateString(formData.date_start),
    date_end: formatDateString(formData.date_end),
  };
  return api.post("/extract-create/", formData)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

function formatDateString(dateString) {
  const date = new Date(dateString);
  const timezoneOffset = date.getTimezoneOffset() / 60;
  date.setHours(date.getHours() - timezoneOffset);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}