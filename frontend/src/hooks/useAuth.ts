import { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';

interface Dealer {
  id: number;
  name: string;
  email: string;
  companyName: string;
  phone: string;
  address: string;
}

interface AuthState {
  isAuthenticated: boolean;
  dealer: Dealer | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    dealer: null,
    loading: true,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthState({ isAuthenticated: false, dealer: null, loading: false });
        return;
      }

      const response = await axiosInstance.get('/dealers/profile');
      setAuthState({
        isAuthenticated: true,
        dealer: response.data,
        loading: false,
      });
    } catch (error) {
      localStorage.removeItem('token');
      setAuthState({ isAuthenticated: false, dealer: null, loading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post('/dealers/login', { email, password });
      const { token, ...dealer } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Update auth state
      setAuthState({
        isAuthenticated: true,
        dealer,
        loading: false,
      });
      
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (dealerData: Omit<Dealer, 'id'> & { password: string }) => {
    try {
      const response = await axiosInstance.post('/dealers/register', dealerData);
      const { token, ...dealer } = response.data;
      
      // Store token
      localStorage.setItem('token', token);
      
      // Update auth state
      setAuthState({
        isAuthenticated: true,
        dealer,
        loading: false,
      });
      
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({ isAuthenticated: false, dealer: null, loading: false });
  };

  return {
    ...authState,
    login,
    register,
    logout,
  };
}; 