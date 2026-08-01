import axios from 'axios'
import { createContext, useContext, useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

const initialState = { isAuth: false, user: {} }

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOGIN':
            return { ...state, isAuth: true, user: action.payload }
        case 'SET_LOGOUT':
            return initialState
        default:
            return state
    }
}

const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(reducer, initialState)
    const navigate = useNavigate()
    const [isAppLoading, setIsAppLoading] = useState(true)

    const backendUrl = import.meta.env.VITE_BACKEND_URL || ""

    const readProfile = () => {
        axios.defaults.withCredentials = true;
        axios.get(`${backendUrl}/api/user/current`)
            .then((res) => {
                const { success, user } = res.data;
                if (success) {
                    dispatch({ type: 'SET_LOGIN', payload: user })
                }
            })
            .catch((err) => {
                const { status } = err.response || {};
                if (status !== 404) {
                    console.error("Error fetching profile:", err);
                }
            })
            .finally(() => {
                setIsAppLoading(false);
            });
    }

    useEffect(() => {
        readProfile()
    }, [])

    const handleLogout = () => {
        axios.defaults.withCredentials = true;
        axios.post(`${backendUrl}/api/auth/logout`)
            .then((res) => {
                const { success, message } = res.data;
                if (success) {
                    dispatch({ type: 'SET_LOGOUT' });
                    navigate('/auth/login');
                    return window.toastify(message, "success");
                }
            })
            .catch((err) => {
                console.error(err.response?.data?.message || "Failed to logout");
            });

    }

    return (
        <AuthContext.Provider value={{ ...state, isAppLoading, handleLogout, dispatch, backendUrl , readProfile }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider

export const useAuth = () => useContext(AuthContext)