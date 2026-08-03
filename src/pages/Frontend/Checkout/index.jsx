import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Input, Button, ConfigProvider, Spin } from 'antd';
import {
  CheckCircleOutlined,
  ShoppingOutlined,
  LeftOutlined,
  EnvironmentOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Checkout = () => {
  const { backendUrl, user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [cart, setCart] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/cart/get`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setCart(res.data.cart);
        setTotalItems(res.data.totalItems || 0);
        setSubtotal(res.data.subtotal || 0);
      }
    } catch (error) {
      console.error('Error fetching cart for checkout:', error);
      window.toastify(error.response?.data?.message || 'Failed to load checkout details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Pre-fill email and user details from useAuth
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName || '',
        email: user.email || '',
      });
    }
  }, [user, form]);

  const handlePlaceOrder = async (values) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      window.toastify('Your cart is empty', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const shippingDetails = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        orderNote: values.orderNote || '',
      };

      const res = await axios.post(
        `${backendUrl}/api/order/create`,
        { shippingDetails, paymentStatus: 'Pending' },
        { withCredentials: true }
      );

      if (res.data.success) {
        window.toastify(res.data.message || 'Order placed successfully!', 'success');
        // Redirect user to /dashboard/my-orders
        navigate('/dashboard/my-orders');
      } else {
        window.toastify(res.data.message || 'Failed to place order', 'error');
      }
    } catch (error) {
      console.error('Place order error:', error);
      window.toastify(error.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          borderRadius: 12,
        },
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&display=swap');
          .checkout-page-section {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>
      <section className="checkout-page-section w-full px-6 md:px-16 lg:px-24 xl:px-32 py-10 min-h-[70vh]">
        {/* Navigation Header aligned with Navbar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-gray-200 mb-8 gap-4 w-full">
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest block mb-1">
              Checkout Process
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
              Complete Your <span style={{ color: '#ea580c' }}>Order</span>
            </h1>
          </div>
          <Link
            to="/cart"
            style={{ color: '#ea580c' }}
            className="text-sm sm:text-base font-semibold hover:opacity-80 flex items-center gap-1.5 transition whitespace-nowrap"
          >
            <LeftOutlined className="text-xs" /> Back to Cart
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-87.5">
            <Spin size="large" tip="Loading checkout information..." />
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-6 sm:px-10 bg-gray-50/80 rounded-3xl border border-gray-200/80 shadow-2xs my-8">
            <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
              <ShoppingOutlined />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              Please add products to your cart before proceeding to checkout.
            </p>
            <Link to="/products">
              <Button type="primary" size="large" className="mt-6 bg-orange-600 hover:bg-orange-700 h-11 px-8 font-semibold rounded-xl shadow-xs">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full"
          >
            {/* Left 7 Columns: Checkout Form */}
            <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                <EnvironmentOutlined className="text-xl text-orange-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                  <p className="text-xs text-gray-500">Provide your delivery address and contact information</p>
                </div>
              </div>
              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <Form.Item
                  name="fullName"
                  label={<span className="font-semibold text-gray-700 text-xs">Full Name</span>}
                  rules={[{ required: true, message: 'Please enter your full name' }]}
                  className="sm:col-span-1"
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="John Doe"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
                {/* Email (Auto-filled from useAuth) */}
                <Form.Item
                  name="email"
                  label={<span className="font-semibold text-gray-700 text-xs">Email Address</span>}
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                  className="sm:col-span-1"
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="user@example.com"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
                {/* Phone Number */}
                <Form.Item
                  name="phone"
                  label={<span className="font-semibold text-gray-700 text-xs">Phone Number</span>}
                  rules={[{ required: true, message: 'Please enter your phone number' }]}
                  className="sm:col-span-2"
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="+92 300 1234567"
                    size="large"
                    className="rounded-xl"
                  />
                </Form.Item>
                {/* Shipping Address */}
                <Form.Item
                  name="address"
                  label={<span className="font-semibold text-gray-700 text-xs">Shipping Address</span>}
                  rules={[{ required: true, message: 'Please enter your street address' }]}
                  className="sm:col-span-2"
                >
                  <Input.TextArea
                    placeholder="House / Apartment #, Street Address, Area"
                    rows={2}
                    className="rounded-xl"
                  />
                </Form.Item>
                {/* City */}
                <Form.Item
                  name="city"
                  label={<span className="font-semibold text-gray-700 text-xs">City</span>}
                  rules={[{ required: true, message: 'Please enter your city' }]}
                  className="sm:col-span-1"
                >
                  <Input placeholder="Karachi / Lahore / Islamabad" size="large" className="rounded-xl" />
                </Form.Item>
                {/* Postal Code */}
                <Form.Item
                  name="postalCode"
                  label={<span className="font-semibold text-gray-700 text-xs">Postal Code</span>}
                  rules={[{ required: true, message: 'Please enter your postal code' }]}
                  className="sm:col-span-1"
                >
                  <Input placeholder="75500" size="large" className="rounded-xl" />
                </Form.Item>
                {/* Order Notes (Optional) */}
                <Form.Item
                  name="orderNote"
                  label={<span className="font-semibold text-gray-700 text-xs">Order Notes (Optional)</span>}
                  className="sm:col-span-2"
                >
                  <Input.TextArea
                    prefix={<FileTextOutlined className="text-gray-400" />}
                    placeholder="Special instructions for delivery (e.g. Leave at door)"
                    rows={2}
                    className="rounded-xl"
                  />
                </Form.Item>
              </div>
            </div>

            {/* Right 5 Columns: Order Summary */}
            <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                Order Summary
              </h2>

              {/* Ordered Products List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {cart.items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  const itemSubtotal = (product.price || 0) * item.quantity;

                  return (
                    <div
                      key={product._id}
                      className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 rounded-lg w-14 h-14 flex items-center justify-center p-1 shrink-0 border border-gray-100">
                          <img
                            src={product.imageURL || 'https://via.placeholder.com/60'}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs sm:text-sm line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            Qty: <span className="font-semibold text-gray-800">{item.quantity}</span> × PKR{' '}
                            {Number(product.price || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">
                          PKR {itemSubtotal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Calculations */}
              <div className="space-y-3 text-sm pt-4 border-t border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Total Items</span>
                  <span className="font-semibold text-gray-900">{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-extrabold" style={{ color: '#ea580c' }}>
                    PKR {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit / Place Order Button */}
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                size="large"
                className="w-full bg-orange-600 hover:bg-orange-700! border-none h-12 text-base font-bold rounded-xl shadow-md flex items-center justify-center gap-2 mt-4"
              >
                Place Order <CheckCircleOutlined className="text-base" />
              </Button>
            </div>
          </Form>
        )}
      </section>
    </ConfigProvider>
  );
};

export default Checkout;