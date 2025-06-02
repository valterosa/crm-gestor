import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAuth } from "@/contexts/useAuth";
import { DashboardMetric, ChartData, Lead, Task, Event } from "@/types";
import { Calendar, CheckSquare, Users, Clipboard } from "lucide-react";

const Dashboard = () => {
  const { user, dataMode } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [leadsData, setLeadsData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [salesData, setSalesData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    // Carregar dados do dashboard
    // Em produção, isso seria carregado a partir da API

    // Métricas
    setMetrics([
      {
        id: "1",
        title: "Leads Activos",
        value: 124,
        previousValue: 98,
        change: 26.5,
        changeType: "positive",
        icon: "users",
      },
      {
        id: "2",
        title: "Tarefas Pendentes",
        value: 42,
        previousValue: 50,
        change: 16,
        changeType: "positive",
        icon: "tasks",
      },
      {
        id: "3",
        title: "Taxa de Conversão",
        value: 28.4,
        previousValue: 22.5,
        change: 26.2,
        changeType: "positive",
        icon: "percent",
      },
      {
        id: "4",
        title: "Receita do Mês",
        value: 78500,
        previousValue: 65000,
        change: 20.8,
        changeType: "positive",
        icon: "euro",
      },
    ]);

    // Dados de gráficos
    setLeadsData({
      labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
      datasets: [
        {
          label: "Novos Leads",
          data: [65, 80, 81, 56, 78, 95],
          backgroundColor: "#0045AC",
        },
        {
          label: "Conversões",
          data: [28, 35, 42, 33, 44, 50],
          backgroundColor: "#00A3E0",
        },
      ],
    });

    setSalesData({
      labels: [
        "Em Negociação",
        "Proposta",
        "Qualificado",
        "Contactado",
        "Novo",
      ],
      datasets: [
        {
          label: "Valor em €",
          data: [65000, 48000, 35000, 28000, 18000],
          backgroundColor: [
            "#0045AC",
            "#00A3E0",
            "#002D62",
            "#FFD100",
            "#EE3124",
          ],
        },
      ],
    });

    // Tarefas pendentes
    setUpcomingTasks([
      {
        id: "1",
        title: "Ligar para Empresa ABC",
        description: "Acompanhamento da proposta",
        dueDate: new Date(Date.now() + 3600000).toISOString(),
        status: "pendente",
        priority: "alta",
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Enviar proposta para XYZ",
        description: "Preparar proposta comercial",
        dueDate: new Date(Date.now() + 86400000).toISOString(),
        status: "pendente",
        priority: "média",
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Acompanhamento de cliente",
        description: "Verificar satisfação após implementação",
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        status: "pendente",
        priority: "baixa",
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // Eventos próximos
    setUpcomingEvents([
      {
        id: "1",
        title: "Reunião com cliente ABC",
        description: "Apresentação da proposta final",
        start: new Date(Date.now() + 7200000).toISOString(),
        end: new Date(Date.now() + 9000000).toISOString(),
        location: "Escritório ABC",
        createdBy: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Demonstração de produto",
        description: "Demonstração para potencial cliente",
        start: new Date(Date.now() + 10800000).toISOString(),
        end: new Date(Date.now() + 12600000).toISOString(),
        location: "Online - Zoom",
        createdBy: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    // Leads recentes
    setRecentLeads([
      {
        id: "1",
        name: "João Silva",
        company: "Empresa ABC",
        email: "joao.silva@abc.com",
        phone: "912345678",
        status: "qualificado",
        value: 15000,
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Maria Pereira",
        company: "XYZ Tecnologia",
        email: "maria.pereira@xyz.com",
        phone: "923456789",
        status: "proposta",
        value: 28000,
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "António Costa",
        company: "Empresa DEF",
        email: "antonio.costa@def.com",
        phone: "934567890",
        status: "novo",
        value: 8500,
        assignedTo: user?.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);
  }, [user]);

  useEffect(() => {
    if (dataMode === "Criar Dados Novos") {
      setMetrics([]);
      setLeadsData({ labels: [], datasets: [] });
      setSalesData({ labels: [], datasets: [] });
      setUpcomingTasks([]);
      setUpcomingEvents([]);
      setRecentLeads([]);
    }
  }, [dataMode]);

  // Função para formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-PT", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  // Função para determinar a cor da prioridade
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta":
        return "text-destructive";
      case "média":
        return "text-yellow-500";
      case "baixa":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  // Função para determinar a cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "novo":
        return "bg-blue-100 text-blue-800";
      case "contactado":
        return "bg-purple-100 text-purple-800";
      case "qualificado":
        return "bg-yellow-100 text-yellow-800";
      case "proposta":
        return "bg-orange-100 text-orange-800";
      case "negociação":
        return "bg-pink-100 text-pink-800";
      case "ganho":
        return "bg-green-100 text-green-800";
      case "perdido":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-gray-500">Bem-vindo de volta, {user?.name}!</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{metric.title}</p>
                <p className="text-2xl font-bold">
                  {metric.title.includes("Receita")
                    ? formatCurrency(metric.value)
                    : metric.title.includes("Taxa")
                    ? `${metric.value}%`
                    : metric.value.toLocaleString("pt-PT")}
                </p>
                <p
                  className={`text-xs flex items-center ${
                    metric.changeType === "positive"
                      ? "text-success"
                      : "text-accent"
                  }`}
                >
                  {metric.changeType === "positive" ? "↑" : "↓"} {metric.change}
                  %
                </p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                {" "}
                {metric.icon === "users" ? (
                  <Users className="h-6 w-6 text-primary" />
                ) : metric.icon === "tasks" ? (
                  <CheckSquare className="h-6 w-6 text-primary" />
                ) : metric.icon === "percent" ? (
                  <Clipboard className="h-6 w-6 text-primary" />
                ) : (
                  <Calendar className="h-6 w-6 text-primary" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Leads e Conversões</CardTitle>
            <CardDescription>Tendência dos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={leadsData.labels.map((label, index) => ({
                    name: label,
                    "Novos Leads": leadsData.datasets[0].data[index],
                    Conversões: leadsData.datasets[1].data[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Novos Leads" fill="#0045AC" />
                  <Bar dataKey="Conversões" fill="#00A3E0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Valor por Estado de Lead</CardTitle>
            <CardDescription>Distribuição do valor potencial</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesData.labels.map((label, index) => ({
                      name: label,
                      value: salesData.datasets[0].data[index],
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesData.labels.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          salesData.datasets[0].backgroundColor instanceof Array
                            ? salesData.datasets[0].backgroundColor[index]
                            : (salesData.datasets[0].backgroundColor as string)
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tarefas e Eventos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" /> Tarefas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority === "alta"
                        ? "Alta"
                        : task.priority === "média"
                        ? "Média"
                        : "Baixa"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Vence em: {formatDate(task.dueDate)}
                  </p>
                </div>
              ))}
              {upcomingTasks.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Não há tarefas pendentes.
                </p>
              )}{" "}
              <div className="text-center mt-2">
                <a
                  href="/tarefas"
                  className="text-primary text-sm hover:underline"
                >
                  Ver todas as tarefas
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <span className="mr-2">{formatDate(event.start)}</span>
                        <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-600">
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Não há eventos próximos.
                </p>
              )}{" "}
              <div className="text-center mt-2">
                <a
                  href="/calendario"
                  className="text-primary text-sm hover:underline"
                >
                  Ver calendário completo
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Leads Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Empresa</th>
                  <th>Estado</th>
                  <th>Valor</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="py-3">{lead.name}</td>
                    <td>{lead.company}</td>
                    <td>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status.charAt(0).toUpperCase() +
                          lead.status.slice(1)}
                      </span>
                    </td>
                    <td>{formatCurrency(lead.value)}</td>
                    <td>
                      {new Date(lead.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
          <div className="text-center mt-4">
            <a href="/leads" className="text-primary text-sm hover:underline">
              Ver todos os leads
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
