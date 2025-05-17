import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Check if user is authenticated on initial load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/users/me`);
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    verifyToken();
  }, [token]);
  
  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };
  
  // Register function
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/auth/register`, {
        name,
        email,
        password
      });
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Update user data
  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
  };
  
  // Subscribe to a plan
  const subscribeToPlan = async (planId, billingCycle, paymentMethodId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
        {
          planId,
          billingCycle,
          paymentMethodId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update user with new subscription data
      updateUser({
        subscription_tier: response.data.subscription.tier,
        subscription_status: response.data.subscription.status,
        plan_id: response.data.subscription.planId
      });
      
      return { 
        success: true, 
        subscription: response.data.subscription 
      };
    } catch (error) {
      console.error('Subscription error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to subscribe to plan' 
      };
    }
  };
  
  // Cancel subscription
  const cancelSubscription = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/subscriptions`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Update user with new subscription data
      updateUser({
        subscription_tier: 'free',
        subscription_status: 'cancelled',
        subscription_id: null
      });
      
      return { 
        success: true, 
        message: response.data.message 
      };
    } catch (error) {
      console.error('Cancellation error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to cancel subscription' 
      };
    }
  };
  
  // Add payment method
  const addPaymentMethod = async (paymentDetails) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3002'}/api/payment-methods`,
        paymentDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      return { 
        success: true, 
        paymentMethod: response.data.paymentMethod 
      };
    } catch (error) {
      console.error('Payment method error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to add payment method' 
      };
    }
  };
  
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    subscribeToPlan,
    cancelSubscription,
    addPaymentMethod
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
