import DOMPurify from "dompurify";

// Configuração baseada no ambiente
const isDevelopment = process.env.NODE_ENV === "development";

// Função de sanitização básica (fallback para casos onde DOMPurify não está disponível)
const basicSanitize = (input: string): string => {
  return input
    .replace(/[<>'"&]/g, (match) => {
      switch (match) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#x27;";
        case "&":
          return "&amp;";
        default:
          return match;
      }
    })
    .trim();
};

// Interface para configuração de sanitização
interface SanitizeOptions {
  allowHtml?: boolean;
  maxLength?: number;
  removeExtraSpaces?: boolean;
}

/**
 * Sanitiza strings para prevenir XSS e outros ataques
 * @param input String a ser sanitizada
 * @param options Opções de sanitização
 * @returns String sanitizada
 */
export const sanitizeInput = (
  input: string | undefined | null,
  options: SanitizeOptions = {}
): string => {
  if (!input) return "";

  const {
    allowHtml = false,
    maxLength = 1000,
    removeExtraSpaces = true,
  } = options;

  let sanitized = input;
  // Remover caracteres de controle (escape the control characters)
  sanitized = sanitized.replace(/[\u0000-\u001F\u007F]/g, "");

  // Usar DOMPurify se HTML for permitido, caso contrário sanitização básica
  if (allowHtml) {
    // Usar DOMPurify para sanitização segura de HTML
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
      ALLOWED_ATTR: [],
    });
  } else {
    // Sanitização básica removendo HTML
    sanitized = basicSanitize(sanitized);
  }

  // Remover espaços extras
  if (removeExtraSpaces) {
    sanitized = sanitized.replace(/\s+/g, " ").trim();
  }

  // Limitar comprimento
  if (maxLength && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
};

/**
 * Sanitiza dados de objetos recursivamente
 * @param data Objeto a ser sanitizado
 * @param options Opções de sanitização
 * @returns Objeto sanitizado
 */
export const sanitizeObject = (
  data: Record<string, unknown>,
  options: SanitizeOptions = {}
): Record<string, unknown> => {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value, options);
    } else if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)
    ) {
      sanitized[key] = sanitizeObject(
        value as Record<string, unknown>,
        options
      );
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string"
          ? sanitizeInput(item, options)
          : typeof item === "object" && item !== null
          ? sanitizeObject(item as Record<string, unknown>, options)
          : item
      );
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Valida e sanitiza email
 * @param email Email a ser validado
 * @returns Email sanitizado ou null se inválido
 */
export const sanitizeEmail = (
  email: string | undefined | null
): string | null => {
  if (!email) return null;

  const sanitized = sanitizeInput(email, { maxLength: 254 });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(sanitized) ? sanitized.toLowerCase() : null;
};

/**
 * Sanitiza número de telefone
 * @param phone Telefone a ser sanitizado
 * @returns Telefone sanitizado
 */
export const sanitizePhone = (phone: string | undefined | null): string => {
  if (!phone) return "";
  // Remove todos os caracteres exceto números, +, -, parênteses, espaços
  return phone.replace(/[^0-9+\-()s]/g, "").trim();
};

/**
 * Sanitiza URL
 * @param url URL a ser sanitizada
 * @returns URL sanitizada ou null se inválida
 */
export const sanitizeUrl = (url: string | undefined | null): string | null => {
  if (!url) return null;

  const sanitized = sanitizeInput(url, { maxLength: 2048 });

  try {
    const urlObj = new URL(sanitized);
    // Apenas permitir HTTP e HTTPS
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
};

/**
 * Remove caracteres perigosos de nomes de arquivos
 * @param filename Nome do arquivo
 * @returns Nome sanitizado
 */
export const sanitizeFilename = (
  filename: string | undefined | null
): string => {
  if (!filename) return "";
  return filename
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
    .replace(/^\.+/, "") // Remove pontos no início
    .trim()
    .substring(0, 255); // Limite de comprimento
};

/**
 * Detecta possíveis tentativas de SQL injection
 * @param input String a ser verificada
 * @returns true se suspeito
 */
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /('|(\\x27)|(\\x2D)|(\\x2D\\x2D))/i,
    /(\\x23|#)/i,
    /(\\x3B|;)/i,
    /(\\x22|")/i,
    /(\\x3D|=)/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i,
    /(script|javascript|vbscript|onload|onerror|onclick)/i,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};

/**
 * Detecta possíveis tentativas de XSS
 * @param input String a ser verificada
 * @returns true se suspeito
 */
export const detectXss = (input: string): boolean => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<embed[^>]*>/gi,
    /<object[^>]*>/gi,
    /<link[^>]*>/gi,
    /<meta[^>]*>/gi,
  ];

  return xssPatterns.some((pattern) => pattern.test(input));
};

// Configurações para produção
export const SECURITY_CONFIG = {
  development: {
    enableLogging: true,
    strictValidation: false,
    allowDebugHeaders: true,
  },
  production: {
    enableLogging: false,
    strictValidation: true,
    allowDebugHeaders: false,
  },
};

/**
 * Obtém configuração de segurança baseada no ambiente
 */
export const getSecurityConfig = () => {
  const env = process.env.NODE_ENV || "development";
  return (
    SECURITY_CONFIG[env as keyof typeof SECURITY_CONFIG] ||
    SECURITY_CONFIG.development
  );
};
