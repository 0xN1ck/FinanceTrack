import axios from 'axios';
import jwt_decode from 'jwt-decode';


const API_BASE_URL = "http://localhost:8000/api"; // Базовый URL вашего API

export let api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const login = (username, password) => {
  return (dispatch) => {
    // Выполняем запрос на сервер для входа пользователя
    // axios.post('http://192.168.1.75:8000/api/dj-rest-auth/login/', { email, password })
    api.post('/login/', {username, password})
      .then((response) => {
        // Если успешно, сохраняем токен в локальном хранилище
        const decodedToken = jwt_decode(response.data.access);
        api = axios.create({
          baseURL: API_BASE_URL,
          headers: {
            Authorization: `Bearer ${response.data.access}`,
          },
        });
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('username', decodedToken.username);
        dispatch({type: 'LOGIN_SUCCESS', payload: response.data.access});
      })
      .catch((error) => {
        dispatch({type: 'LOGIN_FAILURE', error});
      });
  };
};

export const logout = () => {
  return (dispatch) => {
    // Выполняем запрос на сервер для выхода пользователя
    api.post('/dj-rest-auth/logout/')
      .then(() => {
        // Удаляем токен из локального хранилища
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        dispatch({type: 'LOGOUT_SUCCESS'});
      })
      .catch((error) => {
        dispatch({type: 'LOGOUT_ERROR', error});
      });
  };
};

export const isTokenValid = (token) => {
  if (token) {
    try {
      const decodedToken = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp >= currentTime;

    } catch (error) {
      return false;
    }
  }
  return false;
};

export const isAdmin = () => {
  const token = localStorage.getItem("token"); // Получите JWT-токен из localStorage
  if (token) {
    const decodedToken = jwt_decode(token);
    return decodedToken.is_admin; // Верните значение поля is_admin из декодированного токена
  }
  return false; // Если токен отсутствует, предположим, что пользователь не является администратором
};

export const getDataOfUser = () => {
  const token = localStorage.getItem("token"); // Получите JWT-токен из localStorage
  if (token) {
    const decodedToken = jwt_decode(token);
    return {
      username: decodedToken.username,
      email: decodedToken.email,
      id: decodedToken.user_id,
    }; // Верните значение поля is_admin из декодированного токена
  }
  return false; // Если токен отсутствует, предположим, что пользователь не является администратором
};