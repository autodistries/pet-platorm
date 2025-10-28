# 🍎 Guide d'installation macOS

Ce projet est **100% compatible macOS** !

## 📋 Prérequis macOS

### 1. Installer Homebrew (si pas déjà fait)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Installer Node.js et pnpm

```bash
# Installer Node.js
brew install node

# Installer pnpm
npm install -g pnpm

# Ou directement via Homebrew
brew install pnpm
```

### 3. Installer Docker Desktop

**Option 1 : Via le site (recommandé)**
1. Téléchargez Docker Desktop pour Mac : https://www.docker.com/products/docker-desktop/
2. Installez le fichier `.dmg`
3. Lancez Docker Desktop

**Option 2 : Via Homebrew**
```bash
brew install --cask docker
```

## 🚀 Installation du projet

### 1. Cloner le projet
```bash
cd ~/Documents  # ou votre dossier préféré
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

## 🔧 Commandes macOS

Les mêmes commandes que Linux fonctionnent :

```bash
# Lancer tout
./start.sh

# Démarrer seulement la DB
pnpm run db:start

# Démarrer seulement Next.js
pnpm run dev

# Réinitialiser la DB
pnpm run db:reset
```

## 🐛 Dépannage macOS

### Docker Desktop ne démarre pas

**Solution :**
```bash
# Réinitialiser Docker Desktop
# Applications > Docker > Quit Docker Desktop
# Puis relancer depuis Applications
```

### Port 5432 déjà utilisé

**Solution :**
```bash
# Voir ce qui utilise le port
sudo lsof -i :5432

# Si PostgreSQL local tourne
brew services stop postgresql

# Ou modifier le port dans docker-compose.yml
```

### Rosetta 2 (Apple Silicon M1/M2/M3)

Docker Desktop nécessite Rosetta 2 sur Apple Silicon :

```bash
# Installer Rosetta 2
softwareupdate --install-rosetta
```

### Permission refusée pour start.sh

```bash
chmod +x start.sh
./start.sh
```

## 🎯 Spécificités macOS

### Architecture Apple Silicon

Sur les Mac M1/M2/M3, Docker utilise l'architecture ARM64.
Le projet fonctionne parfaitement, mais certaines images Docker peuvent être plus lentes (émulation x86).

Notre configuration utilise `postgres:16-alpine` qui supporte ARM64 nativement ✅

### Paths macOS

```bash
# Fichiers de configuration
~/.docker/config.json

# Base de données locale (si installée)
/usr/local/var/postgresql@16

# Logs Docker Desktop
~/Library/Containers/com.docker.docker/Data/log/
```

## 💡 Alternatives macOS

### PostgreSQL natif avec Homebrew

```bash
# Installer PostgreSQL
brew install postgresql@16

# Démarrer PostgreSQL
brew services start postgresql@16

# Créer la base de données
createdb pet_accessories_db
psql pet_accessories_db

# Dans psql :
CREATE USER petadmin WITH PASSWORD 'petpassword123';
GRANT ALL PRIVILEGES ON DATABASE pet_accessories_db TO petadmin;
\q

# Exécuter le script d'initialisation
psql -U petadmin -d pet_accessories_db -f scripts/init-db.sql
```

**Modifier .env.local :**
```bash
DATABASE_URL=postgresql://petadmin:petpassword123@localhost:5432/pet_accessories_db
```

### Postgres.app (GUI)

Alternative graphique pour macOS :
1. Téléchargez Postgres.app : https://postgresapp.com/
2. Lancez l'application
3. Créez une base de données `pet_accessories_db`
4. Importez `scripts/init-db.sql`

## 🔧 Outils recommandés macOS

### Gestionnaires de base de données
- **Postico** (https://eggerapps.at/postico/) - Interface graphique élégante
- **TablePlus** (https://tableplus.com/) - Multi-DB client
- **pgAdmin** (via Homebrew : `brew install --cask pgadmin4`)

### Éditeurs de code
- **VS Code** : `brew install --cask visual-studio-code`
- **Cursor** : https://cursor.sh/
- **WebStorm** : `brew install --cask webstorm`

### Terminal amélioré
```bash
# Installer iTerm2
brew install --cask iterm2

# Installer oh-my-zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 📊 Performance macOS

### Apple Silicon (M1/M2/M3)
- ✅ Excellente performance native
- ✅ Docker optimisé pour ARM64
- ✅ Next.js très rapide
- ⚠️ Certaines images x86 plus lentes

### Intel Mac
- ✅ Performance identique à Linux
- ✅ Toutes les images Docker compatibles

### Optimisation mémoire Docker

**Augmenter la RAM allouée à Docker :**
1. Docker Desktop > Settings > Resources
2. Memory : 4-8 GB recommandé
3. Apply & Restart

## 🎨 Alias pratiques pour zsh

Ajouter à `~/.zshrc` :

```bash
# Aliases Pet Platform
alias pet-start='cd ~/Documents/pet-platorm && ./start.sh'
alias pet-dev='cd ~/Documents/pet-platorm && pnpm run dev'
alias pet-db='docker exec -it pet-platform-db psql -U petadmin -d pet_accessories_db'
alias pet-logs='docker logs -f pet-platform-db'
alias pet-reset='cd ~/Documents/pet-platorm && pnpm run db:reset'

# Recharger le shell
alias reload='source ~/.zshrc'
```

Puis :
```bash
source ~/.zshrc
```

## ✅ Checklist macOS

- [ ] Homebrew installé (`brew --version`)
- [ ] Node.js installé (`node --version`)
- [ ] pnpm installé (`pnpm --version`)
- [ ] Docker Desktop installé et démarré
- [ ] Projet cloné
- [ ] Dépendances installées (`pnpm install`)
- [ ] Script exécutable (`chmod +x start.sh`)
- [ ] Base de données lancée (`./start.sh`)

## 🆘 Support macOS

### Logs Docker Desktop
```bash
# Voir les logs Docker
cat ~/Library/Containers/com.docker.docker/Data/log/vm/dockerd.log
```

### Réinitialiser complètement Docker
1. Docker Desktop > Troubleshoot > Reset to factory defaults
2. Redémarrer Docker Desktop
3. Relancer `./start.sh`

### Nettoyer Docker
```bash
# Nettoyer les images non utilisées
docker system prune -a

# Nettoyer les volumes
docker volume prune
```

---

**🍎 Tout fonctionne sur macOS !**

Testé sur :
- ✅ macOS Ventura (13.x)
- ✅ macOS Sonoma (14.x)
- ✅ macOS Sequoia (15.x)
- ✅ Apple Silicon (M1/M2/M3)
- ✅ Intel Mac
