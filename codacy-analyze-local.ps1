# Script de Análise Codacy (Alternativo)
# Como o Codacy CLI não está disponível via npm, usamos ESLint + upload manual

Write-Host "🔧 Executando análise de qualidade de código..." -ForegroundColor Yellow

# Verificar se .env existe e carregar token
if (Test-Path ".env") {
    Get-Content ".env" | ForEach-Object {
        if ($_ -match "^([^#][^=]*?)=(.*)$") {
            [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
    
    $token = $env:CODACY_PROJECT_TOKEN
    if ($token) {
        Write-Host "✅ Token configurado: $($token.Substring(0,8))..." -ForegroundColor Green
    } else {
        Write-Host "❌ Token não encontrado" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Arquivo .env não encontrado" -ForegroundColor Red
    exit 1
}

# Executar ESLint com formato JSON
Write-Host "🔍 Executando análise ESLint..." -ForegroundColor Yellow

try {
    # Análise completa do projeto
    npm run lint -- --format=json --output-file=eslint-results.json --max-warnings=0 --no-color 2>$null
    
    if (Test-Path "eslint-results.json") {
        $results = Get-Content "eslint-results.json" | ConvertFrom-Json
        $errorCount = ($results | Measure-Object -Property errorCount -Sum).Sum
        $warningCount = ($results | Measure-Object -Property warningCount -Sum).Sum
        
        Write-Host "📊 Análise ESLint concluída:" -ForegroundColor Green
        Write-Host "   Erros: $errorCount" -ForegroundColor $(if($errorCount -gt 0){"Red"}else{"Green"})
        Write-Host "   Avisos: $warningCount" -ForegroundColor $(if($warningCount -gt 0){"Yellow"}else{"Green"})
        
        # Gerar resumo
        if ($errorCount -eq 0 -and $warningCount -eq 0) {
            Write-Host "🎉 Código sem problemas!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Problemas encontrados. Ver eslint-results.json" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  ESLint executado mas sem arquivo de resultados" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Erro na análise ESLint: $($_.Exception.Message)" -ForegroundColor Red
}

# Executar análise TypeScript
Write-Host "🔍 Verificando tipos TypeScript..." -ForegroundColor Yellow

try {
    $tscOutput = & npx tsc --noEmit --pretty false 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Tipos TypeScript corretos" -ForegroundColor Green
    } else {
        Write-Host "❌ Erros de tipo encontrados:" -ForegroundColor Red
        Write-Host $tscOutput -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Não foi possível verificar tipos" -ForegroundColor Yellow
}

# Gerar relatório de segurança básico
Write-Host "🛡️  Verificando dependências..." -ForegroundColor Yellow

try {
    $auditOutput = npm audit --json 2>$null | ConvertFrom-Json
    if ($auditOutput.vulnerabilities) {
        $vulnCount = $auditOutput.metadata.vulnerabilities.total
        Write-Host "🔍 Vulnerabilidades encontradas: $vulnCount" -ForegroundColor $(if($vulnCount -gt 0){"Red"}else{"Green"})
        
        if ($vulnCount -gt 0) {
            Write-Host "Execute: npm audit fix" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Análise de segurança não disponível" -ForegroundColor Yellow
}

Write-Host "`n📋 Relatórios gerados:" -ForegroundColor Cyan
if (Test-Path "eslint-results.json") {
    Write-Host "  📄 eslint-results.json - Análise de código" -ForegroundColor White
}

Write-Host "`n🌐 Para enviar para Codacy:" -ForegroundColor Cyan
Write-Host "  1. Acesse: https://app.codacy.com/gh/valterosa/crm-gestor" -ForegroundColor White
Write-Host "  2. Configure integração com GitHub" -ForegroundColor White
Write-Host "  3. Os commits automáticamente serão analisados" -ForegroundColor White

Write-Host "`n✨ Análise local concluída!" -ForegroundColor Green
