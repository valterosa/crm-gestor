/* 
  Este arquivo contém funções e utilidades para aplicar o tema da empresa
  Este arquivo será responsável por gerar classes CSS dinâmicas com base nas configurações da empresa
*/

import { useEffect } from "react";
import { useAppConfig } from "@/contexts/AppConfigContext";
import { hexToHSL } from "@/lib/color-utils";

// Hook para aplicar o tema da empresa
export const useCompanyTheme = () => {
  const { config } = useAppConfig();

  useEffect(() => {
    // Obtém a raiz do documento para aplicar variáveis CSS
    const root = document.documentElement;

    // Converte e aplica as cores primárias
    if (config.primaryColor) {
      const primaryHSL = hexToHSL(config.primaryColor);
      root.style.setProperty("--primary", primaryHSL);
    }

    // Converte e aplica as cores secundárias
    if (config.secondaryColor) {
      const secondaryHSL = hexToHSL(config.secondaryColor);
      root.style.setProperty("--secondary", secondaryHSL);
    }

    // Converte e aplica as cores de destaque/acento
    if (config.accentColor) {
      const accentHSL = hexToHSL(config.accentColor);
      root.style.setProperty("--accent", accentHSL);
    }

    // Atualiza o favicon se houver um favicon personalizado
    const favicon = document.querySelector(
      "link[rel='icon']"
    ) as HTMLLinkElement;
    if (favicon && config.logoUrl) {
      favicon.href = config.logoUrl;
    }

    // Atualiza o título da página
    if (config.companyName) {
      document.title = `CRM - ${config.companyName}`;
    }
  }, [config]);
};
