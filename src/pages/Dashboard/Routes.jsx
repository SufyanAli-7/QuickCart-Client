import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Products from './Products'
import ProtectedRoute from '@/components/Misc/ProtectedRoute'
import Page404 from '@/components/Misc/Page404'

const Index = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/products/*' element={<ProtectedRoute allowedRoles={['admin']} Component={Products} />} />
        <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

export default Index