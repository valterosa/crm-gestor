
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Users, 
  BarChart, 
  Database, 
  Upload, 
  ArrowRight,
  Save
} from 'lucide-react';

const Settings = () => {
  const { hasPermission } = useAuth();
  const [companySettings, setCompanySettings] = useState({
    companyName: 'Uniga CRM',
    companyEmail: 'info@uniga.pt',
    phoneNumber: '+351 210 123 456',
    address: 'Rua das Empresas, 123, Lisboa',
    uploadLimit: '10',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanySettings(prev => ({ ...prev, [name]: value }));
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
        <SettingsIcon className="h-6 w-6 text-uniga-blue" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Utilizadores */}
        {hasPermission('manage_users') && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-uniga-blue" />
                <CardTitle>Utilizadores</CardTitle>
              </div>
              <CardDescription>
                Gerir utilizadores e permissões do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure novos utilizadores, atribua perfis e permissões, e atualize informações existentes.
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
        
        {/* Relatórios */}
        {hasPermission('view_reports') && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-uniga-blue" />
                <CardTitle>Relatórios</CardTitle>
              </div>
              <CardDescription>
                Configurações de relatórios e análises.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure os relatórios disponíveis, periodicidade de envio automático e formatos de exportação.
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
        {hasPermission('admin') && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-uniga-blue" />
                <CardTitle>Base de Dados</CardTitle>
              </div>
              <CardDescription>
                Operações de manutenção da base de dados.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Faça backup, restauração e manutenção da base de dados do sistema.
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
        {hasPermission('admin') && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-uniga-blue" />
                <CardTitle>Ficheiros</CardTitle>
              </div>
              <CardDescription>
                Configurações de upload e armazenamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Configure as permissões de upload, limite de tamanho e tipos de ficheiros permitidos.
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
      
      {/* Configurações da Empresa */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Configurações da Empresa</CardTitle>
            <CardDescription>
              Informações gerais da empresa que serão usadas no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={companySettings.companyName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyEmail">Email de Contacto</Label>
                <Input
                  id="companyEmail"
                  name="companyEmail"
                  type="email"
                  value={companySettings.companyEmail}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Telefone</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={companySettings.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Morada</Label>
                <Input
                  id="address"
                  name="address"
                  value={companySettings.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uploadLimit">Limite de Upload (MB)</Label>
                <Input
                  id="uploadLimit"
                  name="uploadLimit"
                  type="number"
                  value={companySettings.uploadLimit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">
              <Save className="h-4 w-4 mr-2" />
              Guardar Configurações
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default Settings;
