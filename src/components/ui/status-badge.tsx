
import { cn } from "@/lib/utils";
import { LeadStatus, TaskStatus, TaskPriority } from "@/types/models";

interface StatusBadgeProps {
  status: LeadStatus | TaskStatus | TaskPriority;
  className?: string;
}

const leadStatusConfig: Record<LeadStatus, {label: string; color: string}> = {
  'novo': { label: 'Novo', color: 'bg-blue-100 text-blue-800' },
  'contactado': { label: 'Contactado', color: 'bg-purple-100 text-purple-800' },
  'qualificado': { label: 'Qualificado', color: 'bg-cyan-100 text-cyan-800' },
  'proposta': { label: 'Proposta', color: 'bg-yellow-100 text-yellow-800' },
  'negociacao': { label: 'Negociação', color: 'bg-orange-100 text-orange-800' },
  'ganho': { label: 'Ganho', color: 'bg-green-100 text-green-800' },
  'perdido': { label: 'Perdido', color: 'bg-red-100 text-red-800' }
};

const taskStatusConfig: Record<TaskStatus, {label: string; color: string}> = {
  'pendente': { label: 'Pendente', color: 'bg-blue-100 text-blue-800' },
  'em_progresso': { label: 'Em Progresso', color: 'bg-yellow-100 text-yellow-800' },
  'concluida': { label: 'Concluída', color: 'bg-green-100 text-green-800' },
  'cancelada': { label: 'Cancelada', color: 'bg-gray-100 text-gray-800' }
};

const taskPriorityConfig: Record<TaskPriority, {label: string; color: string}> = {
  'baixa': { label: 'Baixa', color: 'bg-green-100 text-green-800' },
  'media': { label: 'Média', color: 'bg-blue-100 text-blue-800' },
  'alta': { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  'urgente': { label: 'Urgente', color: 'bg-red-100 text-red-800' }
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  // Determine which config to use based on the status
  let config;
  if (Object.keys(leadStatusConfig).includes(status as string)) {
    config = leadStatusConfig[status as LeadStatus];
  } else if (Object.keys(taskStatusConfig).includes(status as string)) {
    config = taskStatusConfig[status as TaskStatus];
  } else {
    config = taskPriorityConfig[status as TaskPriority];
  }

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.color,
      className
    )}>
      {config.label}
    </span>
  );
};
