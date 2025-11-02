import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'Admin123!';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL Command:');
  console.log(`UPDATE customers SET password_hash = '${hash}' WHERE email = 'admin@petshop.com';`);
}

generateHash();
