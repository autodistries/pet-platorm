# 📚 Index de la Documentation

Bienvenue ! Voici tous les fichiers de documentation disponibles, organisés par usage.

## 🚀 Pour commencer (Lecture obligatoire)

### 1. [QUICK_START.md](./QUICK_START.md)
**⏱️ 2 minutes**  
Guide ultra-rapide pour démarrer en 30 secondes.  
👉 **Commencez par ici si vous êtes pressé !**

### 2. [README.md](./README.md)
**⏱️ 5 minutes**  
Documentation complète du projet avec toutes les commandes.  
👉 **Vue d'ensemble du projet**

### 🐧 [LINUX.md](./LINUX.md) - NOUVEAU !
**⏱️ 10 minutes**  
Guide spécifique pour Linux (Ubuntu, Fedora, Arch, etc.)  
👉 **Si vous utilisez Linux**

---

## 🗄️ Base de données

### 3. [SETUP_DATABASE.md](./SETUP_DATABASE.md) ⭐ **RECOMMANDÉ**
**⏱️ 10 minutes**  
Guide complet de configuration de PostgreSQL avec Docker.  
Inclut :
- ✅ Installation pas à pas
- ✅ Commandes Docker
- ✅ Dépannage
- ✅ Gestion des mots de passe
- ✅ Comptes de test
- ✅ Connexion à la base

👉 **Lisez ceci pour tout comprendre sur la base de données**

### 4. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
**⏱️ 15 minutes**  
Architecture détaillée de la base de données avec diagrammes.  
Inclut :
- 📊 Diagramme des relations
- 📋 Description de chaque table
- 🔑 Contraintes et index
- 💡 Exemples de requêtes SQL
- 📈 Optimisations

👉 **Pour comprendre la structure des données**

### 5. [ALTERNATIVES_DB.md](./ALTERNATIVES_DB.md)
**⏱️ 8 minutes**  
Solutions alternatives si Docker ne fonctionne pas.  
Options :
- 🌐 Supabase (cloud gratuit)
- 💻 PostgreSQL local
- 🐘 ElephantSQL
- 🔧 Neon

👉 **Si Docker ne marche pas sur votre machine**

---

## 📝 Notes et scripts

### 6. [notes.md](./notes.md)
Historique des commandes et notes de développement.

---

## 🛠️ Fichiers techniques

### Scripts de base de données
- **scripts/init-db.sql** - Script d'initialisation complet
- **scripts/01-create-tables.sql** - Création des tables (ancien)
- **scripts/02-seed-data.sql** - Données de test (ancien)
- **scripts/migration-add-admin.sql** - Migration pour ajouter les admins
- **scripts/generate-hashes.js** - Générateur de hash bcrypt

### Configuration
- **docker-compose.yml** - Configuration PostgreSQL
- **.env.local** - Variables d'environnement (local)
- **.env.example** - Template des variables
- **middleware.ts** - Protection des routes admin
- **start.ps1** - Script de démarrage automatique

---

## 📖 Guide de lecture recommandé

### Débutant (Première installation)
```
1. QUICK_START.md       → Comprendre les bases
2. SETUP_DATABASE.md    → Installer la base de données
3. README.md            → Vue d'ensemble du projet
```

### Développeur (Comprendre l'architecture)
```
1. DATABASE_SCHEMA.md   → Architecture des données
2. SETUP_DATABASE.md    → Configuration avancée
3. Code source          → Implémentation
```

### Problèmes techniques
```
1. SETUP_DATABASE.md (section Dépannage)
2. ALTERNATIVES_DB.md   → Si Docker ne marche pas
3. README.md (Commandes utiles)
```

---

## 🎯 Par objectif

### "Je veux juste lancer le projet"
→ [QUICK_START.md](./QUICK_START.md)

### "Je veux comprendre la base de données"
→ [SETUP_DATABASE.md](./SETUP_DATABASE.md)  
→ [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

### "Docker ne fonctionne pas chez moi"
→ [ALTERNATIVES_DB.md](./ALTERNATIVES_DB.md)

### "Je veux voir les comptes de test"
→ [SETUP_DATABASE.md](./SETUP_DATABASE.md) (section Comptes)  
→ [QUICK_START.md](./QUICK_START.md) (section Connexion)

### "Je veux modifier la structure de la base"
→ [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)  
→ `scripts/init-db.sql`

### "Je veux créer un nouveau compte admin"
→ [SETUP_DATABASE.md](./SETUP_DATABASE.md) (Gestion des mots de passe)  
→ `scripts/generate-hashes.js`

---

## 📞 Informations importantes

### 🔐 Comptes de test

**Admin**
- Email: `admin@petshop.com`
- Password: `Admin123!`
- URL: http://localhost:3000/admin

**Client**
- Email: `marie.dubois@email.com`
- Password: `Marie123!`

### 🌐 URLs importantes

- Site web: http://localhost:3000
- Login: http://localhost:3000/auth/login
- Admin: http://localhost:3000/admin
- Base de données: localhost:5432

### ⚡ Commandes rapides

```powershell
# Tout démarrer
.\start.ps1

# Juste la base de données
pnpm run db:start

# Juste le serveur
pnpm run dev

# Réinitialiser la base
pnpm run db:reset
```

---

## 🆘 En cas de problème

1. **Lisez d'abord** [SETUP_DATABASE.md](./SETUP_DATABASE.md) section Dépannage
2. **Vérifiez** que Docker Desktop est installé et démarré
3. **Essayez** de réinitialiser : `pnpm run db:reset`
4. **Sinon** essayez une [alternative](./ALTERNATIVES_DB.md)

---

## 📊 Statistiques de la documentation

- **5 guides** de documentation
- **10 fichiers** de configuration
- **5 scripts** SQL/JavaScript
- **2 comptes** de test préconfigurés
- **4 alternatives** à Docker

---

**Dernière mise à jour** : Configuration initiale de la base de données  
**Auteur** : GitHub Copilot  
**Version** : 1.0
