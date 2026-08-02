import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Card, ConfigProvider, Spin } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const { TextArea } = Input;

const Edit = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { backendUrl } = useAuth();
  const [fetching, setFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setFetching(true);
      try {
        const response = await axios.get(`${backendUrl}/api/product/get-single/${id}`, {
          withCredentials: true,
        });

        if (response.data.success && response.data.product) {
          const product = response.data.product;
          form.setFieldsValue({
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
            status: product.status || 'active',
          });

          if (product.imageURL) {
            setFileList([
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: product.imageURL,
              },
            ]);
          }
        } else {
          window.toastify(response.data.message || 'Product not found', 'error');
          navigate('/dashboard/products');
        }
      } catch (error) {
        console.error(error);
        window.toastify(
          error.response?.data?.message || 'Failed to fetch product details',
          'error'
        );
        navigate('/dashboard/products');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id, backendUrl, form, navigate]);

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      formData.append('category', values.category);
      formData.append('status', values.status || 'active');

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      const response = await axios.patch(
        `${backendUrl}/api/product/update/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true,
        }
      );

      if (response.data.success || response.status === 200) {
        window.toastify(response.data.message || 'Product updated successfully!', 'success');
        navigate('/dashboard/products');
      } else {
        window.toastify(response.data.message || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Failed to update product. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Spin size="large" tip="Loading product details..." />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          borderRadius: 8,
        },
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-sm text-gray-500 mt-1">Update existing product information</p>
          </div>
          <Link to="/dashboard/products">
            <Button icon={<ArrowLeftOutlined />} className="font-medium">
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Card Form */}
        <Card className="shadow-xs border border-gray-200 rounded-xl">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {/* Product Name */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Product Name</span>}
                name="name"
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please enter product name!' }]}
              >
                <Input placeholder="e.g. Wireless Noise-Canceling Headphones" size="large" />
              </Form.Item>

              {/* Category */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Category</span>}
                name="category"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select
                  placeholder="Select category"
                  size="large"
                  options={[
                    "Electronics",
                    "Fashion",
                    "Home & Kitchen",
                    "Beauty",
                    "Sports",
                    "Books",
                    "Toys",
                    "Groceries",
                    "Health",
                    "Automotive",
                    "Accessories",
                    "Furniture",
                    "Stationery"
                  ].map((cat) => ({ value: cat, label: cat }))}
                />
              </Form.Item>

              {/* Status */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Status</span>}
                name="status"
                rules={[{ required: true, message: 'Please select status!' }]}
              >
                <Select
                  size="large"
                  options={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                />
              </Form.Item>

              {/* Price */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Price</span>}
                name="price"
                rules={[{ required: true, message: 'Please enter price!' }]}
              >
                <InputNumber
                  placeholder="0.00"
                  className="w-full"
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                  step={0.01}
                />
              </Form.Item>

              {/* Stock Quantity */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Stock Quantity</span>}
                name="stock"
                rules={[{ required: true, message: 'Please enter stock quantity!' }]}
              >
                <InputNumber
                  placeholder="Available quantity"
                  className="w-full"
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                  precision={0}
                />
              </Form.Item>

              {/* Description */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Description</span>}
                name="description"
                className="md:col-span-2"
                rules={[{ required: true, message: 'Please enter product description!' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Detailed description of the product..."
                  size="large"
                />
              </Form.Item>

              {/* Product Image */}
              <Form.Item
                label={<span className="font-semibold text-gray-700">Product Image</span>}
                className="md:col-span-2"
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                >
                  {fileList.length < 1 && (
                    <div className="flex flex-col items-center">
                      <UploadOutlined className="text-xl text-orange-600 mb-1" />
                      <div className="text-xs text-gray-600 font-medium">Upload New Image</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6">
              <Link to="/dashboard/products">
                <Button size="large" className="font-medium">
                  Cancel
                </Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                className="font-semibold px-8 bg-orange-600 hover:bg-orange-700! border-none shadow-md"
              >
                Update Product
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Edit;