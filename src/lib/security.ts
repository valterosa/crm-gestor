<<<<<<< Updated upstream
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
=======
// Security constants and utilities
import { User } from "../types";

export const SECURITY_CONFIG = {
  // Remove hardcoded credentials completely
  AUTH: {
    TOKEN_EXPIRY: "24h",
    REFRESH_TOKEN_EXPIRY: "7d",
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  },

  // Debug mode controls
  DEBUG: {
    ENABLED: process.env.NODE_ENV !== "production",
    SHOW_PERFORMANCE_METRICS: false,
    LOG_LEVEL: process.env.NODE_ENV === "production" ? "error" : "debug",
  },

  // Session management
  SESSION: {
    SECURE: true,
    HTTP_ONLY: true,
    SAME_SITE: "strict" as const,
    MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  },

  // Content Security Policy
  CSP: {
    DEFAULT_SRC: "'self'",
    SCRIPT_SRC: "'self'",
    STYLE_SRC: "'self' 'unsafe-inline'",
    IMG_SRC: "'self' data: https:",
    FONT_SRC: "'self' data:",
    CONNECT_SRC: "'self' https:",
    FRAME_ANCESTORS: "'none'",
  },
};

// Secure token storage utility
export class SecureStorage {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_KEY = "user_data";

  // Use sessionStorage instead of localStorage for tokens
  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      // In production, this should be handled by httpOnly cookies
      sessionStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static removeToken(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_KEY);
    }
  }
  static setUser(user: User): void {
    if (typeof window !== "undefined") {
      // Only store non-sensitive user data
      const sanitizedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      sessionStorage.setItem(this.USER_KEY, JSON.stringify(sanitizedUser));
    }
  }

  static getUser(): User | null {
    if (typeof window !== "undefined") {
      const userData = sessionStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }
}

// Input sanitization utilities
export const sanitizeInput = {
  // Remove HTML tags and scripts
  html: (input: string): string => {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  },

  // Escape special characters
  escape: (input: string): string => {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  },

  // Validate email format
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 100;
  },

  // Password strength validation
  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[@$!%*?&]/.test(password)) {
      errors.push(
        "Password must contain at least one special character (@$!%*?&)"
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  },
};

// Rate limiting for client-side
export class ClientRateLimit {
  private static attempts: Map<string, { count: number; lastAttempt: number }> =
    new Map();

  static checkAttempt(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has expired
    if (now - attempt.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (attempt.count >= maxAttempts) {
      return false;
    }

    // Increment attempt
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }

  static reset(key: string): void {
    this.attempts.delete(key);
  }
}
>>>>>>> Stashed changes
