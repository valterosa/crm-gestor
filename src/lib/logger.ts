type LogLevel = "error" | "warn" | "info" | "debug";

const isDevMode = process.env.NODE_ENV === "development";

export const logger = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: (message: string, ...args: any[]) => {
    if (isDevMode) console.info(`[INFO] ${message}`, ...args);
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug: (message: string, ...args: any[]) => {
    if (isDevMode) console.debug(`[DEBUG] ${message}`, ...args);
  },
  group: (name: string, fn: () => void) => {
    if (isDevMode) {
      console.group(name);
      fn();
      console.groupEnd();
    }
  },
  // Função especializada para registrar erros de estado de componente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: (componentName: string, data: any) => {
    if (isDevMode) {
      console.group(`Component: ${componentName}`);
      console.log("Data:", data);
      console.groupEnd();
    }
  },  // Função para capturar logs por um período
  captureErrorDetails: (duration = 5000) => {
    return captureErrorDetails(duration);
  },
};

/**
 * Captura os erros e logs do console por um período especificado
 * e copia para a área de transferência para facilitar o compartilhamento.
 * @param duration Duração em milissegundos para capturar logs (padrão: 5000ms)
 * @returns Mensagem indicando que a captura foi iniciada
 */
export function captureErrorDetails(duration = 5000) {
  const consoleOutput: string[] = [];
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleLog = console.log;

  // Sobrescrever temporariamente os métodos do console
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.error = function (...args: any[]) {
    consoleOutput.push(`ERROR: ${args.map((arg) => stringify(arg)).join(" ")}`);
    originalConsoleError.apply(console, args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.warn = function (...args: any[]) {
    consoleOutput.push(`WARN: ${args.map((arg) => stringify(arg)).join(" ")}`);
    originalConsoleWarn.apply(console, args);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log = function (...args: any[]) {
    consoleOutput.push(`LOG: ${args.map((arg) => stringify(arg)).join(" ")}`);
    originalConsoleLog.apply(console, args);
  };

  // Função auxiliar para converter objetos em strings, evitando erros de circular reference
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function stringify(obj: any): string {
    try {
      return typeof obj === "object" ? JSON.stringify(obj) : String(obj);
    } catch (e) {
      return String(obj);
    }
  }

  // Restaurar após o tempo definido
  setTimeout(() => {
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;

    // Copiar para clipboard
    const errorReport = `
ERROR REPORT - ${new Date().toISOString()}
Browser: ${navigator.userAgent}
URL: ${window.location.href}
----- CONSOLE OUTPUT -----
${consoleOutput.join("\n")}
----- END REPORT -----
`;

    navigator.clipboard
      .writeText(errorReport)
      .then(() =>
        alert(
          "Relatório de erro copiado para a área de transferência. Cole para o assistente."
        )
      )      .catch((err: unknown) => {
        console.error("Não foi possível copiar o relatório:", err);
        alert(
          "Não foi possível copiar automaticamente. Abra o console e copie os logs manualmente."
        );
      });
  }, duration);

  return "Capturando logs por " + duration / 1000 + " segundos...";
}

// Registrar a função no objeto window para facilitar o acesso
if (typeof window !== "undefined") {
  (
    window as Window & { captureErrorReport?: typeof captureErrorDetails }
  ).captureErrorReport = captureErrorDetails;
}
