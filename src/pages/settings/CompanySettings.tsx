import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppConfig } from "@/contexts/AppConfigContext";

const CompanySettings = () => {
  const { toast } = useToast();
  const { config, updateConfig } = useAppConfig();

  const [formState, setFormState] = useState({
    companyName: config.companyName,
    companyEmail: config.companyEmail,
    companyDomain: config.companyDomain,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    accentColor: config.accentColor,
    logoUrl: config.logoUrl,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig(formState);
    toast({
      title: "Configurações atualizadas",
      description: "As configurações da empresa foram salvas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Building2 className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Identidade da Empresa</CardTitle>
          <CardDescription>
            Configure as informações e a aparência da sua empresa no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formState.companyName}
                onChange={handleChange}
                placeholder="Ex: Minha Empresa"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email Principal</Label>
              <Input
                id="companyEmail"
                name="companyEmail"
                value={formState.companyEmail}
                onChange={handleChange}
                placeholder="Ex: contato@minhaempresa.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyDomain">Domínio da Empresa</Label>
              <Input
                id="companyDomain"
                name="companyDomain"
                value={formState.companyDomain}
                onChange={handleChange}
                placeholder="Ex: minhaempresa.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="primaryColor">Cor Primária</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={formState.primaryColor}
                    onChange={handleChange}
                    className="w-12"
                  />
                  <Input
                    value={formState.primaryColor}
                    onChange={handleChange}
                    name="primaryColor"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondaryColor">Cor Secundária</Label>
                <div className="flex gap-2">
                  <Input
                    id="secondaryColor"
                    name="secondaryColor"
                    type="color"
                    value={formState.secondaryColor}
                    onChange={handleChange}
                    className="w-12"
                  />
                  <Input
                    value={formState.secondaryColor}
                    onChange={handleChange}
                    name="secondaryColor"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accentColor">Cor de Destaque</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColor"
                    name="accentColor"
                    type="color"
                    value={formState.accentColor}
                    onChange={handleChange}
                    className="w-12"
                  />
                  <Input
                    value={formState.accentColor}
                    onChange={handleChange}
                    name="accentColor"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="logoUrl">URL do Logotipo</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formState.logoUrl}
                onChange={handleChange}
                placeholder="Ex: /logo.png"
              />
            </div>

            <Button type="submit" className="w-full md:w-auto">
              Salvar Configurações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanySettings;
