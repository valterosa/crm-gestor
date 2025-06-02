import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SecureInput } from "@/components/ui/secure-input";
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
import { validateData, loginSchema } from "@/lib/validation";
import { sanitizeInput } from "@/lib/security";

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

    try {
      // Sanitizar inputs antes da validação
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedPassword = sanitizeInput(password);

      // Validar dados com Zod
      const validationResult = validateData(loginSchema, {
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (!validationResult.success) {
        setError(validationResult.errors[0] || "Dados inválidos");
        setIsLoading(false);
        return;
      }

      console.log("handleSubmit called");
      console.log("useDemoData value:", useDemoData);
      console.log("handleSubmit triggered");

      // Armazena a escolha do utilizador no localStorage
      localStorage.setItem("useDemoData", JSON.stringify(useDemoData));

      await login(sanitizedEmail, sanitizedPassword);
      toast.success("Login realizado com sucesso!");
      navigate("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Email ou password incorretos.";
      setError(errorMessage);
      toast.error("Falha no login. " + errorMessage);
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
            {" "}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>{" "}
              <SecureInput
                id="email"
                type="email"
                placeholder="seu.email@empresa.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                securityContext="login.email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>{" "}
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu a password?
                </a>
              </div>{" "}
              <SecureInput
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                securityContext="login.password"
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
            <p>Admin: admin@empresa.com / Admin123</p>
            <p>Gerente: gerente@empresa.com / Gerente123</p>
            <p>Vendedor: vendedor@empresa.com / Vendedor123</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
