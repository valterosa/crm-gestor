import React, { useState, useEffect } from "react";
import { X, Bug, AlertCircle, RefreshCw, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { logger } from "@/lib/logger";
import { useErrorContext } from "@/contexts/ErrorContext";

interface DebugPanelProps {
  title?: string;
  data?: Record<string, any>;
  position?: "top-right" | "bottom-right" | "bottom-left" | "top-left";
  initiallyExpanded?: boolean;
  showCaptureButton?: boolean;
  captureTime?: number;
}

/**
 * Componente de painel de depuração reutilizável.
 * Use este componente envolvido em uma condição de renderização baseada em uma flag de depuração.
 */
const DebugPanel: React.FC<DebugPanelProps> = ({
  title = "Debug Info",
  data = {},
  position = "bottom-right",
  initiallyExpanded = false,
  showCaptureButton = true,
  captureTime = 10000,
}) => {
  const [isOpen, setIsOpen] = useState(initiallyExpanded);
  const [isCapturing, setIsCapturing] = useState(false);
  const { globalError, clearError } = useErrorContext();
  const [localData, setLocalData] = useState<Record<string, any>>({});

  // Atualizar dados locais quando os dados externos mudarem
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Posicionamento da caixa de debug
  const positionClasses = {
    "top-right": "top-4 right-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-left": "top-4 left-4",
  };

  // Iniciar captura de logs
  const handleCaptureLogs = () => {
    setIsCapturing(true);

    logger.captureErrorDetails(captureTime);

    // Cronômetro visual de contagem regressiva
    setTimeout(() => {
      setIsCapturing(false);
    }, captureTime);
  };

  // Copiar dados para área de transferência
  const copyDataToClipboard = () => {
    const dataStr = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        environment: {
          url: window.location.href,
          userAgent: navigator.userAgent,
          screenSize: `${window.innerWidth}x${window.innerHeight}`,
        },
        error: globalError
          ? {
              message: globalError.message,
              stack: globalError.stack,
            }
          : null,
        debugData: localData,
      },
      null,
      2
    );

    navigator.clipboard
      .writeText(dataStr)
      .then(() => {
        // Mostrar feedback visual
        const btn = document.getElementById("debug-copy-btn");
        if (btn) {
          btn.classList.add("bg-green-500");
          setTimeout(() => btn.classList.remove("bg-green-500"), 1000);
        }
      })
      .catch((err) => console.error("Falha ao copiar dados:", err));
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-80 bg-slate-900/90 backdrop-blur-sm text-white rounded-lg shadow-lg overflow-hidden border border-slate-700"
      >
        <CollapsibleTrigger asChild>
          <div className="p-3 flex justify-between items-center cursor-pointer hover:bg-slate-800">
            <div className="flex items-center">
              <Bug className="h-5 w-5 mr-2 text-yellow-400" />
              <span className="font-medium">{title}</span>
              {globalError && (
                <div className="ml-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                </div>
              )}
            </div>
            <div className="flex items-center">
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <span className="text-xs bg-slate-700 px-2 py-0.5 rounded-full">
                  {Object.keys(localData).length} items
                </span>
              )}
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="p-3 border-t border-slate-700 max-h-96 overflow-y-auto">
            {globalError && (
              <div className="mb-3 p-2 bg-red-900/50 rounded border border-red-700">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-red-300">
                    Erro Detectado
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-red-300 hover:text-white hover:bg-red-800"
                    onClick={clearError}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-red-200 mt-1">
                  {globalError.message}
                </p>
                <details className="mt-1">
                  <summary className="text-xs cursor-pointer hover:text-red-300">
                    Stack trace
                  </summary>
                  <pre className="text-xs p-1 mt-1 bg-red-950 rounded whitespace-pre-wrap overflow-x-auto">
                    {globalError.stack}
                  </pre>
                </details>
              </div>
            )}

            {Object.entries(localData).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(localData).map(([key, value]) => (
                  <div key={key} className="p-2 bg-slate-800 rounded">
                    <h4 className="text-xs font-medium text-slate-300">
                      {key}
                    </h4>
                    <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap text-slate-200">
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value, null, 2)
                        : String(value)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400 text-center py-2">
                Nenhum dado de depuração disponível
              </div>
            )}
          </div>

          <div className="p-2 border-t border-slate-700 flex justify-between gap-2">
            {showCaptureButton && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                onClick={handleCaptureLogs}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    <span>Capturando...</span>
                  </>
                ) : (
                  <>
                    <Bug className="h-3 w-3 mr-1" />
                    <span>Capturar logs</span>
                  </>
                )}
              </Button>
            )}

            <Button
              id="debug-copy-btn"
              variant="outline"
              size="sm"
              className="h-8 text-xs bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 transition-colors"
              onClick={copyDataToClipboard}
            >
              <Clipboard className="h-3 w-3 mr-1" />
              <span>Copiar dados</span>
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default DebugPanel;
