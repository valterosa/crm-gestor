import React from "react";
import { AlertCircle, Code, FileText, Settings, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import DebugPanel from "@/components/ui/debug-panel";
import { useDebugMode } from "@/hooks/use-debug-mode";
import { useErrorContext } from "@/contexts/ErrorContext";
import { logger } from "@/lib/logger";

// Interface para extender a API de Performance com a propriedade memory
interface ExtendedPerformance extends Performance {
  memory?: {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
  };
}

/**
 * Componente de debug global que pode ser adicionado ao layout principal
 * para fornecer informações de debug em toda a aplicação.
 */
const GlobalDebugTools: React.FC = () => {
  const { isDebugMode, toggleDebugMode } = useDebugMode();
  const { globalError } = useErrorContext();
  if (!isDebugMode) {
    // Não renderiza nenhum botão, já que agora o controle está na página de configurações
    return null;
  }
  
  // Informações do sistema e ambiente
  const systemInfo = {
    app: {
      versão: process.env.VITE_APP_VERSION ?? "1.0.0",
      ambiente: process.env.NODE_ENV ?? "development",
      buildDate: process.env.VITE_BUILD_DATE ?? new Date().toISOString(),
    },
    navegador: {
      userAgent: navigator.userAgent,
      idioma: navigator.language,
      online: navigator.onLine,
      cookies: navigator.cookieEnabled,
      janela: `${window.innerWidth}x${window.innerHeight}px`,
    },
    runtime: {
      timestamp: new Date().toISOString(),
      memória: (performance as ExtendedPerformance).memory
        ? `${Math.round(
            (performance as ExtendedPerformance).memory?.usedJSHeapSize /
              1048576
          )}MB / ${Math.round(
            (performance as ExtendedPerformance).memory?.jsHeapSizeLimit /
              1048576
          )}MB`
        : "Não disponível",
      paginaCarregadaEm: performance.now().toFixed(2) + "ms",
    },
    erro: globalError
      ? {
          mensagem: globalError.message,
          stack: globalError.stack?.split("\n") || [],
        }
      : "Nenhum erro registrado",
  };

  const handleForceError = () => {
    try {
      throw new Error("Erro forçado via painel de debug global");
    } catch (error) {
      logger.error("Erro forçado:", error);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={handleForceError}
        >
          <AlertCircle className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Forçar erro</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
          onClick={() => logger.captureErrorDetails(15000)}
        >
          <Code className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Capturar logs</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-slate-900 border-slate-700 text-red-400 hover:bg-slate-800"
          onClick={toggleDebugMode}
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Desativar debug</span>
        </Button>
      </div>

      <DebugPanel
        title="Debug Sistema"
        data={systemInfo}
        position="bottom-left"
        initiallyExpanded={false}
      />
    </div>
  );
};

export default GlobalDebugTools;
