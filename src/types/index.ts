export type UserRole = "admin" | "manager" | "salesperson";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status:
    | "novo"
    | "contactado"
    | "qualificado"
    | "proposta"
    | "negociação"
    | "ganho"
    | "perdido";
  value: number;
  assignedTo: string;
  assignedToUser?: User;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  documents?: Document[];
  customFields?: Record<string, unknown>;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  leadId: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: "pendente" | "em_progresso" | "concluída" | "cancelada";
  priority: "baixa" | "média" | "alta";
  assignedTo: string;
  assignedToUser?: User;
  relatedLeadId?: string;
  relatedLead?: Lead;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  location?: string;
  attendees?: string[];
  relatedLeadId?: string;
  relatedLead?: Lead;
  color?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: "positive" | "negative" | "neutral";
  icon?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
  }[];
}
