import { useState, useEffect, useCallback, useRef } from "react";
import { logger } from "@/lib/logger";
import { useErrorContext } from "@/contexts/ErrorContext";

interface ErrorLoggerOptions {
  componentName?: string;
  onError?: (error: Error, info: string | null) => void;
  reportToGlobal?: boolean;
}

/**
 * Hook para capturar e registrar erros em componentes funcionais
 * @param options Opções de configuração para o logger
 * @returns Funções e estado para gerenciar erros
 */
export function useErrorLogger(options?: ErrorLoggerOptions) {
  const [error, setError] = useState<Error | null>(null);
  const componentName = options?.componentName ?? "UnnamedComponent";
  const reportToGlobal = options?.reportToGlobal !== false;
  const errorContext = useErrorContext();
  const listenerId = useRef(
    `errorLogger_${componentName}_${Date.now()}`
  ).current;
  // Registrar listener global para obter erros propagados
  useEffect(() => {
    if (reportToGlobal) {
      errorContext.addErrorListener({
        id: listenerId,
        callback: (globalError) => {
          // Não duplicar erros que vieram deste mesmo componente
          if (!error || error.message !== globalError.message) {
            setError(globalError);
          }
        },
      });
    }

    return () => {
      if (reportToGlobal) {
        errorContext.removeErrorListener(listenerId);
      }
    };
  }, [error, listenerId, reportToGlobal, errorContext]);

  const handleCatch = useCallback(
    (err: unknown) => {
      const errorObject = err instanceof Error ? err : new Error(String(err));

      setError(errorObject);
      logger.error(`Erro em ${componentName}:`, errorObject);

      if (reportToGlobal) {
        errorContext.setGlobalError(errorObject);
      }

      if (options?.onError) {
        options.onError(errorObject, null);
      }
    },
    [options, componentName, reportToGlobal, errorContext]
  );

  const clearError = useCallback(() => {
    setError(null);
    if (reportToGlobal) {
      errorContext.clearError();
    }
  }, [reportToGlobal, errorContext]);
  return {
    error,
    isError: !!error,
    handleCatch,
    clearError,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logInfo: (message: string, data?: any) => {
      logger.info(`[${componentName}] ${message}`, data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logDebug: (message: string, data?: any) => {
      logger.debug(`[${componentName}] ${message}`, data);
    },
  };
}
