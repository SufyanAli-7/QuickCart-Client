import React, { useEffect, useState } from 'react';
import { Card, Spin, Tag, ConfigProvider, Typography, Avatar } from 'antd';
import {
  UserOutlined,
  UsergroupAddOutlined,
  SafetyCertificateOutlined,
  SkinOutlined,
  ShoppingOutlined,
  DollarOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const { Text } = Typography;

const getStatusTagColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'gold';
    case 'Processing':
      return 'blue';
    case 'Shipped':
      return 'purple';
    case 'Delivered':
      return 'green';
    case 'Cancelled':
      return 'red';
    default:
      return 'default';
  }
};

const Hero = () => {
  const { user, backendUrl } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);
  const [customerStats, setCustomerStats] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      if (isAdmin) {
        const res = await axios.get(`${backendUrl}/api/admin/dashboard-stats`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setAdminStats(res.data.stats);
        }
      } else {
        const res = await axios.get(`${backendUrl}/api/user/dashboard-stats`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setCustomerStats(res.data.stats);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchStats();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" tip="Loading dashboard metrics..." />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          borderRadius: 12,
        },
      }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="bg-linear-to-r from-orange-600 to-amber-600 rounded-2xl p-6 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {user?.fullName || 'User'}! 👋
            </h1>
            <p className="text-orange-100 text-sm mt-1">
              {isAdmin
                ? 'Here is an overview of your store performance, orders, and users.'
                : 'Here is an overview of your activity, orders, and saved items.'}
            </p>
          </div>
        </div>

        {/* ADMIN DASHBOARD VIEW */}
        {isAdmin && adminStats && (
          <>
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Total Users */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Users</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {adminStats.totalUsers || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                    <UserOutlined />
                  </div>
                </div>
              </Card>

              {/* Total Customers */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Customers</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {adminStats.totalCustomers || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-lg">
                    <UsergroupAddOutlined />
                  </div>
                </div>
              </Card>

              {/* Total Admins */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Admins</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {adminStats.totalAdmins || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
                    <SafetyCertificateOutlined />
                  </div>
                </div>
              </Card>

              {/* Total Products */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Products</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {adminStats.totalProducts || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                    <SkinOutlined />
                  </div>
                </div>
              </Card>

              {/* Total Orders */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">
                      {adminStats.totalOrders || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg">
                    <ShoppingOutlined />
                  </div>
                </div>
              </Card>

              {/* Total Revenue */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Revenue</p>
                    <p className="text-lg font-extrabold text-gray-900 mt-1">
                      PKR {Number(adminStats.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-lg">
                    <DollarOutlined />
                  </div>
                </div>
              </Card>
            </div>

            {/* Recent Orders & Recent Users Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Card */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Recent Orders</span>
                    <Link
                      to="/dashboard/orders"
                      style={{ color: '#ea580c' }}
                      className="text-xs font-semibold hover:opacity-80 flex items-center gap-1"
                    >
                      View All <RightOutlined className="text-[10px]" />
                    </Link>
                  </div>
                }
                className="shadow-2xs border border-gray-200 rounded-xl"
              >
                <div className="space-y-3">
                  {adminStats.recentOrders?.length > 0 ? (
                    adminStats.recentOrders.map((ord) => (
                      <div
                        key={ord._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <Text copyable={{ text: ord._id }} className="font-mono text-xs font-semibold text-gray-800">
                              #{ord._id?.slice(-6).toUpperCase()}
                            </Text>
                            <Tag color={getStatusTagColor(ord.status)} className="m-0 text-xs">
                              {ord.status}
                            </Tag>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {ord.userId?.fullName || ord.shippingDetails?.fullName || 'Customer'} •{' '}
                            {ord.createdAt
                              ? new Date(ord.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : ''}
                          </p>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          PKR {Number(ord.totalAmount || 0).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">No recent orders</p>
                  )}
                </div>
              </Card>

              {/* Recent Registered Users Card */}
              <Card
                title={
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">Recent Registered Users</span>
                    <Link
                      to="/dashboard/users"
                      style={{ color: '#ea580c' }}
                      className="text-xs font-semibold hover:opacity-80 flex items-center gap-1"
                    >
                      View All <RightOutlined className="text-[10px]" />
                    </Link>
                  </div>
                }
                className="shadow-2xs border border-gray-200 rounded-xl"
              >
                <div className="space-y-3">
                  {adminStats.recentUsers?.length > 0 ? (
                    adminStats.recentUsers.map((usr) => (
                      <div
                        key={usr._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar style={{ backgroundColor: '#ea580c', color: '#ffffff' }} className="font-semibold">
                            {usr.fullName?.charAt(0).toUpperCase() || usr.fullName?.charAt(0).toUpperCase() || 'U'}
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{usr.fullName}</p>
                            <p className="text-xs text-gray-500">{usr.email}</p>
                          </div>
                        </div>
                        <Tag
                          color={usr.role === 'admin' ? 'purple' : 'blue'}
                          className="m-0 text-xs capitalize"
                        >
                          {usr.role}
                        </Tag>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 text-center py-4">No recent users</p>
                  )}
                </div>
              </Card>
            </div>
          </>
        )}

        {/* CUSTOMER DASHBOARD VIEW */}
        {!isAdmin && customerStats && (
          <>
            {/* Customer Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
              {/* Total Orders */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerStats.totalOrders || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center text-xl">
                    <ShoppingOutlined />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to="/dashboard/my-orders"
                    style={{ color: '#ea580c' }}
                    className="text-xs font-semibold hover:opacity-80 flex items-center gap-1"
                  >
                    View My Orders <RightOutlined className="text-[10px]" />
                  </Link>
                </div>
              </Card>

              {/* Total Spent */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total Spent</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      PKR {Number(customerStats.totalSpent || 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
                    <CreditCardOutlined />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Total amount on active orders</span>
                </div>
              </Card>

              {/* Wishlist Items */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Wishlist Items</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerStats.wishlistItems || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center text-xl">
                    <HeartOutlined />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to="/dashboard/wishlist"
                    style={{ color: '#ea580c' }}
                    className="text-xs font-semibold hover:opacity-80 flex items-center gap-1"
                  >
                    View Wishlist <RightOutlined className="text-[10px]" />
                  </Link>
                </div>
              </Card>

              {/* Cart Items */}
              <Card className="shadow-2xs hover:shadow-xs border border-gray-200 transition-all rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Cart Items</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {customerStats.cartItems || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <ShoppingCartOutlined />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <Link
                    to="/products"
                    style={{ color: '#ea580c' }}
                    className="text-xs font-semibold hover:opacity-80 flex items-center gap-1"
                  >
                    Explore Products <RightOutlined className="text-[10px]" />
                  </Link>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Hero;