import { useState } from 'react';
import { Button, Layout, Menu, ConfigProvider } from 'antd';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { HomeOutlined, UserOutlined, UnorderedListOutlined, PlusCircleOutlined } from '@ant-design/icons';
import logo from '@/assets/logo.svg';
import Routes from './Routes';
import { items } from './SidebarItems';

const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const getLinkColor = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' ? 'text-orange-600' : 'text-[#505050]';
    }
    return location.pathname.startsWith(path) ? 'text-orange-600' : 'text-[#505050]';
  };
  
  const menuItems = items
    .filter(item => !item.allowedRoles || item.allowedRoles.includes(user?.role))
    .map(({ key, label, icon, children }) => {
      const item = { key, label, icon };
      if (children) item.children = children;
      return item;
    });

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          colorBgLayout: '#F7FAFC',
          colorBgContainer: '#ffffff',
          fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#F7FAFC' }}>
        <Sider
          breakpoint='lg'
          collapsible
          collapsed={collapsed}
          onCollapse={value => setCollapsed(value)}
          theme="light"
          className="hidden md:block [&_.ant-layout-sider-trigger]:border-r [&_.ant-layout-sider-trigger]:border-t [&_.ant-layout-sider-trigger]:border-[#DEE2E7]"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            overflow: 'auto',
            alignSelf: 'flex-start',
            borderRight: '1px solid #DEE2E7',
            background: '#ffffff'
          }}
        >
          {/* App Logo */}
          <div 
            className='px-4 flex items-center justify-center cursor-pointer select-none border-b border-[#DEE2E7]' 
            style={{ height: '72px' }}
            onClick={() => navigate('/')}
          >
            <img src={logo} alt="Logo" className={collapsed ? "h-7" : "h-8"} />
          </div>

          <Menu 
            theme='light' 
            defaultSelectedKeys={['1']} 
            mode="inline" 
            items={menuItems} 
            style={{ borderRight: 0, paddingTop: '12px' }} 
          />
        </Sider>

        <Layout style={{ background: '#F7FAFC' }}>
          <Header 
            className='flex items-center justify-between px-6' 
            style={{ 
              background: '#ffffff', 
              borderBottom: '1px solid #DEE2E7', 
              height: '72px',
              padding: '0 24px',
              position: 'sticky',
              top: 0,
              zIndex: 1000
            }}
          >
            {/* Left side: Page title and user role */}
            <div className="flex items-center gap-3 select-none">
              <span className="text-[16px] font-bold text-[#1C1C1C]">
                Dashboard
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-semibold capitalize tracking-wide">
                {user?.role || 'User'}
              </span>
            </div>

            {/* Right side: User info & logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col text-left leading-none select-none">
                <span className="text-[14px] font-bold text-[#1C1C1C]">
                  {user?.fullName || 'User'}
                </span>
                <span className="text-xs text-[#8B96A5] mt-1.5 font-medium">
                  {user?.email || ''}
                </span>
              </div>
              <Button 
                type="primary" 
                onClick={handleLogout} 
                className="font-bold text-sm h-9 px-4 cursor-pointer bg-orange-600 hover:bg-orange-700! border-none shadow-none flex items-center justify-center"
              >
                Logout
              </Button>
            </div>
          </Header>

          <Content className='p-6 pb-24 md:pb-6' style={{ minHeight: 'auto' }}>    
             <Routes />      
          </Content>
        </Layout>
      </Layout>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[#DEE2E7] flex items-center justify-around z-1000 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <Link 
          to="/" 
          className="flex flex-col items-center gap-1 text-[#505050] hover:text-orange-600 transition-colors"
        >
          <HomeOutlined className="text-[20px]" />
          <span className="text-[11px] font-bold">Home</span>
        </Link>
        <Link 
          to="/dashboard" 
          className={`flex flex-col items-center gap-1 ${getLinkColor('/dashboard')} hover:text-orange-600 transition-colors`}
        >
          <UserOutlined className="text-[20px]" />
          <span className="text-[11px] font-bold">Dashboard</span>
        </Link>
        {user?.role === 'admin' && (
          <>
            <Link 
              to="/dashboard/products" 
              className={`flex flex-col items-center gap-1 ${getLinkColor('/dashboard/products')} hover:text-orange-600 transition-colors`}
            >
              <UnorderedListOutlined className="text-[20px]" />
              <span className="text-[11px] font-bold">Products</span>
            </Link>
            <Link 
              to="/dashboard/products/add" 
              className={`flex flex-col items-center gap-1 ${getLinkColor('/dashboard/products/add')} hover:text-orange-600 transition-colors`}
            >
              <PlusCircleOutlined className="text-[20px]" />
              <span className="text-[11px] font-bold">Add</span>
            </Link>
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;