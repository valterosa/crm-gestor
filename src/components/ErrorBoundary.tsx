import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });

    // Aqui você poderia enviar o erro para um serviço de log
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 border border-red-300 bg-red-50 rounded-lg max-w-3xl mx-auto my-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-1" />
            <div>
              <h2 className="text-xl font-medium text-red-800 mb-2">
                Algo deu errado
              </h2>
              <details className="bg-white p-4 rounded border border-red-200 mb-4">
                <summary className="font-medium cursor-pointer mb-2">
                  Detalhes do erro
                </summary>
                <pre className="whitespace-pre-wrap text-sm text-red-800 overflow-auto p-2 bg-red-50 rounded">
                  {this.state.error?.toString()}
                </pre>
                {this.state.errorInfo && (
                  <>
                    <p className="font-medium mt-4 mb-2">Stack trace:</p>
                    <pre className="whitespace-pre-wrap text-xs text-gray-700 overflow-auto p-2 bg-gray-50 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </>
                )}
              </details>              <Button
                onClick={() => { window.location.reload(); }}
                variant="destructive"
              >
                Recarregar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
