
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ArrowLeft, Edit, Trash, Calendar, Clock, Phone, Mail, 
  Upload, Paperclip, FileText, Download, Info, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { Lead } from '@/types/models';
import { getLeadById, mockEventos, mockTarefas } from '@/services/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('detalhes');
  
  useEffect(() => {
    if (!id) return;
    
    // Simular carregamento dos dados
    setIsLoading(true);
    setTimeout(() => {
      const leadData = getLeadById(id);
      if (leadData) {
        setLead(leadData);
      }
      setIsLoading(false);
    }, 300);
  }, [id]);
  
  const handleStatusChange = (value: string) => {
    if (!lead) return;
    
    setLead({
      ...lead,
      status: value as any
    });
    
    toast({
      title: "Estado atualizado",
      description: `Estado do lead alterado para ${value}`
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uniga-blue"></div>
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-xl font-medium">Lead não encontrado</p>
        <Button onClick={() => navigate('/leads/kanban')} variant="link">
          Voltar para a lista de leads
        </Button>
      </div>
    );
  }
  
  // Filtrar eventos relacionados a este lead
  const leadEventos = mockEventos
    .filter(evento => evento.leadId === lead.id)
    .map(evento => ({
      ...evento,
      dataFormatada: {
        data: format(new Date(evento.dataInicio), 'dd MMM yyyy', {locale: ptBR}),
        hora: format(new Date(evento.dataInicio), 'HH:mm', {locale: ptBR}),
      }
    }))
    .sort((a, b) => new Date(a.dataInicio).getTime() - new Date(b.dataInicio).getTime());
  
  // Filtrar tarefas relacionadas a este lead
  const leadTarefas = mockTarefas
    .filter(tarefa => tarefa.leadId === lead.id)
    .sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime());
  
  return (
    <div className="space-y-6">
      {/* Cabeçalho e ações */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{lead.nome}</h1>
          <StatusBadge status={lead.status} className="ml-2" />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Alterar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="novo">Novo</SelectItem>
              <SelectItem value="contactado">Contactado</SelectItem>
              <SelectItem value="qualificado">Qualificado</SelectItem>
              <SelectItem value="proposta">Proposta</SelectItem>
              <SelectItem value="negociacao">Negociação</SelectItem>
              <SelectItem value="ganho">Ganho</SelectItem>
              <SelectItem value="perdido">Perdido</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          
          <Button variant="destructive">
            <Trash className="h-4 w-4 mr-2" />
            Apagar
          </Button>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <span>Empresa: </span>
        <span className="font-medium text-foreground">{lead.empresa}</span>
        <span className="mx-2">•</span>
        <span>Criado a </span>
        <span className="font-medium text-foreground">
          {format(new Date(lead.dataRegisto), 'dd MMM yyyy', {locale: ptBR})}
        </span>
        <span className="mx-2">•</span>
        <span>Atualizado a </span>
        <span className="font-medium text-foreground">
          {format(new Date(lead.ultimaAtualizacao), 'dd MMM yyyy', {locale: ptBR})}
        </span>
      </div>
      
      {/* Guias de informações */}
      <Tabs defaultValue="detalhes" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="tarefas">Tarefas</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="detalhes" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Informações principais */}
            <Card className="col-span-1 md:col-span-8">
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{lead.nome}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Empresa</p>
                      <p className="font-medium">{lead.empresa}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a href={`mailto:${lead.email}`} className="text-uniga-blue hover:underline">
                        {lead.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <a href={`tel:${lead.telefone}`} className="text-uniga-blue hover:underline">
                        {lead.telefone}
                      </a>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Origem</p>
                      <p className="font-medium">{lead.origem}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Responsável</p>
                      <p className="font-medium">{lead.responsavel?.name || 'Não atribuído'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-medium">
                        {lead.valor.toLocaleString('pt-PT', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    {lead.proximoContacto && (
                      <div>
                        <p className="text-sm text-muted-foreground">Próximo contacto</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(lead.proximoContacto), 'dd MMM yyyy', {locale: ptBR})}
                          <span className="mx-1">•</span>
                          <Clock className="h-4 w-4" />
                          {format(new Date(lead.proximoContacto), 'HH:mm', {locale: ptBR})}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {Object.keys(lead.camposPersonalizados).length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-medium mb-4">Campos Personalizados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(lead.camposPersonalizados).map(([chave, valor]) => (
                        <div key={chave}>
                          <p className="text-sm text-muted-foreground">{chave}</p>
                          <p className="font-medium">{valor}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Notas</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {lead.notas || 'Sem notas adicionadas.'}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Resumo de atividades */}
            <Card className="col-span-1 md:col-span-4">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 bg-blue-100 text-blue-800 p-1.5 rounded-full">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Evento agendado</p>
                      <p className="text-xs text-muted-foreground">
                        {leadEventos[0]?.titulo || 'Nenhum evento próximo'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {leadEventos[0] ? 
                          `${leadEventos[0].dataFormatada.data} às ${leadEventos[0].dataFormatada.hora}` : 
                          ''}
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab('eventos')}>
                      Ver todas as atividades
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="eventos" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Eventos</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
            </CardHeader>
            <CardContent>
              {leadEventos.length > 0 ? (
                <div className="space-y-4">
                  {leadEventos.map((evento) => (
                    <div key={evento.id} className="flex items-start gap-4 p-3 border rounded-md">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-md">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{evento.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {evento.dataFormatada.data}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {evento.dataFormatada.hora}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  Nenhum evento registado para este lead.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tarefas" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tarefas</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </CardHeader>
            <CardContent>
              {leadTarefas.length > 0 ? (
                <div className="space-y-4">
                  {leadTarefas.map((tarefa) => (
                    <div key={tarefa.id} className="flex items-start gap-4 p-3 border rounded-md">
                      <div className={`p-2 rounded-md ${
                        tarefa.prioridade === 'baixa' ? 'bg-green-100 text-green-800' :
                        tarefa.prioridade === 'media' ? 'bg-blue-100 text-blue-800' :
                        tarefa.prioridade === 'alta' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{tarefa.titulo}</h4>
                        <p className="text-sm text-muted-foreground">{tarefa.descricao}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(tarefa.prazo), 'dd MMM yyyy', {locale: ptBR})}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {format(new Date(tarefa.prazo), 'HH:mm', {locale: ptBR})}
                          </span>
                          <StatusBadge status={tarefa.status} />
                          <StatusBadge status={tarefa.prioridade} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-10 text-muted-foreground">
                  Nenhuma tarefa registada para este lead.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documentos" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Documentos</CardTitle>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Carregar Documento
              </Button>
            </CardHeader>
            <CardContent>
              {lead.documentos.length > 0 ? (
                <div className="space-y-4">
                  {lead.documentos.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-md">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {(doc.tamanho / 1024 / 1024).toFixed(2)} MB • {format(new Date(doc.uploadedAt), 'dd MMM yyyy', {locale: ptBR})}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Paperclip className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhum documento carregado para este lead.
                  </p>
                  <Button variant="link" className="mt-2">
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar documento
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadDetail;
