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
Guide complet pour connecter MongoDB (Atlas ou local), créer un replica set et lancer le projet.  
Inclut :
- ✅ Installation pas à pas
- ✅ Configuration des variables `MONGODB_URI` / `MONGODB_DB_NAME`
- ✅ Script de seed (`pnpm run seed:mongodb`)
- ✅ Dépannage Atlas / local
- ✅ Comptes de test

👉 **Lisez ceci pour tout comprendre sur la base de données**

### 4. [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
**⏱️ 12 minutes**  
Cartographie des collections MongoDB et relations fonctionnelles.  
Inclut :
- 📊 Diagramme des collections
- 📋 Description de chaque collection & champs clés
- 🔑 Index suggérés
- 💡 Exemples de requêtes MongoDB Aggregation

👉 **Pour comprendre la structure des données**

### 5. [ALTERNATIVES_DB.md](./ALTERNATIVES_DB.md)
**⏱️ 5 minutes**  
Panorama des déploiements MongoDB (Atlas, Docker Community Edition, hébergement managé).  
- ☁️ Atlas (starter gratuit)
- 🖥️ MongoDB Community locale (replica set)
- 🐳 Images officielles Docker

👉 **Choisissez l'infrastructure MongoDB adaptée à votre contexte**

---

## 📝 Notes et scripts

### 6. [notes.md](./notes.md)
Historique des commandes et notes de développement.

---

## 🛠️ Fichiers techniques

### Scripts de base de données
- **scripts/seed-mongodb.js** - Peuplement des collections (MongoDB)
- **scripts/generate-hashes.js** - Générateur de hash bcrypt
- **scripts/01-create-tables.sql** - Ancien schéma PostgreSQL (archive)
- **scripts/02-seed-data.sql** - Données de test PostgreSQL (archive)
- **scripts/migration-add-admin.sql** - Migration PostgreSQL (archive)

### Configuration
- **.env.local** - Variables d'environnement (local)
- **.env.example** - Template des variables
- **middleware.ts** - Protection des routes admin
- **next.config.mjs** - Configuration Next.js
- **app/layout.tsx** - Layout principal

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
2. ALTERNATIVES_DB.md   → Choisir un autre hébergement MongoDB
3. README.md (Commandes utiles)
```

---

## 🎯 Par objectif

### "Je veux juste lancer le projet"
→ [QUICK_START.md](./QUICK_START.md)

### "Je veux comprendre la base de données"
→ [SETUP_DATABASE.md](./SETUP_DATABASE.md)  
→ [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

### "Je veux un autre hébergement MongoDB"
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
- URL: http://localhost:8080/admin

**Client**
- Email: `marie.dubois@email.com`
- Password: `Marie123!`

### 🌐 URLs importantes

- Site web: http://localhost:8080
- Login: http://localhost:8080/auth/login
- Admin: http://localhost:8080/admin
- MongoDB: valeur de `MONGODB_URI`

### ⚡ Commandes rapides

```bash
# Lancer le serveur de développement
pnpm run dev

# Peupler la base de démonstration
pnpm run seed:mongodb

# Construire la version production
pnpm run build

# Vérifier la qualité du code
pnpm run lint
```

---

## 🆘 En cas de problème

1. **Consultez** [SETUP_DATABASE.md](./SETUP_DATABASE.md) (section Dépannage)
2. **Contrôlez** votre connexion MongoDB : `mongosh "$MONGODB_URI" --eval 'db.runCommand({ ping: 1 })'`
3. **Regénérez** les collections si besoin : `pnpm run seed:mongodb`
4. **Changez d'hébergement** via [ALTERNATIVES_DB.md](./ALTERNATIVES_DB.md)

---

## 📊 Statistiques de la documentation

- **5 guides** de documentation
- **8 fichiers** de configuration
- **5 scripts** (1 MongoDB, 4 historiques)
- **2 comptes** de test préconfigurés
- **3 options d'hébergement MongoDB**

---

**Dernière mise à jour** : Migration MongoDB Atlas  
**Auteur** : GitHub Copilot  
**Version** : 1.0
