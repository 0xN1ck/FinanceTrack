import React from 'react'
import { Navigate, Outlet} from 'react-router-dom'

const PrivateRoutes = ({ ...rest }) => {
    // const [jwt, setJwt] = useLocalState('jwt', '')
    // const auth = false
    // return auth ? <Outlet /> : <Navigate to="/auth/login" />
    
    const token = localStorage.getItem('token');
    return token ? <Outlet /> : <Navigate to="/auth/login"/>

}

export default PrivateRoutes;