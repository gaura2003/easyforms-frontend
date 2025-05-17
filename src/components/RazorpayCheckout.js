import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Button = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;

  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const RazorpayCheckout = ({ plan, interval }) => {
  const { token, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handlePayment = async () => {
    try {
      setLoading(true);
      
      // Create order on the server
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/create`,
        {
          planId: plan.id,
          interval
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log('Order created:', response.data);

      const { order, key_id } = response.data;

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      // Initialize Razorpay checkout
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'EasyForms',
        description: `${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Plan (${interval})`,
        order_id: order.id,
        handler: async function(response) {
          try {
            // Verify payment
            const verificationResponse = await axios.post(
              `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions/verify`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );
            
            // Update user context with new subscription info
            const { user } = verificationResponse.data;
            updateUser(user);
            
            // Show success message and redirect to dashboard
            alert('Payment successful! Your subscription is now active.');
            navigate('/dashboard');
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
            setLoading(false);
          }
        },
        prefill: {
          email: response.data.user.email,
          contact: response.data.user.phone || ''
        },
        notes: {
          plan_id: plan.id,
          interval: interval,
          plan_name: plan.name
        },
        theme: {
          color: '#6772E5'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      
      // Handle payment failures
      razorpay.on('payment.failed', async function(response) {
        console.error('Payment failed:', response.error);
        
        try {
          // Record failed payment
          await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/payments`,
            {
              order_id: order.id,
              amount: order.amount / 100,
              currency: order.currency,
              payment_method: 'razorpay',
              payment_id: response.error.metadata.payment_id || 'unknown',
              status: 'failed'
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } catch (error) {
          console.error('Error recording failed payment:', error);
        }
        
        alert(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      let errorMessage = 'Payment initialization failed. Please try again.';
      
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
      setLoading(false);
    }
  };

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };

    const initRazorpay = async () => {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Check your internet connection.');
      }
    };

    initRazorpay();
    
    return () => {
      const script = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Subscribe to ${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}`}
    </Button>
  );
};

export default RazorpayCheckout;
