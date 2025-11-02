import('bcrypt').then(async ({ default: bcrypt }) => {
  const password = 'Admin123!';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL:');
  console.log(`UPDATE customers SET password_hash = '${hash}' WHERE email = 'admin@petshop.com';`);
});
