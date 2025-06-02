# Codacy Environment Configuration
# Execute este script para configurar as variáveis de ambiente do Codacy

# 🔑 CONFIGURAÇÃO DO PROJECT TOKEN
# Substitua 'SEU_PROJECT_TOKEN_AQUI' pelo token real do Codacy

# Para Windows PowerShell:
Write-Host "🔧 Configurando Codacy Project Token..." -ForegroundColor Yellow

# Defina o token como variável de ambiente da sessão
$env:CODACY_PROJECT_TOKEN = "SEU_PROJECT_TOKEN_AQUI"

# Para tornar permanente (opcional):
# [Environment]::SetEnvironmentVariable("CODACY_PROJECT_TOKEN", "SEU_PROJECT_TOKEN_AQUI", "User")

Write-Host "✅ Token configurado para a sessão atual!" -ForegroundColor Green
Write-Host "📝 Para tornar permanente, descomente a linha do SetEnvironmentVariable" -ForegroundColor Blue

# Verificar se o token foi definido
if ($env:CODACY_PROJECT_TOKEN -eq "SEU_PROJECT_TOKEN_AQUI") {
    Write-Host "⚠️  ATENÇÃO: Substitua 'SEU_PROJECT_TOKEN_AQUI' pelo token real!" -ForegroundColor Red
} else {
    Write-Host "🎉 Token configurado: $($env:CODACY_PROJECT_TOKEN.Substring(0,8))..." -ForegroundColor Green
}
