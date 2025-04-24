import { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthContainerProps {
  onAuthSuccess: (token: string) => void;
}

export function AuthContainer({ onAuthSuccess }: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/chat/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.access_token);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server');
    }
  };

  const handleRegister = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:8000/chat/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onAuthSuccess(data.access_token);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        {isLogin ? (
          <Login 
            onSwitchToRegister={() => setIsLogin(false)}
            onSubmit={handleLogin}
          />
        ) : (
          <Register 
            onSwitchToLogin={() => setIsLogin(true)}
            onSubmit={handleRegister}
          />
        )}
      </div>
    </div>
  );
}