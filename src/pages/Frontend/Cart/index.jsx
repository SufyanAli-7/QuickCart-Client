import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider, Spin, InputNumber } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Cart = () => {
  const { backendUrl } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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
      console.error('Error fetching cart:', error);
      window.toastify(error.response?.data?.message || 'Failed to load cart', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Cart Item Quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setUpdatingId(productId);
    try {
      const res = await axios.patch(
        `${backendUrl}/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchCart();
      } else {
        window.toastify(res.data.message || 'Failed to update item', 'error');
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      window.toastify(error.response?.data?.message || 'Failed to update quantity', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Remove Item from Cart
  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);
    try {
      const res = await axios.delete(`${backendUrl}/api/cart/delete/${productId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        window.toastify('Item removed from cart', 'success');
        fetchCart();
      } else {
        window.toastify(res.data.message || 'Failed to remove item', 'error');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      window.toastify(error.response?.data?.message || 'Failed to remove item', 'error');
    } finally {
      setUpdatingId(null);
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
          .cart-page-section {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <section className="cart-page-section px-6 md:px-16 lg:px-24 xl:px-32 py-10 max-w-7xl mx-auto min-h-[70vh]">
        {/* Page Header matching reference */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1F2937]">
            Your <span style={{ color: '#ea580c' }}>Cart</span>
          </h1>
          <span className="text-gray-400 font-semibold text-lg sm:text-xl">
            {totalItems} {totalItems === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-87.5">
            <Spin size="large" tip="Loading cart items..." />
          </div>
        ) : !cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <ShoppingCartOutlined className="text-5xl text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
            <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/products">
              <Button type="primary" className="mt-6 bg-orange-600 hover:bg-orange-700 h-10 px-6 font-semibold">
                Explore Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left 8 Columns: Cart Items Table */}
            <div className="lg:col-span-8">
              {/* Table Column Headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs sm:text-sm font-bold text-gray-700">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-gray-100">
                {cart.items.map((item) => {
                  const product = item.productId;
                  if (!product) return null;
                  const itemSubtotal = (product.price || 0) * item.quantity;
                  const isUpdating = updatingId === product._id;

                  return (
                    <div
                      key={product._id}
                      className="py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product Details (Image, Name, Remove Link) */}
                      <div className="md:col-span-6 flex items-center gap-4 w-full">
                        <div className="bg-gray-100 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-2 shrink-0 border border-gray-100">
                          <img
                            src={product.imageURL || 'https://via.placeholder.com/100'}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <div className="space-y-1">
                          <Link to={`/product/${product._id}`}>
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base hover:text-orange-600 transition-colors line-clamp-1">
                              {product.name}
                            </h3>
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(product._id)}
                            disabled={isUpdating}
                            style={{ color: '#ea580c' }}
                            className="text-xs font-semibold hover:opacity-80 transition cursor-pointer border-none bg-transparent p-0 block"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Individual Price */}
                      <div className="md:col-span-2 text-center w-full flex md:block justify-between items-center text-sm font-semibold text-gray-700">
                        <span className="md:hidden text-gray-400 font-normal">Price:</span>
                        <span>PKR {Number(product.price || 0).toLocaleString()}</span>
                      </div>

                      {/* Quantity Selector with Arrows */}
                      <div className="md:col-span-2 text-center w-full flex md:justify-center items-center justify-between">
                        <span className="md:hidden text-gray-400 font-normal text-sm">Quantity:</span>
                        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg p-1 bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600 disabled:opacity-30 cursor-pointer"
                          >
                            <LeftOutlined className="text-[10px]" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                            disabled={item.quantity >= product.stock || isUpdating}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-orange-600 disabled:opacity-30 cursor-pointer"
                          >
                            <RightOutlined className="text-[10px]" />
                          </button>
                        </div>
                      </div>

                      {/* Item Subtotal */}
                      <div className="md:col-span-2 text-right w-full flex md:block justify-between items-center text-sm font-bold text-gray-900">
                        <span className="md:hidden text-gray-400 font-normal">Subtotal:</span>
                        <span>PKR {itemSubtotal.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Navigation matching reference */}
              <div className="pt-6 border-t border-gray-200 mt-4">
                <Link
                  to="/products"
                  style={{ color: '#ea580c' }}
                  className="inline-flex items-center gap-2 font-semibold text-sm hover:opacity-80 transition"
                >
                  <LeftOutlined className="text-xs" /> Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right 4 Columns: Order Summary Box */}
            <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-2xs space-y-6">
              <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-4">
                Order Summary
              </h2>

              <div className="space-y-3.5 text-sm">
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

              {/* Checkout Button */}
              <Button
                type="primary"
                size="large"
                onClick={() => navigate('/checkout')}
                className="w-full bg-orange-600 hover:bg-orange-700! border-none h-12 text-base font-bold rounded-xl shadow-md flex items-center justify-center gap-2 mt-4"
              >
                Proceed to Checkout <RightOutlined className="text-xs" />
              </Button>
            </div>
          </div>
        )}
      </section>
    </ConfigProvider>
  );
};

export default Cart;