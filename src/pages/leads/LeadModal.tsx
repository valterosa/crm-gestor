import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockLeads } from "@/services/mockData";
import { Lead, LeadStatus } from "@/types/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

interface LeadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCreated?: (lead: Lead) => void;
}

const LeadModal = ({ open, onOpenChange, onLeadCreated }: LeadModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Lead>>({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    status: "novo",
    valor: 0,
    origem: "Site",
    notas: "",
    responsavelId: "1",
    camposPersonalizados: {},
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "valor") {
      // Remover formatação de moeda e converter para número
      const numericValue = parseFloat(value.replace(/[^0-9]/g, ""));
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Criar um novo lead com os dados do formulário
    const newLead: Lead = {
      id: `${mockLeads.length + 1}`,
      nome: formData.nome || "",
      empresa: formData.empresa || "",
      email: formData.email || "",
      telefone: formData.telefone || "",
      status: (formData.status as LeadStatus) || "novo",
      valor: formData.valor || 0,
      origem: formData.origem || "Site",
      notas: formData.notas || "",
      responsavelId: formData.responsavelId || "1",
      dataRegisto: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      documentos: [],
      camposPersonalizados: formData.camposPersonalizados || {},
    };

    // Adicionar à lista mock (em um cenário real, faria uma chamada à API)
    mockLeads.push(newLead);

    // Notificar o componente pai sobre a criação
    if (onLeadCreated) {
      onLeadCreated(newLead);
    }

    // Mostrar toast de sucesso
    toast({
      title: "Lead criado com sucesso",
      description: `O lead para ${newLead.nome} foi adicionado com sucesso.`,
    });

    // Limpar formulário e fechar modal
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      empresa: "",
      email: "",
      telefone: "",
      status: "novo",
      valor: 0,
      origem: "Site",
      notas: "",
      responsavelId: "1",
      camposPersonalizados: {},
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nome" className="text-right">
                Nome
              </Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="empresa" className="text-right">
                Empresa
              </Label>
              <Input
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="telefone" className="text-right">
                Telefone
              </Label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="valor" className="text-right">
                Valor (€)
              </Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                className="col-span-3"
                min={0}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Estado
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o estado" />
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="origem" className="text-right">
                Origem
              </Label>
              <Select
                value={formData.origem}
                onValueChange={(value) => handleSelectChange("origem", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Referência">Referência</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Feira">Feira</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notas" className="text-right">
                Notas
              </Label>
              <Textarea
                id="notas"
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Lead</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadModal;
