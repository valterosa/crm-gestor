import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, Filter, User, Phone, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { getLeadsByStatus } from '@/services/mockData';
import { Lead } from '@/types/models';

const LeadsCards = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Carrega leads do serviço mockado
    const leadsByStatus = getLeadsByStatus();
    const allLeads = Object.values(leadsByStatus).flat();
    setLeads(allLeads);
  }, []);

  const filteredLeads = leads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-end items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar leads..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Todos</DropdownMenuItem>
            <DropdownMenuItem>Os meus leads</DropdownMenuItem>
            <DropdownMenuItem>Leads sem responsável</DropdownMenuItem>
            <DropdownMenuItem>Leads de alto valor</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <Link key={lead.id} to={`/leads/${lead.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg">{lead.nome}</h3>
                        <p className="text-sm text-muted-foreground">{lead.empresa}</p>
                      </div>
                      <StatusBadge status={lead.status} />
                    </div>
                    
                    <div className="flex flex-col space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.telefone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{lead.responsavel?.name || 'Não atribuído'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(lead.dataRegisto), 'dd MMM yyyy', {locale: ptBR})}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-3 border-t">
                      <div className="text-lg font-bold text-uniga-blue">
                        {lead.valor.toLocaleString('pt-PT', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">Nenhum lead encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsCards;
