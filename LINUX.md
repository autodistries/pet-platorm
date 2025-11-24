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

CREATE DATABASE pet_accessories_db;

### Pare-feu

sudo ufw allow 3000/tcp
## 🎯 Environnements de développement Linux
# 🐧 Guide d'installation Linux

Ce guide couvre la mise en place du projet **Pet Platform** sur les principales distributions Linux, désormais sans dépendance à Docker/PostgreSQL.

## 📋 Prérequis

### Node.js + pnpm

Installez Node.js 18+ et pnpm via la méthode adaptée à votre distribution :

#### Ubuntu / Debian
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pnpm
```

#### Fedora / RHEL / CentOS
```bash
sudo dnf install nodejs npm
sudo npm install -g pnpm
```

#### Arch Linux
```bash
sudo pacman -S nodejs npm
sudo npm install -g pnpm
```

#### Via NVM (recommandé)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc  # ou ~/.zshrc
nvm install --lts
nvm use --lts
npm install -g pnpm
```

### MongoDB

Deux possibilités :

1. **MongoDB Atlas (Cloud)** — simple et gratuit. Créez un cluster, autorisez votre IP, récupérez l'URI.
2. **MongoDB local** — installez le serveur et activez un replica set pour les transactions.

#### Installation rapide de MongoDB Community Edition

##### Ubuntu / Debian
```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server.gpg ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl enable --now mongod
```

##### Fedora
```bash
sudo tee /etc/yum.repos.d/mongodb-org-7.0.repo <<'EOF'
[mongodb-org-7.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/7.0/x86_64/
gpgcheck=1
enabled=1
# Ou télécharger depuis
EOF
sudo dnf install -y mongodb-org
sudo systemctl enable --now mongod
```

##### Arch Linux
```bash
sudo pacman -S mongodb-bin
sudo systemctl enable --now mongodb
```

> 💡 Pour activer les transactions (requises lors de la création de commandes), lancez MongoDB en mode replica set ou utilisez un cluster Atlas.

## 🚀 Installation du projet

```bash
cd ~/projets  # dossier de votre choix
# https://code.visualstudio.com/
cd pet-platorm
pnpm install
cp .env.example .env.local
```

Éditez `.env.local` pour y placer :

```env
MONGODB_URI=mongodb://localhost:27017/?replicaSet=rs0
MONGODB_DB_NAME=pet-platform
JWT_SECRET=change-me-in-production
```

> Ajustez `MONGODB_URI` si vous utilisez Atlas ou une configuration différente.

## ▶️ Lancer l'application

```bash
# Développement
```

### Extensions recommandées
- ESLint
- Prettier
- PostgreSQL (pour gérer la DB)
- Docker (pour gérer les conteneurs)

# Vérifier la qualité du code
pnpm run lint
```

Le front est disponible sur **http://localhost:8080**.

## 🗂️ Gestion de MongoDB en local

```bash
# Vérifier l'état du service

## 📊 Différences Windows vs Linux
# Démarrer / arrêter
sudo systemctl start mongod
sudo systemctl stop mongod

# Consulter les logs
sudo journalctl -u mongod

# Ouvrir un shell MongoDB
mongosh "$MONGODB_URI"
```

## 🐛 Dépannage Linux

### Connexion refusée à MongoDB
- Vérifiez que le service `mongod` est démarré
- Confirmez l'URI (`MONGODB_URI`) et les accès réseau (Atlas)
- Sur un replica set local :

```bash
mongosh --eval 'rs.initiate({_id:"rs0", members:[{_id:0, host:"127.0.0.1:27017"}]})'
```

### Migrations / données manquantes
- Créez des catégories et produits via `/admin`
- Importez vos propres données avec `mongoimport`

### Problèmes de droits de fichier
Si vous avez cloné le repo avec `sudo`, réattribuez les fichiers :

```bash
sudo chown -R "$USER":"$USER" ~/projets/pet-platorm
```

## 🔗 Ressources complémentaires

- [Documentation officielle MongoDB](https://www.mongodb.com/docs/)
- [README du projet](README.md)
- [Guide base de données](SETUP_DATABASE.md)
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
