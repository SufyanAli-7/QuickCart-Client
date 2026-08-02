import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Card, Modal, ConfigProvider, Image, Typography, Spin, Empty } from 'antd';
import { EyeOutlined, ShoppingOutlined } from '@ant-design/icons';
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

const MyOrders = () => {
  const { backendUrl } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/order/my-orders`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        window.toastify(response.data.message || 'Failed to fetch your orders', 'error');
      }
    } catch (error) {
      console.error('Error fetching my orders:', error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch your orders. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleOpenDetailsModal = (order) => {
    setDetailsOrder(order);
    setDetailsModalOpen(true);
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: 'id',
      render: (id) => (
        <div className="font-mono text-xs font-semibold text-gray-800 flex items-center gap-1">
          <Text copyable={{ text: id }} className="font-mono text-xs font-semibold text-gray-800">
            #{id.slice(-6).toUpperCase()}
          </Text>
        </div>
      ),
    },
    {
      title: 'Ordered Products',
      dataIndex: 'items',
      key: 'items',
      render: (items) => (
        <div className="text-sm text-gray-700 max-w-xs">
          {items && items.length > 0 ? (
            <div>
              <span className="font-semibold">{items[0].name}</span>
              {items.length > 1 && (
                <span className="text-gray-500 text-xs ml-1">+{items.length - 1} more items</span>
              )}
            </div>
          ) : (
            'No items'
          )}
        </div>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'totalItems',
      key: 'totalItems',
      sorter: (a, b) => (a.totalItems || 0) - (b.totalItems || 0),
      render: (totalItems, record) => (
        <Tag color="cyan" className="font-medium">
          {totalItems || record.items?.reduce((acc, item) => acc + item.quantity, 0) || 0} Qty
        </Tag>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (amount) => (
        <span className="font-bold text-gray-900">
          PKR {amount ? Number(amount).toLocaleString() : '0'}
        </span>
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusTagColor(status)} className="font-medium">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Order Date',
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
        <Button
          type="text"
          icon={<EyeOutlined className="text-blue-600" />}
          onClick={() => handleOpenDetailsModal(record)}
          className="hover:bg-blue-50"
          title="View Details"
        />
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
        {/* Header with Total Orders Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              My Orders <ShoppingOutlined style={{color:'#ea580c'}} />
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total Placed Orders:{' '}
              <span className="font-bold text-orange-600 text-base">{orders.length}</span>
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-75">
            <Spin size="large" tip="Loading your orders..." />
          </div>
        ) : orders.length === 0 ? (
          <Card className="shadow-xs border border-gray-200 rounded-xl text-center py-12">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 text-base font-normal">You have not placed any orders yet!</span>
              }
            >
              <Link to="/products">
                <Button
                  type="primary"
                  size="large"
                  className="bg-orange-600 hover:bg-orange-700! border-none font-medium mt-2 rounded-xl"
                >
                  Start Shopping
                </Button>
              </Link>
            </Empty>
          </Card>
        ) : (
          /* Orders Table Card */
          <Card className="shadow-xs border border-gray-200 rounded-xl overflow-hidden p-0">
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="_id"
              loading={loading}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) => `Total ${total} orders`,
              }}
              scroll={{ x: 700 }}
            />
          </Card>
        )}

        {/* View Order Details Modal */}
        <Modal
          title={
            <div className="flex items-center gap-2">
              <span>Order Details</span>
              {detailsOrder?._id && (
                <Text copyable={{ text: detailsOrder._id }} className="font-mono text-xs text-gray-600">
                  #{detailsOrder._id}
                </Text>
              )}
            </div>
          }
          open={detailsModalOpen}
          onCancel={() => setDetailsModalOpen(false)}
          width={700}
          footer={[
            <Button key="close" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>,
          ]}
        >
          {detailsOrder && (
            <div className="py-3 space-y-6">
              {/* Status & Date bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                <div>
                  <span className="text-xs text-gray-500 block">Order Status:</span>
                  <Tag color={getStatusTagColor(detailsOrder.status)} className="font-semibold text-sm mt-0.5">
                    {detailsOrder.status}
                  </Tag>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Payment Status:</span>
                  <Tag color={detailsOrder.paymentStatus === 'Paid' ? 'green' : 'orange'} className="font-semibold text-sm mt-0.5">
                    {detailsOrder.paymentStatus || 'Pending'}
                  </Tag>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block">Order Date:</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {detailsOrder.createdAt
                      ? new Date(detailsOrder.createdAt).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Shipping Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                  Shipping Address & Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium block">Name:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.fullName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Email:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Phone:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.phone || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">City & Postal Code:</span>
                    <span className="text-gray-900 font-semibold">
                      {detailsOrder.shippingDetails?.city || ''} {detailsOrder.shippingDetails?.postalCode ? `(${detailsOrder.shippingDetails?.postalCode})` : ''}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-gray-500 font-medium block">Delivery Address:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.address || 'N/A'}</span>
                  </div>
                  {detailsOrder.shippingDetails?.orderNote && (
                    <div className="sm:col-span-2 bg-amber-50 p-2.5 rounded-md border border-amber-200">
                      <span className="text-amber-800 font-medium text-xs block">Order Note:</span>
                      <span className="text-amber-900 text-sm">{detailsOrder.shippingDetails.orderNote}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ordered Products Table */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                  Ordered Items ({detailsOrder.items?.length || 0})
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {detailsOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Image
                          width={46}
                          height={46}
                          src={item.imageURL || 'https://via.placeholder.com/46'}
                          alt={item.name}
                          style={{ objectFit: 'cover', borderRadius: '6px' }}
                        />
                        <div>
                          <div className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</div>
                          <div className="text-xs text-gray-500">PKR {Number(item.price).toLocaleString()} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-sm">
                          PKR {(Number(item.price) * item.quantity).toLocaleString()}
                        </div>
                        <Tag color="cyan" className="text-xs">
                          {item.quantity} Qty
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="flex items-center justify-between bg-orange-50 border border-orange-200 p-3.5 rounded-lg mt-4">
                  <span className="font-bold text-gray-900">Total Amount:</span>
                  <span className="text-xl font-extrabold text-orange-600">
                    PKR {Number(detailsOrder.totalAmount || 0).toLocaleString()}
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

export default MyOrders;