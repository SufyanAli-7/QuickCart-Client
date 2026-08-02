import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Image, Card, ConfigProvider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const All = () => {
  const { backendUrl, user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/all`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        window.toastify(response.data.message || 'Failed to fetch products', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch products. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/product/delete/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        window.toastify(response.data.message || 'Product deleted successfully', 'success');
        fetchProducts();
      } else {
        window.toastify(response.data.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to delete product',
        'error'
      );
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageURL',
      key: 'imageURL',
      width: 90,
      render: (url, record) => (
        <Image
          width={50}
          height={50}
          src={url || 'https://via.placeholder.com/50'}
          alt={record.name}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="font-semibold text-gray-900">{text}</span>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      responsive: ['md'],
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => <span className="font-semibold text-gray-900">PKR {price}</span>,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
      render: (stock) => (
        stock > 0 ? (
          <Tag color="green">{stock} In Stock</Tag>
        ) : (
          <Tag color="red">Out of Stock</Tag>
        )
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status ? status.toUpperCase() : 'ACTIVE'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/dashboard/products/edit/${record._id}`}>
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-600" />}
              className="hover:bg-blue-50"
            />
          </Link>

          {user?.role === 'admin' && (
            <Popconfirm
              title="Delete Product"
              description="Are you sure you want to delete this product?"
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
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and view all product listings</p>
          </div>
          {user?.role === 'admin' && (
            <Link to="/dashboard/products/add">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                className="font-semibold bg-orange-600 hover:bg-orange-700! border-none shadow-md"
              >
                Add Product
              </Button>
            </Link>
          )}
        </div>

        {/* Simplified Table Card */}
        <Card className="shadow-xs border border-gray-200 rounded-xl overflow-hidden p-0">
          <Table
            columns={columns}
            dataSource={products}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 8,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} products`,
            }}
            scroll={{ x: 600 }}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default All;