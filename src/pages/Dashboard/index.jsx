import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Page404 from '@/components/Misc/Page404'

const Dashboard = () => {
  return (
    <>
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='*' element={<Page404 />}/>
    </Routes>
    </>
  )
}

export default Dashboard