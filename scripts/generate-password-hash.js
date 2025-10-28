const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'password123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Hash for "password123":');
  console.log(hash);
  
  // Vérification
  const isValid = await bcrypt.compare(password, hash);
  console.log('\nVerification:', isValid);
  
  // Test avec l'ancien hash
  const oldHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
  const isOldValid = await bcrypt.compare(password, oldHash);
  console.log('Old hash valid:', isOldValid);
}

generateHash();
