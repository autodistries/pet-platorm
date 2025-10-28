const bcrypt = require('bcryptjs');

async function testLogin() {
  const password = 'password123';
  const storedHash = '$2b$10$YfPgXn3i04ZFjHRmhoN/geqVoxmaH7OasKrJKcvrLphX54r7BTi76';
  
  console.log('Testing login with:');
  console.log('Password:', password);
  console.log('Hash:', storedHash);
  console.log('');
  
  const isValid = await bcrypt.compare(password, storedHash);
  console.log('Password match:', isValid);
  
  if (isValid) {
    console.log('✅ Le mot de passe est correct !');
  } else {
    console.log('❌ Le mot de passe est incorrect !');
  }
}

testLogin();
