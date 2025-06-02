/**
 * Hook para monitoramento de segurança em tempo real
 * Detecta atividades suspeitas e eventos de segurança
 */

import { useState, useEffect, useRef } from "react";
import { sanitizeInput, detectXss, detectSqlInjection } from "@/lib/security";
import { globalRateLimiter } from "@/lib/crypto";

interface SecurityEvent {
  id: string;
  type:
    | "xss_attempt"
    | "sql_injection"
    | "rate_limit_exceeded"
    | "invalid_token"
    | "suspicious_activity";
  timestamp: Date;
  details: string;
  severity: "low" | "medium" | "high" | "critical";
  userAgent?: string;
  ip?: string;
}

interface SecurityMetrics {
  totalEvents: number;
  todayEvents: number;
  criticalEvents: number;
  lastEvent?: SecurityEvent;
}

export const useSecurityMonitoring = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    todayEvents: 0,
    criticalEvents: 0,
  });
  const [isMonitoring, setIsMonitoring] = useState(true);
  const eventIdCounter = useRef(0);

  /**
   * Adiciona um novo evento de segurança
   */
  const addSecurityEvent = (
    type: SecurityEvent["type"],
    details: string,
    severity: SecurityEvent["severity"] = "medium"
  ) => {
    const event: SecurityEvent = {
      id: `sec_${eventIdCounter.current++}_${Date.now()}`,
      type,
      timestamp: new Date(),
      details: sanitizeInput(details),
      severity,
      userAgent: navigator.userAgent,
      ip: "client-side", // Em produção, obteria do servidor
    };    setEvents((prev) => [event, ...prev].slice(0, 100)); // Manter apenas 100 eventos

    // Atualizar métricas
    setMetrics((prev) => ({
      totalEvents: prev.totalEvents + 1,
      todayEvents: prev.todayEvents + 1,
      criticalEvents:
        severity === "critical" ? prev.criticalEvents + 1 : prev.criticalEvents,
      lastEvent: event,
    }));

    // Log em desenvolvimento
    if (process.env.NODE_ENV === "development") {
      console.warn(`🔒 Evento de Segurança [${severity.toUpperCase()}]:`, {
        type,
        details,
        timestamp: event.timestamp,
      });
    }

    return event;
  };

  /**
   * Monitora inputs para atividades suspeitas
   */
  const monitorInput = (input: string, context: string = "unknown") => {
    if (!isMonitoring || !input) return;

    // Detectar tentativas de XSS
    if (detectXss(input)) {
      addSecurityEvent(
        "xss_attempt",
        `Tentativa de XSS detectada no contexto: ${context}. Input: ${input.substring(
          0,
          100
        )}...`,
        "high"
      );
    }

    // Detectar tentativas de SQL Injection
    if (detectSqlInjection(input)) {
      addSecurityEvent(
        "sql_injection",
        `Tentativa de SQL Injection detectada no contexto: ${context}. Input: ${input.substring(
          0,
          100
        )}...`,
        "high"
      );
    }

    // Detectar inputs suspeitos
    if (input.length > 10000) {
      addSecurityEvent(
        "suspicious_activity",
        `Input excessivamente longo detectado no contexto: ${context}. Tamanho: ${input.length}`,
        "medium"
      );
    }
  };

  /**
   * Monitora tentativas de rate limiting
   */
  const monitorRateLimit = (identifier: string, action: string) => {
    if (!globalRateLimiter.isAllowed(identifier)) {
      addSecurityEvent(
        "rate_limit_exceeded",
        `Rate limit excedido para ${identifier} na ação: ${action}`,
        "medium"
      );
      return false;
    }
    return true;
  };

  /**
   * Monitora tokens inválidos
   */
  const monitorInvalidToken = (details: string) => {
    addSecurityEvent(
      "invalid_token",
      `Token inválido detectado: ${details}`,
      "high"
    );
  };

  /**
   * Obtém eventos por tipo
   */
  const getEventsByType = (type: SecurityEvent["type"]) => {
    return events.filter((event) => event.type === type);
  };

  /**
   * Obtém eventos por severidade
   */
  const getEventsBySeverity = (severity: SecurityEvent["severity"]) => {
    return events.filter((event) => event.severity === severity);
  };

  /**
   * Obtém eventos das últimas 24 horas
   */
  const getRecentEvents = () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return events.filter((event) => event.timestamp > yesterday);
  };

  /**
   * Limpa eventos antigos
   */
  const clearOldEvents = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    setEvents((prev) => prev.filter((event) => event.timestamp > weekAgo));
  };

  /**
   * Exporta relatório de segurança
   */
  const exportSecurityReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      metrics,
      recentEvents: getRecentEvents(),
      eventsByType: {
        xss_attempts: getEventsByType("xss_attempt").length,
        sql_injections: getEventsByType("sql_injection").length,
        rate_limits: getEventsByType("rate_limit_exceeded").length,
        invalid_tokens: getEventsByType("invalid_token").length,
        suspicious_activities: getEventsByType("suspicious_activity").length,
      },
      eventsBySeverity: {
        low: getEventsBySeverity("low").length,
        medium: getEventsBySeverity("medium").length,
        high: getEventsBySeverity("high").length,
        critical: getEventsBySeverity("critical").length,
      },
    };

    return report;
  };

  /**
   * Toggle do monitoramento
   */
  const toggleMonitoring = () => {
    setIsMonitoring((prev) => !prev);
  };

  /**
   * Limpa todos os eventos
   */
  const clearAllEvents = () => {
    setEvents([]);
    setMetrics({
      totalEvents: 0,
      todayEvents: 0,
      criticalEvents: 0,
    });
  };

  // Limpeza automática de eventos antigos (diariamente)
  useEffect(() => {
    const interval = setInterval(clearOldEvents, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Resetar contadores diários à meia-noite
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const msUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setMetrics((prev) => ({ ...prev, todayEvents: 0 }));

      // Configurar interval diário
      const interval = setInterval(() => {
        setMetrics((prev) => ({ ...prev, todayEvents: 0 }));
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(interval);
    }, msUntilMidnight);

    return () => clearTimeout(timeout);
  }, []);

  return {
    // Estado
    events,
    metrics,
    isMonitoring,

    // Funções de monitoramento
    addSecurityEvent,
    monitorInput,
    monitorRateLimit,
    monitorInvalidToken,

    // Funções de consulta
    getEventsByType,
    getEventsBySeverity,
    getRecentEvents,

    // Funções de controle
    toggleMonitoring,
    clearAllEvents,
    clearOldEvents,
    exportSecurityReport,
  };
};

export type { SecurityEvent, SecurityMetrics };
