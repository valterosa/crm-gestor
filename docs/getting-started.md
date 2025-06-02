# Guia de Início Rápido

Este guia detalha os passos necessários para instalar, configurar e executar o projeto localmente.

## Pré-requisitos

Certifique-se de que tem os seguintes requisitos instalados no seu sistema:

- **Node.js** (versão 18 ou superior)
- **PostgreSQL** (versão 14 ou superior)
- **Nginx** ou **Apache** (opcional para produção)
- **Ubuntu 24.04 LTS x64** (recomendado para produção)

## Passos para Configuração Local

1. **Clone o Repositório**

   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd crm-gestor
   ```

2. **Instale as Dependências**

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um ficheiro `.env` na raiz do projeto e adicione as seguintes variáveis:

   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
   JWT_SECRET=<sua_chave_secreta>
   ```

4. **Execute o Projeto em Modo de Desenvolvimento**

   ```bash
   npm run dev
   ```

5. **Compilar para Produção**

   ```bash
   npm run build
   ```

6. **Iniciar o Servidor em Produção**
   ```bash
   npm start
   ```

## Notas Adicionais

- Certifique-se de que o PostgreSQL está em execução e configurado corretamente.
- Para mais informações, consulte a documentação completa no GitBook.
