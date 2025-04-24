import { useState, useEffect } from 'react';

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  const logout = () => {
    setToken(null);
  };

  return { token, setToken, logout };
}