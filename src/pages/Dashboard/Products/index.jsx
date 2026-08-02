import { Routes, Route } from 'react-router-dom'
import All from './All'
import Add from './Add'
import Edit from './Edit'
import Page404 from '@/components/Misc/Page404'

const Products = () => {
  return (
    <Routes>
      <Route path="/" element={<All />} />
      <Route path="/add" element={<Add />} />
      <Route path="/edit/:id" element={<Edit />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  )
}

export default Products