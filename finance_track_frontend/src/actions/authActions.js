import axios from 'axios';
import jwt_decode from 'jwt-decode';

export const login = (username, password) => {
    return (dispatch) => {
        // Выполняем запрос на сервер для входа пользователя
        // axios.post('http://192.168.1.75:8000/api/dj-rest-auth/login/', { email, password })
        axios.post('http://localhost:8000/api/login/', { username, password })
            .then((response) => {
                // Если успешно, сохраняем токен в локальном хранилище
                const decodedToken = jwt_decode(response.data.access);
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('username', decodedToken.username);
                dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.access });
            })
            .catch((error) => {
                dispatch({ type: 'LOGIN_FAILURE', error });
            });
    };
};

export const logout = () => {
    return (dispatch) => {
        // Выполняем запрос на сервер для выхода пользователя
        axios.post('http://localhost:8000/api/dj-rest-auth/logout/')
            .then(() => {
                // Удаляем токен из локального хранилища
                localStorage.removeItem('token');
                localStorage.removeItem('username');
                dispatch({ type: 'LOGOUT_SUCCESS' });
            })
            .catch((error) => {
                dispatch({ type: 'LOGOUT_ERROR', error });
            });
    };
};

export const isTokenValid = (token) => {
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
  
        if (decodedToken.exp < currentTime) {
          return false;
        }
        return true;
      } catch (error) {
        return false;
      }
    }
    return false;
  };