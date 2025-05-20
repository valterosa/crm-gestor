
// Tipos de dados para a aplicação
import { User } from './index';

export type LeadStatus = 'novo' | 'contactado' | 'qualificado' | 'proposta' | 'negociacao' | 'ganho' | 'perdido';

export type TaskPriority = 'baixa' | 'media' | 'alta' | 'urgente';
export type TaskStatus = 'pendente' | 'em_progresso' | 'concluida' | 'cancelada';

export interface Lead {
  id: string;
  nome: string;
  empresa: string;
  email: string;
  telefone: string;
  status: LeadStatus;
  valor: number;
  origem: string;
  notas: string;
  responsavelId: string;
  responsavel?: User;
  dataRegisto: string;
  ultimaAtualizacao: string;
  documentos: LeadDocumento[];
  proximoContacto?: string;
  camposPersonalizados: Record<string, string>;
}

export interface LeadDocumento {
  id: string;
  nome: string;
  tipo: string;
  caminho: string;
  tamanho: number;
  uploadedAt: string;
  leadId: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  local?: string;
  participantes: string[];
  leadId?: string;
  lead?: Lead;
  criadoPor: string;
  criadorUsuario?: User;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string;
  status: TaskStatus;
  prioridade: TaskPriority;
  responsavelId: string;
  responsavel?: User;
  leadId?: string;
  lead?: Lead;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'lead_origem' | 'lead_status' | 'tarefa_categoria';
  cor: string;
}

export interface Configuracao {
  id: string;
  chave: string;
  valor: string;
  descricao: string;
}
