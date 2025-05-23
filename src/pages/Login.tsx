import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [useDemoData, setUseDemoData] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    console.log("handleSubmit called");
    console.log("useDemoData value:", useDemoData);
    console.log("handleSubmit triggered"); // Adicionado para confirmar se a função é chamada

    try {
      // Armazena a escolha do utilizador no localStorage
      localStorage.setItem("useDemoData", JSON.stringify(useDemoData));

      await login(email, password);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err) {
      setError("Email ou password incorretos.");
      toast.error("Falha no login. Verifique as suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          {" "}
          <CardTitle className="text-2xl font-bold text-primary">
            CRM Sistema
          </CardTitle>
          <CardDescription>
            Introduza as suas credenciais para aceder ao sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-testid="login-form"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>{" "}
              <Input
                id="email"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>{" "}
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Modo de Dados</Label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dataMode"
                    checked={useDemoData}
                    onChange={() => {
                      setUseDemoData(true);
                      console.log("useDemoData set to true");
                    }}
                  />
                  Dados Demo
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="dataMode"
                    checked={!useDemoData}
                    onChange={() => {
                      setUseDemoData(false);
                      console.log("useDemoData set to false");
                    }}
                  />
                  Criar Dados Novos
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? "A processar..." : "Entrar"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-gray-500">
            Credenciais de teste:
          </div>{" "}
          <div className="text-xs text-center text-gray-500 space-y-1">
            <p>Admin: admin@empresa.com / admin123</p>
            <p>Gerente: gerente@empresa.com / gerente123</p>
            <p>Vendedor: vendedor@empresa.com / vendedor123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
