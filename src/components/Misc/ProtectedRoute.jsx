import { useAuth } from "@/context/AuthContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ Component , allowedRoles }) => {
    const { isAuth , user } = useAuth()
  if (!isAuth) return <Navigate to='/auth/login' replace />  
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to='/dashboard' replace />
  return <Component />
}

export default ProtectedRoute 