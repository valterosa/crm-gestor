/**
 * Input seguro que integra validação, sanitização e monitoramento automático
 */

import React, { forwardRef, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sanitizeInput } from "@/lib/security";
import { useSecurityMonitoring } from "@/hooks/use-security-monitoring";
import { AlertTriangle } from "lucide-react";

interface SecureInputProps
  extends Omit<React.ComponentProps<"input">, "onChange"> {
  /** HTML id attribute */
  id?: string;
  /** Contexto do input para logging de segurança */
  securityContext?: string;
  /** Se deve sanitizar automaticamente o input */
  autoSanitize?: boolean;
  /** Se deve monitorar atividades suspeitas */
  enableMonitoring?: boolean;
  /** Opções de sanitização */
  sanitizeOptions?: {
    allowHtml?: boolean;
    maxLength?: number;
    removeExtraSpaces?: boolean;
  };
  /** Callback chamado quando atividade suspeita é detectada */
  onSuspiciousActivity?: (details: string) => void;
  /** Change handler with specific event type */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Change to onChange?: (_: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  (
    {
      className,
      type = "text",
      securityContext = "input",
      autoSanitize = true,
      enableMonitoring = true,
      sanitizeOptions = {},
      onSuspiciousActivity,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [hasSecurityWarning, setHasSecurityWarning] = useState(false);
    const { monitorInput } = useSecurityMonitoring();

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;
        setHasSecurityWarning(false);

        // Monitoramento de segurança
        if (enableMonitoring && inputValue) {
          try {
            monitorInput(inputValue, securityContext);
          } catch (error) {
            setHasSecurityWarning(true);
            onSuspiciousActivity?.(
              `Atividade suspeita detectada no campo ${securityContext}`
            );
          }
        }

        // Sanitização automática
        if (autoSanitize && inputValue) {
          const sanitized = sanitizeInput(inputValue, sanitizeOptions);
          if (sanitized !== inputValue) {
            // Se o valor foi alterado pela sanitização, atualizar
            inputValue = sanitized;
            e.target.value = sanitized;
          }
        }

        // Chamar onChange original
        onChange?.(e);
      },
      [
        enableMonitoring,
        autoSanitize,
        securityContext,
        sanitizeOptions,
        onSuspiciousActivity,
        onChange,
        monitorInput,
      ]
    );

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={type}
          className={cn(
            className,
            hasSecurityWarning && "border-orange-500 focus:ring-orange-500"
          )}
          onChange={handleChange}
          value={value}
          {...props}
        />
        {hasSecurityWarning && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
        )}
        {hasSecurityWarning && (
          <div className="text-xs text-orange-600 mt-1">
            ⚠️ Atividade suspeita detectada neste campo
          </div>
        )}
      </div>
    );
  }
);

SecureInput.displayName = "SecureInput";

/**
 * TextArea segura com as mesmas funcionalidades do SecureInput
 */
interface SecureTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  securityContext?: string;
  autoSanitize?: boolean;
  enableMonitoring?: boolean;
  sanitizeOptions?: {
    allowHtml?: boolean;
    maxLength?: number;
    removeExtraSpaces?: boolean;
  };
  onSuspiciousActivity?: (details: string) => void;
}

export const SecureTextArea = forwardRef<
  HTMLTextAreaElement,
  SecureTextAreaProps
>(
  (
    {
      className,
      securityContext = "textarea",
      autoSanitize = true,
      enableMonitoring = true,
      sanitizeOptions = {},
      onSuspiciousActivity,
      onChange,
      value,
      ...props
    },
    ref
  ) => {
    const [hasSecurityWarning, setHasSecurityWarning] = useState(false);
    const { monitorInput } = useSecurityMonitoring();

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let inputValue = e.target.value;
        setHasSecurityWarning(false);

        // Monitoramento de segurança
        if (enableMonitoring && inputValue) {
          try {
            monitorInput(inputValue, securityContext);
          } catch (error) {
            setHasSecurityWarning(true);
            onSuspiciousActivity?.(
              `Atividade suspeita detectada no campo ${securityContext}`
            );
          }
        }

        // Sanitização automática
        if (autoSanitize && inputValue) {
          const sanitized = sanitizeInput(inputValue, sanitizeOptions);
          if (sanitized !== inputValue) {
            inputValue = sanitized;
            e.target.value = sanitized;
          }
        }

        onChange?.(e);
      },
      [
        enableMonitoring,
        autoSanitize,
        securityContext,
        sanitizeOptions,
        onSuspiciousActivity,
        onChange,
        monitorInput,
      ]
    );

    return (
      <div className="relative">
        <textarea
          ref={ref}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            hasSecurityWarning && "border-orange-500 focus:ring-orange-500"
          )}
          onChange={handleChange}
          value={value}
          {...props}
        />
        {hasSecurityWarning && (
          <div className="absolute right-2 top-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </div>
        )}
        {hasSecurityWarning && (
          <div className="text-xs text-orange-600 mt-1">
            ⚠️ Atividade suspeita detectada neste campo
          </div>
        )}
      </div>
    );
  }
);

SecureTextArea.displayName = "SecureTextArea";
