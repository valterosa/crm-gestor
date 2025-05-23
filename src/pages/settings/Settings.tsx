import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useDebugMode } from "@/hooks/use-debug-mode";
import {
  Settings as SettingsIcon,
  Users,
  BarChart,
  Database,
  Upload,
  ArrowRight,
  Save,
  Bug,
  Building2,
} from "lucide-react";
import CompanySettings from "./CompanySettings";

const Settings = () => {
  const { hasPermission } = useAuth();
  const { isDebugMode, toggleDebugMode } = useDebugMode();
  const [showCompanySettings, setShowCompanySettings] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    companyName: "CRM App",
    companyEmail: "info@empresa.com",
    phoneNumber: "+351 210 123 456",
    address: "Rua das Empresas, 123, Lisboa",
    uploadLimit: "10",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações guardadas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      {showCompanySettings ? (
        <>
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowCompanySettings(false)}
            >
              Voltar às Configurações
            </Button>
          </div>
          <CompanySettings />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Configurações da Empresa */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>Empresa</CardTitle>
                </div>
                <CardDescription>
                  Configure identidade visual e informações da empresa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Personalize nome, cores, logo e outras configurações da
                  empresa
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowCompanySettings(true)}
                >
                  <span>Configurar Empresa</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            {/* Utilizadores */}
            {hasPermission("manage_users") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Utilizadores</CardTitle>
                  </div>
                  <CardDescription>
                    Gerir utilizadores e permissões do sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure novos utilizadores, atribua perfis e permissões, e
                    atualize informações existentes.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/configuracoes/utilizadores" className="w-full">
                    <Button variant="outline" className="w-full">
                      <span>Gerir Utilizadores</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )}

            {/* Debug Mode - só aparece para administradores */}
            {hasPermission("admin") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bug className="h-5 w-5 text-primary" />
                    <CardTitle>Ferramentas de Debug</CardTitle>
                  </div>
                  <CardDescription>
                    Configurações avançadas de depuração do sistema.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Ativar o modo de depuração para exibir informações
                      técnicas do sistema. Útil para desenvolvedores e
                      administradores durante a solução de problemas.
                    </p>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="debug-mode" className="font-medium">
                        Modo de Debug
                      </Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {isDebugMode ? "Ativado" : "Desativado"}
                        </span>
                        <Switch
                          id="debug-mode"
                          checked={isDebugMode}
                          onCheckedChange={toggleDebugMode}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground w-full">
                    Nota: O modo de depuração exibe informações técnicas
                    sensíveis e deve ser usado apenas durante a análise de
                    problemas.
                  </div>
                </CardFooter>
              </Card>
            )}

            {/* Relatórios */}
            {hasPermission("view_reports") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-primary" />
                    <CardTitle>Relatórios</CardTitle>
                  </div>
                  <CardDescription>
                    Configurações de relatórios e análises.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure os relatórios disponíveis, periodicidade de envio
                    automático e formatos de exportação.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    <span>Configurar Relatórios</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Base de Dados */}
            {hasPermission("admin") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    <CardTitle>Base de Dados</CardTitle>
                  </div>
                  <CardDescription>
                    Operações de manutenção da base de dados.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Faça backup, restauração e manutenção da base de dados do
                    sistema.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    <span>Gerir Base de Dados</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Uploads */}
            {hasPermission("admin") && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-primary" />
                    <CardTitle>Ficheiros</CardTitle>
                  </div>
                  <CardDescription>
                    Configurações de upload e armazenamento.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Configure as permissões de upload, limite de tamanho e tipos
                    de ficheiros permitidos.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    <span>Configurar Uploads</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Settings;
