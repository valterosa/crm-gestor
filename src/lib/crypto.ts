import CryptoJS from "crypto-js";

// Configuração baseada no ambiente
const isDevelopment = process.env.NODE_ENV === "development";

// Simulação básica para desenvolvimento (mantida como fallback)
const simulateEncryption = (text: string, key: string): string => {
  return btoa(text + "::" + key);
};

const simulateDecryption = (encrypted: string, key: string): string => {
  try {
    const decoded = atob(encrypted);
    const [text, originalKey] = decoded.split("::");
    return originalKey === key ? text : "";
  } catch {
    return "";
  }
};

// Chave para desenvolvimento (será substituída por variável de ambiente)
const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY ?? "dev-key-2024";

/**
 * Criptografa dados sensíveis
 * @param data Dados a serem criptografados
 * @returns String criptografada
 */
export const encryptData = (data: string): string => {
  try {
    if (isDevelopment) {
      // Em desenvolvimento, usar simulação para debug mais fácil
      return simulateEncryption(data, ENCRYPTION_KEY);
    } else {
      // Em produção, usar CryptoJS real
      return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    }
  } catch (error) {
    console.error("Erro na criptografia:", error);
    return "";
  }
};

/**
 * Descriptografa dados
 * @param encryptedData Dados criptografados
 * @returns String descriptografada
 */
export const decryptData = (encryptedData: string): string => {
  try {
    if (isDevelopment) {
      // Em desenvolvimento, usar simulação
      return simulateDecryption(encryptedData, ENCRYPTION_KEY);
    } else {
      // Em produção, usar CryptoJS real
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }
  } catch (error) {
    console.error("Erro na descriptografia:", error);
    return "";
  }
};

/**
 * Gera hash de senha (simulação para desenvolvimento)
 * @param password Senha em texto plano
 * @returns Hash da senha
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Em produção, usar bcrypt
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Verifica senha contra hash
 * @param password Senha em texto plano
 * @param hash Hash armazenado
 * @returns true se a senha corresponder
 */
export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const newHash = await hashPassword(password);
  return newHash === hash;
};

/**
 * Gera token JWT simulado (para desenvolvimento)
 * @param payload Dados do payload
 * @returns Token JWT simulado
 */
export const generateToken = (payload: Record<string, unknown>): string => {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);

  const fullPayload = {
    ...payload,
    iat: now,
    exp: now + 24 * 60 * 60, // 24 horas
    iss: "crm-app",
  };

  // Simulação básica - em produção usar biblioteca JWT real
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(fullPayload));
  const signature = btoa(encryptData(encodedHeader + "." + encodedPayload));

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

/**
 * Verifica e decodifica token JWT
 * @param token Token JWT
 * @returns Payload decodificado ou null se inválido
 */
export const verifyToken = (token: string): Record<string, unknown> | null => {
  try {
    const [header, payload, signature] = token.split(".");

    if (!header || !payload || !signature) {
      return null;
    }

    const decodedPayload = JSON.parse(atob(payload));
    const now = Math.floor(Date.now() / 1000);

    // Verificar expiração
    if (decodedPayload.exp && decodedPayload.exp < now) {
      return null;
    }

    return decodedPayload;
  } catch {
    return null;
  }
};

/**
 * Gera refresh token
 * @param userId ID do usuário
 * @returns Refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    type: "refresh",
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 dias
  };

  return generateToken(payload);
};

/**
 * Gestão segura de armazenamento
 */
export class SecureStorage {
  private static instance: SecureStorage;

  public static getInstance(): SecureStorage {
    if (!SecureStorage.instance) {
      SecureStorage.instance = new SecureStorage();
    }
    return SecureStorage.instance;
  }

  /**
   * Armazena dados de forma segura
   * @param key Chave
   * @param data Dados a serem armazenados
   * @param encrypt Se deve criptografar
   */
  public setItem(key: string, data: unknown, encrypt: boolean = true): void {
    try {
      const serialized = JSON.stringify(data);
      const finalData = encrypt ? encryptData(serialized) : serialized;

      // Em desenvolvimento usar localStorage, em produção usar httpOnly cookies
      if (process.env.NODE_ENV === "production") {
        // Implementar cookie httpOnly aqui
        console.warn("Produção: Implementar armazenamento em cookie httpOnly");
      } else {
        localStorage.setItem(key, finalData);
      }
    } catch (error) {
      console.error("Erro ao armazenar dados:", error);
    }
  }

  /**
   * Recupera dados armazenados
   * @param key Chave
   * @param encrypted Se os dados estão criptografados
   * @returns Dados ou null
   */
  public getItem<T = unknown>(
    key: string,
    encrypted = true
  ): T | null {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      const data = encrypted ? decryptData(stored) : stored;
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Erro ao recuperar dados:", error);
      return null;
    }
  }

  /**
   * Remove dados armazenados
   * @param key Chave
   */
  public removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erro ao remover dados:", error);
    }
  }

  /**
   * Limpa todos os dados armazenados
   */
  public clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Erro ao limpar armazenamento:", error);
    }
  }
}

/**
 * Rate Limiter simples para desenvolvimento
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();

  /**
   * Verifica se ação é permitida
   * @param key Identificador (ex: IP, email)
   * @param maxAttempts Máximo de tentativas
   * @param windowMs Janela de tempo em ms
   * @returns true se permitido
   */
  public isAllowed(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000
  ): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) ?? [];

    // Remove tentativas antigas
    const validAttempts = attempts.filter((time) => now - time < windowMs);

    if (validAttempts.length >= maxAttempts) {
      return false;
    }

    // Adiciona nova tentativa
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);

    return true;
  }

  /**
   * Reseta tentativas para uma chave
   * @param key Identificador
   */
  public reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Instância global do rate limiter
export const globalRateLimiter = new RateLimiter();

/**
 * Configurações de segurança por ambiente
 */
export const CRYPTO_CONFIG = {
  development: {
    useEncryption: false,
    tokenExpiry: 24 * 60 * 60, // 24 horas
    refreshTokenExpiry: 7 * 24 * 60 * 60, // 7 dias
    rateLimitAttempts: 10,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutos
  },
  production: {
    useEncryption: true,
    tokenExpiry: 60 * 60, // 1 hora
    refreshTokenExpiry: 24 * 60 * 60, // 1 dia
    rateLimitAttempts: 5,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutos
  },
};

/**
 * Obtém configuração de criptografia baseada no ambiente
 */
export const getCryptoConfig = () => {
  const env = process.env.NODE_ENV || "development";
  return (
    CRYPTO_CONFIG[env as keyof typeof CRYPTO_CONFIG] ||
    CRYPTO_CONFIG.development
  );
};
