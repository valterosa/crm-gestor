/**
 * Configurações de headers de segurança para a aplicação CRM
 * Este arquivo define headers importantes para proteção contra ataques comuns
 */

export interface SecurityHeaders {
  [key: string]: string;
}

/**
 * Headers de segurança recomendados para produção
 */
export const SECURITY_HEADERS: SecurityHeaders = {
  // Previne ataques de clickjacking
  "X-Frame-Options": "DENY",

  // Previne MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Ativa proteção XSS do browser
  "X-XSS-Protection": "1; mode=block",

  // Policy de referrer mais restritiva
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Força HTTPS (em produção)
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",

  // Controla recursos que podem ser carregados
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Permitir scripts inline durante desenvolvimento
    "style-src 'self' 'unsafe-inline'", // Permitir estilos inline durante desenvolvimento
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),

  // Remove headers que podem expor informações
  Server: "", // Remove informações do servidor
  "X-Powered-By": "", // Remove informações da tecnologia
};

/**
 * Headers específicos para desenvolvimento (mais permissivos)
 */
export const DEV_SECURITY_HEADERS: SecurityHeaders = {
  "X-Frame-Options": "SAMEORIGIN", // Mais permissivo em dev
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Permite eval para dev tools
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: http:", // Permite HTTP em dev
    "font-src 'self' data:",
    "connect-src 'self' ws: wss:", // Permite WebSockets para HMR
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
};

/**
 * Configuração de CORS para API
 */
export const CORS_CONFIG = {
  development: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  },
  production: {
    origin: process.env.REACT_APP_ALLOWED_ORIGINS?.split(",") || [
      "https://yourdomain.com",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

/**
 * Obtém headers de segurança baseado no ambiente
 */
export const getSecurityHeaders = (): SecurityHeaders => {
  const env = process.env.NODE_ENV || "development";
  return env === "production" ? SECURITY_HEADERS : DEV_SECURITY_HEADERS;
};

/**
 * Aplica headers de segurança a uma resposta
 * Para uso em middleware do servidor
 */
export const applySecurityHeaders = (headers: SecurityHeaders) => {
  return (
    req: unknown,
    res: { setHeader: (key: string, value: string) => void },
    next: () => void
  ) => {
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        res.setHeader(key, value);
      }
    });
    next();
  };
};

/**
 * Validação de configurações de segurança
 */
export const validateSecurityConfig = (): string[] => {
  const errors: string[] = [];

  if (process.env.NODE_ENV === "production") {
    if (!process.env.REACT_APP_ENCRYPTION_KEY) {
      errors.push("REACT_APP_ENCRYPTION_KEY não definida");
    }

    if (!process.env.REACT_APP_JWT_SECRET) {
      errors.push("REACT_APP_JWT_SECRET não definida");
    }

    if (process.env.REACT_APP_ENCRYPTION_KEY === "dev-key-2024") {
      errors.push("Chave de criptografia de desenvolvimento em produção");
    }
  }

  return errors;
};

/**
 * Configurações de cookies seguros
 */
export const SECURE_COOKIE_OPTIONS = {
  development: {
    httpOnly: true,
    secure: false, // HTTP em desenvolvimento
    sameSite: "lax" as const,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
  },
  production: {
    httpOnly: true,
    secure: true, // HTTPS obrigatório
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 1000, // 1 hora
    domain: process.env.REACT_APP_COOKIE_DOMAIN,
  },
};

/**
 * Lista de IPs permitidos (whitelist) para administração
 */
export const ADMIN_IP_WHITELIST = [
  "127.0.0.1",
  "::1",
  // Adicionar IPs de administradores em produção
];

/**
 * Configurações de logging de segurança
 */
export const SECURITY_LOGGING = {
  logFailedLogins: true,
  logAdminActions: true,
  logDataExports: true,
  logSensitiveOperations: true,
  logRetentionDays: 30,
};
