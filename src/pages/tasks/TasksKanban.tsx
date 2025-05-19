
import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useToast } from '@/hooks/use-toast';
import { getTarefasByStatus } from '@/services/mockData';
import { Tarefa, TaskStatus } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TasksKanban = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Record<TaskStatus, Tarefa[]>>({} as Record<TaskStatus, Tarefa[]>);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carregar tarefas iniciais
    setTasks(getTarefasByStatus());
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
  
    // Se não houver destino ou se o destino for o mesmo que a origem, não faz nada
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }
  
    const sourceStatus = source.droppableId as TaskStatus;
    const destStatus = destination.droppableId as TaskStatus;
  
    // Encontra a tarefa que está sendo arrastada
    const draggedTask = tasks[sourceStatus].find(task => task.id === draggableId);
    if (!draggedTask) return;
  
    // Cria cópias dos arrays de origem e destino
    const newSourceTasks = Array.from(tasks[sourceStatus]);
    const newDestTasks = sourceStatus === destStatus ? 
      newSourceTasks : Array.from(tasks[destStatus]);
  
    // Remove a tarefa da origem
    newSourceTasks.splice(source.index, 1);
  
    // Insere a tarefa no destino com o status atualizado
    const updatedTask = { ...draggedTask, status: destStatus };
    
    if (sourceStatus === destStatus) {
      newSourceTasks.splice(destination.index, 0, updatedTask);
    } else {
      newDestTasks.splice(destination.index, 0, updatedTask);
    }
  
    // Atualiza o estado
    setTasks(prev => ({
      ...prev,
      [sourceStatus]: newSourceTasks,
      [destStatus]: newDestTasks
    }));
  
    // Mostra toast de confirmação
    toast({
      title: "Tarefa atualizada",
      description: `${draggedTask.titulo} movida para ${destStatus === 'pendente' ? 'Pendente' : 
                    destStatus === 'em_progresso' ? 'Em Progresso' : 
                    destStatus === 'concluida' ? 'Concluída' : 'Cancelada'}`,
    });
  };

  const statusColumns: {id: TaskStatus; title: string}[] = [
    { id: 'pendente', title: 'Pendente' },
    { id: 'em_progresso', title: 'Em Progresso' },
    { id: 'concluida', title: 'Concluída' },
    { id: 'cancelada', title: 'Cancelada' },
  ];

  const filteredTasks = Object.fromEntries(
    Object.entries(tasks).map(([status, tasksArray]) => {
      return [status, tasksArray.filter(task => 
        task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.responsavel?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.lead?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )];
    })
  ) as Record<TaskStatus, Tarefa[]>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tarefas - Vista Kanban</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar tarefas..."
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
              <DropdownMenuItem>Todas as tarefas</DropdownMenuItem>
              <DropdownMenuItem>Minhas tarefas</DropdownMenuItem>
              <DropdownMenuItem>Tarefas atrasadas</DropdownMenuItem>
              <DropdownMenuItem>Alta prioridade</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>
      </div>

      <div className="pb-8 overflow-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
            {statusColumns.map((column) => (
              <div key={column.id} className="w-80">
                <div className="bg-gray-100 rounded-t-md p-3 font-medium border">
                  <div className="flex justify-between items-center">
                    <span>{column.title}</span>
                    <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {filteredTasks[column.id]?.length || 0}
                    </span>
                  </div>
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-gray-50 rounded-b-md p-2 min-h-[calc(100vh-270px)] max-h-[calc(100vh-270px)] overflow-y-auto border border-t-0"
                    >
                      {filteredTasks[column.id]?.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="mb-2"
                            >
                              <Card className="hover:shadow-md transition-shadow bg-white">
                                <CardContent className="p-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="font-medium">{task.titulo}</div>
                                    <div className="text-sm text-muted-foreground line-clamp-2">{task.descricao}</div>
                                    
                                    {task.lead && (
                                      <div className="text-xs text-muted-foreground">
                                        Lead: {task.lead.nome}
                                      </div>
                                    )}
                                    
                                    <div className="flex justify-between items-center mt-2">
                                      <div className="flex items-center">
                                        <StatusBadge status={task.prioridade} />
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {format(new Date(task.prazo), 'dd/MM/yyyy')}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TasksKanban;
