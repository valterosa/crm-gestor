import React, { createContext, useContext, useEffect, useState } from "react";
import { logger } from "@/lib/logger";

interface ErrorContextProps {
  globalError: Error | null;
  setGlobalError: (error: Error | null) => void;
  addErrorListener: (listener: ErrorListener) => void;
  removeErrorListener: (listenerId: string) => void;
  clearError: () => void;
}

type ErrorListener = {
  id: string;
  callback: (error: Error) => void;
};

const ErrorContext = createContext<ErrorContextProps | undefined>(undefined);

export function ErrorProvider({ children }: { children: React.ReactNode }) {
  const [globalError, setGlobalError] = useState<Error | null>(null);
  const [listeners, setListeners] = useState<ErrorListener[]>([]);

  // Gerenciar handlers de erro globais
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      const error = new Error(`Global: ${event.message}`);
      logger.error("Erro global não capturado:", error);
      setGlobalError(error);

      // Notificar listeners
      listeners.forEach((listener) => {
        try {
          listener.callback(error);
        } catch (err) {
          logger.error(`Erro ao executar listener ${listener.id}:`, err);
        }
      });

      // Prevenir o comportamento padrão
      event.preventDefault();
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(`Promessa rejeitada: ${String(event.reason)}`);

      logger.error("Promessa rejeitada não tratada:", error);
      setGlobalError(error);

      // Notificar listeners
      listeners.forEach((listener) => {
        try {
          listener.callback(error);
        } catch (err) {
          logger.error(`Erro ao executar listener ${listener.id}:`, err);
        }
      });

      // Prevenir o comportamento padrão
      event.preventDefault();
    };

    // Registrar os handlers globais
    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [listeners]);

  const addErrorListener = (listener: ErrorListener) => {
    setListeners((prev) => [...prev, listener]);
  };

  const removeErrorListener = (listenerId: string) => {
    setListeners((prev) => prev.filter((l) => l.id !== listenerId));
  };

  const clearError = () => {
    setGlobalError(null);
  };

  const contextValue: ErrorContextProps = {
    globalError,
    setGlobalError,
    addErrorListener,
    removeErrorListener,
    clearError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

export function useErrorContext() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error(
      "useErrorContext deve ser usado dentro de um ErrorProvider"
    );
  }
  return context;
}
