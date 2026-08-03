import { SkinOutlined, UserOutlined, UnorderedListOutlined, PlusCircleOutlined, ShoppingOutlined, HeartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const items = [
    { key : '1', label: <Link to='/dashboard'>Dashboard</Link>, icon: <UserOutlined /> },
    { 
        key : '2', 
        label: 'Products', 
        icon: <SkinOutlined />, 
        allowedRoles: ['admin'],
        children: [
            { key: '2_1', label: <Link to='/dashboard/products'>All Products</Link>, icon: <UnorderedListOutlined /> },
            { key: '2_2', label: <Link to='/dashboard/products/add'>Add Product</Link>, icon: <PlusCircleOutlined /> }
        ]
    },
    {
        key: '3',
        label: 'Orders',
        icon: <ShoppingOutlined />,
        allowedRoles: ['admin'],
        children: [
            { key: '3_1', label: <Link to='/dashboard/orders'>All Orders</Link>, icon: <UnorderedListOutlined /> }
        ]
    },
    {
        key: '4',
        label: 'Users',
        icon: <UserOutlined />,
        allowedRoles: ['admin'],
        children: [
            { key: '4_1', label: <Link to='/dashboard/users'>All Users</Link>, icon: <UnorderedListOutlined /> }
        ]
    },
    {
        key: '5',
        label: <Link to='/dashboard/wishlist'>Wishlist</Link>,
        icon: <HeartOutlined />,
        allowedRoles: ['customer'],
    },
    {
        key: '6',
        label: <Link to='/dashboard/my-orders'>My Orders</Link>,
        icon: <ShoppingOutlined />,
        allowedRoles: ['customer'],
    }
]