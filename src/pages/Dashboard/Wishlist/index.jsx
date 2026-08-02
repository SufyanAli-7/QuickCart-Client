import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Empty, Spin, Popconfirm } from 'antd';
import { ShoppingCartOutlined, DeleteOutlined, HeartFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Wishlist = () => {
  const { backendUrl } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/wishlist/get`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setProducts(response.data.wishlist?.products || []);
      } else {
        window.toastify(response.data.message || 'Failed to fetch wishlist', 'error');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      window.toastify(
        error.response?.data?.message || 'Failed to fetch wishlist. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId) => {
    setActionLoadingId(productId);
    try {
      const response = await axios.delete(
        `${backendUrl}/api/wishlist/delete/${productId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        window.toastify(response.data.message || 'Removed from wishlist', 'success');
        setProducts((prev) => prev.filter((item) => item._id !== productId));
      } else {
        window.toastify(response.data.message || 'Failed to remove product', 'error');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      window.toastify(
        error.response?.data?.message || 'Failed to remove product',
        'error'
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAddToCart = async (product) => {
    setActionLoadingId(product._id);
    try {
      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );

      if (response.data.success) {
        window.toastify(response.data.message || 'Added to cart successfully!', 'success');
      } else {
        window.toastify(response.data.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      window.toastify(
        error.response?.data?.message || 'Failed to add to cart',
        'error'
      );
    } finally {
      setActionLoadingId(null);
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
          .wishlist-container {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <div className="wishlist-container max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              My Wishlist <HeartFilled style={{ color: '#ef4444' }} className="text-xl" />
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your saved favorite products ({products.length})
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-75">
            <Spin size="large" tip="Loading your wishlist..." />
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl text-center py-16 px-4">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span className="text-gray-500 text-base font-normal">Your wishlist is currently empty!</span>
              }
            >
              <Link to="/products">
                <Button
                  type="primary"
                  size="large"
                  className="bg-orange-600 hover:bg-orange-700! border-none font-medium mt-2 rounded-xl"
                >
                  Explore Products
                </Button>
              </Link>
            </Empty>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-200 rounded-xl p-3 flex flex-col justify-between group shadow-2xs hover:shadow-xs"
              >
                <div>
                  {/* Top right: Delete Trash Icon */}
                  <div className="flex items-center justify-end mb-1">
                    <Popconfirm
                      title="Remove from Wishlist?"
                      onConfirm={() => handleRemoveFromWishlist(product._id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <div
                        className="size-7 rounded-full border border-zinc-200 hover:border-red-200 hover:bg-red-50 flex items-center justify-center cursor-pointer transition text-gray-400 hover:text-red-500"
                        title="Remove from wishlist"
                      >
                        <DeleteOutlined className="text-xs text-gray-500 hover:text-red-500" />
                      </div>
                    </Popconfirm>
                  </div>

                  {/* Product Image */}
                  <div className="flex items-center justify-center h-28 my-1 px-2 overflow-hidden">
                    <img
                      src={product.imageURL || 'https://via.placeholder.com/140'}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Category & Title */}
                  <p className="text-xs text-gray-400 font-normal mb-0.5">{product.category}</p>
                  <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-9 leading-snug">
                    {product.name}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      PKR {product.price ? Number(product.price).toLocaleString() : '0'}
                    </span>
                  </div>

                  <Button
                    type="primary"
                    icon={<ShoppingCartOutlined className="text-xs" />}
                    onClick={() => handleAddToCart(product)}
                    loading={actionLoadingId === product._id}
                    disabled={product.stock < 1}
                    size="small"
                    className="bg-orange-600 hover:bg-orange-700! border-none font-medium text-xs rounded-lg h-7 px-3 flex items-center gap-1 shadow-2xs"
                  >
                    {product.stock < 1 ? 'Out' : 'Add'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default Wishlist;