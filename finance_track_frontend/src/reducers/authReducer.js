const initialState = {
    token: null,
    loading: false,
    error: null
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                token: action.payload,
                loading: false,
                error: null
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case 'LOGOUT_REQUEST':
            return {
                ...state,
                loading: true,
                error: null
            };
        case 'LOGOUT_SUCCESS':
            return {
                ...state,
                token: null,
                loading: false,
                error: null
            };
        default:
            return state;
    }
};

export default authReducer;