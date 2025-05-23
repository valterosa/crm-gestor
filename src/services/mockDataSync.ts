import { mockUsers } from "./mockData";
import { useAppConfig } from "@/contexts/AppConfigContext";
import { useEffect } from "react";

// Esta função substitui os domínios de email do mock de usuários pelo domínio da empresa configurada
export const useSyncMockData = () => {
  const { config } = useAppConfig();

  useEffect(() => {
    if (config.companyDomain) {
      // Atualiza os emails dos usuários mockados para usar o domínio configurado
      for (const user of mockUsers) {
        if (user.email.includes("@empresa.com")) {
          const username = user.email.split("@")[0];
          user.email = `${username}@${config.companyDomain}`;
        }
      }
    }
  }, [config.companyDomain]);

  return null;
};

// Componente para aplicar a sincronização
export const MockDataSynchronizer = () => {
  useSyncMockData();
  return null;
};
