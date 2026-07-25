import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('nova_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getProfile();
          if (res.success) {
            setUser(res.user);
            localStorage.setItem('nova_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Auth token verification failed:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('nova_token', res.token);
      localStorage.setItem('nova_user', JSON.stringify(res.user));
    }
    return res;
  };

  const register = async (name, email, password, avatar) => {
    const res = await authAPI.register({ name, email, password, avatar });
    if (res.success) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('nova_token', res.token);
      localStorage.setItem('nova_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user');
  };

  const updateProfile = async (data) => {
    const res = await authAPI.updateProfile(data);
    if (res.success) {
      setUser(res.user);
      localStorage.setItem('nova_user', JSON.stringify(res.user));
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!token && !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
