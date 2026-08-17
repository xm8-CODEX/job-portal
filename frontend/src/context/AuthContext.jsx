import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to restore authentication session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuthSession = (authData) => {
    const userData = {
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
    };
    setToken(authData.token);
    setUser(userData);
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return saveAuthSession(response.data);
  };

  const register = async (name, email, password, role) => {
    const response = await api.post('/auth/register', { name, email, password, role });
    return saveAuthSession(response.data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role || null,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
