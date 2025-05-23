import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="text-primary text-9xl font-bold">404</div>
      <h1 className="mt-4 text-3xl font-semibold text-gray-800">
        Página não encontrada
      </h1>
      <p className="mt-2 text-lg text-gray-600 text-center">
        A página que procura não existe ou foi removida.
      </p>
      <Button
        onClick={() => navigate(isAuthenticated ? "/dashboard" : "/login")}
        className="mt-8"
      >
        {isAuthenticated ? "Voltar para Dashboard" : "Voltar para Login"}
      </Button>
    </div>
  );
};

export default NotFound;
