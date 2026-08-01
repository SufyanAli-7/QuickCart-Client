import React, { useState } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Register Values:', values);
      window.toastify('Registration successful!', 'success');
      navigate('/auth/login');
    } catch (error) {
      window.toastify('Registration failed. Please try again.', 'error');
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
                className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-500 mt-4">
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