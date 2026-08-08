import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Page404 from '@/components/Misc/Page404'
import Products from './Products'
import ProductDetails from './ProductDetails'
import Cart from './Cart'
import ProtectedRoute from '@/components/Misc/ProtectedRoute'
import Checkout from './Checkout'
import VerifyStripePayment from './Checkout/VerifyStripePayment'

const Frontend = () => {
  return (
    <>
    <Header />
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='products' element={<Products />}/>
        <Route path='product/:id' element={<ProductDetails />}/>
        <Route path='cart' element={<ProtectedRoute allowedRoles={['customer','admin']} Component={Cart} />}/>
        <Route path='checkout' element={<ProtectedRoute allowedRoles={['customer','admin']} Component={Checkout} />}/>  
        <Route path='verify-stripe-payment' element={<ProtectedRoute allowedRoles={['customer','admin']} Component={VerifyStripePayment} />}/>  
        <Route path='*' element={<Page404 />}/>
    </Routes>
    <Footer />
    </>
  )
}

export default Frontend