import { useState } from "react";
import { useViewPreference } from "@/hooks/useViewPreference";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { KanbanSquare, TableProperties, FileBox } from "lucide-react";
import LeadsKanban from "./LeadsKanban";
import LeadsTable from "./LeadsTable";
import LeadsCards from "./LeadsCards";
import LeadModal from "./LeadModal";
import { Lead } from "@/types/models";
import { useAuth } from "@/contexts/useAuth";

const LeadsPage = () => {
  const { activeView, setActiveView } = useViewPreference("leads");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { dataMode } = useAuth();

  const handleLeadCreated = (lead: Lead) => {
    // Atualiza a visualização quando um lead é criado
    setRefreshTrigger((prev) => prev + 1);
  };

  if (dataMode === "Criar Dados Novos") {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Gestão de Leads</h1>
        <p>Nenhum dado disponível. Crie novos leads para começar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestão de Leads</h1>

        <Tabs
          value={activeView}
          onValueChange={(value) =>
            setActiveView(value as "kanban" | "tabela" | "cartoes")
          }
        >
          <TabsList>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <KanbanSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="tabela" className="flex items-center gap-2">
              <TableProperties className="h-4 w-4" />
              <span className="hidden sm:inline">Tabela</span>
            </TabsTrigger>
            <TabsTrigger value="cartoes" className="flex items-center gap-2">
              <FileBox className="h-4 w-4" />
              <span className="hidden sm:inline">Cartões</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {activeView === "kanban" && (
        <LeadsKanban
          onOpenModal={() => setIsModalOpen(true)}
          refreshTrigger={refreshTrigger}
        />
      )}
      {activeView === "tabela" && (
        <LeadsTable
          onOpenModal={() => setIsModalOpen(true)}
          refreshTrigger={refreshTrigger}
        />
      )}
      {activeView === "cartoes" && (
        <LeadsCards
          onOpenModal={() => setIsModalOpen(true)}
          refreshTrigger={refreshTrigger}
        />
      )}

      <LeadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onLeadCreated={handleLeadCreated}
      />
    </div>
  );
};

export default LeadsPage;
