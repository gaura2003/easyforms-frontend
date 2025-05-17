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
    
    // Create subscription on the server
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

    console.log('Subscription created:', response.data);

    const { subscription, key_id } = response.data;

    if (!subscription || !subscription.id) {
      throw new Error('Invalid subscription response from server');
    }

    // Initialize Razorpay checkout
    const options = {
      key: key_id,
      subscription_id: subscription.id,
      name: 'EasyForms',
      description: `${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} Plan (${interval})`,
      theme: {
        color: '#6772E5'
      },
      // Rest of the code remains the same
    };

    const razorpay = new window.Razorpay(options);
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
