import { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { login as apiLogin, logout as apiLogout, refreshToken as apiRefreshToken } from '../api/auth.js';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userData = localStorage.getItem('user_data');

      if (accessToken && refreshTokenValue && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          localStorage.removeItem(ACCESS_TOKEN_KEY);
          localStorage.removeItem(REFRESH_TOKEN_KEY);
          localStorage.removeItem('user_data');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const { access_token, refresh_token, user: userData } = await apiLogin(username, password);

      localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
      localStorage.setItem('user_data', JSON.stringify(userData));

      setUser(userData);
      return userData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (user) {
        await apiLogout().catch(() => {});
      }
    } finally {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('user_data');
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('token_timestamp');
      setUser(null);
    }
  }, [user]);

  const refreshToken = useCallback(async () => {
    const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    try {
      const { access_token, user: userData } = await apiRefreshToken(refreshTokenValue);
      
      localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
      }
      
      return access_token;
    } catch (err) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem('user_data');
      setUser(null);
      throw err;
    }
  }, []);

  const hasRole = useCallback((role) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    if (!user?.roles || !roles.length) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      login,
      logout,
      refreshToken,
      hasRole,
      hasAnyRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};