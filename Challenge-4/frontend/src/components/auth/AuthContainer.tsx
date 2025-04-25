import { useState, useEffect } from 'react';
import { Login } from './Login';
import { Register } from './Register';

interface AuthContainerProps {
  onAuthSuccess: (token: string) => void;
}

export function AuthContainer({ onAuthSuccess }: AuthContainerProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clear error when switching between login and register
  useEffect(() => {
    setError(null);
  }, [isLogin]);

  const handleLogin = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
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
        // Store token in localStorage for persistence
        localStorage.setItem('auth_token', data.access_token);
        onAuthSuccess(data.access_token);
      } else {
        setError(data.error || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
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
        // Store token in localStorage for persistence
        localStorage.setItem('auth_token', data.access_token);
        onAuthSuccess(data.access_token);
      } else {
        setError(data.error || 'Registration failed. Please try a different username.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('Unable to connect to server. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chat Application</h1>
          <p className="text-gray-600">Connect with friends and colleagues</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-4 text-center font-medium ${
                isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(true)}
              disabled={isLoading}
            >
              Sign In
            </button>
            <button
              className={`flex-1 py-4 text-center font-medium ${
                !isLogin ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setIsLogin(false)}
              disabled={isLoading}
            >
              Create Account
            </button>
          </div>
          
          <div className="p-6">
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
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Chat Application. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="text-blue-600 hover:underline mr-4">Privacy Policy</a>
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}