import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setAuthContext } from '../services/api';

const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    token: null,
    login: () => {},
    logout: () => {},
    register: () => {},
});

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
                await api.post('auth/logout/', { refresh });
            }
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    // Verify token and get user data
                    const response = await api.get('auth/test/');
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                } catch (error) {
                    // If token verification fails, try refresh
                    const refresh = localStorage.getItem('refresh_token');
                    if (refresh) {
                        try {
                            const response = await api.post('auth/refresh/', { refresh });
                            localStorage.setItem('access_token', response.data.access);
                            setToken(response.data.access);
                            setIsAuthenticated(true);
                        } catch (refreshError) {
                            // If refresh fails, clear everything
                            logout();
                        }
                    }
                }
            }
        };

        initAuth();
        // Connect auth context to API service for auto-logout
        setAuthContext({ logout });
    }, [logout]);

    const login = async (tokens, userData) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        setToken(tokens.access);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const register = async (userData) => {
        const response = await api.post('auth/register/', userData);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            token,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 