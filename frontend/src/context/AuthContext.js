import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    setIsAuthenticated(true);
                    setUser({ id: decoded.id,  username: decoded.username });
                } else {
                    localStorage.removeItem('access_token');
                }
            } catch (error) {
                console.error("Token decoding failed:", error);
                localStorage.removeItem('access_token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { username, password });
            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            const decoded = jwtDecode(access);
            setIsAuthenticated(true);
            setUser({ id: decoded.id, username: decoded.username });
            return true;

        } catch (error) {
            console.error("Login failed:", error.message);
            setIsAuthenticated(false);
            setUser(null);
            throw error;
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.post('register/', { username, email, password });
            return true;
        } catch (error) {
            console.error("Registration failed:", error.message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsAuthenticated(false);
        setUser(null);
    };

    const contextValue = {
        isAuthenticated,
        user,
        loading,
        login,
        register,
        logout
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
