import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import { AppConfigProvider } from "./contexts/AppConfigContext";
import { ThemeInjector } from "./components/ThemeInjector"; // Updated import path
import { MockDataSynchronizer } from "./services/mockDataSync";
import MainLayout from "./components/layout/MainLayout";
import AuthGuard from "./components/AuthGuard";
import ErrorBoundary from "./components/ErrorBoundary";

// Páginas
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const LeadsPage = lazy(() => import("./pages/leads/LeadsPage"));
const LeadDetail = lazy(() => import("./pages/leads/LeadDetail"));
const CalendarView = lazy(() => import("./pages/calendar/CalendarView"));
const TasksPage = lazy(() => import("./pages/tasks/TasksPage"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const Settings = lazy(() => import("./pages/settings/Settings"));
const UserManagement = lazy(() => import("./pages/settings/UserManagement"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <ErrorProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppConfigProvider>
            <ThemeInjector />
            <MockDataSynchronizer />
            <AuthProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense
                  fallback={
                    <div className="flex h-screen items-center justify-center">
                      <span className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></span>
                    </div>
                  }
                >
                  <Routes>
                    {/* Rota pública - Login */}
                    <Route path="/login" element={<Login />} />

                    {/* Rota de acesso negado */}
                    <Route path="/denied" element={<AccessDenied />} />

                    {/* Rotas protegidas - Dashboard */}
                    <Route
                      path="/dashboard"
                      element={
                        <AuthGuard requiredPermission="view_dashboard">
                          <MainLayout>
                            <Dashboard />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Rotas protegidas - Leads */}
                    <Route
                      path="/leads"
                      element={
                        <AuthGuard requiredPermission="view_leads">
                          <MainLayout>
                            <LeadsPage />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/leads/:id"
                      element={
                        <AuthGuard requiredPermission="view_leads">
                          <MainLayout>
                            <LeadDetail />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Rotas protegidas - Calendário */}
                    <Route
                      path="/calendario"
                      element={
                        <AuthGuard requiredPermission="view_calendar">
                          <MainLayout>
                            <CalendarView />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Rotas protegidas - Tarefas */}
                    <Route
                      path="/tarefas"
                      element={
                        <AuthGuard requiredPermission="view_tasks">
                          <MainLayout>
                            <TasksPage />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Rotas protegidas - Perfil de Utilizador */}
                    <Route
                      path="/perfil"
                      element={
                        <AuthGuard>
                          <MainLayout>
                            <UserProfile />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Rotas protegidas - Configurações */}
                    <Route
                      path="/configuracoes"
                      element={
                        <AuthGuard requiredPermission="settings">
                          <MainLayout>
                            <Settings />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/configuracoes/utilizadores"
                      element={
                        <AuthGuard requiredPermission="manage_users">
                          <MainLayout>
                            <UserManagement />
                          </MainLayout>
                        </AuthGuard>
                      }
                    />

                    {/* Redirecionar raiz para dashboard */}
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />

                    {/* Rota 404 */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AuthProvider>
          </AppConfigProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorProvider>
  </ErrorBoundary>
);

export default App;
