import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole } from "@/types";
import { useAppConfig } from "./AppConfigContext";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  dataMode: string | null; // Added dataMode to the context type
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

// Mapeamento de permissões baseado em papéis
// Administradores têm acesso a tudo na aplicação
const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "admin",
    "manage_users",
    "view_dashboard",
    "manage_leads",
    "view_leads",
    "manage_tasks",
    "view_tasks",
    "manage_calendar",
    "view_calendar",
    "settings",
    "view_reports",
    "manage_own_leads",
    "manage_own_tasks",
    "view_own_leads",
    "view_own_tasks",
    "manage_own_calendar",
  ],
  manager: [
    "view_dashboard",
    "manage_leads",
    "view_leads",
    "manage_tasks",
    "view_tasks",
    "manage_calendar",
    "view_calendar",
    "view_reports",
  ],
  salesperson: [
    "view_dashboard",
    "view_leads",
    "manage_own_leads",
    "view_tasks",
    "manage_own_tasks",
    "view_calendar",
    "manage_own_calendar",
  ],
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [dataMode, setDataMode] = useState<string | null>(null);
  const { config } = useAppConfig();

  // Verifique o token armazenado ao carregar a aplicação
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const mode = localStorage.getItem("dataMode");
    setDataMode(mode);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Simular uma chamada API para autenticação
      // Em produção, isso seria uma chamada real para o backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Mock de resposta do servidor
      if (
        email === `admin@${config.companyDomain}` &&
        password === "admin123"
      ) {
        const mockUser: User = {
          id: "1",
          name: "Administrador",
          email: `admin@${config.companyDomain}`,
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Armazenar tokens e dados do usuário
        localStorage.setItem("token", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (
        email === `gerente@${config.companyDomain}` &&
        password === "gerente123"
      ) {
        const mockUser: User = {
          id: "2",
          name: "Gerente",
          email: `gerente@${config.companyDomain}`,
          role: "manager",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("token", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
      } else if (
        email === `vendedor@${config.companyDomain}` &&
        password === "vendedor123"
      ) {
        const mockUser: User = {
          id: "3",
          name: "Vendedor",
          email: `vendedor@${config.companyDomain}`,
          role: "salesperson",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        localStorage.setItem("token", "mock-jwt-token");
        localStorage.setItem("user", JSON.stringify(mockUser));

        setUser(mockUser);
        setIsAuthenticated(true);
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Administradores sempre têm todas as permissões
    if (user.role === "admin") return true;

    // Para outros papéis, verifica na lista de permissões
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  // Provide dataMode in the context
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        isLoading,
        hasPermission,
        dataMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export type { AuthContextType };
