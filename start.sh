#!/bin/bash

# Script de démarrage pour Linux/macOS
# Usage: ./start.sh

echo ""
echo "🐾 Démarrage de Pet Platform..."
echo ""

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé!"
    echo "   Installez Docker: https://docs.docker.com/engine/install/"
    exit 1
fi

# Vérifier si Docker tourne
if ! docker info &> /dev/null; then
    echo "⚠️  Docker n'est pas démarré"
    echo "   Lancez Docker et réessayez"
    exit 1
fi

echo "✅ Docker est prêt"

# Vérifier si le conteneur PostgreSQL existe déjà
if [ "$(docker ps -aq -f name=pet-platform-db)" ]; then
    echo "📦 Conteneur PostgreSQL trouvé"
    
    # Vérifier s'il est déjà en cours d'exécution
    if [ "$(docker ps -q -f name=pet-platform-db)" ]; then
        echo "✅ PostgreSQL est déjà en cours d'exécution"
    else
        echo "🔄 Démarrage de PostgreSQL..."
        docker start pet-platform-db
        sleep 3
        echo "✅ PostgreSQL démarré"
    fi
else
    echo "🚀 Création et démarrage de PostgreSQL..."
    docker-compose up -d
    
    echo "⏳ Attente de l'initialisation de la base de données..."
    sleep 8
    echo "✅ PostgreSQL créé et initialisé"
fi

echo ""
echo "🌐 Démarrage du serveur Next.js..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 COMPTES DE TEST"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "👤 Admin:"
echo "   Email     : admin@petshop.com"
echo "   Password  : Admin123!"
echo ""
echo "👤 Client:"
echo "   Email     : marie.dubois@email.com"
echo "   Password  : Marie123!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Lancer le serveur Next.js
pnpm run dev
