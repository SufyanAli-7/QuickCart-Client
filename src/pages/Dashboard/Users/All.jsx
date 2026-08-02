import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Card, Modal, Select, ConfigProvider, Avatar } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const All = () => {
  const { backendUrl, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Edit Role Modal State
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('customer');
  const [updatingRole, setUpdatingRole] = useState(false);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsUser, setDetailsUser] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUsers(response.data.users || []);
      } else {
        window.toastify(response.data.message || 'Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch users. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role || 'customer');
    setRoleModalOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setUpdatingRole(true);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/user/update-role/${selectedUser._id}`,
        { newRole },
        { withCredentials: true }
      );

      if (response.data.success) {
        window.toastify('User role updated successfully!', 'success');
        setRoleModalOpen(false);
        fetchUsers();
      } else {
        window.toastify(response.data.message || 'Failed to update user role', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to update user role',
        'error'
      );
    } finally {
      setUpdatingRole(false);
    }
  };

  const handleOpenDetailsModal = async (userId) => {
    setFetchingDetails(true);
    setDetailsModalOpen(true);
    try {
      const response = await axios.get(`${backendUrl}/api/user/details/${userId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDetailsUser(response.data.user);
      } else {
        window.toastify(response.data.message || 'Failed to fetch user details', 'error');
        setDetailsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch user details',
        'error'
      );
      setDetailsModalOpen(false);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/user/delete/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        window.toastify(response.data.message || 'User deleted successfully', 'success');
        fetchUsers();
      } else {
        window.toastify(response.data.message || 'Failed to delete user', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to delete user',
        'error'
      );
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            className="bg-orange-600 font-bold"
            style={{ backgroundColor: '#ea580c' }}
          >
            {text ? text.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">{text || 'User'}</div>
            <div className="text-xs text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'orange' : 'blue'} className="capitalize font-medium">
          {role || 'customer'}
        </Tag>
      ),
    },
    {
      title: 'Registration Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      responsive: ['lg'],
      render: (date) => (
        <span className="text-gray-600 text-sm">
          {date ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* View Details */}
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-600" />}
            onClick={() => handleOpenDetailsModal(record._id)}
            className="hover:bg-blue-50"
            title="View Details"
          />

          {/* Edit Role */}
          <Button
            type="text"
            icon={<EditOutlined className="text-amber-600" />}
            onClick={() => handleOpenRoleModal(record)}
            className="hover:bg-amber-50"
            title="Change Role"
          />

          {/* Delete User */}
          {currentUser?._id !== record._id && (
            <Popconfirm
              title="Delete User"
              description="Are you sure you want to delete this user?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="hover:bg-red-50"
                title="Delete User"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          borderRadius: 8,
        },
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header with Total Users Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Registered Users</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total Registered Users:{' '}
              <span className="font-bold text-orange-600 text-base">{users.length}</span>
            </p>
          </div>
        </div>

        {/* Users Table Card */}
        <Card className="shadow-xs border border-gray-200 rounded-xl overflow-hidden p-0">
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 600 }}
          />
        </Card>

        {/* Change Role Modal */}
        <Modal
          title="Change User Role"
          open={roleModalOpen}
          onOk={handleUpdateRole}
          confirmLoading={updatingRole}
          onCancel={() => setRoleModalOpen(false)}
          okText="Update Role"
          okButtonProps={{ className: 'bg-orange-600 hover:bg-orange-700!' }}
        >
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-3">
              Select new role for <span className="font-semibold text-gray-900">{selectedUser?.fullName}</span>:
            </p>
            <Select
              value={newRole}
              onChange={(val) => setNewRole(val)}
              className="w-full"
              size="large"
              options={[
                { value: 'customer', label: 'Customer' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </div>
        </Modal>

        {/* User Details Modal */}
        <Modal
          title="User Details"
          open={detailsModalOpen}
          onCancel={() => setDetailsModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>,
          ]}
          loading={fetchingDetails}
        >
          {detailsUser && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                <Avatar
                  size={54}
                  className="bg-orange-600 font-bold text-xl"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  {detailsUser.fullName ? detailsUser.fullName.charAt(0).toUpperCase() : 'U'}
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{detailsUser.fullName}</h3>
                  <Tag color={detailsUser.role === 'admin' ? 'orange' : 'blue'} className="capitalize">
                    {detailsUser.role || 'customer'}
                  </Tag>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="text-gray-500 font-medium block">Full Name:</span>
                  <span className="text-gray-900 font-semibold">{detailsUser.fullName}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Email Address:</span>
                  <span className="text-gray-900 font-semibold">{detailsUser.email}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Role:</span>
                  <span className="text-gray-900 font-semibold capitalize">{detailsUser.role || 'customer'}</span>
                </div>
                <div>
                  <span className="text-gray-500 font-medium block">Registration Date:</span>
                  <span className="text-gray-900 font-semibold">
                    {detailsUser.createdAt
                      ? new Date(detailsUser.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default All;