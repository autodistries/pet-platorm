git clone https://github.com/autodistries/pet-platorm.git
# 🍎 Guide d'installation macOS

Ce guide décrit comment exécuter Pet Platform sur macOS (Intel ou Apple Silicon) avec la nouvelle stack MongoDB.

## 📋 Prérequis

### Homebrew (optionnel mais conseillé)

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Node.js & pnpm

```bash
brew install node
npm install -g pnpm  # ou brew install pnpm
```

> Préférez `nvm` si vous gérez plusieurs versions de Node : `brew install nvm && nvm install --lts`.

### MongoDB

Deux options s'offrent à vous :

1. **MongoDB Atlas** → aucune installation locale, recommandé.
2. **MongoDB local** → installez la Community Edition.

#### Installer MongoDB Community Edition

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

Pour les transactions (commandes), activez un replica set :

```bash
mongosh --eval 'rs.initiate({_id:"rs0", members:[{_id:0, host:"127.0.0.1:27017"}]})'
```

## 🚀 Installation du projet

```bash
cd ~/Documents  # dossier de votre choix

cd pet-platorm
pnpm install
cp .env.example .env.local
```

Modifiez `.env.local` pour y placer votre URI MongoDB :

```env
MONGODB_URI=mongodb://127.0.0.1:27017/?replicaSet=rs0
MONGODB_DB_NAME=pet-platform
JWT_SECRET=change-me-in-production
```

## ▶️ Démarrer

```bash
pnpm run dev       # mode développement
pnpm run build     # build production
pnpm run start     # serveur production
pnpm run lint      # vérification lint
```

Le site répond sur **http://localhost:8080**.

## 🔧 Astuces macOS

- Sur Apple Silicon, les dépendances Node/MongoDB fonctionnent nativement (pas besoin de Rosetta).
- `brew services list` permet de vérifier si MongoDB est bien démarré.
- Pour arrêter MongoDB géré par Homebrew : `brew services stop mongodb-community@7.0`.

## 🐛 Dépannage

### `ECONNREFUSED` lors de l'accès à MongoDB
- Vérifiez que le service MongoDB est démarré (`brew services list`).
- Si vous utilisez Atlas, autorisez votre IP et vérifiez le mot de passe.
- Confirmez que `MONGODB_DB_NAME` correspond à la base attendue.

### App vide (pas de produits)
- Ajoutez des catégories/produits via `/admin`.
- Importez vos données avec `mongoimport` :

```bash
mongoimport --uri "$MONGODB_URI" --db "$MONGODB_DB_NAME" --collection products --file ./data/products.json --jsonArray
```

### Erreurs de certificats (Atlas)
- Assurez-vous d'utiliser une URI `mongodb+srv://`.
- Ajoutez `tls=true` ou `retryWrites=true&w=majority` si nécessaire.

## 🧰 Outils utiles

- **VS Code** : `brew install --cask visual-studio-code`
- **TablePlus** / **MongoDB Compass** pour explorer la base
- **iTerm2** + **oh-my-zsh** pour un terminal amélioré

```bash
brew install --cask mongodb-compass
brew install --cask iterm2
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 📚 Pour aller plus loin

- [README](README.md)
- [Guide base de données](SETUP_DATABASE.md)
- [Guide Linux](LINUX.md) pour la configuration côté serveur
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
