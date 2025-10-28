# 🌐 Alternative Supabase (Sans Docker)

Si vous ne pouvez pas ou ne souhaitez pas installer Docker Desktop, utilisez **Supabase** - une base de données PostgreSQL gratuite dans le cloud.

## 🚀 Configuration rapide (5 minutes)

### 1. Créer un compte Supabase

1. Allez sur https://supabase.com
2. Cliquez sur "Start your project"
3. Créez un compte gratuit (GitHub, Google, ou email)

### 2. Créer un nouveau projet

1. Cliquez sur "New Project"
2. Remplissez les informations :
   - **Name** : `pet-platform`
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez le plus proche (ex: Frankfurt pour l'Europe)
   - **Pricing Plan** : Free (gratuit)
3. Cliquez sur "Create new project"
4. Attendez 2-3 minutes que le projet soit créé

### 3. Récupérer l'URL de connexion

1. Dans votre projet Supabase, allez dans **Settings** > **Database**
2. Scrollez jusqu'à "Connection string"
3. Copiez l'URL de type **URI**
   
   Elle ressemble à :
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

### 4. Configurer votre projet

Modifiez le fichier `.env.local` :

```bash
# Remplacez par votre URL Supabase
DATABASE_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE@db.xxxxx.supabase.co:5432/postgres

JWT_SECRET=votre-secret-jwt-super-securise
NODE_ENV=development
```

### 5. Initialiser la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Cliquez sur "New query"
3. Ouvrez le fichier `scripts/init-db.sql` de votre projet
4. Copiez TOUT le contenu
5. Collez-le dans l'éditeur SQL de Supabase
6. Cliquez sur "Run" (ou appuyez sur Ctrl+Enter)

✅ Votre base de données est maintenant prête !

### 6. Lancer le projet

```powershell
pnpm run dev
```

Ouvrez http://localhost:3000

## ✅ Avantages de Supabase

- ✅ **Gratuit** jusqu'à 500 MB de données
- ✅ **Aucune installation** requise
- ✅ **Interface graphique** pour gérer la DB
- ✅ **Sauvegardes automatiques**
- ✅ **Accessible de partout** (cloud)
- ✅ **PostgreSQL 15** moderne
- ✅ **Support SSL** intégré

## 📊 Gérer vos données

### Voir les données dans Supabase

1. Allez dans **Table Editor**
2. Sélectionnez une table (ex: `customers`, `products`)
3. Vous pouvez :
   - Voir les données
   - Ajouter des lignes
   - Modifier des lignes
   - Supprimer des lignes

### Exécuter des requêtes SQL

1. Allez dans **SQL Editor**
2. Tapez votre requête, par exemple :
   ```sql
   SELECT * FROM customers;
   SELECT * FROM products WHERE price < 20;
   ```
3. Cliquez sur "Run"

## 🔐 Comptes de test

Après avoir exécuté `init-db.sql`, vous aurez :

**Admin :**
- Email : `admin@petshop.com`
- Password : `Admin123!`

**Client :**
- Email : `marie.dubois@email.com`
- Password : `Marie123!`

## 🔧 Dépannage

### "Connection refused" ou erreur de connexion

1. Vérifiez que l'URL dans `.env.local` est correcte
2. Vérifiez que le mot de passe est bien celui de votre projet Supabase
3. Relancez le serveur : `pnpm run dev`

### "Relation does not exist"

Les tables n'ont pas été créées. Retournez à l'étape 5 et exécutez `init-db.sql`.

### Réinitialiser la base de données

1. Dans Supabase, allez dans **SQL Editor**
2. Exécutez :
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
3. Puis réexécutez `init-db.sql`

## 💰 Limites du plan gratuit

- **500 MB** de stockage
- **2 GB** de bande passante par mois
- **50 000** requêtes par mois
- Projet en pause après **1 semaine d'inactivité** (se réactive automatiquement)

Pour un projet de développement, c'est **largement suffisant** ! 🎉

## 🔄 Migration vers Docker plus tard

Si vous installez Docker Desktop plus tard, vous pourrez facilement migrer :

1. Exportez vos données depuis Supabase
2. Changez `DATABASE_URL` dans `.env.local`
3. Lancez `pnpm run db:start`
4. Importez vos données

## 📚 Documentation Supabase

- Documentation : https://supabase.com/docs
- Dashboard : https://app.supabase.com
- Support : https://supabase.com/support

---

**🌐 Avec Supabase, vous êtes opérationnel en 5 minutes sans Docker !**
