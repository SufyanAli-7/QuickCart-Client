import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const Frontend = () => {
  return (
    <>
    <Header />
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='*' element={<div>NotFound</div>}/>
    </Routes>
    <Footer />
    </>
  )
}

export default Frontend