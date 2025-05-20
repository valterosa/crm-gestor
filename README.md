
# CRM

Sistema de CRM desenvolvido para a Uniga, otimizado para instalação em servidor Ubuntu 24.04 x64 com Nginx ou Apache.

## Stack Tecnológica

- **Frontend**: React com Vite, TailwindCSS, ShadCN UI
- **Backend**: Node.js + Express + Prisma
- **Base de Dados**: PostgreSQL
- **Autenticação**: JWT com RBAC (gestão de permissões)
- **Armazenamento**: Local para anexos de leads

## Funcionalidades Principais

- Gestão de Utilizadores com Permissões
  - Perfis: Administrador, Gestor de Vendas e Vendedores
  - Controlo de acesso baseado em permissões
  
- Dashboard Inicial
  - KPIs relevantes por utilizador
  - Indicadores de tarefas, eventos e leads

- Gestão de Leads
  - Vistas: Kanban, Tabela e Cartões
  - Drag-and-drop para mover entre estados
  - Filtros e pesquisa avançada

- Calendário
  - Vistas por Dia, Semana e Mês
  - Arrastar e editar eventos
  
- Gestão de Tarefas
  - Vistas Kanban e Lista
  - Tarefas com data, estado, responsável e prioridade

- Perfil e Configurações
  - Gestão de dados pessoais
  - Configurações do sistema

## Requisitos do Sistema

- Node.js v18+
- PostgreSQL 14+
- Nginx ou Apache
- Ubuntu 24.04 LTS x64

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar em modo de desenvolvimento
npm run dev

# Compilar para produção
npm run build
```

## Credenciais de Teste

- **Administrador**: admin@uniga.com / admin123
- **Gestor**: gerente@uniga.com / gerente123
- **Vendedor**: vendedor@uniga.com / vendedor123

## Autor

© Valter Rosa - 2025

