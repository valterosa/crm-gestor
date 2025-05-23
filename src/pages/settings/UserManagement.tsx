import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { mockUsers } from "@/services/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types";
import { UserRole } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Pencil, Trash, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  confirmPassword?: string;
}

const UserManagement = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "salesperson",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Simular carregamento dos utilizadores
    setUsers(mockUsers);
  }, []);

  useEffect(() => {
    // Preencher formulário quando um utilizador for selecionado para edição
    if (userToEdit) {
      setFormData({
        id: userToEdit.id,
        name: userToEdit.name,
        email: userToEdit.email,
        role: userToEdit.role,
      });
    }
  }, [userToEdit]);

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "salesperson",
      password: "",
      confirmPassword: "",
    });
    setUserToEdit(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As passwords não coincidem.",
        variant: "destructive",
      });
      return;
    }

    // Simular criação de utilizador
    const newUser: User = {
      id: (users.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setOpenCreateDialog(false);
    resetForm();

    toast({
      title: "Utilizador criado",
      description: `${newUser.name} foi adicionado com sucesso.`,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.id) return;

    // Validações
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As passwords não coincidem.",
        variant: "destructive",
      });
      return;
    }

    // Simular edição de utilizador
    setUsers((prev) =>
      prev.map((user) =>
        user.id === formData.id
          ? {
              ...user,
              name: formData.name,
              email: formData.email,
              role: formData.role,
              updatedAt: new Date().toISOString(),
            }
          : user
      )
    );

    setOpenEditDialog(false);
    resetForm();

    toast({
      title: "Utilizador atualizado",
      description: `${formData.name} foi atualizado com sucesso.`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));

    toast({
      title: "Utilizador removido",
      description: "O utilizador foi removido com sucesso.",
    });
  };

  if (!hasPermission("manage_users")) {
    navigate("/denied");
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/configuracoes")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Gestão de Utilizadores</h1>
          </div>
        </div>

        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Utilizador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Utilizador</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo utilizador no sistema.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit}>
              <div className="grid gap-4 py-4">
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
                  <Label htmlFor="role">Perfil</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gestor de Vendas</SelectItem>
                      <SelectItem value="salesperson">Vendedor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpenCreateDialog(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Utilizador</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilizadores do Sistema</CardTitle>
          <CardDescription>
            Gerencie os utilizadores e as suas permissões.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Data de Registo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.role === "admin"
                      ? "Administrador"
                      : user.role === "manager"
                      ? "Gestor de Vendas"
                      : "Vendedor"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), "dd MMM yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Dialog
                        open={openEditDialog && userToEdit?.id === user.id}
                        onOpenChange={(open) => {
                          setOpenEditDialog(open);
                          if (!open) setUserToEdit(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setUserToEdit(user);
                              setOpenEditDialog(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Utilizador</DialogTitle>
                            <DialogDescription>
                              Atualize os dados do utilizador.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Nome</Label>
                                <Input
                                  id="edit-name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Perfil</Label>
                                <Select
                                  value={formData.role}
                                  onValueChange={handleRoleChange}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione um perfil" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">
                                      Administrador
                                    </SelectItem>
                                    <SelectItem value="manager">
                                      Gestor de Vendas
                                    </SelectItem>
                                    <SelectItem value="salesperson">
                                      Vendedor
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-password">
                                  Nova Password (opcional)
                                </Label>
                                <Input
                                  id="edit-password"
                                  name="password"
                                  type="password"
                                  value={formData.password || ""}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-confirmPassword">
                                  Confirmar Nova Password
                                </Label>
                                <Input
                                  id="edit-confirmPassword"
                                  name="confirmPassword"
                                  type="password"
                                  value={formData.confirmPassword || ""}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpenEditDialog(false)}
                              >
                                Cancelar
                              </Button>
                              <Button type="submit">
                                Atualizar Utilizador
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser revertida. O utilizador
                              será permanentemente removido do sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Total: {users.length} utilizadores
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UserManagement;
