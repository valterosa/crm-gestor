import { useState, useEffect } from "react";

interface UseDebugModeOptions {
  enableUrlParam?: string;
  defaultValue?: boolean;
  localStorageKey?: string;
}

/**
 * Hook para gerenciar o modo de debug em componentes
 *
 * @param options Configurações do modo de debug
 * @returns Estado do modo de debug e funções para manipulá-lo
 */
export function useDebugMode(options: UseDebugModeOptions = {}) {
  const {
    enableUrlParam = "debug",
    defaultValue = false,
    localStorageKey = "app_debug_mode",
  } = options;

  // Inicializa o estado com base na URL ou localStorage
  const initDebugMode = (): boolean => {
    // Verificar URL params
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has(enableUrlParam)) {
        // Se URL tem o parâmetro, guarda no localStorage também
        localStorage.setItem(localStorageKey, "true");
        return true;
      }

      // Verificar localStorage
      const storedValue = localStorage.getItem(localStorageKey);
      if (storedValue === "true") {
        return true;
      }
    }

    return defaultValue;
  };

  const [isDebugMode, setIsDebugMode] = useState<boolean>(initDebugMode);

  // Sincronize quando URL mudar
  useEffect(() => {
    const handleUrlChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has(enableUrlParam)) {
        setIsDebugMode(true);
        localStorage.setItem(localStorageKey, "true");
      }
    };

    // Adicionar listener para mudanças na URL
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, [enableUrlParam, localStorageKey]);

  // Funções para manipular o modo debug
  const enableDebugMode = () => {
    setIsDebugMode(true);
    localStorage.setItem(localStorageKey, "true");
  };

  const disableDebugMode = () => {
    setIsDebugMode(false);
    localStorage.removeItem(localStorageKey);

    // Remover da URL se presente
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has(enableUrlParam)) {
        urlParams.delete(enableUrlParam);
        const newUrl =
          window.location.pathname +
          (urlParams.toString() ? `?${urlParams.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }
    }
  };

  const toggleDebugMode = () => {
    if (isDebugMode) {
      disableDebugMode();
    } else {
      enableDebugMode();
    }
  };

  // Adicionar parâmetro na URL
  const addUrlParam = () => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set(enableUrlParam, "true");
      const newUrl = window.location.pathname + `?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
  };

  return {
    isDebugMode,
    enableDebugMode,
    disableDebugMode,
    toggleDebugMode,
    addUrlParam,
  };
}
