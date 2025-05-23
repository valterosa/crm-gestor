import {
  Lead,
  LeadStatus,
  Tarefa,
  TaskStatus,
  TaskPriority,
  Evento,
  LeadDocumento,
} from "@/types/models";
import { User } from "@/types";

// Mock de utilizadores
export const mockUsers: User[] = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@empresa.com",
    role: "admin",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Gestor de Vendas",
    email: "gerente@empresa.com",
    role: "manager",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Vendedor Silva",
    email: "vendedor@empresa.com",
    role: "salesperson",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    name: "Vendedor Santos",
    email: "vendedor2@empresa.com",
    role: "salesperson",
    createdAt: "2023-01-04T00:00:00.000Z",
    updatedAt: "2023-01-04T00:00:00.000Z",
  },
];

// Mock de leads
export const mockLeads: Lead[] = [
  {
    id: "1",
    nome: "João Pereira",
    empresa: "Tecnologia Avançada, Lda",
    email: "joao@tecnologiaavancada.pt",
    telefone: "912345678",
    status: "contactado",
    valor: 25000,
    origem: "Site",
    notas: "Interessado em soluções de CRM para equipa de 20 pessoas",
    responsavelId: "3",
    dataRegisto: "2023-05-15T10:30:00.000Z",
    ultimaAtualizacao: "2023-05-17T14:20:00.000Z",
    documentos: [],
    proximoContacto: "2023-05-25T11:00:00.000Z",
    camposPersonalizados: {
      setor: "Tecnologia",
      tamanhoEmpresa: "Média (20-99)",
    },
  },
  {
    id: "2",
    nome: "Ana Silva",
    empresa: "Construções Silva & Filhos",
    email: "ana@construcoessilva.pt",
    telefone: "961234567",
    status: "qualificado",
    valor: 45000,
    origem: "Referência",
    notas: "Procura solução completa de gestão para empresa de construção",
    responsavelId: "2",
    dataRegisto: "2023-05-10T09:15:00.000Z",
    ultimaAtualizacao: "2023-05-16T16:45:00.000Z",
    documentos: [],
    proximoContacto: "2023-05-22T10:00:00.000Z",
    camposPersonalizados: {
      setor: "Construção",
      tamanhoEmpresa: "Pequena (5-19)",
    },
  },
  {
    id: "3",
    nome: "Manuel Costa",
    empresa: "Farmácias Costa",
    email: "manuel@farmaciascosta.pt",
    telefone: "933456789",
    status: "proposta",
    valor: 15000,
    origem: "LinkedIn",
    notas: "Necessita de sistema para rede de 5 farmácias",
    responsavelId: "3",
    dataRegisto: "2023-05-05T15:45:00.000Z",
    ultimaAtualizacao: "2023-05-15T11:30:00.000Z",
    documentos: [],
    proximoContacto: "2023-05-23T14:30:00.000Z",
    camposPersonalizados: {
      setor: "Saúde",
      tamanhoEmpresa: "Pequena (5-19)",
    },
  },
  {
    id: "4",
    nome: "Sofia Martins",
    empresa: "Consultoria Jurídica, Lda",
    email: "sofia@consultoriajuridica.pt",
    telefone: "967654321",
    status: "novo",
    valor: 10000,
    origem: "Email",
    notas: "Escritório de advogados com 8 colaboradores",
    responsavelId: "4",
    dataRegisto: "2023-05-18T08:30:00.000Z",
    ultimaAtualizacao: "2023-05-18T08:30:00.000Z",
    documentos: [],
    camposPersonalizados: {
      setor: "Jurídico",
      tamanhoEmpresa: "Pequena (5-19)",
    },
  },
  {
    id: "5",
    nome: "Ricardo Gomes",
    empresa: "Supermercados Gomes",
    email: "ricardo@sgomes.pt",
    telefone: "936543210",
    status: "negociacao",
    valor: 60000,
    origem: "Feira",
    notas: "Rede de supermercados com 12 lojas, precisa de sistema integrado",
    responsavelId: "2",
    dataRegisto: "2023-05-01T11:20:00.000Z",
    ultimaAtualizacao: "2023-05-17T09:45:00.000Z",
    documentos: [],
    proximoContacto: "2023-05-24T16:00:00.000Z",
    camposPersonalizados: {
      setor: "Retalho",
      tamanhoEmpresa: "Média (20-99)",
    },
  },
  {
    id: "6",
    nome: "Catarina Ferreira",
    empresa: "Design CF",
    email: "catarina@designcf.pt",
    telefone: "912876543",
    status: "qualificado",
    valor: 8000,
    origem: "Site",
    notas: "Estúdio de design com 6 pessoas",
    responsavelId: "4",
    dataRegisto: "2023-05-12T14:10:00.000Z",
    ultimaAtualizacao: "2023-05-16T10:15:00.000Z",
    documentos: [],
    proximoContacto: "2023-05-26T11:30:00.000Z",
    camposPersonalizados: {
      setor: "Design",
      tamanhoEmpresa: "Micro (1-4)",
    },
  },
  {
    id: "7",
    nome: "Pedro Nunes",
    empresa: "Transportes Rápidos",
    email: "pedro@transportesrapidos.pt",
    telefone: "969876543",
    status: "ganho",
    valor: 35000,
    origem: "Referência",
    notas: "Empresa de transportes com frota de 25 veículos",
    responsavelId: "3",
    dataRegisto: "2023-04-20T10:00:00.000Z",
    ultimaAtualizacao: "2023-05-17T15:30:00.000Z",
    documentos: [],
    camposPersonalizados: {
      setor: "Transportes",
      tamanhoEmpresa: "Média (20-99)",
    },
  },
  {
    id: "8",
    nome: "Margarida Santos",
    empresa: "Escola de Línguas MS",
    email: "margarida@escolalinguas.pt",
    telefone: "936789012",
    status: "perdido",
    valor: 12000,
    origem: "Google",
    notas: "Escola com 10 professores, optou por solução concorrente",
    responsavelId: "4",
    dataRegisto: "2023-04-10T09:30:00.000Z",
    ultimaAtualizacao: "2023-05-15T16:20:00.000Z",
    documentos: [],
    camposPersonalizados: {
      setor: "Educação",
      tamanhoEmpresa: "Pequena (5-19)",
    },
  },
];

// Mock de documentos de leads
export const mockLeadDocumentos: LeadDocumento[] = [
  {
    id: "1",
    nome: "Proposta_Comercial.pdf",
    tipo: "application/pdf",
    caminho: "/uploads/leads/1/Proposta_Comercial.pdf",
    tamanho: 2458634,
    uploadedAt: "2023-05-16T14:30:00.000Z",
    leadId: "1",
  },
  {
    id: "2",
    nome: "Requisitos_Tecnicos.docx",
    tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    caminho: "/uploads/leads/1/Requisitos_Tecnicos.docx",
    tamanho: 1345678,
    uploadedAt: "2023-05-16T14:35:00.000Z",
    leadId: "1",
  },
  {
    id: "3",
    nome: "Contrato.pdf",
    tipo: "application/pdf",
    caminho: "/uploads/leads/5/Contrato.pdf",
    tamanho: 3567890,
    uploadedAt: "2023-05-17T10:15:00.000Z",
    leadId: "5",
  },
];

// Mock de tarefas
export const mockTarefas: Tarefa[] = [
  {
    id: "1",
    titulo: "Contactar João Pereira",
    descricao: "Agendar reunião para apresentação da solução",
    prazo: "2023-05-25T17:00:00.000Z",
    status: "pendente",
    prioridade: "alta",
    responsavelId: "3",
    leadId: "1",
  },
  {
    id: "2",
    titulo: "Preparar proposta",
    descricao: "Elaborar proposta para Construções Silva & Filhos",
    prazo: "2023-05-22T17:00:00.000Z",
    status: "em_progresso",
    prioridade: "alta",
    responsavelId: "2",
    leadId: "2",
  },
  {
    id: "3",
    titulo: "Demonstração do sistema",
    descricao: "Demonstração online para Farmácias Costa",
    prazo: "2023-05-23T15:00:00.000Z",
    status: "pendente",
    prioridade: "media",
    responsavelId: "3",
    leadId: "3",
  },
  {
    id: "4",
    titulo: "Primeira abordagem",
    descricao: "Contacto inicial com Sofia Martins",
    prazo: "2023-05-20T12:00:00.000Z",
    status: "pendente",
    prioridade: "baixa",
    responsavelId: "4",
    leadId: "4",
  },
  {
    id: "5",
    titulo: "Renegociar condições",
    descricao: "Renegociar condições do contrato com Supermercados Gomes",
    prazo: "2023-05-24T16:30:00.000Z",
    status: "em_progresso",
    prioridade: "urgente",
    responsavelId: "2",
    leadId: "5",
  },
  {
    id: "6",
    titulo: "Apresentação de produto",
    descricao: "Elaborar apresentação para Design CF",
    prazo: "2023-05-26T10:00:00.000Z",
    status: "pendente",
    prioridade: "media",
    responsavelId: "4",
    leadId: "6",
  },
  {
    id: "7",
    titulo: "Elaborar documentação",
    descricao:
      "Preparar documentação de implementação para Transportes Rápidos",
    prazo: "2023-05-25T17:00:00.000Z",
    status: "em_progresso",
    prioridade: "media",
    responsavelId: "3",
    leadId: "7",
  },
  {
    id: "8",
    titulo: "Reunião de equipa",
    descricao: "Reunião semanal de equipa de vendas",
    prazo: "2023-05-19T10:00:00.000Z",
    status: "pendente",
    prioridade: "baixa",
    responsavelId: "2",
  },
  {
    id: "9",
    titulo: "Análise de mercado",
    descricao: "Preparar análise de novos mercados potenciais",
    prazo: "2023-05-30T17:00:00.000Z",
    status: "pendente",
    prioridade: "baixa",
    responsavelId: "2",
  },
  {
    id: "10",
    titulo: "Atualizar CRM",
    descricao: "Verificar e atualizar todas as entradas no CRM",
    prazo: "2023-05-19T17:00:00.000Z",
    status: "concluida",
    prioridade: "media",
    responsavelId: "4",
  },
];

// Mock de eventos
export const mockEventos: Evento[] = [
  {
    id: "1",
    titulo: "Reunião com João Pereira",
    descricao: "Apresentação da solução CRM",
    dataInicio: "2023-05-25T11:00:00.000Z",
    dataFim: "2023-05-25T12:00:00.000Z",
    local: "Online - Microsoft Teams",
    participantes: ["3"],
    leadId: "1",
    criadoPor: "3",
  },
  {
    id: "2",
    titulo: "Reunião com Ana Silva",
    descricao: "Discussão da proposta",
    dataInicio: "2023-05-22T10:00:00.000Z",
    dataFim: "2023-05-22T11:30:00.000Z",
    local: "Escritório Principal",
    participantes: ["2", "3"],
    leadId: "2",
    criadoPor: "2",
  },
  {
    id: "3",
    titulo: "Demo para Farmácias Costa",
    descricao: "Demonstração online do sistema",
    dataInicio: "2023-05-23T14:30:00.000Z",
    dataFim: "2023-05-23T15:30:00.000Z",
    local: "Google Meet",
    participantes: ["3"],
    leadId: "3",
    criadoPor: "3",
  },
  {
    id: "4",
    titulo: "Negociação Supermercados Gomes",
    descricao: "Reunião final de negociação",
    dataInicio: "2023-05-24T16:00:00.000Z",
    dataFim: "2023-05-24T17:30:00.000Z",
    local: "Sede do cliente",
    participantes: ["1", "2"],
    leadId: "5",
    criadoPor: "2",
  },
  {
    id: "5",
    titulo: "Apresentação Design CF",
    descricao: "Apresentação inicial da solução",
    dataInicio: "2023-05-26T11:30:00.000Z",
    dataFim: "2023-05-26T12:30:00.000Z",
    local: "Zoom",
    participantes: ["4"],
    leadId: "6",
    criadoPor: "4",
  },
  {
    id: "6",
    titulo: "Reunião de equipa",
    descricao: "Reunião semanal de vendas",
    dataInicio: "2023-05-19T10:00:00.000Z",
    dataFim: "2023-05-19T11:00:00.000Z",
    local: "Sala de reuniões",
    participantes: ["1", "2", "3", "4"],
    criadoPor: "1",
  },
];

// Funções utilitárias para simular chamadas de API
export const getLeadsByStatus = (): Record<LeadStatus, Lead[]> => {
  const result: Record<LeadStatus, Lead[]> = {
    novo: [],
    contactado: [],
    qualificado: [],
    proposta: [],
    negociacao: [],
    ganho: [],
    perdido: [],
  };

  mockLeads.forEach((lead) => {
    result[lead.status].push({
      ...lead,
      responsavel: mockUsers.find((user) => user.id === lead.responsavelId),
    });
  });

  return result;
};

export const getLeadById = (id: string): Lead | undefined => {
  const lead = mockLeads.find((l) => l.id === id);
  if (!lead) return undefined;

  // Add related data
  return {
    ...lead,
    responsavel: mockUsers.find((user) => user.id === lead.responsavelId),
    documentos: mockLeadDocumentos.filter((doc) => doc.leadId === id),
  };
};

export const getTarefasByStatus = (): Record<TaskStatus, Tarefa[]> => {
  const result: Record<TaskStatus, Tarefa[]> = {
    pendente: [],
    em_progresso: [],
    concluida: [],
    cancelada: [],
  };

  mockTarefas.forEach((tarefa) => {
    result[tarefa.status].push({
      ...tarefa,
      responsavel: mockUsers.find((user) => user.id === tarefa.responsavelId),
      lead: tarefa.leadId
        ? mockLeads.find((lead) => lead.id === tarefa.leadId)
        : undefined,
    });
  });

  return result;
};

export const getTarefasByPrioridade = (): Record<TaskPriority, Tarefa[]> => {
  const result: Record<TaskPriority, Tarefa[]> = {
    baixa: [],
    media: [],
    alta: [],
    urgente: [],
  };

  mockTarefas.forEach((tarefa) => {
    result[tarefa.prioridade].push({
      ...tarefa,
      responsavel: mockUsers.find((user) => user.id === tarefa.responsavelId),
      lead: tarefa.leadId
        ? mockLeads.find((lead) => lead.id === tarefa.leadId)
        : undefined,
    });
  });

  return result;
};

export const getEventosByData = (inicio: Date, fim: Date): Evento[] => {
  return mockEventos
    .filter((evento) => {
      const eventoInicio = new Date(evento.dataInicio);
      const eventoFim = new Date(evento.dataFim);
      return (
        (eventoInicio >= inicio && eventoInicio <= fim) ||
        (eventoFim >= inicio && eventoFim <= fim) ||
        (eventoInicio <= inicio && eventoFim >= fim)
      );
    })
    .map((evento) => ({
      ...evento,
      lead: evento.leadId
        ? mockLeads.find((lead) => lead.id === evento.leadId)
        : undefined,
      criadorUsuario: mockUsers.find((user) => user.id === evento.criadoPor),
    }));
};

export const getEventosByUsuario = (userId: string): Evento[] => {
  return mockEventos
    .filter(
      (evento) =>
        evento.participantes.includes(userId) || evento.criadoPor === userId
    )
    .map((evento) => ({
      ...evento,
      lead: evento.leadId
        ? mockLeads.find((lead) => lead.id === evento.leadId)
        : undefined,
      criadorUsuario: mockUsers.find((user) => user.id === evento.criadoPor),
    }));
};

export const getTarefasByUsuario = (userId: string): Tarefa[] => {
  return mockTarefas
    .filter((tarefa) => tarefa.responsavelId === userId)
    .map((tarefa) => ({
      ...tarefa,
      lead: tarefa.leadId
        ? mockLeads.find((lead) => lead.id === tarefa.leadId)
        : undefined,
    }));
};

export const getLeadsByUsuario = (userId: string): Lead[] => {
  return mockLeads
    .filter((lead) => lead.responsavelId === userId)
    .map((lead) => ({
      ...lead,
      responsavel: mockUsers.find((user) => user.id === lead.responsavelId),
    }));
};

// Contador de leads por status
export const getLeadCountsByStatus = (): Record<LeadStatus, number> => {
  const counts: Record<LeadStatus, number> = {
    novo: 0,
    contactado: 0,
    qualificado: 0,
    proposta: 0,
    negociacao: 0,
    ganho: 0,
    perdido: 0,
  };

  mockLeads.forEach((lead) => {
    counts[lead.status]++;
  });

  return counts;
};

// Valor total de leads por status
export const getLeadValueByStatus = (): Record<LeadStatus, number> => {
  const values: Record<LeadStatus, number> = {
    novo: 0,
    contactado: 0,
    qualificado: 0,
    proposta: 0,
    negociacao: 0,
    ganho: 0,
    perdido: 0,
  };

  mockLeads.forEach((lead) => {
    values[lead.status] += lead.valor;
  });

  return values;
};

// Function to get data based on user choice
export function getDataBasedOnMode<T>(mockData: T[]): T[] {
  const dataMode = localStorage.getItem("dataMode");
  if (dataMode === "Criar Dados Novos") {
    return []; // Return empty data for "Criar Dados Novos"
  }
  return mockData; // Return mock data for "Dados Demo"
}

// Updated exports to use the new function
export const users = getDataBasedOnMode(mockUsers);
export const leads = getDataBasedOnMode(mockLeads);
export const leadDocumentos = getDataBasedOnMode(mockLeadDocumentos);
export const tarefas = getDataBasedOnMode(mockTarefas);
