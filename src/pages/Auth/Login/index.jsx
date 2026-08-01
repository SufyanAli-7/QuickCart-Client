import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { backendUrl, dispatch, readProfile } = useAuth();

  const onFinish = async (values) => {
    const { email, password } = values;
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.success) {
        window.toastify(response.data.message || 'Login successful!', 'success');
        await readProfile();        
      }
    } catch (error) {
      console.error(error);
      window.toastify(
        error.response?.data?.message || 'Login failed. Please check your credentials.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
          borderRadius: 8,
          controlHeight: 42,
        },
      }}
    >
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="Logo" className="h-9 mx-auto" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-500 mt-1">Please sign in to your account</p>
          </div>

          {/* Login Form */}
          <Form
            form={form}
            name="login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
            initialValues={{ remember: true }}
          >
            {/* Email */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Email</span>}
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email address!' }
              ]}
            >
              <Input placeholder="name@example.com" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Password</span>}
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' }
              ]}
            >
              <Input.Password placeholder="Enter your password" size="large" />
            </Form.Item>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-sm text-gray-600">Remember me</Checkbox>
              </Form.Item>
              <Link
                to="/auth/forgot-password"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Don't have an account?{' '}
            <Link to="/auth/register" className="font-semibold text-orange-600 hover:text-orange-700">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Login;