
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AuthGuardProps {
  children: ReactNode;
  requiredPermission?: string;
}

const AuthGuard = ({ children, requiredPermission }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, hasPermission, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (requiredPermission && !hasPermission(requiredPermission)) {
      navigate('/denied', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, requiredPermission, hasPermission]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-uniga-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Administradores têm acesso a todas as rotas
  if (user?.role === 'admin') {
    return <>{children}</>;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
