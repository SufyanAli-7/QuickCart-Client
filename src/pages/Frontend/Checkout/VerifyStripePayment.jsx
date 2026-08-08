import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Spin, ConfigProvider } from 'antd';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

const VerifyStripePayment = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { backendUrl } = useAuth();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        window.toastify('Invalid payment session ID', 'error');
        navigate('/cart');
        return;
      }

      try {
        const res = await axios.get(
          `${backendUrl}/api/order/verify-stripe-session?session_id=${sessionId}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          window.toastify(res.data.message || 'Payment verified & order placed!', 'success');
          navigate('/dashboard/my-orders');
        } else {
          window.toastify(res.data.message || 'Payment verification failed', 'error');
          navigate('/cart');
        }
      } catch (error) {
        console.error('Error verifying Stripe payment:', error);
        window.toastify(
          error.response?.data?.message || 'Failed to verify Stripe payment',
          'error'
        );
        navigate('/cart');
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [sessionId, backendUrl, navigate]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ea580c',
        },
      }}
    >
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-gray-200/80 shadow-xs max-w-md w-full text-center space-y-4">
          <Spin size="large" description="Verifying your payment with Stripe..." />
          <h2 className="text-xl font-bold text-gray-900 mt-4">Verifying Payment...</h2>
          <p className="text-xs text-gray-500">
            Please do not refresh or close this window while we confirm your order.
          </p>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default VerifyStripePayment;
