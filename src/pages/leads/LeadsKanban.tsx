
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import { getLeadsByStatus, mockLeads } from '@/services/mockData';
import { Lead, LeadStatus } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const LeadsKanban = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Record<LeadStatus, Lead[]>>({} as Record<LeadStatus, Lead[]>);
  const [searchTerm, setSearchTerm] = useState('');
  const [collapsedColumns, setCollapsedColumns] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Carregar leads iniciais
    setLeads(getLeadsByStatus());
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
  
    // Se não houver destino ou se o destino for o mesmo que a origem, não faz nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
  
    const sourceStatus = source.droppableId as LeadStatus;
    const destStatus = destination.droppableId as LeadStatus;
  
    // Encontra o lead que está sendo arrastado
    const draggedLead = leads[sourceStatus].find(lead => lead.id === draggableId);
    if (!draggedLead) return;
  
    // Cria cópias dos arrays de origem e destino
    const newSourceLeads = Array.from(leads[sourceStatus]);
    const newDestLeads = sourceStatus === destStatus ? 
      newSourceLeads : Array.from(leads[destStatus]);
  
    // Remove o lead da origem
    newSourceLeads.splice(source.index, 1);
  
    // Insere o lead no destino com o status atualizado
    const updatedLead = { ...draggedLead, status: destStatus };
    
    if (sourceStatus === destStatus) {
      newSourceLeads.splice(destination.index, 0, updatedLead);
    } else {
      newDestLeads.splice(destination.index, 0, updatedLead);
    }
  
    // Atualiza o estado
    setLeads(prev => ({
      ...prev,
      [sourceStatus]: newSourceLeads,
      [destStatus]: newDestLeads
    }));
  
    // Mostra toast de confirmação
    toast({
      title: "Lead atualizado",
      description: `${draggedLead.nome} movido para ${destStatus === 'ganho' ? 'Ganho' : 
                    destStatus === 'perdido' ? 'Perdido' : 
                    destStatus === 'novo' ? 'Novo' :
                    destStatus === 'contactado' ? 'Contactado' :
                    destStatus === 'qualificado' ? 'Qualificado' :
                    destStatus === 'proposta' ? 'Proposta' : 'Negociação'}`,
    });
  };

  const toggleColumn = (columnId: string) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  const statusColumns: {id: LeadStatus; title: string}[] = [
    { id: 'novo', title: 'Novo' },
    { id: 'contactado', title: 'Contactado' },
    { id: 'qualificado', title: 'Qualificado' },
    { id: 'proposta', title: 'Proposta' },
    { id: 'negociacao', title: 'Negociação' },
    { id: 'ganho', title: 'Ganho' },
    { id: 'perdido', title: 'Perdido' },
  ];

  const filteredLeads = Object.fromEntries(
    Object.entries(leads).map(([status, leadsArray]) => {
      return [status, leadsArray.filter(lead => 
        lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.empresa.toLowerCase().includes(searchTerm.toLowerCase())
      )];
    })
  ) as Record<LeadStatus, Lead[]>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar leads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Os meus leads</DropdownMenuItem>
            <DropdownMenuItem>Leads sem responsável</DropdownMenuItem>
            <DropdownMenuItem>Leads de alto valor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="pb-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap gap-4">
            {statusColumns.map((column) => (
              <Collapsible
                key={column.id}
                className={`w-72 flex-shrink-0 flex flex-col ${collapsedColumns[column.id] ? 'h-auto' : ''}`}
                open={!collapsedColumns[column.id]}
              >
                <div className="bg-gray-100 rounded-t-md p-3 font-medium border">
                  <CollapsibleTrigger asChild onClick={() => toggleColumn(column.id)} className="w-full">
                    <div className="flex justify-between items-center cursor-pointer">
                      <span>{column.title}</span>
                      <div className="flex items-center">
                        <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-2">
                          {filteredLeads[column.id]?.length || 0}
                        </span>
                        {collapsedColumns[column.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                </div>
                
                <CollapsibleContent className="flex-grow">
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="bg-gray-50 rounded-b-md border border-t-0 h-full"
                      >
                        <ScrollArea className="h-[400px] p-2">
                          {filteredLeads[column.id]?.map((lead, index) => (
                            <Draggable key={lead.id} draggableId={lead.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="mb-2"
                                >
                                  <Link to={`/leads/${lead.id}`}>
                                    <Card className="hover:shadow-md transition-shadow bg-white">
                                      <CardContent className="p-4">
                                        <div className="flex flex-col gap-2">
                                          <div className="font-medium">{lead.nome}</div>
                                          <div className="text-sm text-muted-foreground">{lead.empresa}</div>
                                          <div className="flex justify-between items-center mt-2">
                                            <div className="text-sm font-medium">
                                              {lead.valor.toLocaleString('pt-PT', {
                                                style: 'currency',
                                                currency: 'EUR',
                                                minimumFractionDigits: 0,
                                              })}
                                            </div>
                                            <StatusBadge status={lead.status} />
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </Link>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </ScrollArea>
                      </div>
                    )}
                  </Droppable>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default LeadsKanban;
