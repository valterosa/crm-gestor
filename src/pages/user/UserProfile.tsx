import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Lock } from "lucide-react";
import { validateData, userSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/security";

const UserProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sanitizar inputs
      const sanitizedName = sanitizeInput(formData.name);
      const sanitizedEmail = sanitizeInput(formData.email);

      // Validar dados
      const validationResult = validateData(userSchema, {
        name: sanitizedName,
        email: sanitizedEmail,
        role: user?.role || "salesperson",
      });

      if (!validationResult.success) {
        toast({
          title: "Erro de validação",
          description: validationResult.errors[0] || "Dados inválidos",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Perfil atualizado",
        description: "As suas informações foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Sanitizar passwords
      const sanitizedCurrentPassword = sanitizeInput(formData.currentPassword);
      const sanitizedNewPassword = sanitizeInput(formData.newPassword);
      const sanitizedConfirmPassword = sanitizeInput(formData.confirmPassword);

      // Validar dados
      const validationResult = validateData(userSchema, {
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "salesperson",
        password: sanitizedNewPassword,
        confirmPassword: sanitizedConfirmPassword,
      });

      if (!validationResult.success) {
        toast({
          title: "Erro de validação",
          description: validationResult.errors[0] || "Password inválida",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Password atualizada",
        description: "A sua password foi atualizada com sucesso.",
      });

      // Limpar os campos de password
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar password.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">O Meu Perfil</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Perfil</CardTitle>
              <CardDescription>
                Atualize as suas informações pessoais de perfil.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleProfileSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nível de Acesso</Label>
                  <div className="p-2 bg-gray-100 rounded-md">
                    {user?.role === "admin"
                      ? "Administrador"
                      : user?.role === "manager"
                      ? "Gestor de Vendas"
                      : "Vendedor"}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  Guardar Alterações
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Password</CardTitle>
              <CardDescription>
                Atualize a sua password de acesso.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handlePasswordSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Atual</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nova Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirmar Nova Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto">
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;
