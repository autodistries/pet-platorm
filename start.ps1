# Script de demarrage rapide pour Windows PowerShell
# Usage: .\start.ps1

Write-Host ""
Write-Host "Demarrage de Pet Platform..." -ForegroundColor Cyan
Write-Host ""

# Verifier si Docker est installe
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker n'est pas installe!" -ForegroundColor Red
    Write-Host "Telechargez Docker Desktop: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    exit 1
}

# Verifier si Docker tourne
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker Desktop n'est pas demarre" -ForegroundColor Yellow
    Write-Host "Veuillez lancer Docker Desktop et reessayer" -ForegroundColor Yellow
    exit 1
}

Write-Host "Docker est pret" -ForegroundColor Green

# Verifier si le conteneur PostgreSQL existe deja
$container = docker ps -a --filter "name=pet-platform-db" --format "{{.Names}}"

if ($container -eq "pet-platform-db") {
    Write-Host "Conteneur PostgreSQL trouve" -ForegroundColor Green
    
    # Verifier s'il est deja en cours d'execution
    $running = docker ps --filter "name=pet-platform-db" --format "{{.Names}}"
    
    if ($running -eq "pet-platform-db") {
        Write-Host "PostgreSQL est deja en cours d'execution" -ForegroundColor Green
    } else {
        Write-Host "Demarrage de PostgreSQL..." -ForegroundColor Cyan
        docker start pet-platform-db
        Start-Sleep -Seconds 3
        Write-Host "PostgreSQL demarre" -ForegroundColor Green
    }
} else {
    Write-Host "Creation et demarrage de PostgreSQL..." -ForegroundColor Cyan
    docker-compose up -d
    
    Write-Host "Attente de l'initialisation de la base de donnees..." -ForegroundColor Cyan
    Start-Sleep -Seconds 8
    Write-Host "PostgreSQL cree et initialise" -ForegroundColor Green
}

Write-Host ""
Write-Host "Demarrage du serveur Next.js..." -ForegroundColor Cyan
Write-Host ""
Write-Host "============================================" -ForegroundColor DarkGray
Write-Host "COMPTES DE TEST" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Admin:" -ForegroundColor Magenta
Write-Host "   Email     : admin@petshop.com" -ForegroundColor White
Write-Host "   Password  : Admin123!" -ForegroundColor White
Write-Host ""
Write-Host "Client:" -ForegroundColor Cyan
Write-Host "   Email     : marie.dubois@email.com" -ForegroundColor White
Write-Host "   Password  : Marie123!" -ForegroundColor White
Write-Host ""
Write-Host "============================================" -ForegroundColor DarkGray
Write-Host ""

# Lancer le serveur Next.js
pnpm run dev
