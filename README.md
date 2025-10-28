# 🐾 Pet Platform - Plateforme e-commerce d'accessoires pour animaux

## 🌍 Compatibilité

✅ **Windows** (PowerShell)  
✅ **Linux** (Bash) - [Guide Linux](./LINUX.md)  
✅ **macOS** (Bash/Zsh)

## 📋 Prérequis

- **Node.js** (v18 ou supérieur)
- **pnpm** (gestionnaire de paquets)
- **Docker Desktop** (pour la base de données PostgreSQL)

## 🚀 Installation

### 1. Installer les dépendances

```powershell
pnpm install
```

### 2. Configurer la base de données

#### Option A : Avec Docker (Recommandé) ⭐

```powershell
# Démarrer PostgreSQL avec Docker
docker-compose up -d

# Vérifier que le conteneur est en cours d'exécution
docker ps
```

La base de données sera automatiquement initialisée avec :
- ✅ Toutes les tables créées
- ✅ Catégories de produits
- ✅ Produits d'exemple
- ✅ Comptes utilisateurs de test

#### Option B : PostgreSQL local

Si vous préférez installer PostgreSQL directement sur Windows :

1. Téléchargez PostgreSQL depuis https://www.postgresql.org/download/windows/
2. Créez une base de données `pet_accessories_db`
3. Exécutez le script `scripts/init-db.sql`

### 3. Variables d'environnement

Le fichier `.env.local` est déjà configuré avec les bonnes valeurs pour Docker.

## 🎮 Utilisation

### Windows
```powershell
# Lancer le serveur de développement
pnpm run dev
```

### Linux / macOS
```bash
# Lancer le serveur de développement
pnpm run dev
```

Le site sera accessible sur : **http://localhost:3000**

## 👤 Comptes de test

### Compte Administrateur
- **Email** : `admin@petshop.com`
- **Mot de passe** : `Admin123!`
- **Accès** : Tableau de bord admin sur `/admin`

### Compte Client
- **Email** : `marie.dubois@email.com`
- **Mot de passe** : `Marie123!`
- **Accès** : Espace client standard

## 📦 Commandes utiles

### Windows (PowerShell)
```powershell
# Arrêter la base de données
docker-compose down

# Redémarrer la base de données (données conservées)
docker-compose restart

# Réinitialiser complètement la base de données
docker-compose down -v
docker-compose up -d

# Voir les logs de la base de données
docker-compose logs postgres

# Se connecter à PostgreSQL
docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db
```

### Linux / macOS (Bash)
```bash
# Arrêter la base de données
docker-compose down

# Redémarrer la base de données (données conservées)
docker-compose restart

# Réinitialiser complètement la base de données
docker-compose down -v && docker-compose up -d

# Voir les logs de la base de données
docker-compose logs postgres

# Se connecter à PostgreSQL
docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db
```

## 🗂️ Structure de la base de données

- **customers** : Utilisateurs (clients et admins)
- **categories** : Catégories de produits
- **products** : Catalogue de produits
- **carts** / **cart_items** : Paniers d'achat
- **orders** / **order_items** : Commandes
- **payments** : Paiements
- **shipments** : Livraisons
- **support_tickets** / **support_messages** : Support client

## 🛠️ Développement

### Tous les OS
```bash
# Build production
pnpm run build

# Lancer en production
pnpm run start

# Linter
pnpm run lint
```

### Scripts de démarrage rapide

**Windows:**
```powershell
.\start.ps1
```

**Linux/macOS:**
```bash
chmod +x start.sh  # Première fois uniquement
./start.sh
```

# lIvrables

Pour render un document .md, allez sur https://codimd.go.tulsacounty.org/new et collez le contenu du document dedans

qsdjfhkjdpjqkdrjlwdlWLxlvsqio
