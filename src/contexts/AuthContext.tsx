import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { User, UserRole } from "@/types";
import { useAppConfig } from "./AppConfigContext";
import {
  SecureStorage,
  generateToken,
  verifyToken,
  globalRateLimiter,
  getCryptoConfig,
} from "@/lib/crypto";
import { validateData, loginSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/security";

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

  // Memoize stable instances
  const secureStorage = useMemo(() => SecureStorage.getInstance(), []);
  const cryptoConfig = useMemo(() => getCryptoConfig(), []);
  // Verifique o token armazenado ao carregar a aplicação
  useEffect(() => {
    const token = secureStorage.getItem<string>(
      "authToken",
      cryptoConfig.useEncryption
    );
    const storedUser = secureStorage.getItem<User>(
      "user",
      cryptoConfig.useEncryption
    );

    if (token && storedUser) {
      // Verificar se o token ainda é válido
      const payload = verifyToken(token);
      if (
        payload &&
        payload.exp &&
        typeof payload.exp === "number" &&
        payload.exp > Math.floor(Date.now() / 1000)
      ) {
        setIsAuthenticated(true);
        setUser(storedUser);
      } else {
        // Token expirado, limpar dados
        secureStorage.removeItem("authToken");
        secureStorage.removeItem("user");
      }
    }

    setIsLoading(false);
  }, [secureStorage, cryptoConfig]);

  useEffect(() => {
    const mode = localStorage.getItem("dataMode");
    setDataMode(mode);
  }, []);
  const login = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      // Sanitizar inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);

      // Validar com Zod
      const validationResult = validateData(loginSchema, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (!validationResult.success) {
        throw new Error(validationResult.errors[0] || "Dados inválidos");
      }

      // Rate limiting
      if (
        !globalRateLimiter.isAllowed(
          sanitizedEmail,
          cryptoConfig.rateLimitAttempts,
          cryptoConfig.rateLimitWindow
        )
      ) {
        throw new Error(
          "Muitas tentativas de login. Tente novamente mais tarde."
        );
      }

      // Simular uma chamada API para autenticação
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock de resposta do servidor com credenciais validadas
      let mockUser: User | null = null;

      if (
        sanitizedEmail === `admin@${config.companyDomain}` &&
        sanitizedPassword === "admin123"
      ) {
        mockUser = {
          id: "1",
          name: "Administrador",
          email: `admin@${config.companyDomain}`,
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (
        sanitizedEmail === `gerente@${config.companyDomain}` &&
        sanitizedPassword === "gerente123"
      ) {
        mockUser = {
          id: "2",
          name: "Gerente",
          email: `gerente@${config.companyDomain}`,
          role: "manager",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (
        sanitizedEmail === `vendedor@${config.companyDomain}` &&
        sanitizedPassword === "vendedor123"
      ) {
        mockUser = {
          id: "3",
          name: "Vendedor",
          email: `vendedor@${config.companyDomain}`,
          role: "salesperson",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      if (!mockUser) {
        throw new Error("Credenciais inválidas");
      }

      // Gerar token seguro
      const token = generateToken({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });

      // Armazenar de forma segura
      secureStorage.setItem("authToken", token, cryptoConfig.useEncryption);
      secureStorage.setItem("user", mockUser, cryptoConfig.useEncryption);

      // Resetar rate limiter em caso de sucesso
      globalRateLimiter.reset(sanitizedEmail);

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    secureStorage.removeItem("authToken");
    secureStorage.removeItem("user");
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
      {children}{" "}
    </AuthContext.Provider>
  );
};

export type { AuthContextType };
