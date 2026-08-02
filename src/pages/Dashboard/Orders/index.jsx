import { Routes, Route } from 'react-router-dom'
import All from './All'
import Page404 from '@/components/Misc/Page404'

const Orders = () => {
    return (
        <Routes>
            <Route path='/' element={<All />} />
            <Route path='*' element={<Page404 />} />
        </Routes>
    )
}

export default Orders