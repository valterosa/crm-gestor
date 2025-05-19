
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, Filter, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { getTarefasByStatus } from '@/services/mockData';
import { Tarefa } from '@/types/models';

const TasksCards = () => {
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carrega tarefas do serviço mockado
    const tasksByStatus = getTarefasByStatus();
    const allTasks = Object.values(tasksByStatus).flat();
    setTasks(allTasks);
  }, []);

  const filteredTasks = tasks.filter(task => 
    task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.responsavel?.name && task.responsavel.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (task.lead?.nome && task.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const isPastDue = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Tarefas - Vista Cartões</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card key={task.id} className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">{task.titulo}</h3>
                    <StatusBadge status={task.status} />
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2">{task.descricao}</p>
                  
                  <div className="flex flex-col space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className={`${isPastDue(task.prazo) && task.status !== 'concluida' ? 'text-red-600 font-medium' : ''}`}>
                        {format(new Date(task.prazo), 'dd MMM yyyy', {locale: ptBR})}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{task.responsavel?.name || 'Não atribuído'}</span>
                    </div>
                    
                    {task.lead && (
                      <div className="text-xs text-muted-foreground border-t pt-2 mt-1">
                        <span className="font-medium">Lead:</span> {task.lead.nome}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-auto pt-2">
                    <StatusBadge status={task.prioridade} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksCards;
