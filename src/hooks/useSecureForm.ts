import { useState, useCallback } from "react";
import { useSecurityMonitoring } from "@/hooks/use-security-monitoring";
import { sanitizeInput } from "@/lib/security";

/**
 * Hook para criar inputs seguros em formulários
 */
export const useSecureForm = (formContext = "form") => {
  const { monitorInput } = useSecurityMonitoring();
  const [suspiciousFields, setSuspiciousFields] = useState<Set<string>>(
    new Set()
  );

  const validateField = useCallback(
    (fieldName: string, value: string) => {
      try {
        monitorInput(value, `${formContext}.${fieldName}`);
        setSuspiciousFields((prev) => {
          const newSet = new Set(prev);
          newSet.delete(fieldName);
          return newSet;
        });
        return true;
      } catch (error) {
        setSuspiciousFields((prev) => new Set(prev).add(fieldName));
        return false;
      }
    },
    [formContext, monitorInput]
  );

  const sanitizeFieldValue = useCallback((value: string, options = {}) => {
    return sanitizeInput(value, options);
  }, []);

  const isFieldSuspicious = useCallback(
    (fieldName: string) => {
      return suspiciousFields.has(fieldName);
    },
    [suspiciousFields]
  );

  const clearSuspiciousFlags = useCallback(() => {
    setSuspiciousFields(new Set());
  }, []);

  return {
    validateField,
    sanitizeFieldValue,
    isFieldSuspicious,
    clearSuspiciousFlags,
    suspiciousFieldsCount: suspiciousFields.size,
  };
};
