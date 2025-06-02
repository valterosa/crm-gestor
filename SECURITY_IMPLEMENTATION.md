# CRM Security Implementation Guide

## Overview

Este documento descreve a implementação completa de segurança para o sistema CRM, incluindo as medidas implementadas durante o desenvolvimento para facilitar a transição para produção.

## Architecture de Segurança

### 1. Sistema de Validação (Zod)

**Localização**: `src/lib/validation.ts`

- **Schemas implementados**:

  - `loginSchema`: Validação de credenciais de login
  - `userSchema`: Validação de dados de utilizador
  - `leadSchema`: Validação de leads
  - `taskSchema`: Validação de tarefas
  - `companySettingsSchema`: Validação de configurações

- **Funcionalidades**:
  - Validação de tipos TypeScript automática
  - Validação de passwords com regex de força
  - Função helper `validateData()` centralizada

### 2. Sistema de Sanitização (DOMPurify)

**Localização**: `src/lib/security.ts`

- **Funções principais**:

  - `sanitizeInput()`: Sanitização básica anti-XSS
  - `sanitizeObject()`: Sanitização recursiva de objetos
  - `sanitizeEmail()`, `sanitizePhone()`, `sanitizeUrl()`, `sanitizeFilename()`: Funções específicas
  - `detectSqlInjection()`, `detectXss()`: Detecção de ataques

- **Configurações por ambiente**:
  - Desenvolvimento: Validação mais permissiva para debug
  - Produção: Validação rigorosa

### 3. Sistema de Criptografia (CryptoJS)

**Localização**: `src/lib/crypto.ts`

- **Funcionalidades**:

  - `encryptData()` / `decryptData()`: Criptografia AES
  - `hashPassword()` / `verifyPassword()`: Hash de senhas seguro
  - `generateToken()` / `verifyToken()`: JWT simulado para desenvolvimento
  - `SecureStorage`: Armazenamento seguro com criptografia
  - `RateLimiter`: Controlo de tentativas de login

- **Configuração por ambiente**:
  - Desenvolvimento: Simulação para debug fácil
  - Produção: CryptoJS real com chaves de ambiente

### 4. Headers de Segurança

**Localização**: `src/lib/security-headers.ts`

- **Headers implementados**:
  - Content Security Policy (CSP)
  - X-Frame-Options
  - X-Content-Type-Options
  - Strict-Transport-Security (HSTS)
  - X-XSS-Protection
  - Referrer-Policy

### 5. Monitoramento de Segurança

**Localização**: `src/hooks/use-security-monitoring.ts`

- **Funcionalidades**:
  - Detecção em tempo real de atividades suspeitas
  - Log de eventos de segurança
  - Rate limiting automático
  - Alertas de segurança

### 6. Componentes Seguros

**Localização**: `src/components/ui/secure-input.tsx`

- **Componentes**:
  - `SecureInput`: Input com validação e sanitização automática
  - `SecureTextArea`: TextArea segura
  - Hook `useSecureForm`: Gestão de formulários seguros

## Implementação por Componente

### AuthContext

- Integração com `SecureStorage` para tokens
- Validação Zod para login
- Rate limiting integrado
- Gestão segura de sessão

### Login Page

- Validação Zod completa
- SecureInput para todos os campos
- Sanitização automática
- Monitoramento de tentativas suspeitas

### User Profile

- Validação de dados de perfil
- Sanitização de inputs
- Proteção contra XSS

### Security Monitoring Panel

- Interface para visualizar eventos de segurança
- Exportação de relatórios
- Controlo de monitoramento em tempo real

## Configuração de Ambiente

### Variáveis de Ambiente (.env.example)

```env
# Chaves de criptografia
REACT_APP_ENCRYPTION_KEY=your-production-encryption-key-here
REACT_APP_JWT_SECRET=your-jwt-secret-here

# Configurações de segurança
REACT_APP_RATE_LIMIT_WINDOW=900000
REACT_APP_RATE_LIMIT_MAX_ATTEMPTS=5
REACT_APP_SESSION_TIMEOUT=86400000

# Configurações de produção
REACT_APP_SECURE_COOKIES=true
REACT_APP_ENABLE_CSP=true
REACT_APP_ENABLE_HSTS=true

# URLs permitidas para CSP
REACT_APP_CSP_ALLOWED_ORIGINS=https://your-domain.com
REACT_APP_API_BASE_URL=https://api.your-domain.com
```

### Desenvolvimento vs Produção

#### Desenvolvimento

- Simulações para debug mais fácil
- Logs detalhados de segurança
- Validação menos rigorosa
- Armazenamento em localStorage

#### Produção

- Criptografia real (CryptoJS)
- Headers de segurança completos
- Cookies httpOnly
- Validação rigorosa
- Logs de segurança mínimos

## Dependências de Segurança

### Instaladas

- `dompurify ^3.2.6`: Sanitização de HTML/XSS
- `crypto-js ^4.2.0`: Criptografia
- `js-cookie ^3.0.5`: Gestão de cookies
- `zod ^3.23.8`: Validação de schemas
- `@types/dompurify ^3.0.5`: Tipos TypeScript
- `@types/js-cookie ^3.0.6`: Tipos TypeScript

## Padrões de Uso

### 1. Validação de Formulários

```typescript
import { validateData, userSchema } from "@/lib/validation";

const result = validateData(userSchema, formData);
if (!result.success) {
  // Handle validation errors
  console.error(result.errors);
}
```

### 2. Sanitização de Inputs

```typescript
import { sanitizeInput } from "@/lib/security";

const safeInput = sanitizeInput(userInput, {
  allowHtml: false,
  maxLength: 100,
});
```

### 3. Uso de SecureInput

```typescript
import { SecureInput } from "@/components/ui/secure-input";

<SecureInput
  type="email"
  securityContext="login.email"
  onChange={(e) => setValue(e.target.value)}
  autoSanitize={true}
  enableMonitoring={true}
/>;
```

### 4. Monitoramento de Segurança

```typescript
import { useSecurityMonitoring } from "@/hooks/use-security-monitoring";

const { events, monitorInput, exportReport } = useSecurityMonitoring();
```

## Transição para Produção

### Checklist de Segurança

#### ✅ Implementado

- [x] Validação Zod em todos os formulários
- [x] Sanitização DOMPurify
- [x] Criptografia CryptoJS
- [x] Headers de segurança
- [x] Monitoramento em tempo real
- [x] Rate limiting
- [x] Componentes seguros
- [x] Gestão segura de tokens

#### 🔄 Para Produção

- [ ] Configurar chaves de criptografia reais
- [ ] Ativar cookies httpOnly
- [ ] Configurar CSP específico do domínio
- [ ] Implementar logging de segurança centralizado
- [ ] Configurar monitoramento de alertas
- [ ] Testes de penetração
- [ ] Auditoria de segurança

### Configuração de Produção

1. **Variáveis de Ambiente**:

   - Configurar todas as variáveis do `.env.example`
   - Usar chaves criptográficas fortes
   - Definir domínios específicos para CSP

2. **Build de Produção**:

   ```bash
   npm run build
   ```

3. **Configuração do Servidor**:
   - Configurar headers de segurança no servidor web
   - Ativar HTTPS obrigatório
   - Configurar cookies seguros

## Manutenção e Monitoramento

### Logs de Segurança

- Eventos suspeitos são registados automaticamente
- Painel de debug disponível em desenvolvimento
- Exportação de relatórios de segurança

### Atualizações de Segurança

- Verificar dependências regularmente
- Manter bibliotecas de segurança atualizadas
- Revisar configurações periodicamente

### Testes de Segurança

- Testes automáticos de XSS
- Verificação de SQL injection
- Validação de sanitização
- Testes de rate limiting

## Resolução de Problemas

### Problemas Comuns

1. **PowerShell Execution Policy**:

   - Usar caminhos completos para node/npm
   - Configurar política de execução se necessário

2. **Dependências não Instaladas**:

   - Verificar package.json
   - Reinstalar dependências se necessário

3. **Erros de Validação**:

   - Verificar schemas Zod
   - Validar tipos de dados

4. **Problemas de Criptografia**:
   - Verificar chaves de ambiente
   - Confirmar modo de desenvolvimento/produção

## Contatos e Suporte

Para questões de segurança ou implementação, consultar:

- Documentação técnica dos componentes
- Logs de segurança da aplicação
- Painel de monitoramento de debug

---

**Nota**: Esta implementação fornece uma base sólida de segurança para desenvolvimento, com todos os componentes necessários para uma transição suave para produção. Toda a arquitetura foi desenhada para ser facilmente configurável entre ambientes de desenvolvimento e produção.
