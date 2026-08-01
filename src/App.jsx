import React from 'react'
import Routes from './pages/Routes.jsx'
import { useAuth } from '@/context/AuthContext'
import ScreenLoader from '@/components/Misc/ScreenLoader'
import { ConfigProvider } from 'antd'

const App = () => {
  const { isAppLoading } = useAuth()
  return (
    <>
      <ConfigProvider theme={{ components: { Button: { controlOutline: 'none' } } }}>
        {!isAppLoading ? <Routes /> : <ScreenLoader />}
      </ConfigProvider>
    </>
  )
}

export default App