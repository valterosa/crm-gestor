import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TaskPriority, TaskStatus, Tarefa } from "@/types/models";

interface TaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Tarefa | null;
  leadId: string;
  onTaskSaved: (task: Tarefa) => void;
}

const TaskModal = ({
  open,
  onOpenChange,
  task,
  leadId,
  onTaskSaved,
}: TaskModalProps) => {
  const { toast } = useToast();
  const isEditing = !!task;

  const [formData, setFormData] = useState<Partial<Tarefa>>({
    titulo: "",
    descricao: "",
    prazo: new Date().toISOString(),
    status: "pendente",
    prioridade: "media",
    leadId,
  });

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState("09:00");

  // Preencher o formulário quando abrir para edição
  useEffect(() => {
    if (task && open) {
      setFormData({
        ...task,
      });

      const taskDate = new Date(task.prazo);
      setDate(taskDate);
      setHour(format(taskDate, "HH:mm"));
    } else if (open) {
      // Reset para valores padrão se for uma nova tarefa
      setFormData({
        titulo: "",
        descricao: "",
        prazo: new Date().toISOString(),
        status: "pendente",
        prioridade: "media",
        leadId,
      });
      setDate(new Date());
      setHour("09:00");
    }
  }, [task, open, leadId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "prioridade"
          ? (value as TaskPriority)
          : name === "status"
          ? (value as TaskStatus)
          : value,
    }));
  };

  const handleDateTimeChange = () => {
    if (!date) return;

    // Extrair horas e minutos do input de hora
    const [hours, minutes] = hour.split(":").map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes, 0);

    setFormData((prev) => ({ ...prev, prazo: dateTime.toISOString() }));
  };
  // Atualizar o prazo sempre que a data ou hora mudar
  useEffect(() => {
    handleDateTimeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, hour]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    if (!formData.titulo) {
      toast({
        title: "Erro",
        description: "O título da tarefa é obrigatório",
        variant: "destructive",
      });
      return;
    }

    // Gerar ID se for uma nova tarefa
    const savedTask = {
      ...formData,
      id: task?.id || `task-${Date.now()}`,
      responsavelId: task?.responsavelId || "1", // ID padrão ou do usuário atual
    } as Tarefa;

    onTaskSaved(savedTask);

    // Feedback
    toast({
      title: isEditing ? "Tarefa atualizada" : "Tarefa criada",
      description: isEditing
        ? `A tarefa "${savedTask.titulo}" foi atualizada com sucesso.`
        : `A tarefa "${savedTask.titulo}" foi criada com sucesso.`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Tarefa" : "Nova Tarefa"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite os detalhes da tarefa abaixo."
              : "Crie uma nova tarefa para este lead."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="titulo" className="text-right">
                Título
              </Label>
              <Input
                id="titulo"
                name="titulo"
                value={formData.titulo || ""}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descricao" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={formData.descricao || ""}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Data</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "justify-start text-left font-normal w-[200px]",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "dd MMM yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecionar data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>

                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />                  <Input
                    type="time"
                    value={hour}
                    onChange={(e) => { setHour(e.target.value); }}
                    className="w-[120px]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prioridade" className="text-right">
                Prioridade
              </Label>              <Select
                value={formData.prioridade || "media"}
                onValueChange={(value) =>
                  { handleSelectChange("prioridade", value); }
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>              <Select
                value={formData.status || "pendente"}
                onValueChange={(value) => { handleSelectChange("status", value); }}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="em_progresso">Em progresso</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>            <Button
              type="button"
              variant="outline"
              onClick={() => { onOpenChange(false); }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Alterações" : "Criar Tarefa"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
