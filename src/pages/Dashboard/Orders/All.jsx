import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, Card, Modal, Select, ConfigProvider, Image } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

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

const All = () => {
  const { backendUrl } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Status Update Modal State
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('Pending');
  const [newPaymentStatus, setNewPaymentStatus] = useState('Pending');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Details Modal State
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [detailsOrder, setDetailsOrder] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/order/all-orders`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        window.toastify(response.data.message || 'Failed to fetch orders', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch orders. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'Pending');
    setNewPaymentStatus(order.paymentStatus || 'Pending');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const response = await axios.patch(
        `${backendUrl}/api/order/update-status/${selectedOrder._id}`,
        { status: newStatus, paymentStatus: newPaymentStatus },
        { withCredentials: true }
      );

      if (response.data.success) {
        window.toastify('Order status updated successfully!', 'success');
        setStatusModalOpen(false);
        fetchOrders();
      } else {
        window.toastify(response.data.message || 'Failed to update order status', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to update order status',
        'error'
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleOpenDetailsModal = async (orderId) => {
    setFetchingDetails(true);
    setDetailsModalOpen(true);
    try {
      const response = await axios.get(`${backendUrl}/api/order/get-single/${orderId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setDetailsOrder(response.data.order);
      } else {
        window.toastify(response.data.message || 'Failed to fetch order details', 'error');
        setDetailsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch order details',
        'error'
      );
      setDetailsModalOpen(false);
    } finally {
      setFetchingDetails(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/order/delete-order/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        window.toastify(response.data.message || 'Order deleted successfully', 'success');
        fetchOrders();
      } else {
        window.toastify(response.data.message || 'Failed to delete order', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to delete order',
        'error'
      );
    }
  };

  const columns = [
    {
      title: 'Order ID / Customer',
      dataIndex: '_id',
      key: 'id',      
      render: (id, record) => (
        <div>
          <div className="font-mono text-xs font-semibold text-gray-800">#{id.slice(-6).toUpperCase()}</div>
          <div className="font-medium text-gray-900 text-sm">{record.shippingDetails?.fullName || record.userId?.userName || 'Customer'}</div>
          <div className="text-xs text-gray-500">{record.shippingDetails?.email || record.userId?.email}</div>
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
      title: 'Quantities',
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
        <Space size="middle">
          {/* View Details */}
          <Button
            type="text"
            icon={<EyeOutlined className="text-blue-600" />}
            onClick={() => handleOpenDetailsModal(record._id)}
            className="hover:bg-blue-50"
            title="View Details"
          />

          {/* Update Status */}
          <Button
            type="text"
            icon={<EditOutlined className="text-amber-600" />}
            onClick={() => handleOpenStatusModal(record)}
            className="hover:bg-amber-50"
            title="Update Status"
          />

          {/* Delete Order */}
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order?"
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
              title="Delete Order"
            />
          </Popconfirm>
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
        {/* Header with Total Orders Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Customer Orders</h1>
            <p className="text-sm text-gray-500 mt-1">
              Total Orders Received:{' '}
              <span className="font-bold text-orange-600 text-base">{orders.length}</span>
            </p>
          </div>
        </div>

        {/* Orders Table Card */}
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

        {/* Update Status Modal */}
        <Modal
          title="Update Order Status"
          open={statusModalOpen}
          onOk={handleUpdateStatus}
          confirmLoading={updatingStatus}
          onCancel={() => setStatusModalOpen(false)}
          okText="Save Changes"
          okButtonProps={{ className: 'bg-orange-600 hover:bg-orange-700!' }}
        >
          <div className="py-4 space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Order Status</label>
              <Select
                value={newStatus}
                onChange={(val) => setNewStatus(val)}
                className="w-full"
                size="large"
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Processing', label: 'Processing' },
                  { value: 'Shipped', label: 'Shipped' },
                  { value: 'Delivered', label: 'Delivered' },
                  { value: 'Cancelled', label: 'Cancelled' },
                ]}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1.5">Payment Status</label>
              <Select
                value={newPaymentStatus}
                onChange={(val) => setNewPaymentStatus(val)}
                className="w-full"
                size="large"
                options={[
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Paid', label: 'Paid' },
                  { value: 'Failed', label: 'Failed' },
                ]}
              />
            </div>
          </div>
        </Modal>

        {/* View Order Details Modal */}
        <Modal
          title={`Order Details #${detailsOrder?._id?.slice(-6).toUpperCase() || ''}`}
          open={detailsModalOpen}
          onCancel={() => setDetailsModalOpen(false)}
          width={700}
          footer={[
            <Button key="close" onClick={() => setDetailsModalOpen(false)}>
              Close
            </Button>,
          ]}
          loading={fetchingDetails}
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

              {/* Customer Shipping Details */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                  Customer & Shipping Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium block">Customer Name:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.fullName || detailsOrder.userId?.userName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium block">Email:</span>
                    <span className="text-gray-900 font-semibold">{detailsOrder.shippingDetails?.email || detailsOrder.userId?.email || 'N/A'}</span>
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
                  Ordered Products ({detailsOrder.items?.length || 0})
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

export default All;