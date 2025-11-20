import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_URL } from '../constants/Config';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Helper functions for platform-specific storage
const setStorageItem = async (key, value) => {
    if (Platform.OS === 'web') {
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Local storage is not available:', e);
        }
    } else {
        await SecureStore.setItemAsync(key, value);
    }
};

const getStorageItem = async (key) => {
    if (Platform.OS === 'web') {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Local storage is not available:', e);
            return null;
        }
    } else {
        return await SecureStore.getItemAsync(key);
    }
};

const removeStorageItem = async (key) => {
    if (Platform.OS === 'web') {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Local storage is not available:', e);
        }
    } else {
        await SecureStore.deleteItemAsync(key);
    }
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: null, // null = loading, true = authenticated, false = not authenticated
        user: null,
    });

    useEffect(() => {
        const loadToken = async () => {
            const token = await getStorageItem('token');
            if (token) {
                // Verify token with backend or just trust it for now and verify on first request
                setAuthState({
                    token,
                    authenticated: true,
                    user: null, // We can fetch user details here if needed
                });

                // Optional: Fetch user details
                fetchUser(token);
            } else {
                setAuthState({
                    token: null,
                    authenticated: false,
                    user: null,
                });
            }
        };

        loadToken();
    }, []);

    const fetchUser = async (token) => {
        try {
            const response = await fetch(`${API_URL}/auth/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setAuthState((prev) => ({ ...prev, user: data.data }));
            } else {
                // Token might be invalid
                await logout();
            }
        } catch (e) {
            console.error('Failed to fetch user', e);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                const { token, ...user } = data.data;
                await setStorageItem('token', token);
                setAuthState({
                    token,
                    authenticated: true,
                    user,
                });
                return data;
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (e) {
            return { success: false, error: e.message };
        }
    };

    const logout = async () => {
        await removeStorageItem('token');
        setAuthState({
            token: null,
            authenticated: false,
            user: null,
        });
    };

    return (
        <AuthContext.Provider value={{ authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
