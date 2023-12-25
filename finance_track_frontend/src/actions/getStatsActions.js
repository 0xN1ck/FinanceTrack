import {api, getDataOfUser} from "./authActions";

export const getStatsForUser = () => {
  const dataUser = getDataOfUser();
  return api.get(`/statistics/${dataUser.id}`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};

export const getStatsForAllUsers = () => {
  const dataUser = getDataOfUser();
  return api.get(`/statistics/`)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
      throw error;
    });
};