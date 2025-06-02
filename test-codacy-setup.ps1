# Script para configurar e testar o Codacy
# Uso: .\test-codacy-setup.ps1

Write-Host "🔧 Testando configuração do Codacy..." -ForegroundColor Yellow

# Verificar se o .env existe
if (Test-Path ".env") {
    Write-Host "✅ Arquivo .env encontrado" -ForegroundColor Green
    
    # Carregar variáveis de ambiente
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*?)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    
    $token = $env:CODACY_PROJECT_TOKEN
    if ($token) {
        Write-Host "✅ Token do Codacy encontrado: $($token.Substring(0,8))..." -ForegroundColor Green
    } else {
        Write-Host "❌ Token do Codacy não encontrado no .env" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado" -ForegroundColor Red
    Write-Host "Execute primeiro: .\setup-codacy-token.ps1" -ForegroundColor Yellow
    exit 1
}

# Verificar se o Codacy CLI está instalado
Write-Host "🔍 Verificando instalação do Codacy CLI..." -ForegroundColor Yellow

try {
    $version = & codacy-analysis-cli --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Codacy CLI instalado: $version" -ForegroundColor Green
    } else {
        throw "Não instalado"
    }
} catch {
    Write-Host "❌ Codacy CLI não está instalado" -ForegroundColor Red
    Write-Host "Instalando via npm..." -ForegroundColor Yellow
    
    npm install -g @codacy/codacy-analysis-cli
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Codacy CLI instalado com sucesso" -ForegroundColor Green
    } else {
        Write-Host "❌ Falha na instalação do Codacy CLI" -ForegroundColor Red
        exit 1
    }
}

# Testar análise local
Write-Host "🧪 Executando teste de análise local..." -ForegroundColor Yellow

try {
    $output = & codacy-analysis-cli analyze --directory . --tool eslint --format json --output test-codacy.json --timeout 60 2>&1
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path "test-codacy.json")) {
        $results = Get-Content "test-codacy.json" | ConvertFrom-Json
        Write-Host "✅ Análise local executada com sucesso" -ForegroundColor Green
        Write-Host "📊 Resultados: $($results.Count) issues encontrados" -ForegroundColor Cyan
        
        # Limpar arquivo de teste
        Remove-Item "test-codacy.json" -ErrorAction SilentlyContinue
    } else {
        Write-Host "⚠️  Análise local executada mas sem resultados JSON" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Falha na análise local: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Configuração do Codacy concluída!" -ForegroundColor Green
Write-Host "📋 Comandos disponíveis:" -ForegroundColor Cyan
Write-Host "  npm run codacy:analyze  - Análise local" -ForegroundColor White
Write-Host "  npm run codacy:upload   - Análise e upload" -ForegroundColor White
Write-Host "  npm run codacy:local    - Análise ESLint local" -ForegroundColor White
