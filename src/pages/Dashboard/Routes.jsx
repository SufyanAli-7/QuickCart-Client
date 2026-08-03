import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Products from './Products'
import ProtectedRoute from '@/components/Misc/ProtectedRoute'
import Page404 from '@/components/Misc/Page404'
import Users from './Users'
import Orders from './Orders'
import Wishlist from './Wishlist'
import MyOrders from './MyOrders'

const Index = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products/*' element={<ProtectedRoute allowedRoles={['admin']} Component={Products} />} />
        <Route path='/orders/*' element={<ProtectedRoute allowedRoles={['admin']} Component={Orders} />} />
        <Route path='/users/*' element={<ProtectedRoute allowedRoles={['admin']} Component={Users} />} />
        <Route path='/wishlist/*' element={<ProtectedRoute allowedRoles={['customer']} Component={Wishlist} />} />
        <Route path='/my-orders/*' element={<ProtectedRoute allowedRoles={['customer']} Component={MyOrders} />} />        
        <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

export default Index