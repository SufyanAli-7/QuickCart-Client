import React from 'react'
import Routes from './pages/Routes.jsx'
import { useAuth } from '@/context/AuthContext'
import ScreenLoader from '@/components/Misc/ScreenLoader'

const App = () => {
  const { isAppLoading } = useAuth()
  return (
    <>
      {!isAppLoading ? <Routes /> : <ScreenLoader />}
    </>
  )
}

export default App