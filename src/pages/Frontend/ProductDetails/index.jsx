import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, ConfigProvider, Spin, Tag, Breadcrumb } from 'antd';
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  LeftOutlined,
  TruckOutlined,
  SafetyCertificateOutlined,
  PlusOutlined,
  MinusOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, isAuth } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFav, setIsFav] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [buyNowLoading, setBuyNowLoading] = useState(false);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // Fetch Single Product
      const res = await axios.get(`${backendUrl}/api/product/get-single/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setProduct(res.data.product);
      } else {
        window.toastify(res.data.message || 'Product not found', 'error');
      }

      // Check Wishlist Status if authenticated
      if (isAuth) {
        const wishRes = await axios.get(`${backendUrl}/api/wishlist/get`, {
          withCredentials: true,
        });
        if (wishRes.data.success) {
          const ids = wishRes.data.wishlist?.products?.map((p) => p._id) || [];
          setIsFav(ids.includes(id));
        }
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      window.toastify(error.response?.data?.message || 'Failed to load product details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id, isAuth]);

  // Wishlist Toggle (Top-right Heart Icon on image box)
  const handleToggleWishlist = async () => {
    if (!isAuth) {
      window.toastify('Please log in to manage your wishlist', 'error');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isFav) {
        const res = await axios.delete(`${backendUrl}/api/wishlist/delete/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setIsFav(false);
          window.toastify('Removed from wishlist', 'success');
        }
      } else {
        const res = await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId: id },
          { withCredentials: true }
        );
        if (res.data.success) {
          setIsFav(true);
          window.toastify('Added to wishlist', 'success');
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      window.toastify(error.response?.data?.message || 'Failed to update wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!isAuth) {
      window.toastify('Please log in to add items to cart', 'error');
      return;
    }

    if (!product || product.stock < 1) {
      window.toastify('Product is out of stock', 'error');
      return;
    }

    setCartLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.toastify(res.data.message || `Added ${quantity} item(s) to cart!`, 'success');
      } else {
        window.toastify(res.data.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      window.toastify(error.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setCartLoading(false);
    }
  };

  // Buy Now (Adds item to cart & redirects to /cart)
  const handleBuyNow = async () => {
    if (!isAuth) {
      window.toastify('Please log in to proceed with purchase', 'error');
      return;
    }

    if (!product || product.stock < 1) {
      window.toastify('Product is out of stock', 'error');
      return;
    }

    setBuyNowLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId: product._id, quantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.toastify('Added to cart!', 'success');
        navigate('/cart');
      } else {
        window.toastify(res.data.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Buy Now error:', error);
      window.toastify(error.response?.data?.message || 'Failed to process Buy Now', 'error');
    } finally {
      setBuyNowLoading(false);
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
          .product-details-page {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <div className="product-details-page min-h-[70vh] w-full px-6 md:px-16 lg:px-24 xl:px-32 py-8">
        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-orange-600 transition-colors cursor-pointer"
          >
            <LeftOutlined className="text-xs group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          <Breadcrumb
            items={[
              { title: <Link to="/">Home</Link> },
              { title: <Link to="/products">Products</Link> },
              { title: product ? product.category : 'Details' },
            ]}
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-112.5">
            <Spin size="large" tip="Loading product details..." />
          </div>
        ) : !product ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
            <p className="text-gray-500 text-sm mt-2">The product you are looking for does not exist or has been removed.</p>
            <Link to="/products">
              <Button type="primary" className="mt-6 bg-orange-600 hover:bg-orange-700">
                Explore All Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left Column: Large Product Image Display */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-6 sm:p-10 flex items-center justify-center relative shadow-2xs group">
              {/* Stock Status Tag */}
              <div className="absolute top-5 left-5 z-10">
                <Tag
                  color={product.stock > 0 ? 'green' : 'red'}
                  className="font-medium text-xs px-3 py-1 rounded-full m-0 border-0 shadow-2xs"
                >
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </Tag>
              </div>

              {/* Top Right Wishlist Heart Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                disabled={wishlistLoading}
                className={`absolute top-5 right-5 z-10 size-11 rounded-full border flex items-center justify-center cursor-pointer shadow-md transition-all ${
                  isFav
                    ? 'border-orange-200 bg-orange-50 text-orange-600 scale-105'
                    : 'border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50 text-gray-400 hover:text-orange-600'
                }`}
                title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlistLoading ? (
                  <Spin size="small" />
                ) : isFav ? (
                  <HeartFilled className="text-lg text-orange-600" style={{ color: '#ea580c' }} />
                ) : (
                  <HeartOutlined className="text-lg text-gray-500" />
                )}
              </button>

              {/* Image */}
              <div className="w-full h-80 sm:h-96 md:h-105 flex items-center justify-center p-4">
                <img
                  src={product.imageURL || 'https://via.placeholder.com/400'}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: Product Information & Purchase Controls */}
            <div className="flex flex-col justify-between h-full space-y-6">
              <div>
                {/* Category Badge */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 font-semibold text-xs rounded-full uppercase tracking-wider">
                    {product.category || 'General'}
                  </span>
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 my-4 pb-4 border-b border-gray-100">
                  <span className="text-3xl sm:text-4xl font-extrabold text-orange-600">
                    PKR {Number(product.price || 0).toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">Inclusive of all taxes</span>
                </div>

                {/* Short Specs / Highlights */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <TruckOutlined className="text-orange-600 text-base" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Fast Shipping</p>
                      <p className="text-[11px] text-gray-400">Doorstep delivery</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <SafetyCertificateOutlined className="text-emerald-600 text-base" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Guaranteed Quality</p>
                      <p className="text-[11px] text-gray-400">100% Authentic</p>
                    </div>
                  </div>
                </div>

                {/* Product Description */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">
                    Product Description
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed bg-gray-50/70 p-4 sm:p-5 rounded-2xl border border-gray-100 whitespace-pre-line">
                    {product.description || 'No detailed description available for this product.'}
                  </p>
                </div>
              </div>

              {/* Quantity Counter & Action Buttons */}
              <div className="pt-6 border-t border-gray-200 space-y-4">
                {/* Quantity Control */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1 || product.stock < 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <MinusOutlined className="text-xs" />
                    </button>
                    <span className="px-4 py-2 font-bold text-gray-900 text-sm min-w-10 text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.min(product.stock || 99, prev + 1))}
                      disabled={quantity >= product.stock || product.stock < 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-40 transition-colors cursor-pointer"
                    >
                      <PlusOutlined className="text-xs" />
                    </button>
                  </div>

                  {product.stock > 0 && (
                    <span className="text-xs text-gray-400 font-medium">
                      ({product.stock} items in stock)
                    </span>
                  )}
                </div>

                {/* Action Buttons Row: Add to Cart & Buy Now */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined className="text-lg" />}
                    onClick={handleAddToCart}
                    loading={cartLoading}
                    disabled={product.stock < 1}
                    className="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700! border-none h-12 text-base font-semibold rounded-xl shadow-md flex items-center justify-center gap-2"
                  >
                    {product.stock < 1 ? 'Out of Stock' : `Add to Cart • PKR ${(Number(product.price || 0) * quantity).toLocaleString()}`}
                  </Button>

                  <Button
                    size="large"
                    icon={<ThunderboltOutlined className="text-lg" />}
                    onClick={handleBuyNow}
                    loading={buyNowLoading}
                    disabled={product.stock < 1}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold border-2 border-orange-600 text-orange-600 hover:bg-orange-50 hover:border-orange-700 transition flex items-center justify-center gap-2"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ConfigProvider>
  );
};

export default ProductDetails;