import { createContext, useState, useContext, useEffect } from 'react';

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

    useEffect(() => {
        if (token) {
            setIsAuthenticated(true);
            // You could fetch user data here using the token
        }
    }, [token]);

    const login = (tokens, userData) => {
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        setToken(tokens.access);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            // Call logout endpoint
            await fetch('http://localhost:8000/api/auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ refresh })
            });
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const register = async (userData) => {
        const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return response.json();
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