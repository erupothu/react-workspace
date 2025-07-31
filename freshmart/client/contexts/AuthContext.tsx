import React from "react";

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
  user: User | null;
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

const AuthContext = React.createContext<AuthContextType>(defaultContextValue);

const AUTH_STORAGE_KEY = "freshmart_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use React.useState with explicit React reference
  const [user, setUser] = React.useState<User | null>(() => {
    // Initialize from localStorage
    try {
      const savedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Load user from localStorage on mount
  React.useEffect(() => {
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

  const login = React.useCallback((userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to remove user data:", error);
    }
  }, []);

  const updateUser = React.useCallback((updates: Partial<User>) => {
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

  const isAuthenticated = React.useMemo(() => user !== null, [user]);

  const contextValue = React.useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [user, isAuthenticated, login, logout, updateUser]
  );

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  return context || defaultContextValue;
}

export default AuthProvider;
