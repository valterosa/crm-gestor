# 🔑 Guia de Configuração do Codacy Project Token

Este guia irá ajudar-te a configurar o Project Token do Codacy para análise de qualidade de código.

## 📋 **Passo 1: Obter o Project Token**

### 1.1 Aceder ao Codacy Dashboard
1. Vai a: **https://app.codacy.com/**
2. Faz login na tua conta GitHub
3. Navega para o projeto: **`valterosa/crm-gestor`**

### 1.2 Configurações do Projeto
1. Clica no ícone **"Settings"** (⚙️) no menu lateral
2. Vai para **"Integrations"**
3. Clica em **"Project API"**
4. Copia o **"Project Token"** (algo como: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## 🔧 **Passo 2: Configurar o Token Localmente**

### 2.1 Opção A: PowerShell (Recomendado)
```powershell
# Definir token para a sessão atual
$env:CODACY_PROJECT_TOKEN = "SEU_TOKEN_AQUI"

# Verificar se foi definido
echo $env:CODACY_PROJECT_TOKEN
```

### 2.2 Opção B: Script Automático
```powershell
# Execute o script de configuração
.\setup-codacy-token.ps1
```

### 2.3 Opção C: Permanente (Windows)
```powershell
# Tornar permanente para o utilizador
[Environment]::SetEnvironmentVariable("CODACY_PROJECT_TOKEN", "SEU_TOKEN_AQUI", "User")

# Reiniciar PowerShell ou VS Code após esta configuração
```

## 📊 **Passo 3: Testar a Configuração**

### 3.1 Instalar Codacy CLI
```powershell
# Via NPM
npm run codacy:install

# Ou globalmente
npm install -g @codacy/codacy-analysis-cli
```

### 3.2 Executar Análise Local
```powershell
# Análise local (sem upload)
npm run codacy:analyze

# Análise completa com upload
npm run codacy:upload

# Apenas ESLint local
npm run codacy:local
```

### 3.3 Verificar Resultados
```powershell
# Ver resultados locais
Get-Content codacy-results.json | ConvertFrom-Json

# Verificar se upload funcionou
# Vai ao dashboard do Codacy para ver os resultados
```

## 📁 **Arquivos Criados**

- **`.codacy.yml`** - Configuração do Codacy
- **`setup-codacy-token.ps1`** - Script de configuração
- **`.env.example`** - Variáveis de ambiente (atualizado)
- **`package.json`** - Scripts NPM adicionados

## 🚀 **Scripts NPM Disponíveis**

```json
{
  "codacy:install": "Instalar Codacy CLI",
  "codacy:analyze": "Análise local sem upload",
  "codacy:upload": "Análise completa com upload",
  "codacy:local": "Apenas ESLint local"
}
```

## ⚠️ **Problemas Comuns**

### Token não encontrado
```powershell
# Verificar se token está definido
if ($env:CODACY_PROJECT_TOKEN) {
    Write-Host "Token configurado: $($env:CODACY_PROJECT_TOKEN.Substring(0,8))..."
} else {
    Write-Host "Token NÃO configurado!"
}
```

### Permissões PowerShell
```powershell
# Se houver erro de execução de scripts
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### CLI não instalado
```powershell
# Verificar instalação
codacy-analysis-cli --version

# Se não funcionar, reinstalar
npm uninstall -g @codacy/codacy-analysis-cli
npm install -g @codacy/codacy-analysis-cli
```

## 🎯 **Próximos Passos**

1. ✅ Configurar o token (este guia)
2. 🔍 Executar primeira análise
3. 📊 Revisar resultados no dashboard
4. 🔄 Configurar CI/CD (opcional)
5. 📈 Monitorizar qualidade contínua

## 📞 **Suporte**

Se tiveres problemas:
1. Verifica se o token está correto
2. Confirma permissões do repositório
3. Testa com análise local primeiro
4. Consulta: https://docs.codacy.com/

---

**✨ Depois de configurares, executa:** `npm run codacy:upload`
