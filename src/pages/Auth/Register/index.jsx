import React, { useState } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { backendUrl } = useAuth();
 
  const onFinish = async (values) => {
    const { fullName, email, password } = values;
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/auth/register`, { fullName, email, password }, { withCredentials: true });
      if (response.data.success) {
        window.toastify(response.data.message, 'success');
        navigate('/auth/login');
      }
    } catch (error) {
      console.error(error);
      window.toastify(error.response?.data?.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${backendUrl}/auth/google`;
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
            <h2 className="text-2xl font-bold text-gray-900">Create an Account</h2>
            <p className="text-sm text-gray-500 mt-1">Join us today to start shopping</p>
          </div>

          {/* Registration Form */}
          <Form
            form={form}
            name="register"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            requiredMark={false}
          >
            {/* 1. Full Name */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Full Name</span>}
              name="fullName"
              rules={[
                { required: true, message: 'Please enter your full name!' },
                { min: 3, message: 'Name must be at least 3 characters!' }
              ]}
            >
              <Input placeholder="Enter your full name" size="large" />
            </Form.Item>

            {/* 2. Email */}
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

            {/* 3. Password */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Password</span>}
              name="password"
              rules={[
                { required: true, message: 'Please enter your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password placeholder="Create a password" size="large" />
            </Form.Item>

            {/* 4. Confirm Password */}
            <Form.Item
              label={<span className="font-medium text-gray-700">Confirm Password</span>}
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" size="large" />
            </Form.Item>

            {/* Submit Button */}
            <Form.Item className="mt-6 mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none cursor-pointer"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Register Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-300 rounded-xl shadow-2xs bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-orange-600 hover:text-orange-700">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Register;