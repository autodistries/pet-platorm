# 🐾 Notes internes (MongoDB)

- ✅ Migration complète vers MongoDB Atlas / MongoDB Community.
- 🆕 Script de seed : `pnpm run seed:mongodb` (lit `MONGODB_URI` et importe les données historiques).
- 📄 Documentation à jour : `SETUP_DATABASE.md`, `README.md`, `LINUX.md`, `MACOS.md`.
- 🔐 Comptes de test conservés :
	- Admin · `admin@petshop.com` · `Admin123!`
	- Client · `marie.dubois@email.com` · `Marie123!`
- 🧪 Pour vérifier la connexion :

```bash
mongosh "$MONGODB_URI" --eval 'db.runCommand({ ping: 1 })'
pnpm run dev
```

- 📬 Collections alimentées automatiquement : `categories`, `products`, `customers`.
- 📌 Les anciens scripts SQL (`scripts/*.sql`) sont archivés pour référence uniquement.