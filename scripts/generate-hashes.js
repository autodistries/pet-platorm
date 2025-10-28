// Script pour générer les hash de mots de passe
// Usage: node scripts/generate-hashes.js

const bcrypt = require('bcryptjs');

const users = [
  { email: 'admin@petshop.com', password: 'Admin123!' },
  { email: 'marie.dubois@email.com', password: 'Marie123!' }
];

console.log('🔐 Génération des hash de mots de passe...\n');

users.forEach(user => {
  const hash = bcrypt.hashSync(user.password, 10);
  console.log(`Email: ${user.email}`);
  console.log(`Mot de passe: ${user.password}`);
  console.log(`Hash: ${hash}`);
  console.log('---');
});

console.log('\n✅ Hash générés avec succès!');
console.log('\n💡 Copiez ces hash dans le fichier scripts/init-db.sql');
