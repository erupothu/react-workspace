import React, { useState, useEffect, useCallback, useMemo, useContext, createContext, ReactNode } from "react";

export interface User {
  id: string;
  mobile?: string;
  name: string;
  email?: string;
  isVerified: boolean;
  authProvider?: "mobile" | "google" | "github" | "apple" | "microsoft";
  avatar?: string;
}

interface AuthContextType {
  user: User;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Default context value
const defaultContextValue: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

const AUTH_STORAGE_KEY = "freshmart_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User>(() => {
    // Initialize from localStorage
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Failed to parse saved user data:", error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user data:", error);
    }
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Failed to update user data:", error);
      }
      return updatedUser;
    });
  }, []);

  const isAuthenticated = useMemo(() => user !== null, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, login, logout, updateUser]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  return context || defaultContextValue;
}

export default AuthProvider;
