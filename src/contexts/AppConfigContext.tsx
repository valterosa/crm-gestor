import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";

// Definição do tipo para a configuração da aplicação
interface AppConfig {
  companyName: string;
  companyEmail: string;
  companyDomain: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
}

// Tipo do contexto
interface AppConfigContextType {
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  isLoading: boolean;
}

// Valores padrão (que podem ser sobrescritos pela configuração do usuário)
const DEFAULT_CONFIG: AppConfig = {
  companyName: "Empresa",
  companyEmail: "contato@empresa.com",
  companyDomain: "empresa.com",
  primaryColor: "#0045AC", // Cor primária padrão
  secondaryColor: "#00A3E0", // Cor secundária padrão
  accentColor: "#EE3124", // Cor de destaque padrão
  logoUrl: "/logo.png",
};

// Criar o contexto
const AppConfigContext = createContext<AppConfigContextType | undefined>(
  undefined
);

export { AppConfigContext };

interface AppConfigProviderProps {
  children: ReactNode;
}

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);

  // Carregar configurações salvas quando o componente montar
  useEffect(() => {
    const loadConfig = () => {
      try {
        const savedConfig = localStorage.getItem("appConfig");

        if (savedConfig) {
          setConfig({
            ...DEFAULT_CONFIG,
            ...JSON.parse(savedConfig),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Função para atualizar a configuração
  const updateConfig = (newConfig: Partial<AppConfig>) => {
    setConfig((prevConfig) => {
      const updatedConfig = {
        ...prevConfig,
        ...newConfig,
      };

      // Salvar no localStorage
      localStorage.setItem("appConfig", JSON.stringify(updatedConfig));

      return updatedConfig;
    });
  };

  return (
    <AppConfigContext.Provider value={{ config, updateConfig, isLoading }}>
      {children}
    </AppConfigContext.Provider>
  );
};

// Hook personalizado para acessar o contexto
export const useAppConfig = () => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error(
      "useAppConfig deve ser usado dentro de um AppConfigProvider"
    );
  }
  return context;
};
