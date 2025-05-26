/**
 * Painel de Monitoramento de Segurança para Desenvolvimento
 * Permite visualizar eventos de segurança em tempo real
 */

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  useSecurityMonitoring,
  SecurityEvent,
} from "@/hooks/use-security-monitoring";
import {
  Shield,
  AlertTriangle,
  Activity,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Bug,
} from "lucide-react";

const SecurityMonitoringPanel: React.FC = () => {
  const {
    events,
    metrics,
    isMonitoring,
    toggleMonitoring,
    clearAllEvents,
    exportSecurityReport,
    getEventsByType,
    getEventsBySeverity,
  } = useSecurityMonitoring();

  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(
    null
  );
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityColor = (severity: SecurityEvent["severity"]) => {
    switch (severity) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: SecurityEvent["type"]) => {
    switch (type) {
      case "xss_attempt":
        return "🚨";
      case "sql_injection":
        return "💉";
      case "rate_limit_exceeded":
        return "⏱️";
      case "invalid_token":
        return "🔑";
      case "suspicious_activity":
        return "👁️";
      default:
        return "⚠️";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }).format(timestamp);
  };

  const downloadReport = () => {
    const report = exportSecurityReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Não mostrar em produção
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="mb-2 bg-background shadow-lg"
          >
            <Shield className="h-4 w-4 mr-2" />
            Segurança ({metrics.totalEvents})
            {metrics.criticalEvents > 0 && (
              <Badge variant="destructive" className="ml-2">
                {metrics.criticalEvents}
              </Badge>
            )}
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Card className="w-96 max-h-96 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center">
                  <Bug className="h-4 w-4 mr-2" />
                  Monitor de Segurança
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMonitoring}
                    className="h-8 w-8 p-0"
                  >
                    {isMonitoring ? (
                      <Eye className="h-3 w-3" />
                    ) : (
                      <EyeOff className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadReport}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllEvents}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription className="text-xs">
                Status: {isMonitoring ? "Ativo" : "Inativo"} | Hoje:{" "}
                {metrics.todayEvents} eventos
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 pt-0">
              {/* Métricas rápidas */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">
                    {getEventsBySeverity("critical").length}
                  </div>
                  <div className="text-xs text-gray-600">Críticos</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">
                    {getEventsBySeverity("high").length}
                  </div>
                  <div className="text-xs text-gray-600">Altos</div>
                </div>
              </div>

              {/* Lista de eventos */}
              <ScrollArea className="h-48">
                {events.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">
                    Nenhum evento de segurança registrado
                  </div>
                ) : (
                  <div className="space-y-2">
                    {events.slice(0, 10).map((event) => (
                      <div
                        key={event.id}
                        className="border rounded p-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="mr-2">
                              {getTypeIcon(event.type)}
                            </span>
                            <div>
                              <div className="text-xs font-medium">
                                {event.type.replace("_", " ")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatTimestamp(event.timestamp)}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`text-xs ${getSeverityColor(
                              event.severity
                            )}`}
                          >
                            {event.severity}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {events.length > 10 && (
                <div className="text-center text-xs text-gray-500 mt-2">
                  ... e mais {events.length - 10} eventos
                </div>
              )}
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Modal de detalhes do evento */}
      <Dialog
        open={!!selectedEvent}
        onOpenChange={() => setSelectedEvent(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Detalhes do Evento de Segurança
            </DialogTitle>
            <DialogDescription>
              Informações detalhadas sobre o evento detectado
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <div className="text-sm">
                    {getTypeIcon(selectedEvent.type)}{" "}
                    {selectedEvent.type.replace("_", " ")}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Severidade</label>
                  <div>
                    <Badge className={getSeverityColor(selectedEvent.severity)}>
                      {selectedEvent.severity}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Timestamp</label>
                <div className="text-sm">
                  {selectedEvent.timestamp.toLocaleString("pt-PT")}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Detalhes</label>
                <div className="text-sm bg-gray-100 p-2 rounded max-h-32 overflow-y-auto">
                  {selectedEvent.details}
                </div>
              </div>

              {selectedEvent.userAgent && (
                <div>
                  <label className="text-sm font-medium">User Agent</label>
                  <div className="text-xs bg-gray-100 p-2 rounded break-all">
                    {selectedEvent.userAgent}
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium">ID do Evento</label>
                <div className="text-xs font-mono">{selectedEvent.id}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SecurityMonitoringPanel;
