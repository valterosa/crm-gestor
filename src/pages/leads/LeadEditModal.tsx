import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lead, LeadStatus } from "@/types/models";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { User, AtSign, Phone, Building, Euro, FileText } from "lucide-react";

interface LeadEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
  onLeadUpdated?: (lead: Lead) => void;
}

const LeadEditModal = ({
  open,
  onOpenChange,
  lead,
  onLeadUpdated,
}: LeadEditModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Lead>>({});

  // Preencher o formulário quando o lead mudar ou o modal abrir
  useEffect(() => {
    if (lead && open) {
      setFormData({
        ...lead,
      });
    }
  }, [lead, open]);

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

    if (!lead) return;

    // Criar um lead atualizado com os dados do formulário
    const updatedLead: Lead = {
      ...lead,
      ...(formData as Lead),
      ultimaAtualizacao: new Date().toISOString(),
    };

    // Notificar o componente pai sobre a atualização
    if (onLeadUpdated) {
      onLeadUpdated(updatedLead);
    }

    // Mostrar toast de sucesso
    toast({
      title: "Lead atualizado com sucesso",
      description: `As informações do lead ${updatedLead.nome} foram atualizadas.`,
    });

    // Fechar modal
    onOpenChange(false);
  };

  if (!lead) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl">Editar Lead</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {lead.empresa} - {lead.nome}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4 max-h-[70vh] overflow-y-auto pr-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="info">Informações Básicas</TabsTrigger>
                <TabsTrigger value="contato">Contacto</TabsTrigger>
                <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              </TabsList>

              {/* Aba de Informações Básicas */}
              <TabsContent value="info" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Dados Principais</h3>
                </div>
                <Separator className="mb-4" />

                {/* Layout de 2 colunas em telas maiores */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="empresa">Empresa</Label>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="empresa"
                        name="empresa"
                        value={formData.empresa || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status || lead.status}
                    onValueChange={(value) =>
                      handleSelectChange("status", value)
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="origem">Origem</Label>
                  <Select
                    value={formData.origem || lead.origem}
                    onValueChange={(value) =>
                      handleSelectChange("origem", value)
                    }
                  >
                    <SelectTrigger>
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

                <div className="space-y-2">
                  <Label htmlFor="valor" className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    Valor (€)
                  </Label>
                  <Input
                    id="valor"
                    name="valor"
                    type="number"
                    value={formData.valor || 0}
                    onChange={handleChange}
                    min={0}
                  />
                </div>
              </TabsContent>

              {/* Aba de Contato */}
              <TabsContent value="contato" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <AtSign className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Informações de Contacto</h3>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Espaço para dados adicionais de contato no futuro */}
                <div className="mt-4 p-4 bg-muted/50 rounded-md">
                  <p className="text-sm text-muted-foreground">
                    Os detalhes de contato são usados para comunicações
                    importantes relacionadas ao lead.
                  </p>
                </div>
              </TabsContent>

              {/* Aba de Detalhes */}
              <TabsContent value="detalhes" className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Detalhes Adicionais</h3>
                </div>
                <Separator className="mb-4" />

                <div className="space-y-2">
                  <Label htmlFor="notas">Notas</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    value={formData.notas || ""}
                    onChange={handleChange}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Campos personalizados */}
                {Object.keys(lead.camposPersonalizados).length > 0 && (
                  <Card className="mt-4">
                    <CardHeader className="py-3">
                      <CardTitle className="text-sm font-medium">
                        Campos Personalizados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-2 space-y-4">
                      {Object.entries(lead.camposPersonalizados).map(
                        ([chave, valor], index) => (
                          <div key={chave} className="space-y-2">
                            <Label htmlFor={`campo-${chave}`}>{chave}</Label>
                            <Input
                              id={`campo-${chave}`}
                              name={`camposPersonalizados.${chave}`}
                              value={
                                formData.camposPersonalizados?.[chave] || valor
                              }
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  camposPersonalizados: {
                                    ...(prev.camposPersonalizados || {}),
                                    [chave]: e.target.value,
                                  },
                                }));
                              }}
                            />
                            {index <
                              Object.entries(lead.camposPersonalizados).length -
                                1 && <Separator className="my-2" />}
                          </div>
                        )
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter className="mt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Guardar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadEditModal;
