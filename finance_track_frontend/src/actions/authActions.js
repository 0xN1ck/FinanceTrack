import axios from 'axios';

export const login = (email, password) => {
    return (dispatch) => {
        // Выполняем запрос на сервер для входа пользователя
        axios.post('http://192.168.1.75:8000/api/dj-rest-auth/login/', { email, password })
            .then((response) => {
                // Если успешно, сохраняем токен в локальном хранилище
                localStorage.setItem('token', response.data.access);
                localStorage.setItem('username', response.data.user.username);
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
        axios.post('http://192.168.1.75:8000/api/dj-rest-auth/logout/')
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