
import { useState } from 'react';
import { useViewPreference } from '@/hooks/useViewPreference';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { KanbanSquare, TableProperties, FileBox } from 'lucide-react';
import TasksKanban from './TasksKanban';
import TasksTable from './TasksTable'; 
import TasksCards from './TasksCards';

const TasksPage = () => {
  const { activeView, setActiveView } = useViewPreference('tarefas');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestão de Tarefas</h1>
        
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'kanban' | 'tabela' | 'cartoes')}>
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <KanbanSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="tabela" className="flex items-center gap-2">
              <TableProperties className="h-4 w-4" />
              <span className="hidden sm:inline">Tabela</span>
            </TabsTrigger>
            <TabsTrigger value="cartoes" className="flex items-center gap-2">
              <FileBox className="h-4 w-4" />
              <span className="hidden sm:inline">Cartões</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeView === 'kanban' && <TasksKanban />}
      {activeView === 'tabela' && <TasksTable />}
      {activeView === 'cartoes' && <TasksCards />}
    </div>
  );
};

export default TasksPage;
