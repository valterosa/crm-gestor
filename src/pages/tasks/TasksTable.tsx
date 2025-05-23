import { memo, useMemo, useCallback, useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Search, Plus, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/ui/status-badge";
import { getTarefasByStatus } from "@/services/mockData";
import { Tarefa, TaskStatus, TaskPriority } from "@/types/models";

type SortField =
  | "titulo"
  | "prazo"
  | "status"
  | "prioridade"
  | "responsavel"
  | "lead";
type SortDirection = "asc" | "desc";

const TasksTableComponent = () => {
  const [tasks, setTasks] = useState<Tarefa[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("prazo");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    // Carrega tarefas do serviço mockado
    const tasksByStatus = getTarefasByStatus();
    const allTasks = Object.values(tasksByStatus).flat();
    setTasks(allTasks);
  }, []);

  const filteredTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (task.responsavel?.name &&
            task.responsavel.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (task.lead?.nome &&
            task.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    [tasks, searchTerm]
  );

  const handleSort = useCallback(
    (field: SortField) => {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      // Lógica de ordenação baseada no campo
      if (sortField === "titulo") {
        return sortDirection === "asc"
          ? a.titulo.localeCompare(b.titulo)
          : b.titulo.localeCompare(a.titulo);
      }
      if (sortField === "prazo") {
        return sortDirection === "asc"
          ? new Date(a.prazo).getTime() - new Date(b.prazo).getTime()
          : new Date(b.prazo).getTime() - new Date(a.prazo).getTime();
      }
      if (sortField === "status") {
        return sortDirection === "asc"
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortField === "prioridade") {
        const prioridadeOrder: Record<TaskPriority, number> = {
          baixa: 1,
          media: 2,
          alta: 3,
          urgente: 4,
        };

        return sortDirection === "asc"
          ? prioridadeOrder[a.prioridade] - prioridadeOrder[b.prioridade]
          : prioridadeOrder[b.prioridade] - prioridadeOrder[a.prioridade];
      }
      if (sortField === "responsavel") {
        const aName = a.responsavel?.name || "";
        const bName = b.responsavel?.name || "";

        return sortDirection === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      if (sortField === "lead") {
        const aName = a.lead?.nome || "";
        const bName = b.lead?.nome || "";

        return sortDirection === "asc"
          ? aName.localeCompare(bName)
          : bName.localeCompare(aName);
      }
      return 0;
    });
  }, [filteredTasks, sortField, sortDirection]);

  const isPastDue = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("titulo")}
              >
                Título
                {sortField === "titulo" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("prazo")}
              >
                Prazo
                {sortField === "prazo" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                Estado
                {sortField === "status" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("prioridade")}
              >
                Prioridade
                {sortField === "prioridade" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("responsavel")}
              >
                Responsável
                {sortField === "responsavel" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("lead")}
              >
                Lead
                {sortField === "lead" &&
                  (sortDirection === "asc" ? (
                    <ChevronUp className="inline h-4 w-4 ml-1" />
                  ) : (
                    <ChevronDown className="inline h-4 w-4 ml-1" />
                  ))}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TableRow
                  key={task.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{task.titulo}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {task.descricao}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`${
                        isPastDue(task.prazo) && task.status !== "concluida"
                          ? "text-red-600 font-medium"
                          : ""
                      }`}
                    >
                      {format(new Date(task.prazo), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.prioridade} />
                  </TableCell>
                  <TableCell>
                    {task.responsavel?.name || "Não atribuído"}
                  </TableCell>
                  <TableCell>{task.lead?.nome || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma tarefa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const TasksTable = memo(TasksTableComponent);
export default TasksTable;
