import React, { useState } from 'react';
import { Button, Form, Input, ConfigProvider } from 'antd';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/logo.svg';

const { Item } = Form;

const ForgotPassword = () => {
  const { backendUrl } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (value) => setOtp(value);
  const handleNewPasswordChange = (e) => setNewPassword(e.target.value);

  const handleSubmitEmail = (e) => {
    e.preventDefault();
    if (!email) {
      return window.toastify('Please enter your email address', 'error');
    }
    setIsLoading(true);
    axios
      .post(`${backendUrl}/api/auth/send-reset-otp`, { email })
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          setIsEmailSent(true);
          window.toastify(message, 'success');
        }
      })
      .catch((err) => {
        window.toastify(err.response?.data?.message || 'Failed to send OTP', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      return window.toastify('Please enter the 6-digit OTP', 'error');
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsOtpSubmitted(true);
      setIsLoading(false);
    }, 800);
  };

  const handleSubmitNewPassword = (e) => {
    e.preventDefault();
    if (!newPassword) {
      return window.toastify('Please enter a new password', 'error');
    }
    setIsLoading(true);
    axios
      .post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword })
      .then((res) => {
        const { success, message } = res.data;
        if (success) {
          window.toastify(message, 'success');
          navigate('/auth/login');
        }
      })
      .catch((err) => {
        window.toastify(err.response?.data?.message || 'Failed to reset password', 'error');
      })
      .finally(() => {
        setIsLoading(false);
      });
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

          {/* Step 1: Enter Email */}
          {!isEmailSent && (
            <>
              <div className="text-center mb-8">
                <Link to="/" className="inline-block mb-4">
                  <img src={logo} alt="Logo" className="h-9 mx-auto" />
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Forgot Password</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your registered email address</p>
              </div>

              <Form layout="vertical">
                <Item label={<span className="font-medium text-gray-700">Email</span>} required>
                  <Input
                    placeholder="Enter your email"
                    size="large"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </Item>

                <div className="text-sm text-gray-500 mb-6">
                  Remembered your password?{' '}
                  <Link to="/auth/login" className="font-semibold text-orange-600 hover:text-orange-700">
                    Login here
                  </Link>
                </div>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={handleSubmitEmail}
                  block
                  className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none"
                >
                  Send OTP
                </Button>
              </Form>
            </>
          )}

          {/* Step 2: Enter OTP */}
          {!isOtpSubmitted && isEmailSent && (
            <>
              <div className="text-center mb-8">
                <Link to="/" className="inline-block mb-4">
                  <img src={logo} alt="Logo" className="h-9 mx-auto" />
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">Reset Password OTP</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the 6-digit code sent to <span className="font-medium text-gray-800">{email}</span>
                </p>
              </div>

              <Form layout="vertical">
                <div className="flex justify-center my-6">
                  <Input.OTP size="large" value={otp} onChange={handleOtpChange} length={6} />
                </div>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={handleSubmitOtp}
                  block
                  className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none mt-4"
                >
                  Verify OTP
                </Button>
              </Form>
            </>
          )}

          {/* Step 3: Enter New Password */}
          {isOtpSubmitted && isEmailSent && (
            <>
              <div className="text-center mb-8">
                <Link to="/" className="inline-block mb-4">
                  <img src={logo} alt="Logo" className="h-9 mx-auto" />
                </Link>
                <h2 className="text-2xl font-bold text-gray-900">New Password</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your new password below</p>
              </div>

              <Form layout="vertical">
                <Item label={<span className="font-medium text-gray-700">New Password</span>} required>
                  <Input.Password
                    placeholder="Enter new password"
                    size="large"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </Item>

                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  loading={isLoading}
                  onClick={handleSubmitNewPassword}
                  block
                  className="font-semibold shadow-md bg-orange-600 hover:bg-orange-700! border-none mt-4"
                >
                  Reset Password
                </Button>
              </Form>
            </>
          )}

        </div>
      </div>
    </ConfigProvider>
  );
};

export default ForgotPassword;