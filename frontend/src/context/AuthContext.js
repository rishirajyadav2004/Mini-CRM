import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Set axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        if (token) {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`);
          setUser(res.data.data);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, [token]);

  // Register function
  const register = async (userData) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};