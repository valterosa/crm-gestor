# Documentação da API

A aplicação CRM utiliza uma API para gerir dados e funcionalidades. Aqui estão os principais endpoints disponíveis:

## Autenticação

### Login

**POST** `/api/auth/login`

- **Descrição**: Autentica o utilizador e retorna um token JWT.
- **Parâmetros**:
  - `email` (string): Email do utilizador.
  - `password` (string): Palavra-passe do utilizador.
- **Resposta**:
  ```json
  {
    "token": "<jwt_token>",
    "user": {
      "id": "1",
      "name": "Admin",
      "role": "admin"
    }
  }
  ```

## Leads

### Obter Leads

**GET** `/api/leads`

- **Descrição**: Retorna uma lista de leads.
- **Parâmetros**:
  - `status` (opcional, string): Filtra leads por estado.
- **Resposta**:
  ```json
  [
    {
      "id": "1",
      "nome": "Empresa ABC",
      "status": "novo",
      "valor": 5000
    }
  ]
  ```

### Criar Lead

**POST** `/api/leads`

- **Descrição**: Cria um novo lead.
- **Parâmetros**:
  - `nome` (string): Nome do lead.
  - `email` (string): Email do lead.
  - `telefone` (string): Telefone do lead.
- **Resposta**:
  ```json
  {
    "id": "2",
    "nome": "Empresa XYZ",
    "status": "novo"
  }
  ```

## Tarefas

### Obter Tarefas

**GET** `/api/tarefas`

- **Descrição**: Retorna uma lista de tarefas.
- **Parâmetros**:
  - `responsavelId` (opcional, string): Filtra tarefas por responsável.
- **Resposta**:
  ```json
  [
    {
      "id": "1",
      "titulo": "Contactar cliente",
      "prazo": "2025-05-30",
      "status": "pendente"
    }
  ]
  ```

Para mais detalhes sobre a API, consulte a documentação completa no GitBook.
