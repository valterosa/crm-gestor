
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-uniga-red text-9xl font-bold">403</div>
      <h1 className="mt-4 text-3xl font-semibold text-gray-800">Acesso Negado</h1>
      <p className="mt-2 text-lg text-gray-600">
        Não tem permissão para aceder a esta página.
      </p>
      <Button 
        onClick={() => navigate('/dashboard')}
        className="mt-8 bg-uniga-blue hover:bg-uniga-darkblue"
      >
        Voltar para Dashboard
      </Button>
    </div>
  );
};

export default AccessDenied;
