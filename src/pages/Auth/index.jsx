import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import ForgotPassword from './ForgotPassword'
import Page404 from '@/components/Misc/Page404'

const Auth = () => {
  return (
    <>
    <Routes>
        <Route path='login' element={<Login />}/>
        <Route path='register' element={<Register />}/>
        <Route path='forgot-password' element={<ForgotPassword />}/>
        <Route path='*' element={<Page404 />}/>
    </Routes>
    </>
  )
}

export default Auth 