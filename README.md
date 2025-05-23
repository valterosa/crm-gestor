# CRM Documentation

Bem-vindo à documentação do sistema CRM. Este documento foi estruturado para ser utilizado no GitBook, centralizando todas as informações relevantes sobre o projeto.

## Introdução

O CRM é um sistema completo e generalizável, otimizado para instalação em servidor Ubuntu 24.04 x64 com Nginx ou Apache. Ele é adaptável e personalizável para atender às necessidades de qualquer empresa.

## Stack Tecnológica

- **Frontend**: React com Vite, TailwindCSS, ShadCN UI
- **Backend**: Node.js + Express + Prisma
- **Base de Dados**: PostgreSQL
- **Autenticação**: JWT com RBAC (gestão de permissões)
- **Armazenamento**: Local para anexos de leads

## Funcionalidades Principais

### Gestão de Utilizadores

- Perfis: Administrador, Gestor de Vendas e Vendedores
- Controlo de acesso baseado em permissões

### Dashboard Inicial

- KPIs relevantes por utilizador
- Indicadores de tarefas, eventos e leads

### Gestão de Leads

- Vistas: Kanban, Tabela e Cartões
- Drag-and-drop para mover entre estados
- Filtros e pesquisa avançada

### Calendário

- Vistas por Dia, Semana e Mês
- Arrastar e editar eventos

### Gestão de Tarefas

- Vistas Kanban e Lista
- Tarefas com data, estado, responsável e prioridade

### Perfil e Configurações

- Gestão de dados pessoais
- Configurações do sistema

## Requisitos do Sistema

- Node.js v18+
- PostgreSQL 14+
- Nginx ou Apache
- Ubuntu 24.04 LTS x64

## Guia de Instalação

### Passos para Configuração Local

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente no arquivo `.env`.
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Para compilar para produção:
   ```bash
   npm run build
   ```

## Credenciais de Teste

- **Administrador**: admin@empresa.com / admin123
- **Gestor**: gerente@empresa.com / gerente123
- **Vendedor**: vendedor@empresa.com / vendedor123

## Contribuição

Contribuições são bem-vindas! Siga os passos abaixo para contribuir:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature ou correção de bug:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Descrição da minha feature"
   ```
4. Envie suas alterações:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## Autor

© Valter Rosa - 2025

---

Este documento foi otimizado para ser utilizado no GitBook. Certifique-se de manter as informações atualizadas.
