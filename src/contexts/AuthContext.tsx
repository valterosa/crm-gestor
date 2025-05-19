
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock de permissões baseado em papéis
const rolePermissions: Record<UserRole, string[]> = {
  admin: ['admin', 'manage_users', 'view_dashboard', 'manage_leads', 'manage_tasks', 'manage_calendar', 'settings'],
  manager: ['view_dashboard', 'manage_leads', 'manage_tasks', 'manage_calendar', 'view_reports'],
  salesperson: ['view_dashboard', 'view_leads', 'manage_own_leads', 'view_tasks', 'manage_own_tasks', 'view_calendar', 'manage_own_calendar'],
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Verifique o token armazenado ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simular uma chamada API para autenticação
      // Em produção, isso seria uma chamada real para o backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Mock de resposta do servidor
      if (email === 'admin@uniga.com' && password === 'admin123') {
        const mockUser: User = {
          id: '1',
          name: 'Administrador',
          email: 'admin@uniga.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        // Armazenar tokens e dados do usuário
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (email === 'gerente@uniga.com' && password === 'gerente123') {
        const mockUser: User = {
          id: '2',
          name: 'Gerente',
          email: 'gerente@uniga.com',
          role: 'manager',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (email === 'vendedor@uniga.com' && password === 'vendedor123') {
        const mockUser: User = {
          id: '3',
          name: 'Vendedor',
          email: 'vendedor@uniga.com',
          role: 'salesperson',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
