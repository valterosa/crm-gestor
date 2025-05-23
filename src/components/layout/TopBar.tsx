import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TopBar = () => {
  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4 md:w-1/3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />{" "}
          <input
            type="text"
            placeholder="Pesquisar..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />{" "}
              <span className="absolute top-1 right-1 bg-accent text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="p-2 font-medium">Notificações</div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer p-3">
              <div>
                <p className="font-medium">Novo lead adicionado</p>
                <p className="text-sm text-gray-500">
                  Empresa ABC solicitou contacto
                </p>
                <p className="text-xs text-gray-400 mt-1">há 5 minutos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-3">
              <div>
                <p className="font-medium">Tarefa atribuída</p>
                <p className="text-sm text-gray-500">Contactar Empresa XYZ</p>
                <p className="text-xs text-gray-400 mt-1">há 30 minutos</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer p-3">
              <div>
                <p className="font-medium">Reunião em breve</p>
                <p className="text-sm text-gray-500">
                  Reunião com Cliente ABC às 15:00
                </p>
                <p className="text-xs text-gray-400 mt-1">há 1 hora</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />{" "}
            <DropdownMenuItem className="cursor-pointer flex justify-center text-primary">
              Ver todas as notificações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
