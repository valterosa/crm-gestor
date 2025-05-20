
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { user, hasPermission, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      permission: 'view_dashboard'
    },
    {
      name: 'Leads',
      path: '/leads',
      icon: <Users className="h-5 w-5" />,
      permission: 'view_leads',
    },
    {
      name: 'Calendário',
      path: '/calendario',
      icon: <Calendar className="h-5 w-5" />,
      permission: 'view_calendar'
    },
    {
      name: 'Tarefas',
      path: '/tarefas',
      icon: <CheckSquare className="h-5 w-5" />,
      permission: 'view_tasks',
    },
    {
      name: 'Configurações',
      path: '/configuracoes',
      icon: <Settings className="h-5 w-5" />,
      permission: 'settings'
    },
  ];

  return (
    <>
      {/* Botão mobile para abrir sidebar */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50" 
        onClick={toggleMobileSidebar}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay para fechar o menu no mobile */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside 
        className={cn(
          "bg-uniga-blue text-white flex flex-col h-screen fixed top-0 left-0 z-50 transition-all duration-300 shadow-lg",
          isCollapsed ? "w-[70px]" : "w-[250px]",
          !isMobileOpen && "hidden md:flex",
          className
        )}
      >
        {/* Header do sidebar */}
        <div className="flex items-center justify-between p-4 border-b border-uniga-darkblue">
          {!isCollapsed && <h2 className="text-xl font-bold">CRM Uniga</h2>}
          <Button 
            variant="ghost"
            size="icon" 
            onClick={toggleSidebar} 
            className="hover:bg-uniga-darkblue rounded-full"
          >
            {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </Button>
        </div>

        {/* Perfil do utilizador */}
        <div className="p-4 border-b border-uniga-darkblue flex items-center gap-3">
          <div className="bg-uniga-lightblue rounded-full h-8 w-8 flex items-center justify-center text-white font-bold">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium truncate">{user?.name}</p>
              <p className="text-xs text-uniga-lightblue">
                {user?.role === 'admin' ? 'Administrador' : 
                 user?.role === 'manager' ? 'Gestor de Vendas' : 'Vendedor'}
              </p>
            </div>
          )}
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              hasPermission(item.permission) && (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-uniga-darkblue transition-colors",
                      isActive(item.path) && "bg-uniga-darkblue"
                    )}
                  >
                    <div>{item.icon}</div>
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              )
            ))}
            
            {/* Link para perfil de usuário */}
            <li>
              <Link 
                to="/perfil" 
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-uniga-darkblue transition-colors",
                  isActive('/perfil') && "bg-uniga-darkblue"
                )}
              >
                <User className="h-5 w-5" />
                {!isCollapsed && <span>Perfil</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-uniga-darkblue">
          <Button 
            variant="ghost" 
            className="flex items-center gap-3 w-full justify-start hover:bg-uniga-darkblue"
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span>Terminar Sessão</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
