# 🔄 Alternatives à Docker pour PostgreSQL

Si Docker ne fonctionne pas sur votre système, voici les alternatives :

## 🌐 Option 1 : Supabase (Recommandé - Gratuit & Cloud)

**Avantages:**
- ✅ Gratuit jusqu'à 500 Mo
- ✅ Interface web moderne
- ✅ Aucune installation locale
- ✅ Sauvegardes automatiques
- ✅ Accès depuis n'importe où

**Configuration:**

1. **Créer un compte** : https://supabase.com
2. **Nouveau projet** : Cliquez sur "New Project"
3. **Configurer** :
   - Nom : `pet-platform`
   - Password : Choisissez un mot de passe fort
   - Region : `Europe (Frankfurt)` ou le plus proche

4. **Obtenir l'URL de connexion** :
   - Allez dans `Settings` → `Database`
   - Copiez la "Connection string" (mode "Session")
   - Format : `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

5. **Modifier `.env.local`** :
   ```env
   DATABASE_URL=postgresql://postgres:VOTRE_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

6. **Exécuter le script SQL** :
   - Allez dans l'onglet `SQL Editor`
   - Créez une nouvelle query
   - Copiez le contenu de `scripts/init-db.sql`
   - Cliquez sur "Run"

7. **Lancer l'app** :
   ```powershell
   pnpm run dev
   ```

---

## 💻 Option 2 : PostgreSQL local (Windows)

**Avantages:**
- ✅ Contrôle total
- ✅ Fonctionne hors ligne
- ✅ Performances maximales

**Installation:**

1. **Télécharger** : https://www.postgresql.org/download/windows/
   - Choisissez la version 16
   - Téléchargez l'installeur Windows

2. **Installer** :
   - Lancez l'installeur
   - Port : `5432` (défaut)
   - Password : Notez-le bien !
   - Locale : `French, France` ou `C`

3. **Créer la base** :
   - Lancez `pgAdmin 4` (installé avec PostgreSQL)
   - Connectez-vous avec votre mot de passe
   - Clic droit sur `Databases` → `Create` → `Database`
   - Nom : `pet_accessories_db`
   - Owner : `postgres`
   - Save

4. **Exécuter le script** :
   - Clic droit sur `pet_accessories_db` → `Query Tool`
   - Ouvrez `scripts/init-db.sql`
   - Copiez tout le contenu
   - Collez dans Query Tool
   - Cliquez sur ▶️ (Execute)

5. **Configurer `.env.local`** :
   ```env
   DATABASE_URL=postgresql://postgres:VOTRE_PASSWORD@localhost:5432/pet_accessories_db
   ```

6. **Lancer** :
   ```powershell
   pnpm run dev
   ```

---

## 🐘 Option 3 : ElephantSQL (Cloud gratuit)

**Avantages:**
- ✅ Gratuit (20 Mo)
- ✅ Simple et rapide
- ✅ Pas d'installation

**Configuration:**

1. **Créer un compte** : https://www.elephantsql.com
2. **Nouveau plan** : Sélectionnez "Tiny Turtle" (gratuit)
3. **Region** : Choisissez EU-West-1
4. **Copier l'URL** depuis le dashboard
5. **Modifier `.env.local`** :
   ```env
   DATABASE_URL=votre_url_elephantsql
   ```
6. **Browser** → Onglet SQL
7. **Copier/coller** le contenu de `scripts/init-db.sql`
8. **Execute**

---

## 🔧 Option 4 : Neon (Serverless PostgreSQL)

**Avantages:**
- ✅ Gratuit (3 Go)
- ✅ Ultra moderne
- ✅ Mise en veille automatique

**Configuration:**

1. **Compte** : https://neon.tech
2. **Nouveau projet** : Créez un projet
3. **Copier la connection string**
4. **Modifier `.env.local`**
5. **SQL Editor** dans Neon → Exécuter `init-db.sql`

---

## 🆚 Comparaison

| Solution | Gratuit | Limite | Complexité | Offline |
|----------|---------|--------|------------|---------|
| Docker | ✅ | Illimité | Moyenne | ✅ |
| Supabase | ✅ | 500 Mo | Facile | ❌ |
| PostgreSQL local | ✅ | Illimité | Difficile | ✅ |
| ElephantSQL | ✅ | 20 Mo | Facile | ❌ |
| Neon | ✅ | 3 Go | Facile | ❌ |

---

## 💡 Recommandation

**Pour le développement :**
1. 🥇 **Docker** (si possible)
2. 🥈 **Supabase** (si Docker ne marche pas)
3. 🥉 **Neon** (alternative moderne)

**Pour la production :**
- Supabase Pro
- Neon Scale
- AWS RDS
- Render PostgreSQL

---

## 🐛 Problèmes communs

### "Password authentication failed"
➡️ Vérifiez votre mot de passe dans `.env.local`

### "Connection refused"
➡️ Vérifiez que PostgreSQL est démarré

### "Database does not exist"
➡️ Créez la base `pet_accessories_db` d'abord

### "Role postgres does not exist"
➡️ Vérifiez l'utilisateur dans votre URL de connexion

---

## 🆘 Besoin d'aide ?

Consultez :
- `SETUP_DATABASE.md` pour plus de détails
- `QUICK_START.md` pour le guide rapide
- Les logs : `pnpm run db:logs` (Docker uniquement)
