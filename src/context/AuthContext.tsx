import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { api } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = api.getToken();
    if (token) {
      setIsAuthenticated(true);
      const storedUsername = localStorage.getItem('adminUsername');
      setUsername(storedUsername);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.login({ username, password });
    setIsAuthenticated(true);
    setUsername(response.username);
    localStorage.setItem('adminUsername', response.username);
  };

  const logout = () => {
    api.clearToken();
    setIsAuthenticated(false);
    setUsername(null);
    localStorage.removeItem('adminUsername');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
