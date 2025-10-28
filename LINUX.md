# 🐧 Guide d'installation Linux

Ce projet est **100% compatible Linux** ! Voici comment l'installer.

## 📋 Prérequis Linux

### 1. Node.js et pnpm

#### Ubuntu / Debian
```bash
# Installer Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installer pnpm
npm install -g pnpm
```

#### Fedora / RHEL / CentOS
```bash
# Installer Node.js
sudo dnf install nodejs

# Installer pnpm
npm install -g pnpm
```

#### Arch Linux
```bash
# Installer Node.js et npm
sudo pacman -S nodejs npm

# Installer pnpm
npm install -g pnpm
```

#### Avec NVM (recommandé pour tous)
```bash
# Installer NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Recharger le shell
source ~/.bashrc  # ou ~/.zshrc

# Installer Node.js LTS
nvm install --lts
nvm use --lts

# Installer pnpm
npm install -g pnpm
```

### 2. Docker

#### Ubuntu / Debian
```bash
# Mettre à jour les paquets
sudo apt-get update

# Installer Docker
sudo apt-get install -y docker.io docker-compose

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Se déconnecter et reconnecter pour appliquer les changements
# Ou utiliser: newgrp docker

# Démarrer Docker
sudo systemctl start docker
sudo systemctl enable docker
```

#### Fedora
```bash
# Installer Docker
sudo dnf install docker docker-compose

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Arch Linux
```bash
# Installer Docker
sudo pacman -S docker docker-compose

# Démarrer et activer Docker
sudo systemctl start docker
sudo systemctl enable docker

# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER
newgrp docker
```

## 🚀 Installation du projet

### 1. Cloner le projet
```bash
cd ~/projets  # ou votre dossier préféré
git clone https://github.com/autodistries/pet-platorm.git
cd pet-platorm
```

### 2. Installer les dépendances
```bash
pnpm install
```

### 3. Rendre le script de démarrage exécutable
```bash
chmod +x start.sh
```

### 4. Lancer le projet
```bash
./start.sh
```

C'est tout ! 🎉

## 🔧 Commandes Linux spécifiques

### Gestion de Docker

```bash
# Vérifier que Docker tourne
sudo systemctl status docker

# Démarrer Docker
sudo systemctl start docker

# Arrêter Docker
sudo systemctl stop docker

# Voir les conteneurs en cours
docker ps

# Voir tous les conteneurs
docker ps -a

# Voir les logs d'un conteneur
docker logs pet-platform-db

# Entrer dans le conteneur PostgreSQL
docker exec -it pet-platform-db bash
```

### Gestion de la base de données

```bash
# Démarrer PostgreSQL
pnpm run db:start

# Arrêter PostgreSQL
pnpm run db:stop

# Redémarrer PostgreSQL
pnpm run db:restart

# Réinitialiser la base
pnpm run db:reset

# Voir les logs en temps réel
pnpm run db:logs

# Se connecter à PostgreSQL
docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db
```

### Développement

```bash
# Lancer le serveur de développement
pnpm run dev

# Build production
pnpm run build

# Démarrer en production
pnpm run start
```

## 🐛 Dépannage Linux

### Permission refusée pour Docker

**Problème :** `permission denied while trying to connect to the Docker daemon`

**Solution :**
```bash
# Ajouter votre utilisateur au groupe docker
sudo usermod -aG docker $USER

# Appliquer les changements sans redémarrage
newgrp docker

# Ou redémarrer la session
# logout puis login
```

### Docker daemon n'est pas démarré

**Problème :** `Cannot connect to the Docker daemon`

**Solution :**
```bash
# Démarrer Docker
sudo systemctl start docker

# Vérifier le statut
sudo systemctl status docker
```

### Port 5432 déjà utilisé

**Problème :** `port is already allocated`

**Solution :**
```bash
# Voir ce qui utilise le port 5432
sudo lsof -i :5432

# Ou avec netstat
sudo netstat -tulpn | grep 5432

# Arrêter PostgreSQL local s'il tourne
sudo systemctl stop postgresql

# Ou modifier le port dans docker-compose.yml
# ports:
#   - "5433:5432"  # Utiliser 5433 à la place
```

### pnpm: command not found

**Solution :**
```bash
# Installer pnpm globalement
npm install -g pnpm

# Ou avec curl
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Recharger le shell
source ~/.bashrc  # ou ~/.zshrc
```

### Permission refusée pour start.sh

**Problème :** `Permission denied: ./start.sh`

**Solution :**
```bash
# Rendre le script exécutable
chmod +x start.sh

# Puis relancer
./start.sh
```

## 🌐 Alternatives à Docker sur Linux

### Option 1 : PostgreSQL natif (recommandé pour Linux)

#### Ubuntu/Debian
```bash
# Installer PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Démarrer PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Se connecter
sudo -u postgres psql

# Dans psql :
CREATE DATABASE pet_accessories_db;
CREATE USER petadmin WITH PASSWORD 'petpassword123';
GRANT ALL PRIVILEGES ON DATABASE pet_accessories_db TO petadmin;
\q

# Exécuter le script d'initialisation
psql -U petadmin -d pet_accessories_db -f scripts/init-db.sql
```

#### Modifier .env.local
```bash
DATABASE_URL=postgresql://petadmin:petpassword123@localhost:5432/pet_accessories_db
```

### Option 2 : Podman (alternative à Docker)

```bash
# Installer Podman (Ubuntu)
sudo apt-get install podman podman-compose

# Utiliser les mêmes commandes en remplaçant docker par podman
podman-compose up -d
```

## 📁 Permissions des fichiers

Sur Linux, assurez-vous que les permissions sont correctes :

```bash
# Donner les permissions aux scripts
chmod +x start.sh
chmod +x scripts/*.sh  # Si vous avez d'autres scripts

# Vérifier les permissions
ls -la start.sh
```

## 🔒 Sécurité Linux

### Pare-feu

Si vous utilisez `ufw` ou `firewalld` :

```bash
# Autoriser le port 3000 (Next.js)
sudo ufw allow 3000/tcp

# Ou avec firewalld
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### SELinux (Fedora/RHEL/CentOS)

Si vous avez des problèmes avec SELinux :

```bash
# Vérifier le statut
getenforce

# Mode permissif temporaire (pour tester)
sudo setenforce 0

# Désactiver définitivement (non recommandé en production)
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/' /etc/selinux/config
```

## 🎯 Environnements de développement Linux

### VS Code
```bash
# Installer VS Code (Ubuntu)
sudo snap install code --classic

# Ou télécharger depuis
# https://code.visualstudio.com/
```

### Extensions recommandées
- ESLint
- Prettier
- PostgreSQL (pour gérer la DB)
- Docker (pour gérer les conteneurs)

## 📊 Différences Windows vs Linux

| Fonctionnalité | Windows | Linux |
|----------------|---------|-------|
| Script de démarrage | `.\start.ps1` | `./start.sh` |
| Docker Desktop | Obligatoire | Docker Engine suffit |
| PostgreSQL natif | Complexe | Simple (apt/dnf/pacman) |
| Permissions | Automatiques | Nécessite chmod |
| Performance Docker | Virtualisation | Native (meilleure) |

## 🚀 Performance sur Linux

Linux offre généralement **de meilleures performances** pour Docker car :
- Pas de virtualisation (contrairement à Windows)
- Accès direct au kernel Linux
- Moins de ressources consommées
- Démarrage plus rapide

## 💡 Conseils spécifiques Linux

### 1. Utiliser Docker sans sudo
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Optimiser PostgreSQL pour dev
Éditer `/etc/postgresql/XX/main/postgresql.conf` :
```conf
shared_buffers = 256MB
work_mem = 16MB
maintenance_work_mem = 64MB
```

### 3. Alias pratiques
Ajouter à `~/.bashrc` ou `~/.zshrc` :
```bash
alias pet-start='cd ~/projets/pet-platorm && ./start.sh'
alias pet-db='docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db'
alias pet-logs='docker logs -f pet-platform-db'
```

## ✅ Checklist Linux

- [ ] Node.js installé (`node --version`)
- [ ] pnpm installé (`pnpm --version`)
- [ ] Docker installé (`docker --version`)
- [ ] Docker démarré (`docker ps` fonctionne sans sudo)
- [ ] Projet cloné
- [ ] Dépendances installées (`pnpm install`)
- [ ] Script exécutable (`chmod +x start.sh`)
- [ ] Base de données lancée (`./start.sh`)

---

**🐧 Prêt pour Linux !**

Le projet fonctionne parfaitement sur :
- ✅ Ubuntu / Debian
- ✅ Fedora / RHEL / CentOS
- ✅ Arch Linux
- ✅ openSUSE
- ✅ Linux Mint
- ✅ Pop!_OS
- ✅ Manjaro
- ✅ Toute distribution avec Docker
