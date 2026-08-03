import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Spin, Tag, Pagination } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, HeartFilled, EyeOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const AllProductsListing = () => {
  const { backendUrl, isAuth } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistLoadingId, setWishlistLoadingId] = useState(null);
  const [cartLoadingId, setCartLoadingId] = useState(null);

  // Search URL Query Params
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch All Products
      const res = await axios.get(`${backendUrl}/api/product/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setAllProducts(res.data.products || []);
      }

      // Fetch User's Wishlist if authenticated
      if (isAuth) {
        const wishRes = await axios.get(`${backendUrl}/api/wishlist/get`, {
          withCredentials: true,
        });
        if (wishRes.data.success) {
          const ids = wishRes.data.wishlist?.products?.map((p) => p._id) || [];
          setWishlistIds(ids);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAuth]);

  // Reset pagination when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filter products by search query
  const filteredProducts = allProducts.filter((product) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      product.name?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );
  });

  // Handle Add / Remove Wishlist Toggle
  const handleToggleWishlist = async (productId) => {
    if (!isAuth) {
      window.toastify('Please log in to manage your wishlist', 'error');
      return;
    }

    const isFav = wishlistIds.includes(productId);
    setWishlistLoadingId(productId);

    try {
      if (isFav) {
        const res = await axios.delete(`${backendUrl}/api/wishlist/delete/${productId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          window.toastify('Removed from wishlist', 'success');
        }
      } else {
        const res = await axios.post(
          `${backendUrl}/api/wishlist/add`,
          { productId },
          { withCredentials: true }
        );
        if (res.data.success) {
          setWishlistIds((prev) => [...prev, productId]);
          window.toastify('Added to wishlist', 'success');
        }
      }
    } catch (error) {
      console.error('Wishlist error:', error);
      window.toastify(error.response?.data?.message || 'Failed to update wishlist', 'error');
    } finally {
      setWishlistLoadingId(null);
    }
  };

  // Handle Add to Cart
  const handleAddToCart = async (product) => {
    if (!isAuth) {
      window.toastify('Please log in to add items to cart', 'error');
      return;
    }

    setCartLoadingId(product._id);
    try {
      const res = await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId: product._id, quantity: 1 },
        { withCredentials: true }
      );
      if (res.data.success) {
        window.toastify(res.data.message || 'Added to cart successfully!', 'success');
      } else {
        window.toastify(res.data.message || 'Failed to add to cart', 'error');
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      window.toastify(error.response?.data?.message || 'Failed to add to cart', 'error');
    } finally {
      setCartLoadingId(null);
    }
  };

  // Calculate paginated products
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          .products-page-section {
            font-family: "Geist", sans-serif;
          }
        `}
      </style>

      <section className="products-page-section px-6 md:px-16 lg:px-24 xl:px-32 my-10 max-w-7xl mx-auto">
        {/* Page Header Banner */}
        <div className="bg-[#E6E9F2] rounded-2xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold text-orange-600 uppercase tracking-widest block mb-1">
              Store Catalog
            </span>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-lg">
              {searchQuery
                ? `Showing items matching "${searchQuery}".`
                : 'Explore our full collection of top-rated items with doorstep delivery.'}
            </p>

            {searchQuery && (
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 text-xs font-semibold bg-white border border-gray-300 rounded-lg text-gray-700 hover:text-orange-600 hover:border-orange-500 transition-colors shadow-2xs cursor-pointer"
              >
                <ArrowLeftOutlined className="text-[10px]" /> All Products
              </Link>
            )}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            Showing <span className="font-semibold text-gray-900">{filteredProducts.length > 0 ? startIndex + 1 : 0}</span>–
            <span className="font-semibold text-gray-900">{Math.min(startIndex + pageSize, filteredProducts.length)}</span> of{' '}
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-100">
            <Spin size="large" tip="Loading products..." />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col items-center justify-center">
            <p className="text-gray-700 text-base font-semibold">
              No products found for "{searchQuery}"
            </p>
            <p className="text-gray-400 text-xs mt-1 mb-4">
              Try searching with another keyword or browse all items.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowLeftOutlined className="text-xs" /> Back to All Products
            </Link>
          </div>
        ) : (
          <>
            {/* Products Grid: 3 columns on PC (9 cards total per page), 1 on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentProducts.map((product) => {
                const isFav = wishlistIds.includes(product._id);
                const isHeartLoading = wishlistLoadingId === product._id;

                return (
                  <div
                    key={product._id}
                    className="bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-200 rounded-xl p-3 sm:p-4 flex flex-col justify-between group shadow-2xs hover:shadow-xs"
                  >
                    <div>
                      {/* Top Header: Stock Badge & Wishlist Heart Icon */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <Tag
                          color={product.stock > 0 ? 'green' : 'red'}
                          className="m-0 text-[11px] font-medium border-0 px-2 py-0.5 rounded-md"
                        >
                          {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </Tag>

                        <button
                          type="button"
                          onClick={() => handleToggleWishlist(product._id)}
                          disabled={isHeartLoading}
                          className={`size-7 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                            isFav
                              ? 'border-orange-200 bg-orange-50 text-orange-600'
                              : 'border-zinc-200 hover:border-orange-200 hover:bg-orange-50 text-gray-400 hover:text-orange-600'
                          }`}
                          title={isFav ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          {isHeartLoading ? (
                            <Spin size="small" />
                          ) : isFav ? (
                            <HeartFilled className="text-xs text-orange-600" style={{ color: '#ea580c' }} />
                          ) : (
                            <HeartOutlined className="text-xs text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Product Image Link */}
                      <Link
                        to={`/product/${product._id}`}
                        className="flex items-center justify-center h-28 sm:h-36 my-1 sm:my-2 px-2 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={product.imageURL || 'https://via.placeholder.com/160'}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Category */}
                      <p className="text-xs text-gray-400 font-normal mb-0.5">{product.category}</p>

                      {/* Product Name Link */}
                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-sm font-medium text-gray-800 line-clamp-1 cursor-pointer hover:text-orange-600 transition-colors">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Short Description */}
                      <p className="text-xs text-gray-500 line-clamp-2 mt-1 min-h-8 leading-relaxed">
                        {product.description || 'High quality item from our store.'}
                      </p>

                      {/* Price Above Action Buttons */}
                      <div className="mt-2.5 pt-2 border-t border-gray-100">
                        <span className="text-sm sm:text-base font-bold text-gray-900 block">
                          PKR {product.price ? Number(product.price).toLocaleString() : '0'}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Action Bar: View Details Button & Add to Cart Button */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2">
                      <Link to={`/product/${product._id}`} className="flex-1">
                        <Button
                          size="small"
                          icon={<EyeOutlined className="text-xs" />}
                          className="w-full text-xs font-medium border-gray-300 text-gray-700 hover:text-orange-600 hover:border-orange-500 rounded-lg h-8 flex items-center justify-center gap-1"
                        >
                          Details
                        </Button>
                      </Link>

                      <Button
                        type="primary"
                        icon={<ShoppingCartOutlined className="text-xs" />}
                        onClick={() => handleAddToCart(product)}
                        loading={cartLoadingId === product._id}
                        disabled={product.stock < 1}
                        size="small"
                        className="bg-orange-600 hover:bg-orange-700! border-none font-medium text-xs rounded-lg h-8 px-3 flex items-center gap-1 shadow-2xs flex-1"
                      >
                        {product.stock < 1 ? 'Out' : 'Add'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Component: 9 items per page */}
            {filteredProducts.length > pageSize && (
              <div className="flex justify-center mt-12 mb-6">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={filteredProducts.length}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  className="products-pagination"
                />
              </div>
            )}
          </>
        )}
      </section>
    </ConfigProvider>
  );
};

export default AllProductsListing;