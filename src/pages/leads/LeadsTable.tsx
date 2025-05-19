
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Plus, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { StatusBadge } from '@/components/ui/status-badge';
import { getLeadsByStatus } from '@/services/mockData';
import { Lead, LeadStatus } from '@/types/models';

type SortField = 'nome' | 'empresa' | 'valor' | 'dataRegisto' | 'status';
type SortDirection = 'asc' | 'desc';

const LeadsTable = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('dataRegisto');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    // Carrega leads do serviço mockado
    const leadsByStatus = getLeadsByStatus();
    const allLeads = Object.values(leadsByStatus).flat();
    setLeads(allLeads);
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    // Lógica de ordenação baseada no campo
    if (sortField === 'nome') {
      return sortDirection === 'asc' 
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    }
    if (sortField === 'empresa') {
      return sortDirection === 'asc'
        ? a.empresa.localeCompare(b.empresa)
        : b.empresa.localeCompare(a.empresa);
    }
    if (sortField === 'valor') {
      return sortDirection === 'asc'
        ? a.valor - b.valor
        : b.valor - a.valor;
    }
    if (sortField === 'dataRegisto') {
      return sortDirection === 'asc'
        ? new Date(a.dataRegisto).getTime() - new Date(b.dataRegisto).getTime()
        : new Date(b.dataRegisto).getTime() - new Date(a.dataRegisto).getTime();
    }
    if (sortField === 'status') {
      return sortDirection === 'asc'
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    return 0;
  });

  const filteredLeads = sortedLeads.filter(lead => 
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Leads - Vista Tabela</h1>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('nome')}
              >
                Nome
                {sortField === 'nome' && (
                  sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('empresa')}
              >
                Empresa
                {sortField === 'empresa' && (
                  sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead 
                className="cursor-pointer text-right"
                onClick={() => handleSort('valor')}
              >
                Valor
                {sortField === 'valor' && (
                  sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('status')}
              >
                Estado
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('dataRegisto')}
              >
                Data de Registo
                {sortField === 'dataRegisto' && (
                  sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4 ml-1" /> : <ChevronDown className="inline h-4 w-4 ml-1" />
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => window.location.href = `/leads/${lead.id}`}
                >
                  <TableCell className="font-medium">{lead.nome}</TableCell>
                  <TableCell>{lead.empresa}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.telefone}</TableCell>
                  <TableCell className="text-right">
                    {lead.valor.toLocaleString('pt-PT', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0,
                    })}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={lead.status} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(lead.dataRegisto), 'dd MMM yyyy', {locale: ptBR})}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LeadsTable;
