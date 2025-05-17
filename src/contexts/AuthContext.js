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
  
  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    register,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

